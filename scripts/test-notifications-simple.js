// [2024-12-19 10:30] - Simple test script to verify notification system setup
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testNotificationSetup() {
  console.log('🧪 Testing Notification System Setup...\n');

  try {
    // Test notification preferences table
    console.log('1. Checking notification_preferences table...');
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('*')
      .limit(1);

    if (prefsError) {
      console.log('❌ Error accessing notification_preferences table:', prefsError.message);
      console.log('   Please run the setup-notification-preferences.sql script in Supabase SQL Editor');
      console.log('   File: scripts/setup-notification-preferences.sql');
      return;
    }

    console.log('✅ notification_preferences table accessible');
    console.log(`   Found ${prefs?.length || 0} preference records\n`);

    // Test booking_notifications table
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

    // Test businesses table
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

    console.log('🎉 Notification system setup verified!');
    console.log('\nNext steps:');
    console.log('1. Open the partner app at http://localhost:5173');
    console.log('2. Navigate to the "Notifications" tab');
    console.log('3. Configure your notification preferences');
    console.log('4. Test sending notifications');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNotificationSetup(); 