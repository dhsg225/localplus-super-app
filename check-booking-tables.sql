-- Check which booking system tables exist
-- Execute this in Supabase SQL Editor to see what's missing

SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM (
    VALUES 
        ('partners'),
        ('restaurant_settings'),
        ('operating_hours'),
        ('time_slots'),
        ('bookings'),
        ('blocked_dates'),
        ('menu_categories'),
        ('menu_items'),
        ('booking_notifications')
) AS required_tables(table_name)
ORDER BY 
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN 1
        ELSE 0
    END DESC,
    table_name; 