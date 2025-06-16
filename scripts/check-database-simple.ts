// Import the existing supabase client from the app
import { supabase } from '../src/lib/supabase';

async function checkDatabase() {
  console.log('🔍 Checking LocalPlus Database Status...\n');

  try {
    // Check if geographic hierarchy tables exist
    console.log('📍 Checking Geographic Hierarchy Tables:');
    
    // Check provinces table
    const { data: provinces, error: provincesError } = await supabase
      .from('provinces')
      .select('*')
      .limit(5);
    
    if (provincesError) {
      console.log('❌ provinces table: NOT FOUND');
      console.log('   Error:', provincesError.message);
    } else {
      console.log('✅ provinces table: EXISTS');
      console.log(`   Records: ${provinces?.length || 0}`);
      if (provinces && provinces.length > 0) {
        console.log('   Sample:', provinces[0].name_en);
      }
    }

    // Check districts table
    const { data: districts, error: districtsError } = await supabase
      .from('districts')
      .select('*')
      .limit(5);
    
    if (districtsError) {
      console.log('❌ districts table: NOT FOUND');
      console.log('   Error:', districtsError.message);
    } else {
      console.log('✅ districts table: EXISTS');
      console.log(`   Records: ${districts?.length || 0}`);
      if (districts && districts.length > 0) {
        console.log('   Sample:', districts[0].name_en);
      }
    }

    // Check sub_districts table
    const { data: subDistricts, error: subDistrictsError } = await supabase
      .from('sub_districts')
      .select('*')
      .limit(5);
    
    if (subDistrictsError) {
      console.log('❌ sub_districts table: NOT FOUND');
      console.log('   Error:', subDistrictsError.message);
    } else {
      console.log('✅ sub_districts table: EXISTS');
      console.log(`   Records: ${subDistricts?.length || 0}`);
      if (subDistricts && subDistricts.length > 0) {
        console.log('   Sample:', subDistricts[0].name_en);
      }
    }

    console.log('\n🏢 Checking Businesses Table:');
    
    // Check if businesses table has new geographic columns
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, name, address, province_id, district_id, sub_district_id, address_line, postal_code')
      .limit(3);
    
    if (businessesError) {
      console.log('❌ businesses table: ERROR');
      console.log('   Error:', businessesError.message);
    } else {
      console.log('✅ businesses table: EXISTS');
      console.log(`   Records: ${businesses?.length || 0}`);
      
      // Check if geographic columns exist
      if (businesses && businesses.length > 0) {
        const sample = businesses[0];
        console.log('   Geographic columns:');
        console.log(`     province_id: ${sample.province_id ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`     district_id: ${sample.district_id ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`     sub_district_id: ${sample.sub_district_id ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`     address_line: ${sample.address_line ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`     postal_code: ${sample.postal_code ? '✅ EXISTS' : '❌ MISSING'}`);
      }
    }

    console.log('\n🔗 Checking Business Locations View:');
    
    // Check if business_locations view exists
    const { data: businessLocations, error: viewError } = await supabase
      .from('business_locations')
      .select('*')
      .limit(3);
    
    if (viewError) {
      console.log('❌ business_locations view: NOT FOUND');
      console.log('   Error:', viewError.message);
    } else {
      console.log('✅ business_locations view: EXISTS');
      console.log(`   Records: ${businessLocations?.length || 0}`);
      if (businessLocations && businessLocations.length > 0) {
        console.log('   Sample business:', businessLocations[0].name);
        console.log('   Full address:', businessLocations[0].full_address);
      }
    }

    console.log('\n📊 Summary:');
    const tablesExist = !provincesError && !districtsError && !subDistrictsError;
    const businessesUpdated = !businessesError && businesses && businesses.length > 0 && businesses[0].province_id;
    const viewExists = !viewError;

    if (tablesExist && businessesUpdated && viewExists) {
      console.log('🎉 SUCCESS: Geographic hierarchy is fully implemented!');
    } else if (tablesExist) {
      console.log('⚠️  PARTIAL: Tables exist but migration may be incomplete');
    } else {
      console.log('❌ FAILED: Geographic hierarchy tables not found');
      console.log('   Please run the SQL migration script in Supabase');
    }

  } catch (error) {
    console.error('💥 Database check failed:', error);
  }
}

// Run the check
checkDatabase(); 