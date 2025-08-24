-- [2024-12-19 10:30] - Setup notification preferences table for business notification settings

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    email_templates JSONB DEFAULT '{
        "confirmation": "Your booking at {{restaurant_name}} has been confirmed for {{date}} at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}",
        "reminder": "Reminder: Your booking at {{restaurant_name}} is tomorrow at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}",
        "cancellation": "Your booking at {{restaurant_name}} for {{date}} at {{time}} has been cancelled. {{cancellation_reason}}",
        "no_show": "Your booking at {{restaurant_name}} for {{date}} at {{time}} has been marked as no-show."
    }'::jsonb,
    sms_templates JSONB DEFAULT '{
        "confirmation": "Booking confirmed at {{restaurant_name}} for {{date}} at {{time}}. Code: {{confirmation_code}}",
        "reminder": "Reminder: Booking tomorrow at {{time}} at {{restaurant_name}}. Code: {{confirmation_code}}",
        "cancellation": "Booking cancelled at {{restaurant_name}} for {{date}} at {{time}}.",
        "no_show": "Booking marked as no-show at {{restaurant_name}} for {{date}} at {{time}}."
    }'::jsonb,
    reminder_hours_before INTEGER DEFAULT 24 CHECK (reminder_hours_before >= 1 AND reminder_hours_before <= 168),
    auto_send_confirmations BOOLEAN DEFAULT true,
    auto_send_reminders BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_notification_preferences_business ON notification_preferences(business_id);

-- Add trigger for updated_at column
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER trigger_update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_preferences_updated_at();

-- Add RLS policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Partners can view their own business notification preferences
CREATE POLICY "Partners can view own business notification preferences" ON notification_preferences
    FOR SELECT USING (
        business_id IN (
            SELECT business_id FROM partners 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy: Partners can insert their own business notification preferences
CREATE POLICY "Partners can insert own business notification preferences" ON notification_preferences
    FOR INSERT WITH CHECK (
        business_id IN (
            SELECT business_id FROM partners 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy: Partners can update their own business notification preferences
CREATE POLICY "Partners can update own business notification preferences" ON notification_preferences
    FOR UPDATE USING (
        business_id IN (
            SELECT business_id FROM partners 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Policy: Partners can delete their own business notification preferences
CREATE POLICY "Partners can delete own business notification preferences" ON notification_preferences
    FOR DELETE USING (
        business_id IN (
            SELECT business_id FROM partners 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Insert default preferences for existing businesses (optional)
-- This will create default preferences for businesses that don't have them yet
INSERT INTO notification_preferences (business_id)
SELECT id FROM businesses 
WHERE id NOT IN (SELECT business_id FROM notification_preferences)
ON CONFLICT (business_id) DO NOTHING; 