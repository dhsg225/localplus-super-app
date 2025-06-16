// Script to add sample restaurants to the businesses table
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

const sampleRestaurants = [
  {
    name: 'Golden Palace Thai Restaurant',
    category: 'Thai Restaurant',
    address: '45 Naresdamri Road, Hua Hin, Prachuap Khiri Khan 77110',
    latitude: 12.5681,
    longitude: 99.9592,
    phone: '+66 32 234 567',
    email: 'contact@goldenpalace.co.th',
    website_url: 'https://goldenpalace.co.th',
    partnership_status: 'active'
  },
  {
    name: 'Seaside Grill & Bar',
    category: 'Seafood Restaurant',
    address: '123 Beach Road, Hua Hin, Prachuap Khiri Khan 77110',
    latitude: 12.5706,
    longitude: 99.9571,
    phone: '+66 32 123 456',
    email: 'info@seasidegrill.com',
    website_url: 'https://seasidegrill.com',
    partnership_status: 'active'
  },
  {
    name: 'Som Tam Paradise',
    category: 'Thai Street Food',
    address: '89 Phetkasem Road, Hua Hin, Prachuap Khiri Khan 77110',
    latitude: 12.5665,
    longitude: 99.9548,
    phone: '+66 32 345 678',
    email: 'hello@somtamparadise.com',
    partnership_status: 'active'
  },
  {
    name: 'La Bella Vista Italian',
    category: 'Italian Restaurant',
    address: '67 Damrongrat Road, Hua Hin, Prachuap Khiri Khan 77110',
    latitude: 12.5698,
    longitude: 99.9585,
    phone: '+66 32 456 789',
    email: 'info@labellavista.com',
    partnership_status: 'active'
  },
  {
    name: 'Ocean Breeze Cafe',
    category: 'Cafe & Restaurant',
    address: '234 Soi Hua Hin 51, Hua Hin, Prachuap Khiri Khan 77110',
    latitude: 12.5723,
    longitude: 99.9603,
    phone: '+66 32 567 890',
    email: 'contact@oceanbreeze.co.th',
    partnership_status: 'active'
  }
];

async function addSampleRestaurants() {
  try {
    console.log('🏪 Adding sample restaurants to database...');
    
    for (const restaurant of sampleRestaurants) {
      console.log(`Adding: ${restaurant.name}`);
      
      const { data, error } = await supabase
        .from('businesses')
        .insert([restaurant])
        .select();
      
      if (error) {
        console.error(`Error adding ${restaurant.name}:`, error);
      } else {
        console.log(`✅ Successfully added: ${restaurant.name}`);
      }
    }
    
    console.log('🎉 Sample restaurants added successfully!');
    
  } catch (error) {
    console.error('Error adding sample restaurants:', error);
  }
}

addSampleRestaurants(); 