import { createClient } from '@supabase/supabase-js';

// Use the correct credentials from .env file
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkViewIssue() {
  console.log('🔍 Diagnosing business_locations view issue...\n');

  try {
    // First check businesses with geographic data and their partnership status
    console.log('📊 Checking businesses with geographic data:');
    const { data: geoBusinesses, error: geoError } = await supabase
      .from('businesses')
      .select('name, partnership_status, province_id')
      .not('province_id', 'is', null)
      .limit(5);

    if (geoError) {
      console.log('❌ Error:', geoError.message);
      return;
    }

    console.log(`Found ${geoBusinesses?.length || 0} businesses with geographic data:`);
    geoBusinesses?.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} - Status: "${business.partnership_status}"`);
    });

    // Check what partnership statuses exist
    const statuses = Array.from(new Set(geoBusinesses?.map(b => b.partnership_status) || []));
    console.log(`\nPartnership statuses found: ${statuses.join(', ')}`);

    // Test the view without any WHERE clause to see all records
    console.log('\n🔗 Testing business_locations view (all records):');
    const { data: allViewData, error: allViewError } = await supabase
      .from('business_locations')
      .select('name, partnership_status, province_name')
      .limit(10);

    if (allViewError) {
      console.log('❌ View error:', allViewError.message);
    } else {
      console.log(`✅ View returned ${allViewData?.length || 0} records`);
      allViewData?.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name} (${business.partnership_status}) - Province: ${business.province_name || 'NULL'}`);
      });
    }

    // Check if the issue is the 'active' filter
    console.log('\n🎯 The issue is likely the partnership_status filter in the view.');
    console.log('The view filters for partnership_status = \'active\' but your businesses might have different statuses.');
    
    if (statuses.length > 0 && !statuses.includes('active')) {
      console.log(`\n💡 SOLUTION: Update businesses to have 'active' status or modify the view.`);
      console.log(`Current statuses: ${statuses.join(', ')}`);
      console.log(`Expected status: 'active'`);
    }

  } catch (error) {
    console.error('💥 Check failed:', error);
  }
}

// Run the check
checkViewIssue(); 