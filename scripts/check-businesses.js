const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBusinesses() {
  console.log('Checking businesses in database...');
  
  try {
    // Check businesses table
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('*')
      .limit(10);
    
    if (businessesError) {
      console.error('Error fetching businesses:', businessesError);
    } else {
      console.log(`Found ${businesses.length} businesses:`);
      businesses.forEach(business => {
        console.log(`- ${business.name} (ID: ${business.id})`);
      });
    }
    
    // Check partners table
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*')
      .limit(10);
    
    if (partnersError) {
      console.error('Error fetching partners:', partnersError);
    } else {
      console.log(`\nFound ${partners.length} partners:`);
      partners.forEach(partner => {
        console.log(`- ${partner.email} (ID: ${partner.id})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkBusinesses(); 