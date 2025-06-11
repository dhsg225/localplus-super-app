-- LocalPlus Super App Database Schema
-- Execute these commands in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon, color) VALUES
('Restaurants', 'Dining and food services', 'utensils', '#ef4444'),
('Wellness', 'Spas, fitness, and health services', 'heart', '#10b981'),
('Shopping', 'Retail stores and markets', 'shopping-bag', '#f59e0b'),
('Services', 'Professional and personal services', 'wrench', '#6366f1'),
('Entertainment', 'Events, activities, and leisure', 'calendar', '#8b5cf6'),
('Travel', 'Hotels, tours, and transportation', 'map-pin', '#06b6d4');

-- Businesses table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_place_id VARCHAR UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website_url VARCHAR(500),
    description TEXT,
    business_hours JSONB, -- Store opening hours as JSON
    partnership_status VARCHAR(20) DEFAULT 'pending' CHECK (partnership_status IN ('pending', 'active', 'suspended')),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount offers table
CREATE TABLE discount_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    terms_conditions TEXT,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    max_redemptions_per_user INTEGER DEFAULT 1 CHECK (max_redemptions_per_user > 0),
    total_redemption_limit INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    total_savings DECIMAL(10,2) DEFAULT 0,
    redemption_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User redemptions table
CREATE TABLE user_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    discount_offer_id UUID REFERENCES discount_offers(id) ON DELETE CASCADE,
    redemption_code VARCHAR(20) UNIQUE NOT NULL,
    amount_saved DECIMAL(10,2),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'disputed')),
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Business analytics table
CREATE TABLE business_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    profile_views INTEGER DEFAULT 0,
    redemptions INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    total_savings_given DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_businesses_location ON businesses USING GIST (point(longitude, latitude));
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_partnership_status ON businesses(partnership_status);
CREATE INDEX idx_discount_offers_business ON discount_offers(business_id);
CREATE INDEX idx_discount_offers_active ON discount_offers(is_active, valid_from, valid_until);
CREATE INDEX idx_user_redemptions_user ON user_redemptions(user_id);
CREATE INDEX idx_user_redemptions_business ON user_redemptions(business_id);
CREATE INDEX idx_user_redemptions_date ON user_redemptions(redeemed_at);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_offers_updated_at BEFORE UPDATE ON discount_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique redemption codes
CREATE OR REPLACE FUNCTION generate_redemption_code(business_name TEXT)
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    prefix TEXT;
    suffix TEXT;
BEGIN
    -- Generate prefix from business name (first 2-3 letters, uppercase)
    prefix := UPPER(LEFT(REGEXP_REPLACE(business_name, '[^A-Za-z]', '', 'g'), 3));
    
    -- Generate random suffix
    suffix := LPAD((RANDOM() * 99999)::INTEGER::TEXT, 5, '0');
    
    -- Combine with current year
    code := prefix || DATE_PART('year', NOW())::TEXT || '-' || suffix;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for businesses and offers
CREATE POLICY "Businesses are viewable by everyone" ON businesses
    FOR SELECT USING (partnership_status = 'active');

CREATE POLICY "Active discount offers are viewable by everyone" ON discount_offers
    FOR SELECT USING (is_active = true);

-- Users can only see/edit their own profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can view their own redemptions
CREATE POLICY "Users can view their own redemptions" ON user_redemptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create redemptions for themselves
CREATE POLICY "Users can create their own redemptions" ON user_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sample data insertion
INSERT INTO businesses (name, category_id, address, latitude, longitude, phone, email, description, partnership_status) VALUES
(
    'Seaside Bistro',
    (SELECT id FROM categories WHERE name = 'Restaurants'),
    '123 Beach Road, Hua Hin 77110',
    12.5684, 
    99.9578,
    '+66-32-512-345',
    'info@seasidebistro.com',
    'Fresh seafood restaurant with ocean views. Specializing in local Thai cuisine and international dishes.',
    'active'
),
(
    'Blue Wave Spa',
    (SELECT id FROM categories WHERE name = 'Wellness'),
    '456 Wellness Center, Hua Hin 77110',
    12.5704,
    99.9598,
    '+66-32-513-456',
    'booking@bluewavespa.com',
    'Luxury spa offering traditional Thai massage, aromatherapy, and wellness treatments.',
    'active'
),
(
    'Local Craft Market',
    (SELECT id FROM categories WHERE name = 'Shopping'),
    '789 Night Market Street, Hua Hin 77110',
    12.5664,
    99.9568,
    '+66-32-514-567',
    'info@localcraftmarket.com',
    'Authentic local crafts, souvenirs, and handmade products from local artisans.',
    'active'
),
(
    'Sunset Sailing',
    (SELECT id FROM categories WHERE name = 'Entertainment'),
    'Hua Hin Pier, Hua Hin 77110',
    12.5744,
    99.9638,
    '+66-32-515-678',
    'bookings@sunsetsailing.com',
    'Scenic boat tours and sunset sailing experiences along the Hua Hin coastline.',
    'active'
),
(
    'Golden Palace Thai',
    (SELECT id FROM categories WHERE name = 'Restaurants'),
    '321 Royal Golf Area, Hua Hin 77110',
    12.5804,
    99.9718,
    '+66-32-516-789',
    'reservations@goldenpalacethai.com',
    'Upscale Thai restaurant featuring royal cuisine in an elegant setting.',
    'active'
),
(
    'Wellness Retreat Center',
    (SELECT id FROM categories WHERE name = 'Wellness'),
    '654 Khao Takiab Road, Hua Hin 77110',
    12.5584,
    99.9518,
    '+66-32-517-890',
    'info@wellnessretreat.com',
    'Holistic wellness center offering yoga, meditation, and detox programs.',
    'active'
);

-- Insert discount offers for the businesses
INSERT INTO discount_offers (business_id, title, description, discount_percentage, terms_conditions, valid_until, max_redemptions_per_user) 
SELECT 
    b.id,
    CASE 
        WHEN b.name = 'Seaside Bistro' THEN 'Fresh Seafood Special'
        WHEN b.name = 'Blue Wave Spa' THEN 'Relaxation Package'
        WHEN b.name = 'Local Craft Market' THEN 'Artisan Craft Discount'
        WHEN b.name = 'Sunset Sailing' THEN 'Sunset Cruise Special'
        WHEN b.name = 'Golden Palace Thai' THEN 'Royal Dining Experience'
        WHEN b.name = 'Wellness Retreat Center' THEN 'Wellness Journey Package'
    END,
    CASE 
        WHEN b.name = 'Seaside Bistro' THEN '20% off all seafood dishes and appetizers'
        WHEN b.name = 'Blue Wave Spa' THEN '25% off traditional Thai massage treatments'
        WHEN b.name = 'Local Craft Market' THEN '15% off handmade local crafts and souvenirs'
        WHEN b.name = 'Sunset Sailing' THEN '30% off sunset sailing tours'
        WHEN b.name = 'Golden Palace Thai' THEN '18% off dinner menu and wine selection'
        WHEN b.name = 'Wellness Retreat Center' THEN '22% off wellness programs and yoga classes'
    END,
    CASE 
        WHEN b.name = 'Seaside Bistro' THEN 20
        WHEN b.name = 'Blue Wave Spa' THEN 25
        WHEN b.name = 'Local Craft Market' THEN 15
        WHEN b.name = 'Sunset Sailing' THEN 30
        WHEN b.name = 'Golden Palace Thai' THEN 18
        WHEN b.name = 'Wellness Retreat Center' THEN 22
    END,
    'Valid for Savings Passport members only. Cannot be combined with other offers. Valid ID required.',
    '2024-12-31',
    1
FROM businesses b
WHERE b.partnership_status = 'active'; 