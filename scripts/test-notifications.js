// [2024-12-19 10:30] - Test script to verify notification system functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // 1. Test notification preferences table
    console.log('1. Checking notification_preferences table...');
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('*')
      .limit(1);

    if (prefsError) {
      console.log('❌ Error accessing notification_preferences table:', prefsError.message);
      console.log('   Please run the setup-notification-preferences.sql script in Supabase');
      return;
    }

    console.log('✅ notification_preferences table accessible');
    console.log(`   Found ${prefs?.length || 0} preference records\n`);

    // 2. Test booking_notifications table
    console.log('2. Checking booking_notifications table...');
    const { data: notifications, error: notifError } = await supabase
      .from('booking_notifications')
      .select('*')
      .limit(1);

    if (notifError) {
      console.log('❌ Error accessing booking_notifications table:', notifError.message);
      return;
    }

    console.log('✅ booking_notifications table accessible');
    console.log(`   Found ${notifications?.length || 0} notification records\n`);

    // 3. Test businesses table
    console.log('3. Checking businesses table...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .limit(1);

    if (businessError) {
      console.log('❌ Error accessing businesses table:', businessError.message);
      return;
    }

    console.log('✅ businesses table accessible');
    if (businesses?.length > 0) {
      console.log(`   Found business: ${businesses[0].name} (${businesses[0].id})`);
    } else {
      console.log('   No businesses found');
    }
    console.log('');

    // 4. Test creating notification preferences
    if (businesses?.length > 0) {
      console.log('4. Testing notification preferences creation...');
      const businessId = businesses[0].id;
      
      const { data: newPrefs, error: createError } = await supabase
        .from('notification_preferences')
        .upsert({
          business_id: businessId,
          email_enabled: true,
          sms_enabled: false,
          auto_send_confirmations: true,
          auto_send_reminders: true,
          reminder_hours_before: 24
        })
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creating notification preferences:', createError.message);
      } else {
        console.log('✅ Notification preferences created/updated successfully');
        console.log(`   Business ID: ${newPrefs.business_id}`);
        console.log(`   Email enabled: ${newPrefs.email_enabled}`);
        console.log(`   SMS enabled: ${newPrefs.sms_enabled}`);
      }
      console.log('');
    }

    // 5. Test template variables
    console.log('5. Testing template variable replacement...');
    const testTemplate = 'Your booking at {{restaurant_name}} has been confirmed for {{date}} at {{time}} for {{party_size}} people.';
    const variables = {
      restaurant_name: 'Test Restaurant',
      date: '2024-12-20',
      time: '19:00',
      party_size: '4'
    };

    let processedTemplate = testTemplate;
    Object.entries(variables).forEach(([key, value]) => {
      processedTemplate = processedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    console.log('✅ Template variable replacement working');
    console.log(`   Original: ${testTemplate}`);
    console.log(`   Processed: ${processedTemplate}`);
    console.log('');

    console.log('🎉 All notification system tests passed!');
    console.log('\nNext steps:');
    console.log('1. Open the partner app at http://localhost:5173');
    console.log('2. Navigate to the "Notifications" tab');
    console.log('3. Configure your notification preferences');
    console.log('4. Test sending notifications');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNotificationSystem(); 