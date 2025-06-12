-- Curated Business Pipeline Schema Extension
-- Execute after main schema to add curation capabilities

-- Suggested businesses queue (temporary holding for Google Places discoveries)
CREATE TABLE suggested_businesses (
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
    google_types TEXT[], -- Array of Google Place types
    primary_category VARCHAR(100), -- Our categorization
    google_photos JSONB, -- Array of photo references
    business_hours JSONB, -- Google Places opening hours
    discovery_source VARCHAR(50) DEFAULT 'google_places', -- How we found it
    discovery_criteria JSONB, -- What filters/search led to discovery
    quality_score INTEGER DEFAULT 0, -- Computed quality score (0-100)
    curation_status VARCHAR(20) DEFAULT 'pending' CHECK (curation_status IN ('pending', 'approved', 'rejected', 'flagged_for_sales')),
    curated_by UUID REFERENCES auth.users(id),
    curated_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    sales_priority INTEGER DEFAULT 0, -- 1-5 scale for sales prioritization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales leads queue (businesses flagged for partner outreach)
CREATE TABLE sales_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id), -- If already in main businesses table
    suggested_business_id UUID REFERENCES suggested_businesses(id), -- If still in suggestions
    lead_source VARCHAR(50) DEFAULT 'curation_pipeline',
    priority_level INTEGER DEFAULT 3 CHECK (priority_level BETWEEN 1 AND 5), -- 5 = highest priority
    estimated_partnership_value DECIMAL(10,2), -- Expected monthly revenue
    outreach_status VARCHAR(30) DEFAULT 'new' CHECK (outreach_status IN ('new', 'contacted', 'interested', 'negotiating', 'converted', 'declined', 'inactive')),
    assigned_to VARCHAR(255), -- Sales team member
    first_contact_date DATE,
    last_contact_date DATE,
    conversion_date DATE,
    notes TEXT,
    contact_attempts INTEGER DEFAULT 0,
    partnership_tier VARCHAR(20), -- 'basic', 'premium', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extend businesses table with partnership and display metadata
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_place_id VARCHAR UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_rating DECIMAL(3,2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_review_count INTEGER DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS partnership_tier VARCHAR(20) DEFAULT 'basic' CHECK (partnership_tier IN ('basic', 'premium', 'enterprise'));
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS display_priority INTEGER DEFAULT 0; -- Higher = more prominent
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 0;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual'; -- 'manual', 'google_places', 'import'
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS curation_notes TEXT;

-- Discovery campaigns tracking (for organized Google Places searches)
CREATE TABLE discovery_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_location VARCHAR(255) NOT NULL, -- "Hua Hin", "Bangkok - Thonglor"
    center_latitude DECIMAL(10,8) NOT NULL,
    center_longitude DECIMAL(11,8) NOT NULL,
    search_radius INTEGER NOT NULL, -- in meters
    target_categories TEXT[], -- Categories to search for
    quality_filters JSONB, -- Min rating, review count, etc.
    campaign_status VARCHAR(20) DEFAULT 'active' CHECK (campaign_status IN ('active', 'paused', 'completed')),
    businesses_discovered INTEGER DEFAULT 0,
    businesses_approved INTEGER DEFAULT 0,
    businesses_flagged_for_sales INTEGER DEFAULT 0,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    run_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly', 'manual'
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curation activity log (audit trail)
CREATE TABLE curation_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curator_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL, -- 'approved', 'rejected', 'flagged_for_sales', 'quality_updated'
    target_type VARCHAR(30) NOT NULL, -- 'suggested_business', 'business', 'sales_lead'
    target_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business performance metrics (for analytics and partner value assessment)
CREATE TABLE business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    profile_views INTEGER DEFAULT 0,
    deal_views INTEGER DEFAULT 0,
    deal_redemptions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    customer_rating DECIMAL(3,2),
    customer_reviews INTEGER DEFAULT 0,
    search_impressions INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4) DEFAULT 0, -- CTR as decimal (0.0543 = 5.43%)
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, metric_date)
);

-- Create indexes for performance
CREATE INDEX idx_suggested_businesses_curation_status ON suggested_businesses(curation_status);
CREATE INDEX idx_suggested_businesses_quality_score ON suggested_businesses(quality_score DESC);
CREATE INDEX idx_suggested_businesses_location ON suggested_businesses USING GIST (point(longitude, latitude));
CREATE INDEX idx_sales_leads_priority ON sales_leads(priority_level DESC, created_at);
CREATE INDEX idx_sales_leads_status ON sales_leads(outreach_status);
CREATE INDEX idx_businesses_partnership_tier ON businesses(partnership_tier);
CREATE INDEX idx_businesses_display_priority ON businesses(display_priority DESC);
CREATE INDEX idx_businesses_featured ON businesses(is_featured, display_priority DESC);
CREATE INDEX idx_business_metrics_date ON business_metrics(metric_date);
CREATE INDEX idx_discovery_campaigns_location ON discovery_campaigns USING GIST (point(center_longitude, center_latitude));

-- Functions for curation workflow
CREATE OR REPLACE FUNCTION approve_suggested_business(
    suggested_business_uuid UUID,
    curator_uuid UUID
) RETURNS UUID AS $$
DECLARE
    new_business_id UUID;
    suggested_record RECORD;
BEGIN
    -- Get the suggested business record
    SELECT * INTO suggested_record FROM suggested_businesses WHERE id = suggested_business_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Suggested business not found';
    END IF;
    
    -- Insert into main businesses table
    INSERT INTO businesses (
        google_place_id, name, address, latitude, longitude, phone, website_url,
        google_rating, google_review_count, category, partnership_status,
        quality_score, source, curation_notes
    ) VALUES (
        suggested_record.google_place_id,
        suggested_record.name,
        suggested_record.address,
        suggested_record.latitude,
        suggested_record.longitude,
        suggested_record.phone,
        suggested_record.website_url,
        suggested_record.google_rating,
        suggested_record.google_review_count,
        suggested_record.primary_category,
        'pending',
        suggested_record.quality_score,
        'google_places',
        'Approved via curation pipeline'
    ) RETURNING id INTO new_business_id;
    
    -- Update suggested business status
    UPDATE suggested_businesses 
    SET curation_status = 'approved', 
        curated_by = curator_uuid, 
        curated_at = NOW()
    WHERE id = suggested_business_uuid;
    
    -- Log the activity
    INSERT INTO curation_activities (curator_id, action, target_type, target_id, notes)
    VALUES (curator_uuid, 'approved', 'suggested_business', suggested_business_uuid, 'Business approved and moved to main directory');
    
    RETURN new_business_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION flag_for_sales_outreach(
    suggested_business_uuid UUID,
    curator_uuid UUID,
    priority_level INTEGER DEFAULT 3,
    estimated_value DECIMAL DEFAULT 500.00
) RETURNS UUID AS $$
DECLARE
    sales_lead_id UUID;
BEGIN
    -- Create sales lead
    INSERT INTO sales_leads (
        suggested_business_id, priority_level, estimated_partnership_value,
        lead_source, notes
    ) VALUES (
        suggested_business_uuid, priority_level, estimated_value,
        'curation_pipeline', 'Flagged during curation process'
    ) RETURNING id INTO sales_lead_id;
    
    -- Update suggested business status
    UPDATE suggested_businesses 
    SET curation_status = 'flagged_for_sales',
        curated_by = curator_uuid,
        curated_at = NOW(),
        sales_priority = priority_level
    WHERE id = suggested_business_uuid;
    
    -- Log the activity
    INSERT INTO curation_activities (curator_id, action, target_type, target_id, notes)
    VALUES (curator_uuid, 'flagged_for_sales', 'suggested_business', suggested_business_uuid, 'Business flagged for sales outreach');
    
    RETURN sales_lead_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate business quality score
CREATE OR REPLACE FUNCTION calculate_quality_score(
    rating DECIMAL,
    review_count INTEGER,
    has_phone BOOLEAN DEFAULT false,
    has_website BOOLEAN DEFAULT false,
    has_photos BOOLEAN DEFAULT false,
    category_relevance INTEGER DEFAULT 5 -- 1-10 scale
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base score from rating (0-40 points)
    IF rating IS NOT NULL THEN
        score := score + (rating * 8)::INTEGER; -- 5.0 rating = 40 points
    END IF;
    
    -- Review count score (0-25 points)
    IF review_count IS NOT NULL THEN
        score := score + LEAST(review_count / 4, 25)::INTEGER; -- 100+ reviews = 25 points
    END IF;
    
    -- Contact info completeness (0-20 points)
    IF has_phone THEN score := score + 10; END IF;
    IF has_website THEN score := score + 10; END IF;
    
    -- Media presence (0-10 points)
    IF has_photos THEN score := score + 10; END IF;
    
    -- Category relevance (0-5 points)
    score := score + LEAST(category_relevance / 2, 5)::INTEGER;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_suggested_businesses_updated_at BEFORE UPDATE ON suggested_businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_leads_updated_at BEFORE UPDATE ON sales_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discovery_campaigns_updated_at BEFORE UPDATE ON discovery_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE suggested_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE curation_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;

-- Admin/curator access policies
CREATE POLICY "Curators can view all suggested businesses" ON suggested_businesses
    FOR SELECT USING (true); -- Adjust based on role system

CREATE POLICY "Curators can update suggested businesses" ON suggested_businesses
    FOR UPDATE USING (true); -- Adjust based on role system

CREATE POLICY "Sales team can view leads" ON sales_leads
    FOR SELECT USING (true); -- Adjust based on role system

CREATE POLICY "Business metrics are viewable by business owners and admins" ON business_metrics
    FOR SELECT USING (true); -- Adjust based on ownership/role system 