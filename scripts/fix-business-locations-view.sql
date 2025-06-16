-- Fix the business_locations view
-- Run this in Supabase SQL Editor

-- Drop and recreate the business_locations view
DROP VIEW IF EXISTS business_locations;

CREATE VIEW business_locations AS
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

-- Test the view
SELECT 'business_locations view recreated successfully!' as message; 