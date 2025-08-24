-- Create missing booking system tables
-- Execute this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Restaurant settings - Booking configuration per restaurant
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
    booking_enabled BOOLEAN DEFAULT true,
    advance_booking_days INTEGER DEFAULT 30 CHECK (advance_booking_days > 0),
    max_party_size INTEGER DEFAULT 12 CHECK (max_party_size > 0),
    min_party_size INTEGER DEFAULT 1 CHECK (min_party_size > 0),
    booking_buffer_minutes INTEGER DEFAULT 15 CHECK (booking_buffer_minutes >= 0),
    cancellation_policy TEXT DEFAULT 'Free cancellation up to 2 hours before booking time',
    special_instructions TEXT,
    auto_confirm BOOLEAN DEFAULT false,
    require_phone BOOLEAN DEFAULT true,
    require_email BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operating hours - When restaurants are open for bookings
CREATE TABLE IF NOT EXISTS operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    is_open BOOLEAN DEFAULT true,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    break_start_time TIME, -- For lunch breaks, etc.
    break_end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, day_of_week)
);

-- Time slots - Available booking slots per restaurant
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL,
    capacity INTEGER DEFAULT 50 CHECK (capacity > 0),
    duration_minutes INTEGER DEFAULT 120 CHECK (duration_minutes > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, slot_time)
);

-- Bookings table - Core booking data
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    confirmation_code VARCHAR(20) UNIQUE,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('customer', 'restaurant', 'system')),
    seated_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT, -- Internal restaurant notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocked dates - When restaurants are closed or unavailable
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurring_type VARCHAR(20) CHECK (recurring_type IN ('weekly', 'monthly', 'yearly')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, blocked_date)
);

-- Menu categories - For organizing menu items
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, name)
);

-- Menu items - Restaurant menu management
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    dietary_flags JSONB DEFAULT '[]'::jsonb, -- ["vegetarian", "vegan", "gluten-free", "spicy"]
    spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5),
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    preparation_time_minutes INTEGER DEFAULT 15,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking notifications - Track notification history
CREATE TABLE IF NOT EXISTS booking_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'confirmation', 'reminder', 'cancellation', etc.
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    channel VARCHAR(20) CHECK (channel IN ('email', 'sms', 'whatsapp', 'in_app')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance (only if they don't exist)
DO $$
BEGIN
    -- Bookings indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_business_date') THEN
        CREATE INDEX idx_bookings_business_date ON bookings(business_id, booking_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_status') THEN
        CREATE INDEX idx_bookings_status ON bookings(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_customer_email') THEN
        CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_confirmation_code') THEN
        CREATE INDEX idx_bookings_confirmation_code ON bookings(confirmation_code);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_datetime') THEN
        CREATE INDEX idx_bookings_datetime ON bookings(booking_date, booking_time);
    END IF;
    
    -- Other indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_operating_hours_business') THEN
        CREATE INDEX idx_operating_hours_business ON operating_hours(business_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_time_slots_business') THEN
        CREATE INDEX idx_time_slots_business ON time_slots(business_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_blocked_dates_business_date') THEN
        CREATE INDEX idx_blocked_dates_business_date ON blocked_dates(business_id, blocked_date);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_items_business') THEN
        CREATE INDEX idx_menu_items_business ON menu_items(business_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_items_category') THEN
        CREATE INDEX idx_menu_items_category ON menu_items(category_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_menu_items_available') THEN
        CREATE INDEX idx_menu_items_available ON menu_items(is_available);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_booking_notifications_booking') THEN
        CREATE INDEX idx_booking_notifications_booking ON booking_notifications(booking_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_booking_notifications_status') THEN
        CREATE INDEX idx_booking_notifications_status ON booking_notifications(status);
    END IF;
END $$;

-- Add triggers for updated_at columns (safe to re-run)
DROP TRIGGER IF EXISTS update_restaurant_settings_updated_at ON restaurant_settings;
CREATE TRIGGER update_restaurant_settings_updated_at BEFORE UPDATE ON restaurant_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_categories_updated_at ON menu_categories;
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking confirmation codes
CREATE OR REPLACE FUNCTION generate_booking_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    prefix TEXT := 'BK';
    suffix TEXT;
BEGIN
    -- Generate random 6-digit suffix
    suffix := LPAD((RANDOM() * 999999)::INTEGER::TEXT, 6, '0');
    
    -- Combine with prefix and current year
    code := prefix || DATE_PART('year', NOW())::TEXT || suffix;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
    p_business_id UUID,
    p_booking_date DATE,
    p_booking_time TIME,
    p_party_size INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    slot_capacity INTEGER;
    current_bookings INTEGER;
    is_open BOOLEAN;
    is_blocked BOOLEAN;
BEGIN
    -- Check if date is blocked
    SELECT EXISTS(
        SELECT 1 FROM blocked_dates 
        WHERE business_id = p_business_id 
        AND blocked_date = p_booking_date
    ) INTO is_blocked;
    
    IF is_blocked THEN
        RETURN FALSE;
    END IF;
    
    -- Check if restaurant is open on this day/time
    SELECT EXISTS(
        SELECT 1 FROM operating_hours 
        WHERE business_id = p_business_id 
        AND day_of_week = EXTRACT(DOW FROM p_booking_date)
        AND is_open = true
        AND p_booking_time >= open_time 
        AND p_booking_time <= close_time
        AND (break_start_time IS NULL OR p_booking_time < break_start_time OR p_booking_time >= break_end_time)
    ) INTO is_open;
    
    IF NOT is_open THEN
        RETURN FALSE;
    END IF;
    
    -- Get time slot capacity
    SELECT capacity INTO slot_capacity
    FROM time_slots 
    WHERE business_id = p_business_id 
    AND slot_time = p_booking_time
    AND is_active = true;
    
    -- If no specific time slot, use default capacity from restaurant settings
    IF slot_capacity IS NULL THEN
        slot_capacity := 50; -- Default capacity
    END IF;
    
    -- Count current bookings for this time slot
    SELECT COALESCE(SUM(party_size), 0) INTO current_bookings
    FROM bookings 
    WHERE business_id = p_business_id 
    AND booking_date = p_booking_date 
    AND booking_time = p_booking_time
    AND status NOT IN ('cancelled', 'no_show');
    
    -- Check if there's enough capacity
    RETURN (current_bookings + p_party_size) <= slot_capacity;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Restaurant settings accessible by partners
DROP POLICY IF EXISTS "Partners can view restaurant settings" ON restaurant_settings;
CREATE POLICY "Partners can view restaurant settings" ON restaurant_settings
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM partners WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "Partners can update restaurant settings" ON restaurant_settings;
CREATE POLICY "Partners can update restaurant settings" ON restaurant_settings
    FOR ALL USING (
        business_id IN (
            SELECT business_id FROM partners WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Bookings policies
DROP POLICY IF EXISTS "Partners can view their restaurant bookings" ON bookings;
CREATE POLICY "Partners can view their restaurant bookings" ON bookings
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM partners WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "Partners can manage their restaurant bookings" ON bookings;
CREATE POLICY "Partners can manage their restaurant bookings" ON bookings
    FOR ALL USING (
        business_id IN (
            SELECT business_id FROM partners WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "Customers can create bookings" ON bookings;
CREATE POLICY "Customers can create bookings" ON bookings
    FOR INSERT WITH CHECK (true); -- Anyone can create a booking

-- Public access policies
DROP POLICY IF EXISTS "Public can view restaurant operating hours" ON operating_hours;
CREATE POLICY "Public can view restaurant operating hours" ON operating_hours
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view time slots" ON time_slots;
CREATE POLICY "Public can view time slots" ON time_slots
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view menu items" ON menu_items;
CREATE POLICY "Public can view menu items" ON menu_items
    FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Public can view menu categories" ON menu_categories;
CREATE POLICY "Public can view menu categories" ON menu_categories
    FOR SELECT USING (is_active = true);

-- Success message
SELECT 'Missing booking system tables created successfully!' as message; 