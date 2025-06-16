-- Fix missing Google Places integration columns
-- These should have been added by the migration but weren't applied

-- Add Google Places integration columns to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS google_types JSONB,
ADD COLUMN IF NOT EXISTS google_primary_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS cuisine_types_google JSONB,
ADD COLUMN IF NOT EXISTS cuisine_types_localplus JSONB,
ADD COLUMN IF NOT EXISTS cuisine_display_names JSONB,
ADD COLUMN IF NOT EXISTS discovery_source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS curation_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_google_sync TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_google_place_id ON businesses(google_place_id);
CREATE INDEX IF NOT EXISTS idx_businesses_cuisine_types_localplus ON businesses USING GIN(cuisine_types_localplus);
CREATE INDEX IF NOT EXISTS idx_businesses_curation_status ON businesses(curation_status);
CREATE INDEX IF NOT EXISTS idx_businesses_discovery_source ON businesses(discovery_source);

-- Create the business_discovery_view
CREATE OR REPLACE VIEW business_discovery_view AS
SELECT 
    b.*,
    -- Enhanced fields for discovery
    COALESCE(b.cuisine_types_localplus, '[]'::jsonb) as cuisine_types_localplus,
    COALESCE(b.cuisine_types_google, '[]'::jsonb) as cuisine_types_google,
    COALESCE(b.google_types, '[]'::jsonb) as google_types,
    b.google_primary_type,
    b.discovery_source,
    b.curation_status,
    b.last_google_sync
FROM businesses b
WHERE b.partnership_status = 'active'
AND (b.status IS NULL OR b.status = 'active'); 