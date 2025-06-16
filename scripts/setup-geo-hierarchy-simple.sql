-- Thailand Geographic Hierarchy Migration Script (Simplified - No Thai Characters)
-- Run this in your Supabase SQL editor to set up the geographic hierarchy tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_th VARCHAR(100) NOT NULL,
  region VARCHAR(20) NOT NULL CHECK (region IN ('central', 'northern', 'northeastern', 'southern', 'eastern', 'western')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  name_en VARCHAR(100) NOT NULL,
  name_th VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create sub_districts table
CREATE TABLE IF NOT EXISTS sub_districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  name_en VARCHAR(100) NOT NULL,
  name_th VARCHAR(100) NOT NULL,
  postal_codes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_districts_province_id ON districts(province_id);
CREATE INDEX IF NOT EXISTS idx_sub_districts_district_id ON sub_districts(district_id);
CREATE INDEX IF NOT EXISTS idx_provinces_region ON provinces(region);
CREATE INDEX IF NOT EXISTS idx_provinces_name_en ON provinces(name_en);
CREATE INDEX IF NOT EXISTS idx_districts_name_en ON districts(name_en);
CREATE INDEX IF NOT EXISTS idx_sub_districts_name_en ON sub_districts(name_en);

-- Update businesses table to use geographic hierarchy
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

-- Insert LDP priority area data (English names only for now)
INSERT INTO provinces (id, code, name_en, name_th, region) VALUES 
('11111111-1111-1111-1111-111111111111', '77', 'Prachuap Khiri Khan', 'Prachuap Khiri Khan', 'southern'),
('22222222-2222-2222-2222-222222222222', '20', 'Chonburi', 'Chonburi', 'eastern'),
('33333333-3333-3333-3333-333333333333', '83', 'Phuket', 'Phuket', 'southern'),
('44444444-4444-4444-4444-444444444444', '50', 'Chiang Mai', 'Chiang Mai', 'northern'),
('55555555-5555-5555-5555-555555555555', '10', 'Bangkok', 'Bangkok', 'central')
ON CONFLICT (code) DO NOTHING;

-- Insert districts for LDP areas
INSERT INTO districts (id, code, province_id, name_en, name_th) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '7703', '11111111-1111-1111-1111-111111111111', 'Hua Hin', 'Hua Hin'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2007', '22222222-2222-2222-2222-222222222222', 'Bang Lamung', 'Bang Lamung'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '8301', '33333333-3333-3333-3333-333333333333', 'Mueang Phuket', 'Mueang Phuket'),
('cccccccd-cccc-cccc-cccc-cccccccccccc', '8302', '33333333-3333-3333-3333-333333333333', 'Kathu', 'Kathu'),
('ccccccce-cccc-cccc-cccc-cccccccccccc', '8303', '33333333-3333-3333-3333-333333333333', 'Thalang', 'Thalang'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '5001', '44444444-4444-4444-4444-444444444444', 'Mueang Chiang Mai', 'Mueang Chiang Mai'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '1003', '55555555-5555-5555-5555-555555555555', 'Bang Rak', 'Bang Rak'),
('eeeeeeff-eeee-eeee-eeee-eeeeeeeeeeee', '1002', '55555555-5555-5555-5555-555555555555', 'Pathum Wan', 'Pathum Wan')
ON CONFLICT (code) DO NOTHING;

-- Insert sub-districts for LDP areas
INSERT INTO sub_districts (id, code, district_id, name_en, name_th, postal_codes) VALUES 
('11111111-aaaa-aaaa-aaaa-111111111111', '770301', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hua Hin', 'Hua Hin', ARRAY['77110']),
('11111112-aaaa-aaaa-aaaa-111111111111', '770302', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nong Kae', 'Nong Kae', ARRAY['77110']),
('11111113-aaaa-aaaa-aaaa-111111111111', '770303', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hin Lek Fai', 'Hin Lek Fai', ARRAY['77110']),
('22222221-bbbb-bbbb-bbbb-222222222222', '200704', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pattaya', 'Pattaya', ARRAY['20150']),
('22222222-bbbb-bbbb-bbbb-222222222222', '200701', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Na Kluea', 'Na Kluea', ARRAY['20150']),
('22222223-bbbb-bbbb-bbbb-222222222222', '200702', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nong Prue', 'Nong Prue', ARRAY['20260']),
('33333331-cccc-cccc-cccc-333333333333', '830101', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Patong', 'Patong', ARRAY['83150']),
('33333332-cccc-cccc-cccc-333333333333', '830102', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Karon', 'Karon', ARRAY['83100']),
('33333333-cccc-cccc-cccc-333333333333', '830103', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Kata', 'Kata', ARRAY['83100']),
('33333334-cccc-cccc-cccc-333333333333', '830104', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Rawai', 'Rawai', ARRAY['83130']),
('33333335-cccc-cccc-cccc-333333333333', '830105', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Chalong', 'Chalong', ARRAY['83130']),
('44444441-dddd-dddd-dddd-444444444444', '500101', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Si Phum', 'Si Phum', ARRAY['50200']),
('44444442-dddd-dddd-dddd-444444444444', '500102', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Phra Sing', 'Phra Sing', ARRAY['50200']),
('44444443-dddd-dddd-dddd-444444444444', '500103', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Chang Khlan', 'Chang Khlan', ARRAY['50100']),
('44444444-dddd-dddd-dddd-444444444444', '500104', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Suthep', 'Suthep', ARRAY['50200'])
ON CONFLICT (code) DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_districts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to geographic data
CREATE POLICY "Allow public read access to provinces" ON provinces FOR SELECT USING (true);
CREATE POLICY "Allow public read access to districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sub_districts" ON sub_districts FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_geo_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_provinces_updated_at BEFORE UPDATE ON provinces 
    FOR EACH ROW EXECUTE FUNCTION update_geo_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts 
    FOR EACH ROW EXECUTE FUNCTION update_geo_updated_at_column();
CREATE TRIGGER update_sub_districts_updated_at BEFORE UPDATE ON sub_districts 
    FOR EACH ROW EXECUTE FUNCTION update_geo_updated_at_column();

-- Grant permissions for application access
GRANT SELECT ON provinces, districts, sub_districts TO anon, authenticated;
GRANT ALL ON provinces, districts, sub_districts TO service_role;

-- Create a view for easy business location queries
CREATE OR REPLACE VIEW business_locations AS
SELECT 
    b.id,
    b.name,
    b.address_line,
    b.postal_code,
    b.address as original_address,
    b.partnership_status,
    b.latitude,
    b.longitude,
    p.name_en as province_name,
    p.name_th as province_name_th,
    d.name_en as district_name,
    d.name_th as district_name_th,
    s.name_en as sub_district_name,
    s.name_th as sub_district_name_th,
    CONCAT_WS(', ', 
        COALESCE(b.address_line, ''),
        COALESCE(s.name_en, ''),
        COALESCE(d.name_en, ''),
        COALESCE(p.name_en, '')
    ) as full_address
FROM businesses b
LEFT JOIN provinces p ON b.province_id = p.id
LEFT JOIN districts d ON b.district_id = d.id  
LEFT JOIN sub_districts s ON b.sub_district_id = s.id
WHERE b.partnership_status = 'active';

-- Grant select access to the view
GRANT SELECT ON business_locations TO anon, authenticated;

-- Update existing Hua Hin businesses to use the new geographic hierarchy
UPDATE businesses 
SET 
  province_id = '11111111-1111-1111-1111-111111111111',
  district_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  sub_district_id = '11111111-aaaa-aaaa-aaaa-111111111111',
  address_line = TRIM(REGEXP_REPLACE(address, 'Hua Hin.*$', '', 'i')),
  postal_code = '77110'
WHERE address ILIKE '%hua hin%' 
AND province_id IS NULL;

-- Success message
SELECT 'Thailand Geographic Hierarchy tables created successfully!' as message; 