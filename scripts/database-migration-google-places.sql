-- Database Migration for Google Places API Integration and Enhanced Cuisine Categorization
-- This migration enhances the businesses table to support Google Places API integration
-- and implements the curated cuisine categorization strategy

-- 1. Add new columns to businesses table for Google Places integration
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS google_types JSONB, -- Raw Google Place Types for reference
ADD COLUMN IF NOT EXISTS google_primary_type VARCHAR(100), -- Google's primary type
ADD COLUMN IF NOT EXISTS cuisine_types_google JSONB, -- Google's cuisine-specific types
ADD COLUMN IF NOT EXISTS cuisine_types_localplus JSONB, -- Our curated cuisine tags
ADD COLUMN IF NOT EXISTS discovery_source VARCHAR(50) DEFAULT 'manual', -- 'google_places', 'manual', 'partner_signup'
ADD COLUMN IF NOT EXISTS curation_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'approved'
ADD COLUMN IF NOT EXISTS curation_notes TEXT, -- Notes from LDP team during curation
ADD COLUMN IF NOT EXISTS last_google_sync TIMESTAMP WITH TIME ZONE; -- Last sync with Google Places

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_google_place_id ON businesses(google_place_id);
CREATE INDEX IF NOT EXISTS idx_businesses_cuisine_types_localplus ON businesses USING GIN(cuisine_types_localplus);
CREATE INDEX IF NOT EXISTS idx_businesses_curation_status ON businesses(curation_status);
CREATE INDEX IF NOT EXISTS idx_businesses_discovery_source ON businesses(discovery_source);

-- 3. Create a lookup table for our curated LocalPlus cuisine categories
CREATE TABLE IF NOT EXISTS cuisine_categories_localplus (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'thai_traditional', 'seafood_grilled'
    display_name VARCHAR(100) NOT NULL, -- e.g., 'Traditional Thai', 'Grilled Seafood'
    description TEXT,
    parent_category VARCHAR(50), -- For hierarchical categorization
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insert initial curated cuisine categories for Thailand market
INSERT INTO cuisine_categories_localplus (category_code, display_name, description, parent_category) VALUES
-- Thai Cuisine
('thai_traditional', 'Traditional Thai', 'Authentic Thai dishes with traditional recipes', 'thai'),
('thai_royal', 'Royal Thai', 'Refined Thai cuisine with royal court influences', 'thai'),
('thai_street_food', 'Thai Street Food', 'Popular street food and casual Thai dishes', 'thai'),
('thai_northern', 'Northern Thai (Lanna)', 'Specialties from Northern Thailand', 'thai'),
('thai_northeastern', 'Northeastern Thai (Isaan)', 'Spicy dishes from Isaan region', 'thai'),
('thai_southern', 'Southern Thai', 'Spicy curries and seafood from Southern Thailand', 'thai'),

-- Seafood
('seafood_grilled', 'Grilled Seafood', 'Fresh grilled fish and seafood', 'seafood'),
('seafood_steamed', 'Steamed Seafood', 'Delicate steamed preparations', 'seafood'),
('seafood_spicy', 'Spicy Seafood', 'Thai-style spicy seafood dishes', 'seafood'),

-- International
('japanese_sushi', 'Sushi & Sashimi', 'Traditional Japanese sushi and sashimi', 'japanese'),
('japanese_ramen', 'Ramen', 'Japanese noodle soups', 'japanese'),
('japanese_teppanyaki', 'Teppanyaki', 'Japanese grilled dishes', 'japanese'),
('italian_pasta', 'Italian Pasta', 'Traditional and modern pasta dishes', 'italian'),
('italian_pizza', 'Italian Pizza', 'Wood-fired and traditional pizzas', 'italian'),
('chinese_cantonese', 'Cantonese', 'Cantonese-style Chinese cuisine', 'chinese'),
('chinese_sichuan', 'Sichuan', 'Spicy Sichuan province dishes', 'chinese'),
('indian_north', 'North Indian', 'Curries and tandoor from North India', 'indian'),
('indian_south', 'South Indian', 'Rice-based dishes from South India', 'indian'),
('korean_bbq', 'Korean BBQ', 'Grilled meats Korean-style', 'korean'),
('vietnamese_pho', 'Vietnamese Pho', 'Traditional Vietnamese noodle soups', 'vietnamese'),

-- Western
('american_burger', 'Burgers', 'American-style burgers and sandwiches', 'american'),
('american_steak', 'Steakhouse', 'Premium steaks and grilled meats', 'american'),
('french_bistro', 'French Bistro', 'Classic French bistro cuisine', 'french'),

-- Beverages & Desserts
('cafe_coffee', 'Coffee & Cafe', 'Specialty coffee and cafe drinks', 'beverages'),
('dessert_ice_cream', 'Ice Cream & Desserts', 'Sweet treats and frozen desserts', 'desserts'),
('bar_cocktails', 'Cocktails & Bar', 'Craft cocktails and bar atmosphere', 'beverages'),

-- Dietary
('vegetarian', 'Vegetarian', 'Plant-based and vegetarian options', 'dietary'),
('vegan', 'Vegan', 'Strictly plant-based cuisine', 'dietary'),
('halal', 'Halal', 'Halal-certified food options', 'dietary')
ON CONFLICT (category_code) DO NOTHING;

-- 5. Create a table to track Google Places API sync jobs
CREATE TABLE IF NOT EXISTS google_places_sync_jobs (
    id SERIAL PRIMARY KEY,
    job_type VARCHAR(50) NOT NULL, -- 'nearby_search', 'text_search', 'place_details'
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    search_radius INTEGER, -- in meters
    search_query TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    businesses_found INTEGER DEFAULT 0,
    businesses_processed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create a table for suggested businesses from Google Places (before curation)
CREATE TABLE IF NOT EXISTS suggested_businesses (
    id SERIAL PRIMARY KEY,
    google_place_id VARCHAR(255) UNIQUE NOT NULL,
    sync_job_id INTEGER REFERENCES google_places_sync_jobs(id),
    google_data JSONB NOT NULL, -- Full Google Places API response
    suggested_name VARCHAR(255),
    suggested_address TEXT,
    suggested_phone VARCHAR(50),
    suggested_website VARCHAR(500),
    suggested_category VARCHAR(100),
    suggested_cuisine_types JSONB, -- Derived from Google types
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'duplicate'
    assigned_to VARCHAR(255), -- LDP team member
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create indexes for suggested businesses
CREATE INDEX IF NOT EXISTS idx_suggested_businesses_google_place_id ON suggested_businesses(google_place_id);
CREATE INDEX IF NOT EXISTS idx_suggested_businesses_status ON suggested_businesses(status);
CREATE INDEX IF NOT EXISTS idx_suggested_businesses_sync_job ON suggested_businesses(sync_job_id);

-- 8. Update users table to use our curated cuisine preferences
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_cuisines_localplus JSONB; -- Array of our cuisine_categories_localplus codes

-- 9. Create a function to update cuisine preferences format
CREATE OR REPLACE FUNCTION migrate_user_cuisine_preferences()
RETURNS void AS $$
BEGIN
    -- This function can be used to migrate existing preferred_cuisines to new format
    -- Implementation would depend on current data format
    RAISE NOTICE 'User cuisine preferences migration function created. Run manually when needed.';
END;
$$ LANGUAGE plpgsql;

-- 10. Create a view for business discovery that combines all relevant data
CREATE OR REPLACE VIEW business_discovery_view AS
SELECT 
    b.id,
    b.google_place_id,
    b.name,
    b.category,
    b.address,
    b.latitude,
    b.longitude,
    b.phone,
    b.email,
    b.website_url,
    b.partnership_status,
    b.cuisine_types_localplus,
    b.cuisine_types_google,
    b.discovery_source,
    b.curation_status,
    -- Aggregate cuisine category display names
    COALESCE(
        (SELECT json_agg(ccl.display_name)
         FROM cuisine_categories_localplus ccl
         WHERE ccl.category_code = ANY(
             SELECT jsonb_array_elements_text(b.cuisine_types_localplus)
         )), 
        '[]'::json
    ) as cuisine_display_names,
    b.created_at,
    b.updated_at
FROM businesses b
WHERE b.partnership_status = 'active';

-- 11. Add comments for documentation
COMMENT ON COLUMN businesses.google_place_id IS 'Unique Google Places API place ID';
COMMENT ON COLUMN businesses.google_types IS 'Raw array of Google Place Types from API';
COMMENT ON COLUMN businesses.google_primary_type IS 'Google Places primary type classification';
COMMENT ON COLUMN businesses.cuisine_types_google IS 'Google-derived cuisine types (e.g., thai_restaurant, seafood_restaurant)';
COMMENT ON COLUMN businesses.cuisine_types_localplus IS 'Curated LocalPlus cuisine category codes';
COMMENT ON COLUMN businesses.discovery_source IS 'How this business was discovered (google_places, manual, partner_signup)';
COMMENT ON COLUMN businesses.curation_status IS 'Status of human curation process';

COMMENT ON TABLE cuisine_categories_localplus IS 'Curated cuisine categories specific to LocalPlus Thailand market';
COMMENT ON TABLE suggested_businesses IS 'Businesses discovered via Google Places API awaiting curation';
COMMENT ON TABLE google_places_sync_jobs IS 'Track Google Places API sync operations';

-- Migration complete
SELECT 'Google Places API integration schema migration completed successfully' as status; 