-- Fix Partner Access and Verify Booking Data
-- Execute this in Supabase SQL Editor

-- First, let's check what exists
SELECT 'Current restaurants in database:' as check_type;
SELECT id, name FROM businesses ORDER BY name;

SELECT 'Current bookings for Shannon''s:' as check_type;
SELECT id, customer_name, booking_date, booking_time, status 
FROM bookings 
WHERE business_id = '12345678-1234-5678-9012-123456789012';

SELECT 'Current partners:' as check_type;
SELECT id, user_id, business_id, role, is_active FROM partners;

-- Create a demo user partner record for Shannon's Restaurant
-- Note: You'll need to replace 'YOUR_USER_ID' with your actual Supabase auth user ID
-- You can get this from Supabase Auth > Users section

-- For now, let's create a test partner record
-- Replace this UUID with your actual user ID from Supabase Auth
INSERT INTO partners (
    user_id, 
    business_id, 
    role, 
    is_active,
    accepted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- REPLACE WITH YOUR ACTUAL USER ID
    '12345678-1234-5678-9012-123456789012', -- Shannon's Restaurant
    'owner',
    true,
    NOW()
) ON CONFLICT (user_id, business_id) DO UPDATE SET
    is_active = true,
    role = 'owner',
    accepted_at = NOW();

-- Verify the partner record was created
SELECT 'Partner access after insert:' as check_type;
SELECT user_id, business_id, role, is_active 
FROM partners 
WHERE business_id = '12345678-1234-5678-9012-123456789012';

-- Check RLS policies are working
SELECT 'Testing RLS policies:' as check_type;
SELECT 'If you see this message, the script ran successfully!' as message; 