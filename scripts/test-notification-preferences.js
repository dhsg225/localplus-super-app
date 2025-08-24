const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const businessId = '550e8400-e29b-41d4-a716-446655440000';

async function testNotificationPreferences() {
  console.log('🧪 Testing notification preferences access...');
  console.log('Business ID:', businessId);
  
  try {
    // Test 1: Check if table exists and we can query it
    console.log('\n1️⃣ Testing basic table access...');
    const { data: allPrefs, error: allError } = await supabase
      .from('notification_preferences')
      .select('*')
      .limit(5);
    
    if (allError) {
      console.error('❌ Error accessing notification_preferences table:', allError);
      return;
    }
    
    console.log('✅ Table access successful. Found', allPrefs?.length || 0, 'preferences');
    
    // Test 2: Check for existing preferences for this business
    console.log('\n2️⃣ Testing business-specific query...');
    const { data: businessPrefs, error: businessError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('business_id', businessId);
    
    if (businessError) {
      console.error('❌ Error querying business preferences:', businessError);
      return;
    }
    
    console.log('✅ Business query successful. Found', businessPrefs?.length || 0, 'preferences for business');
    
    // Test 3: Try to create a test preference
    console.log('\n3️⃣ Testing preference creation...');
    const testPreference = {
      business_id: businessId,
      email_enabled: true,
      sms_enabled: false,
      email_templates: {
        confirmation: 'Test confirmation',
        reminder: 'Test reminder',
        cancellation: 'Test cancellation',
        no_show: 'Test no-show'
      },
      sms_templates: {
        confirmation: 'Test SMS confirmation',
        reminder: 'Test SMS reminder',
        cancellation: 'Test SMS cancellation',
        no_show: 'Test SMS no-show'
      },
      reminder_hours_before: 24,
      auto_send_confirmations: true,
      auto_send_reminders: true
    };
    
    const { data: createdPref, error: createError } = await supabase
      .from('notification_preferences')
      .insert([testPreference])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating test preference:', createError);
      return;
    }
    
    console.log('✅ Test preference created successfully:', createdPref.id);
    
    // Test 4: Try to read the created preference
    console.log('\n4️⃣ Testing preference retrieval...');
    const { data: retrievedPref, error: retrieveError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('id', createdPref.id)
      .single();
    
    if (retrieveError) {
      console.error('❌ Error retrieving created preference:', retrieveError);
      return;
    }
    
    console.log('✅ Preference retrieval successful:', retrievedPref.id);
    
    console.log('\n🎉 All tests passed! The service role client works correctly.');
    console.log('💡 The 406 error in the browser might be due to a different issue.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testNotificationPreferences(); 