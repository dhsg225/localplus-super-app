-- LocalPlus Curated Pipeline Deployment Script
-- Execute this entire script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Suggested businesses queue (temporary holding for Google Places discoveries)
CREATE TABLE IF NOT EXISTS suggested_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_place_id VARCHAR UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(20),
    website_url VARCHAR(500),
    google_rating DECIMAL(3,2),
    google_review_count INTEGER DEFAULT 0,
    google_price_level INTEGER,
    google_types TEXT[],
    primary_category VARCHAR(100),
    google_photos JSONB,
    business_hours JSONB,
    discovery_source VARCHAR(50) DEFAULT 'google_places',
    discovery_criteria JSONB,
    quality_score INTEGER DEFAULT 0,
    curation_status VARCHAR(20) DEFAULT 'pending' CHECK (curation_status IN ('pending', 'approved', 'rejected', 'flagged_for_sales')),
    curated_by UUID,
    curated_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    sales_priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales leads queue (businesses flagged for partner outreach)
CREATE TABLE IF NOT EXISTS sales_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID,
    suggested_business_id UUID REFERENCES suggested_businesses(id),
    lead_source VARCHAR(50) DEFAULT 'curation_pipeline',
    priority_level INTEGER DEFAULT 3 CHECK (priority_level BETWEEN 1 AND 5),
    estimated_partnership_value DECIMAL(10,2),
    outreach_status VARCHAR(30) DEFAULT 'new' CHECK (outreach_status IN ('new', 'contacted', 'interested', 'negotiating', 'converted', 'declined', 'inactive')),
    assigned_to VARCHAR(255),
    first_contact_date DATE,
    last_contact_date DATE,
    conversion_date DATE,
    notes TEXT,
    contact_attempts INTEGER DEFAULT 0,
    partnership_tier VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discovery campaigns tracking (for organized Google Places searches)
CREATE TABLE IF NOT EXISTS discovery_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_location VARCHAR(255) NOT NULL,
    center_latitude DECIMAL(10,8) NOT NULL,
    center_longitude DECIMAL(11,8) NOT NULL,
    search_radius INTEGER NOT NULL,
    target_categories TEXT[],
    quality_filters JSONB,
    campaign_status VARCHAR(20) DEFAULT 'active' CHECK (campaign_status IN ('active', 'paused', 'completed')),
    businesses_discovered INTEGER DEFAULT 0,
    businesses_approved INTEGER DEFAULT 0,
    businesses_flagged_for_sales INTEGER DEFAULT 0,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    run_frequency VARCHAR(20) DEFAULT 'weekly',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curation activity log (audit trail)
CREATE TABLE IF NOT EXISTS curation_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curator_id UUID,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business performance metrics (for analytics and partner value assessment)
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    profile_views INTEGER DEFAULT 0,
    deal_views INTEGER DEFAULT 0,
    deal_redemptions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    customer_rating DECIMAL(3,2),
    customer_reviews INTEGER DEFAULT 0,
    search_impressions INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for business metrics
DO $$
BEGIN
    BEGIN
        ALTER TABLE business_metrics ADD CONSTRAINT unique_business_metric_date UNIQUE(business_id, metric_date);
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END
$$;

-- Extend businesses table with partnership and display metadata (if columns don't exist)
DO $$
BEGIN
    BEGIN
        ALTER TABLE businesses ADD COLUMN google_place_id VARCHAR UNIQUE;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN google_rating DECIMAL(3,2);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN google_review_count INTEGER DEFAULT 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN partnership_tier VARCHAR(20) DEFAULT 'basic';
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN is_featured BOOLEAN DEFAULT false;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN display_priority INTEGER DEFAULT 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN quality_score INTEGER DEFAULT 0;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN source VARCHAR(50) DEFAULT 'manual';
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE businesses ADD COLUMN curation_notes TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END
$$;

-- Add check constraint for partnership_tier (if not exists)
DO $$
BEGIN
    BEGIN
        ALTER TABLE businesses ADD CONSTRAINT check_partnership_tier CHECK (partnership_tier IN ('basic', 'premium', 'enterprise'));
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_suggested_businesses_curation_status ON suggested_businesses(curation_status);
CREATE INDEX IF NOT EXISTS idx_suggested_businesses_quality_score ON suggested_businesses(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_sales_leads_priority ON sales_leads(priority_level DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON sales_leads(outreach_status);
CREATE INDEX IF NOT EXISTS idx_businesses_partnership_tier ON businesses(partnership_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_display_priority ON businesses(display_priority DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(is_featured, display_priority DESC);
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON business_metrics(metric_date);

-- Function to calculate business quality score
CREATE OR REPLACE FUNCTION calculate_quality_score(
    rating DECIMAL,
    review_count INTEGER,
    has_phone BOOLEAN DEFAULT false,
    has_website BOOLEAN DEFAULT false,
    has_photos BOOLEAN DEFAULT false,
    category_relevance INTEGER DEFAULT 5
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base score from rating (0-40 points)
    IF rating IS NOT NULL THEN
        score := score + (rating * 8)::INTEGER;
    END IF;
    
    -- Review count score (0-25 points)
    IF review_count IS NOT NULL THEN
        score := score + LEAST(review_count / 4, 25)::INTEGER;
    END IF;
    
    -- Contact info completeness (0-20 points)
    IF has_phone THEN score := score + 10; END IF;
    IF has_website THEN score := score + 10; END IF;
    
    -- Media presence (0-10 points)
    IF has_photos THEN score := score + 10; END IF;
    
    -- Category relevance (0-5 points)
    score := score + LEAST(category_relevance / 2, 5)::INTEGER;
    
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_suggested_businesses_updated_at ON suggested_businesses;
CREATE TRIGGER update_suggested_businesses_updated_at 
    BEFORE UPDATE ON suggested_businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_leads_updated_at ON sales_leads;
CREATE TRIGGER update_sales_leads_updated_at 
    BEFORE UPDATE ON sales_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discovery_campaigns_updated_at ON discovery_campaigns;
CREATE TRIGGER update_discovery_campaigns_updated_at 
    BEFORE UPDATE ON discovery_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial discovery campaigns for key markets
INSERT INTO discovery_campaigns (
    name, description, target_location, center_latitude, center_longitude,
    search_radius, target_categories, quality_filters, run_frequency
) VALUES 
(
    'Hua Hin Premium Restaurants',
    'High-quality dining establishments in Hua Hin center',
    'Hua Hin, Thailand',
    12.5664, 99.9589, 5000,
    ARRAY['Restaurants'],
    '{"minRating": 4.0, "minReviewCount": 20, "excludedTypes": ["fast_food", "gas_station"]}',
    'weekly'
),
(
    'Bangkok Thonglor Wellness', 
    'Spas and wellness centers in premium Bangkok district',
    'Bangkok Thonglor',
    13.7326, 100.5848, 3000,
    ARRAY['Wellness'],
    '{"minRating": 4.2, "minReviewCount": 15}',
    'monthly'
),
(
    'Pattaya Entertainment',
    'Entertainment venues and activities in Pattaya', 
    'Pattaya, Thailand',
    12.9236, 100.8825, 8000,
    ARRAY['Entertainment'],
    '{"minRating": 3.8, "minReviewCount": 30}',
    'weekly'
);

-- Insert some sample suggested businesses for testing
INSERT INTO suggested_businesses (
    google_place_id, name, address, latitude, longitude, phone, website_url,
    google_rating, google_review_count, primary_category, quality_score,
    curation_status, discovery_source
) VALUES 
(
    'ChIJ_test_restaurant_1',
    'The Deck Restaurant & Bar',
    '123 Beach Road, Hua Hin, Thailand',
    12.5664, 99.9589,
    '+66 32 123 456',
    'https://thedeckhuahin.com',
    4.4, 87,
    'Restaurants',
    82,
    'pending',
    'automated_campaign'
),
(
    'ChIJ_test_spa_1', 
    'Ananda Wellness Spa',
    '456 Wellness Lane, Bangkok, Thailand',
    13.7326, 100.5848,
    '+66 2 456 789',
    'https://anandawellness.com',
    4.6, 124,
    'Wellness',
    89,
    'pending',
    'manual_search'
);

-- VERIFICATION QUERIES (Run these after deployment)

-- 1. Verify all tables were created
SELECT 'Tables Created' as status, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'suggested_businesses', 
    'sales_leads', 
    'discovery_campaigns', 
    'curation_activities', 
    'business_metrics'
);

-- 2. Test quality score function
SELECT 'Quality Score Test' as status, calculate_quality_score(4.5, 120, true, true, true, 8) as score;

-- 3. Check sample data
SELECT 'Sample Campaigns' as status, COUNT(*) as campaign_count FROM discovery_campaigns;
SELECT 'Sample Suggested Businesses' as status, COUNT(*) as business_count FROM suggested_businesses;

-- 4. Verify businesses table enhancements
SELECT 'Businesses Table Columns' as status, column_name 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name IN ('google_place_id', 'partnership_tier', 'is_featured', 'quality_score');

-- Show pipeline status
SELECT 
    'Pipeline Status' as report,
    (SELECT COUNT(*) FROM discovery_campaigns) as campaigns,
    (SELECT COUNT(*) FROM suggested_businesses) as suggested_businesses,
    (SELECT COUNT(*) FROM sales_leads) as sales_leads;

-- Success message
SELECT '🎉 Curated Pipeline Database Schema Deployed Successfully!' as deployment_status; 