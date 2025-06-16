-- Add missing geographic columns to businesses table
-- Run this in Supabase SQL Editor

-- Add geographic columns to businesses table
ALTER TABLE businesses 
  ADD COLUMN IF NOT EXISTS province_id UUID REFERENCES provinces(id),
  ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES districts(id),
  ADD COLUMN IF NOT EXISTS sub_district_id UUID REFERENCES sub_districts(id),
  ADD COLUMN IF NOT EXISTS address_line TEXT,
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10);

-- Create indexes for businesses geographic columns
CREATE INDEX IF NOT EXISTS idx_businesses_province_id ON businesses(province_id);
CREATE INDEX IF NOT EXISTS idx_businesses_district_id ON businesses(district_id);
CREATE INDEX IF NOT EXISTS idx_businesses_sub_district_id ON businesses(sub_district_id);

-- Update existing Hua Hin businesses to use the new geographic hierarchy
UPDATE businesses 
SET 
  province_id = '11111111-1111-1111-1111-111111111111',  -- Prachuap Khiri Khan
  district_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',   -- Hua Hin District
  sub_district_id = '11111111-aaaa-aaaa-aaaa-111111111111', -- Hua Hin Sub-district
  address_line = TRIM(REGEXP_REPLACE(address, 'Hua Hin.*$', '', 'i')),
  postal_code = '77110'
WHERE address ILIKE '%hua hin%' 
AND province_id IS NULL;

-- Success message
SELECT 'Geographic columns added successfully to businesses table!' as message; 