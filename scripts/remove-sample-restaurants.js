// Script to remove sample/mock restaurants from the businesses table
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// List of sample restaurant names to remove
const sampleRestaurantNames = [
  'Golden Palace Thai Restaurant',
  'Seaside Grill & Bar',
  'Som Tam Paradise',
  'La Bella Vista Italian',
  'Ocean Breeze Cafe'
];

async function removeSampleRestaurants() {
  try {
    console.log('🗑️  Removing sample/mock restaurants from database...');
    
    // First, let's see what restaurants are currently in the database
    const { data: allBusinesses, error: fetchError } = await supabase
      .from('businesses')
      .select('id, name, category')
      .or('category.ilike.%restaurant%,category.ilike.%food%,category.ilike.%dining%,category.ilike.%cafe%');
    
    if (fetchError) {
      console.error('Error fetching businesses:', fetchError);
      return;
    }
    
    console.log('\n📋 Current restaurant businesses in database:');
    allBusinesses?.forEach(business => {
      console.log(`  - ${business.name} (${business.category})`);
    });
    
    // Remove sample restaurants
    for (const restaurantName of sampleRestaurantNames) {
      console.log(`\n🗑️  Removing: ${restaurantName}`);
      
      const { data, error } = await supabase
        .from('businesses')
        .delete()
        .eq('name', restaurantName)
        .select();
      
      if (error) {
        console.error(`❌ Error removing ${restaurantName}:`, error);
      } else if (data && data.length > 0) {
        console.log(`✅ Successfully removed: ${restaurantName}`);
      } else {
        console.log(`ℹ️  Restaurant not found: ${restaurantName}`);
      }
    }
    
    // Show remaining businesses
    const { data: remainingBusinesses, error: remainingError } = await supabase
      .from('businesses')
      .select('id, name, category')
      .or('category.ilike.%restaurant%,category.ilike.%food%,category.ilike.%dining%,category.ilike.%cafe%');
    
    if (!remainingError) {
      console.log('\n📋 Remaining restaurant businesses in database:');
      if (remainingBusinesses && remainingBusinesses.length > 0) {
        remainingBusinesses.forEach(business => {
          console.log(`  - ${business.name} (${business.category})`);
        });
      } else {
        console.log('  ✨ Database is now clean - no restaurant businesses remaining');
      }
    }
    
    console.log('\n🎉 Sample restaurant cleanup completed!');
    console.log('💡 Your app will now use fallback data until you add real restaurants to the database.');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

removeSampleRestaurants(); 