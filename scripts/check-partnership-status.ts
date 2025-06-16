import { createClient } from '@supabase/supabase-js';

// Use the correct credentials from .env file
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPartnershipStatus() {
  console.log('🔍 Checking partnership status values...\n');

  try {
    // Check all partnership statuses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('name, partnership_status, province_id')
      .not('province_id', 'is', null)
      .limit(10);

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log('📊 Businesses with geographic data and their partnership status:');
    const statusCounts: Record<string, number> = {};
    
    businesses?.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name}`);
      console.log(`   Partnership Status: "${business.partnership_status}"`);
      console.log('');
      
      statusCounts[business.partnership_status] = (statusCounts[business.partnership_status] || 0) + 1;
    });

    console.log('📈 Partnership Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   "${status}": ${count} businesses`);
    });

    // Test the view with different filters
    console.log('\n🔗 Testing business_locations view with different filters:');
    
    // Test without any filter
    const { data: allViewData, error: allError } = await supabase
      .from('business_locations')
      .select('name, partnership_status, province_name')
      .limit(5);

    if (allError) {
      console.log('❌ All view error:', allError.message);
    } else {
      console.log(`✅ All businesses in view: ${allViewData?.length || 0}`);
      allViewData?.forEach(business => {
        console.log(`   ${business.name} (${business.partnership_status}) - Province: ${business.province_name || 'NULL'}`);
      });
    }

    // Check what partnership statuses exist in the view
    const { data: statusData, error: statusError } = await supabase
      .from('business_locations')
      .select('partnership_status')
      .not('province_name', 'is', null);

    if (statusError) {
      console.log('❌ Status check error:', statusError.message);
    } else {
      console.log(`\n📋 Partnership statuses in view: ${statusData?.length || 0} records`);
      const viewStatuses = Array.from(new Set(statusData?.map(d => d.partnership_status)));
      viewStatuses.forEach(status => {
        console.log(`   "${status}"`);
      });
    }

  } catch (error) {
    console.error('💥 Check failed:', error);
  }
}

// Run the check
checkPartnershipStatus(); 