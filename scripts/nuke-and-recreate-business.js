const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, supabaseKey);

const oldId = '12345678-1234-5678-9012-123456789012';
const newId = '550e8400-e29b-41d4-a716-446655440000';

async function nukeAndRecreateBusiness() {
  console.log('🚀 Starting business cleanup and recreation with service role...');
  console.log('Old ID:', oldId);
  console.log('New ID:', newId);
  
  try {
    // Step 1: Delete from child tables first (to avoid foreign key errors)
    console.log('\n🗑️  Deleting related data...');
    
    const tablesToClean = [
      'partners',
      'bookings', 
      'notification_preferences',
      'operating_hours',
      'time_slots',
      'blocked_dates',
      'menu_categories',
      'menu_items'
    ];
    
    for (const table of tablesToClean) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('business_id', oldId);
      
      if (error) {
        console.log(`⚠️  Warning deleting from ${table}:`, error.message);
      } else {
        console.log(`✅ Cleaned ${table}`);
      }
    }
    
    // Step 2: Delete the business itself
    console.log('\n🗑️  Deleting business...');
    const { error: deleteError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', oldId);
    
    if (deleteError) {
      console.error('❌ Error deleting business:', deleteError);
      return;
    }
    
    console.log('✅ Business deleted successfully');
    
    // Step 3: Recreate the business with new UUID
    console.log('\n🔄 Recreating business with new UUID...');
    const newBusiness = {
      id: newId,
      name: "Shannon's Coastal Kitchen",
      address: "123 Ocean View Drive, Hua Hin 77110, Thailand",
      latitude: 12.5684,
      longitude: 99.9578,
      phone: "+66-32-555-0123",
      email: "reservations@shannonscoastal.com",
      description: "Coastal dining with fresh seafood and stunning ocean views",
      category: "restaurant",
      partnership_status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: createdBusiness, error: createError } = await supabase
      .from('businesses')
      .insert([newBusiness])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating business:', createError);
      return;
    }
    
    console.log('✅ Business recreated successfully:', createdBusiness.name);
    console.log('New ID:', createdBusiness.id);
    
    // Step 4: Verify the change
    console.log('\n🔍 Verifying the change...');
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name')
      .ilike('name', '%shannon%');
    
    if (businesses && businesses.length > 0) {
      console.log('✅ Found Shannon\'s restaurant with new ID:', businesses[0].id);
    } else {
      console.log('⚠️  Could not find Shannon\'s restaurant after recreation');
    }
    
    console.log('\n🎉 Business cleanup and recreation complete!');
    console.log('💡 Now refresh your app and test the notification settings.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

nukeAndRecreateBusiness(); 