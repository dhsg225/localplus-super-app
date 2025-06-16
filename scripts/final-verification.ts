import { createClient } from '@supabase/supabase-js';

// Use the correct credentials from .env file
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalVerification() {
  console.log('🎯 Final Geographic Hierarchy Verification\n');

  try {
    // Check businesses with geographic data
    console.log('📍 Checking businesses with geographic data:');
    const { data: geoBusinesses, error: geoError } = await supabase
      .from('businesses')
      .select('name, address, province_id, district_id, sub_district_id, postal_code, partnership_status')
      .not('province_id', 'is', null)
      .limit(5);

    if (geoError) {
      console.log('❌ Error:', geoError.message);
    } else {
      console.log(`✅ Found ${geoBusinesses?.length || 0} businesses with geographic data`);
      geoBusinesses?.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name}`);
        console.log(`   Province ID: ${business.province_id}`);
        console.log(`   District ID: ${business.district_id}`);
        console.log(`   Sub-district ID: ${business.sub_district_id}`);
        console.log(`   Postal Code: ${business.postal_code}`);
        console.log(`   Partnership Status: "${business.partnership_status}"`);
        console.log('');
      });
      
      // Check partnership statuses
      const statuses = Array.from(new Set(geoBusinesses?.map(b => b.partnership_status) || []));
      console.log(`🔍 Partnership statuses found: ${statuses.join(', ')}`);
      console.log(`💡 Note: The view filters for 'active' status only`);
    }

    // Test the business_locations view with geographic data
    console.log('🔗 Testing business_locations view:');
    const { data: viewData, error: viewError } = await supabase
      .from('business_locations')
      .select('name, full_address, province_name, district_name, sub_district_name')
      .not('province_name', 'is', null)
      .limit(5);

    if (viewError) {
      console.log('❌ View error:', viewError.message);
    } else {
      console.log(`✅ Found ${viewData?.length || 0} businesses in view with geographic data`);
      viewData?.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name}`);
        console.log(`   Province: ${business.province_name}`);
        console.log(`   District: ${business.district_name}`);
        console.log(`   Sub-district: ${business.sub_district_name}`);
        console.log(`   Full Address: ${business.full_address}`);
        console.log('');
      });
    }

    // Test geographic filtering
    console.log('🏖️  Testing geographic filtering (Hua Hin District):');
    const { data: huaHinBusinesses, error: filterError } = await supabase
      .from('business_locations')
      .select('name, district_name, province_name')
      .eq('district_name', 'Hua Hin')
      .limit(10);

    if (filterError) {
      console.log('❌ Filter error:', filterError.message);
    } else {
      console.log(`✅ Found ${huaHinBusinesses?.length || 0} businesses in Hua Hin District`);
      huaHinBusinesses?.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name} (${business.district_name}, ${business.province_name})`);
      });
    }

    // Summary
    console.log('\n📊 FINAL SUMMARY:');
    const hasGeoData = geoBusinesses && geoBusinesses.length > 0;
    const viewWorking = viewData && viewData.length > 0;
    const filteringWorks = huaHinBusinesses && huaHinBusinesses.length > 0;

    if (hasGeoData && viewWorking && filteringWorks) {
      console.log('🎉 SUCCESS: Geographic hierarchy is FULLY IMPLEMENTED and WORKING!');
      console.log('✅ Tables created');
      console.log('✅ Columns added to businesses table');
      console.log('✅ Data populated for Hua Hin businesses');
      console.log('✅ Business locations view working');
      console.log('✅ Geographic filtering functional');
      console.log('\n🚀 Ready for production use!');
    } else {
      console.log('⚠️  Issues found:');
      if (!hasGeoData) console.log('❌ No businesses have geographic data');
      if (!viewWorking) console.log('❌ Business locations view not working');
      if (!filteringWorks) console.log('❌ Geographic filtering not working');
    }

  } catch (error) {
    console.error('💥 Verification failed:', error);
  }
}

// Run the verification
finalVerification(); 