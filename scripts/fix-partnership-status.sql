-- Fix partnership status for businesses with geographic data
-- Run this in Supabase SQL Editor

-- Update businesses with geographic data to have 'active' status
UPDATE businesses 
SET partnership_status = 'active'
WHERE province_id IS NOT NULL;

-- Verify the update
SELECT 'Partnership status updated to active for businesses with geographic data!' as message;