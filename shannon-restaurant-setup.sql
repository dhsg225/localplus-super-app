-- Shannon's Restaurant Complete Setup Script
-- Execute this in Supabase SQL Editor
-- IMPORTANT: First run the booking-system-schema.sql to create the booking tables

-- Insert Shannon's Restaurant with dynamic column detection
DO $$
DECLARE
    has_category BOOLEAN;
    has_category_id BOOLEAN;
    insert_sql TEXT;
    values_sql TEXT;
BEGIN
    -- Check which columns exist
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'category') INTO has_category;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'category_id') INTO has_category_id;
    
    -- Build dynamic INSERT statement
    insert_sql := 'INSERT INTO businesses (id, name, address, latitude, longitude, phone, email, website_url, description, partnership_status';
    values_sql := ' VALUES (''12345678-1234-5678-9012-123456789012'', ''Shannon''''s Coastal Kitchen'', ''123 Ocean View Drive, Hua Hin 77110, Thailand'', 12.5684, 99.9578, ''+66-32-555-0123'', ''reservations@shannonscoastal.com'', ''https://shannonscoastal.com'', ''Experience the finest coastal cuisine at Shannon''''s, where fresh seafood meets innovative culinary artistry. Our oceanfront restaurant offers panoramic views of the Gulf of Thailand, creating the perfect backdrop for an unforgettable dining experience. Chef Shannon combines traditional Thai flavors with international techniques, sourcing the freshest local ingredients daily from Hua Hin''''s fishing boats and organic farms.'', ''active''';
    
    -- Add optional columns
    IF has_category THEN
        insert_sql := insert_sql || ', category';
        values_sql := values_sql || ', ''restaurant''';
    END IF;
    
    IF has_category_id THEN
        insert_sql := insert_sql || ', category_id';
        values_sql := values_sql || ', (SELECT id FROM categories WHERE name = ''Restaurants'' LIMIT 1)';
    END IF;
    
    -- Complete the statement
    insert_sql := insert_sql || ')' || values_sql || ') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description';
    
    -- Execute the dynamic INSERT
    EXECUTE insert_sql;
END $$;

-- Restaurant Settings (only if booking tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'restaurant_settings') THEN
        INSERT INTO restaurant_settings (
            business_id,
            booking_enabled,
            advance_booking_days,
            max_party_size,
            min_party_size,
            booking_buffer_minutes,
            cancellation_policy,
            special_instructions,
            auto_confirm,
            require_phone,
            require_email
        ) VALUES (
            '12345678-1234-5678-9012-123456789012',
            true,
            30,
            8,
            1,
            15,
            'Free cancellation up to 4 hours before your reservation. Cancellations within 4 hours may incur a 500 THB fee.',
            'We accommodate dietary restrictions with advance notice. Our sunset terrace offers the best views and requires a minimum party of 2. Children are welcome until 8 PM.',
            false,
            true,
            true
        ) ON CONFLICT (business_id) DO UPDATE SET
            booking_enabled = EXCLUDED.booking_enabled,
            cancellation_policy = EXCLUDED.cancellation_policy,
            special_instructions = EXCLUDED.special_instructions;
    END IF;
END $$;

-- Operating Hours (only if booking tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'operating_hours') THEN
        INSERT INTO operating_hours (business_id, day_of_week, is_open, open_time, close_time, break_start_time, break_end_time)
        VALUES 
            ('12345678-1234-5678-9012-123456789012', 0, true, '10:00', '22:00', null, null), -- Sunday
            ('12345678-1234-5678-9012-123456789012', 1, true, '11:00', '22:00', '15:00', '17:00'), -- Monday
            ('12345678-1234-5678-9012-123456789012', 2, true, '11:00', '22:00', '15:00', '17:00'), -- Tuesday
            ('12345678-1234-5678-9012-123456789012', 3, true, '11:00', '22:00', '15:00', '17:00'), -- Wednesday
            ('12345678-1234-5678-9012-123456789012', 4, true, '11:00', '22:00', '15:00', '17:00'), -- Thursday
            ('12345678-1234-5678-9012-123456789012', 5, true, '11:00', '23:00', null, null), -- Friday
            ('12345678-1234-5678-9012-123456789012', 6, true, '10:00', '23:00', null, null) -- Saturday
        ON CONFLICT (business_id, day_of_week) DO UPDATE SET
            is_open = EXCLUDED.is_open,
            open_time = EXCLUDED.open_time,
            close_time = EXCLUDED.close_time;
    END IF;
END $$;

-- Time Slots (only if booking tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'time_slots') THEN
        INSERT INTO time_slots (business_id, slot_time, capacity, duration_minutes, is_active)
        VALUES 
            ('12345678-1234-5678-9012-123456789012', '11:00', 24, 120, true),
            ('12345678-1234-5678-9012-123456789012', '11:30', 24, 120, true),
            ('12345678-1234-5678-9012-123456789012', '12:00', 32, 120, true),
            ('12345678-1234-5678-9012-123456789012', '12:30', 32, 120, true),
            ('12345678-1234-5678-9012-123456789012', '13:00', 32, 120, true),
            ('12345678-1234-5678-9012-123456789012', '13:30', 28, 120, true),
            ('12345678-1234-5678-9012-123456789012', '17:30', 40, 150, true),
            ('12345678-1234-5678-9012-123456789012', '18:00', 40, 150, true),
            ('12345678-1234-5678-9012-123456789012', '18:30', 40, 150, true),
            ('12345678-1234-5678-9012-123456789012', '19:00', 40, 150, true),
            ('12345678-1234-5678-9012-123456789012', '19:30', 36, 150, true),
            ('12345678-1234-5678-9012-123456789012', '20:00', 32, 150, true),
            ('12345678-1234-5678-9012-123456789012', '20:30', 24, 150, true),
            ('12345678-1234-5678-9012-123456789012', '21:00', 16, 150, true)
        ON CONFLICT (business_id, slot_time) DO UPDATE SET
            capacity = EXCLUDED.capacity,
            is_active = EXCLUDED.is_active;
    END IF;
END $$;

-- Menu Categories (only if booking tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_categories') THEN
        INSERT INTO menu_categories (business_id, name, description, sort_order, is_active)
        VALUES 
            ('12345678-1234-5678-9012-123456789012', 'Appetizers & Small Plates', 'Start your culinary journey with our signature small plates', 1, true),
            ('12345678-1234-5678-9012-123456789012', 'Fresh Seafood', 'Daily catch from local Hua Hin fishing boats', 2, true),
            ('12345678-1234-5678-9012-123456789012', 'Signature Mains', 'Chef Shannon''s innovative fusion creations', 3, true),
            ('12345678-1234-5678-9012-123456789012', 'Thai Classics', 'Traditional Thai dishes with a modern twist', 4, true),
            ('12345678-1234-5678-9012-123456789012', 'Desserts', 'Sweet endings to your coastal dining experience', 5, true),
            ('12345678-1234-5678-9012-123456789012', 'Beverages', 'Craft cocktails, wines, and refreshing drinks', 6, true)
        ON CONFLICT (business_id, name) DO UPDATE SET
            description = EXCLUDED.description,
            sort_order = EXCLUDED.sort_order;
    END IF;
END $$;

-- Sample Bookings (only if booking tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        INSERT INTO bookings (
            business_id,
            customer_name,
            customer_email,
            customer_phone,
            party_size,
            booking_date,
            booking_time,
            special_requests,
            status,
            confirmation_code,
            notes
        )
        VALUES 
            ('12345678-1234-5678-9012-123456789012', 'James Wilson', 'james.wilson@email.com', '+66-87-123-4567', 2, CURRENT_DATE, '19:00', 'Anniversary dinner, window table preferred', 'confirmed', 'BK2024001234', 'VIP treatment requested'),
            ('12345678-1234-5678-9012-123456789012', 'Sarah Chen', 'sarah.chen@email.com', '+66-89-234-5678', 4, CURRENT_DATE, '20:00', 'One vegetarian guest', 'confirmed', 'BK2024001235', 'Table 12 reserved'),
            ('12345678-1234-5678-9012-123456789012', 'Michael Thompson', 'mike.t@email.com', '+66-91-345-6789', 6, CURRENT_DATE + 1, '18:30', 'Business dinner', 'pending', 'BK2024001236', 'Waiting for confirmation'),
            ('12345678-1234-5678-9012-123456789012', 'Lisa Rodriguez', 'lisa.r@email.com', '+66-92-456-7890', 2, CURRENT_DATE + 1, '19:30', 'Gluten-free options needed', 'confirmed', 'BK2024001237', 'Dietary restrictions noted'),
            ('12345678-1234-5678-9012-123456789012', 'David Kim', 'david.kim@email.com', '+66-93-567-8901', 3, CURRENT_DATE + 2, '12:00', 'Lunch meeting', 'confirmed', 'BK2024001238', 'Business lunch setup'),
            ('12345678-1234-5678-9012-123456789012', 'Emma Johnson', 'emma.j@email.com', '+66-94-678-9012', 5, CURRENT_DATE + 2, '20:30', 'Birthday celebration', 'pending', 'BK2024001239', 'Birthday cake arranged'),
            ('12345678-1234-5678-9012-123456789012', 'Robert Brown', 'rob.brown@email.com', '+66-95-789-0123', 2, CURRENT_DATE + 3, '18:00', 'Sunset terrace preferred', 'confirmed', 'BK2024001240', 'Terrace table 5'),
            ('12345678-1234-5678-9012-123456789012', 'Amanda Davis', 'amanda.d@email.com', '+66-96-890-1234', 4, CURRENT_DATE + 4, '19:00', 'No seafood allergies', 'pending', 'BK2024001241', 'Allergy info recorded')
        ON CONFLICT (confirmation_code) DO NOTHING;
    END IF;
END $$;

-- Add basic discount offer (simplified version)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discount_offers') THEN
        -- Try basic insert first
        BEGIN
            INSERT INTO discount_offers (
                business_id,
                description,
                discount_percentage,
                terms_conditions,
                valid_from,
                valid_until,
                is_active
            ) VALUES (
                '12345678-1234-5678-9012-123456789012',
                '25% off dinner reservations between 5:30-7:00 PM with ocean view seating',
                25,
                'Valid for LocalPlus members only. Must book sunset terrace seating. Cannot be combined with other offers. Valid Sunday-Thursday only.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '30 days',
                true
            ) ON CONFLICT DO NOTHING;
        EXCEPTION
            WHEN OTHERS THEN
                -- If basic insert fails, skip the discount offer
                NULL;
        END;
    END IF;
END $$;

-- Success message
SELECT 'Shannon''s Coastal Kitchen has been successfully created with mock data!' as message; 