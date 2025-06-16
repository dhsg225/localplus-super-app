import { createClient } from '@supabase/supabase-js';

// Use the correct credentials from .env file
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyColumns() {
  console.log('🔍 Verifying Database Schema...\n');

  try {
    // Try to select all columns from businesses table to see what exists
    console.log('📋 Checking businesses table structure:');
    
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (businessesError) {
      console.log('❌ Error querying businesses:', businessesError.message);
      return;
    }

    if (businesses && businesses.length > 0) {
      const sample = businesses[0];
      console.log('✅ Sample business record found');
      console.log('📊 Available columns:');
      
      Object.keys(sample).forEach(key => {
        console.log(`   - ${key}: ${typeof sample[key]} ${sample[key] !== null ? '(has value)' : '(null)'}`);
      });

      // Check specifically for geographic columns
      console.log('\n🗺️  Geographic columns status:');
      console.log(`   province_id: ${sample.hasOwnProperty('province_id') ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   district_id: ${sample.hasOwnProperty('district_id') ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   sub_district_id: ${sample.hasOwnProperty('sub_district_id') ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   address_line: ${sample.hasOwnProperty('address_line') ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   postal_code: ${sample.hasOwnProperty('postal_code') ? '✅ EXISTS' : '❌ MISSING'}`);

      // If columns exist, show their values
      if (sample.hasOwnProperty('province_id')) {
        console.log('\n📍 Geographic data values:');
        console.log(`   province_id: ${sample.province_id || 'NULL'}`);
        console.log(`   district_id: ${sample.district_id || 'NULL'}`);
        console.log(`   sub_district_id: ${sample.sub_district_id || 'NULL'}`);
        console.log(`   address_line: ${sample.address_line || 'NULL'}`);
        console.log(`   postal_code: ${sample.postal_code || 'NULL'}`);
      }
    }

    // Also test the business_locations view
    console.log('\n🔗 Testing business_locations view:');
    const { data: viewData, error: viewError } = await supabase
      .from('business_locations')
      .select('name, full_address, province_name, district_name')
      .limit(1);

    if (viewError) {
      console.log('❌ View error:', viewError.message);
    } else if (viewData && viewData.length > 0) {
      console.log('✅ View working:');
      console.log(`   Business: ${viewData[0].name}`);
      console.log(`   Full address: ${viewData[0].full_address}`);
      console.log(`   Province: ${viewData[0].province_name || 'NULL'}`);
      console.log(`   District: ${viewData[0].district_name || 'NULL'}`);
    }

  } catch (error) {
    console.error('💥 Verification failed:', error);
  }
}

// Run the verification
verifyColumns(); 