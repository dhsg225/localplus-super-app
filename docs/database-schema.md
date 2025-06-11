# LocalPlus Database Schema Design

## Overview
Production-ready PostgreSQL schema for LocalPlus dual-revenue platform (B2B restaurants + B2C customers).

## Core Tables

### 1. Users (Customers)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  
  -- Location & Preferences
  preferred_location VARCHAR(100),
  preferred_cuisines JSON, -- ["Thai", "Italian", "Japanese"]
  
  -- Subscription Status
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'premium'
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  
  -- Passport System
  passport_stamps INTEGER DEFAULT 0,
  passport_level VARCHAR(20) DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  passport_badges JSON, -- ["silom_master", "thai_expert", "weekend_warrior"]
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

### 2. Businesses (Restaurants)
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Business Profile
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE, -- url-friendly name
  description TEXT,
  cuisine_type VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  
  -- Location
  address TEXT NOT NULL,
  district VARCHAR(100), -- Silom, Sathorn, Thonglor, etc.
  city VARCHAR(100) DEFAULT 'Bangkok',
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Hours (JSON for flexibility)
  operating_hours JSON, -- {"monday": {"open": "11:00", "close": "22:00", "closed": false}}
  
  -- Subscription & Status
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free', 'premium'
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  monthly_fee DECIMAL(8,2) DEFAULT 300.00, -- 300 THB
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'active', 'pending', 'overdue', 'cancelled'
  
  -- Business Metrics
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0.00,
  
  -- Features & Verification
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  owner_user_id UUID REFERENCES users(id)
);
```

### 3. Business Media
```sql
CREATE TABLE business_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER, -- bytes
  display_order INTEGER DEFAULT 0,
  
  -- Image specific
  alt_text VARCHAR(255),
  is_cover_photo BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Deals & Offers
```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  
  -- Deal Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deal_type VARCHAR(20) NOT NULL, -- 'early-bird', 'afternoon', 'late-night'
  
  -- Pricing
  original_price DECIMAL(8,2),
  discount_percentage INTEGER NOT NULL, -- Always rounded to nearest 5%
  discounted_price DECIMAL(8,2),
  
  -- Availability
  available_dates JSON, -- ["2024-06-11", "2024-06-12"]
  max_uses_per_customer INTEGER DEFAULT 1,
  total_redemptions INTEGER DEFAULT 0,
  max_total_redemptions INTEGER,
  
  -- Terms & Conditions
  terms_conditions JSON, -- ["Advance booking required", "Limited time offer"]
  pax_options JSON, -- [2, 4, 6, 8]
  
  -- Time Management
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Subscription Gating
  requires_premium BOOLEAN DEFAULT false,
  
  -- Popularity & Features
  is_popular BOOLEAN DEFAULT false,
  is_limited_time BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Deal Time Slots
```sql
CREATE TABLE deal_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  
  start_time TIME NOT NULL, -- 14:00
  end_time TIME NOT NULL,   -- 15:00
  
  max_seats INTEGER NOT NULL,
  remaining_seats INTEGER NOT NULL,
  
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Bookings & Reservations
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id),
  business_id UUID NOT NULL REFERENCES businesses(id),
  deal_id UUID REFERENCES deals(id), -- NULL if regular booking
  time_slot_id UUID REFERENCES deal_time_slots(id),
  
  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  party_size INTEGER NOT NULL,
  
  -- Contact Info
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  special_requests TEXT,
  
  -- Status & Payment
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
  confirmation_code VARCHAR(10) UNIQUE,
  
  -- Financial
  original_amount DECIMAL(8,2),
  discount_amount DECIMAL(8,2) DEFAULT 0.00,
  final_amount DECIMAL(8,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  
  -- Passport Points
  stamps_earned INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Reviews & Ratings
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID NOT NULL REFERENCES users(id),
  business_id UUID NOT NULL REFERENCES businesses(id),
  booking_id UUID REFERENCES bookings(id),
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  
  -- Deal Experience (if applicable)
  deal_rating INTEGER CHECK (deal_rating >= 1 AND deal_rating <= 5),
  would_recommend BOOLEAN,
  
  -- Status
  is_verified BOOLEAN DEFAULT false, -- Verified if linked to actual booking
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 8. User Passport System
```sql
CREATE TABLE passport_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Activity Details
  activity_type VARCHAR(30) NOT NULL, -- 'booking_completed', 'review_written', 'deal_redeemed'
  activity_description VARCHAR(255),
  
  -- Rewards
  stamps_earned INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  badge_earned VARCHAR(50), -- 'silom_master', 'thai_expert', etc.
  
  -- Context
  related_business_id UUID REFERENCES businesses(id),
  related_booking_id UUID REFERENCES bookings(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. Saved Deals (Customer Bookmarks)
```sql
CREATE TABLE saved_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  deal_id UUID NOT NULL REFERENCES deals(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, deal_id)
);
```

### 10. Business Analytics
```sql
CREATE TABLE business_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  
  -- Date Range
  analytics_date DATE NOT NULL,
  
  -- Metrics
  profile_views INTEGER DEFAULT 0,
  deal_views INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- Deal Performance
  most_popular_deal_id UUID REFERENCES deals(id),
  total_deal_redemptions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_id, analytics_date)
);
```

### 11. Subscription Payments
```sql
CREATE TABLE subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User/Business References
  user_id UUID REFERENCES users(id), -- For customer subscriptions
  business_id UUID REFERENCES businesses(id), -- For restaurant subscriptions
  
  -- Payment Details
  payment_type VARCHAR(20) NOT NULL, -- 'customer_premium', 'business_premium'
  amount DECIMAL(8,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  
  -- Billing Period
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  
  -- Payment Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method VARCHAR(30), -- 'credit_card', 'promptpay', 'bank_transfer'
  external_payment_id VARCHAR(255), -- Stripe/Omise payment ID
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_end_date);

-- Business lookups
CREATE INDEX idx_businesses_location ON businesses(district, city);
CREATE INDEX idx_businesses_cuisine ON businesses(cuisine_type);
CREATE INDEX idx_businesses_subscription ON businesses(subscription_tier, payment_status);

-- Deal queries
CREATE INDEX idx_deals_business ON deals(business_id, is_active);
CREATE INDEX idx_deals_type_dates ON deals(deal_type, start_date, end_date);
CREATE INDEX idx_deals_premium ON deals(requires_premium, is_active);

-- Booking queries
CREATE INDEX idx_bookings_user ON bookings(user_id, created_at);
CREATE INDEX idx_bookings_business ON bookings(business_id, booking_date);
CREATE INDEX idx_bookings_status ON bookings(status, booking_date);

-- Analytics
CREATE INDEX idx_analytics_business_date ON business_analytics(business_id, analytics_date);
```

## Business Logic Views

```sql
-- Active Premium Customers
CREATE VIEW premium_customers AS
SELECT u.*, 
       CASE WHEN u.subscription_end_date > NOW() THEN true ELSE false END as is_premium_active
FROM users u
WHERE u.subscription_tier = 'premium';

-- Restaurant Revenue Dashboard
CREATE VIEW restaurant_revenue_summary AS
SELECT 
  b.id,
  b.name,
  COUNT(bk.id) as total_bookings,
  SUM(bk.final_amount) as total_revenue,
  AVG(r.rating) as average_rating,
  COUNT(r.id) as review_count
FROM businesses b
LEFT JOIN bookings bk ON b.id = bk.business_id AND bk.status = 'completed'
LEFT JOIN reviews r ON b.id = r.business_id AND r.is_active = true
GROUP BY b.id, b.name;
```

## Key Features Supported

✅ **Dual Revenue Model**: User + Business subscriptions
✅ **Passport System**: Stamps, badges, levels
✅ **Deal Management**: Time slots, availability, premium gating
✅ **Analytics**: Business performance tracking
✅ **Reviews & Ratings**: Verified customer feedback
✅ **Location-based**: District/city filtering
✅ **Subscription Management**: Payment tracking, renewals
✅ **Media Management**: Restaurant photos/videos
✅ **Booking System**: Reservations with confirmation codes

## Next Steps
1. Set up Supabase project with this schema
2. Create database migrations
3. Add Row Level Security (RLS) policies
4. Set up real-time subscriptions for bookings
5. Implement backup and monitoring 