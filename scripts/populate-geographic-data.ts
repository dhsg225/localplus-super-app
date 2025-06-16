import { createClient } from '@supabase/supabase-js';

// Use the correct credentials from .env file
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateGeographicData() {
  console.log('🔍 Checking current business addresses...\n');

  try {
    // First, let's see what addresses we have
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, name, address, province_id')
      .order('name');
    
    if (businessesError) {
      console.log('❌ Error querying businesses:', businessesError.message);
      return;
    }

    console.log('📋 Current businesses:');
    businesses?.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name}`);
      console.log(`   Address: "${business.address}"`);
      console.log(`   Province ID: ${business.province_id || 'NULL'}`);
      console.log('');
    });

    // Check if any contain "hua hin" (case insensitive)
    const huaHinBusinesses = businesses?.filter(b => 
      b.address.toLowerCase().includes('hua hin')
    );

    console.log(`🏖️  Businesses containing "hua hin": ${huaHinBusinesses?.length || 0}`);
    
    if (huaHinBusinesses && huaHinBusinesses.length > 0) {
      console.log('Found Hua Hin businesses - updating them...');
      
      // Update each Hua Hin business
      for (const business of huaHinBusinesses) {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            province_id: '11111111-1111-1111-1111-111111111111',  // Prachuap Khiri Khan
            district_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',   // Hua Hin District
            sub_district_id: '11111111-aaaa-aaaa-aaaa-111111111111', // Hua Hin Sub-district
            address_line: business.address.replace(/hua hin.*/i, '').trim(),
            postal_code: '77110'
          })
          .eq('id', business.id);

        if (updateError) {
          console.log(`❌ Error updating ${business.name}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${business.name}`);
        }
      }
    } else {
      // If no "hua hin" matches, let's try a broader approach
      console.log('🔄 No "hua hin" matches found. Trying broader search...');
      
      // Let's update all businesses to have some geographic data for testing
      // We'll assign them all to Hua Hin for now since that's our test area
      console.log('📍 Assigning all businesses to Hua Hin for testing...');
      
      const { error: updateAllError } = await supabase
        .from('businesses')
        .update({
          province_id: '11111111-1111-1111-1111-111111111111',  // Prachuap Khiri Khan
          district_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',   // Hua Hin District
          sub_district_id: '11111111-aaaa-aaaa-aaaa-111111111111', // Hua Hin Sub-district
          postal_code: '77110'
        })
        .is('province_id', null);

      if (updateAllError) {
        console.log('❌ Error updating businesses:', updateAllError.message);
      } else {
        console.log('✅ Updated all businesses with geographic data');
      }
    }

    // Verify the update worked
    console.log('\n🔍 Verifying updates...');
    const { data: updatedBusinesses, error: verifyError } = await supabase
      .from('businesses')
      .select('name, province_id, district_id, sub_district_id, postal_code')
      .limit(3);

    if (verifyError) {
      console.log('❌ Error verifying:', verifyError.message);
    } else {
      console.log('📊 Updated businesses:');
      updatedBusinesses?.forEach(business => {
        console.log(`   ${business.name}:`);
        console.log(`     Province: ${business.province_id ? '✅' : '❌'}`);
        console.log(`     District: ${business.district_id ? '✅' : '❌'}`);
        console.log(`     Sub-district: ${business.sub_district_id ? '✅' : '❌'}`);
        console.log(`     Postal code: ${business.postal_code || 'NULL'}`);
      });
    }

    // Test the view
    console.log('\n🔗 Testing business_locations view:');
    const { data: viewData, error: viewError } = await supabase
      .from('business_locations')
      .select('name, full_address, province_name, district_name')
      .limit(2);

    if (viewError) {
      console.log('❌ View error:', viewError.message);
    } else {
      console.log('✅ View results:');
      viewData?.forEach(business => {
        console.log(`   ${business.name}: ${business.full_address}`);
        console.log(`     Province: ${business.province_name || 'NULL'}`);
        console.log(`     District: ${business.district_name || 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('💥 Population failed:', error);
  }
}

// Run the population
populateGeographicData(); 