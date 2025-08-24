// [2024-12-19] - Check business partnership status
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBusinessStatus() {
  console.log('Checking business partnership status...');
  
  try {
    // Get all businesses with their partnership status
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, partnership_status')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching businesses:', error);
      return;
    }
    
    console.log(`✅ Found ${data?.length || 0} businesses:`);
    
    if (data && data.length > 0) {
      const statusCounts = {};
      
      data.forEach(business => {
        const status = business.partnership_status || 'null';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        console.log(`- ${business.name} (${business.id}) - Status: ${status}`);
      });
      
      console.log('\n📊 Status Summary:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} businesses`);
      });
      
      // Check which businesses would be visible with current RLS policy
      const activeBusinesses = data.filter(b => b.partnership_status === 'active');
      console.log(`\n🔍 Businesses visible with RLS policy (partnership_status = 'active'): ${activeBusinesses.length}`);
      
      if (activeBusinesses.length === 0) {
        console.log('❌ No businesses are visible due to RLS policy!');
        console.log('💡 This explains why the signup form shows "No businesses available"');
      } else {
        console.log('✅ Some businesses are visible');
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkBusinessStatus(); 