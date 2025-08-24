-- Fix Partner Access with Real User ID
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

-- Verify the user exists in auth.users
SELECT 'Checking if user exists in auth.users:' as check_type;
SELECT id, email FROM auth.users WHERE id = '12e35209-e85b-4d90-951f-9ed417deaeef';

-- Create partner record with your actual user ID
INSERT INTO partners (
    user_id, 
    business_id, 
    role, 
    is_active,
    accepted_at
) VALUES (
    '12e35209-e85b-4d90-951f-9ed417deaeef', -- Your actual user ID
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

-- Success message
SELECT 'Partner access setup complete! You should now only see Shannon''s Restaurant in the partner app.' as message; 