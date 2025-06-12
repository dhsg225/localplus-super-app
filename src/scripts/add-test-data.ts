// Script to add test data for curation pipeline
import { createClient } from '@supabase/supabase-js';

// Use the environment that's working in the app
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWt1bnByYWhnZGh2ZGh6bXV3bCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMzODg5MTM4LCJleHAiOjIwNDk0NjUxMzh9.Nb0-3QGFcM-xC2YzctGKmKT_QbYK8W_v5BwDPHEhb4E';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testBusinesses = [
  {
    google_place_id: 'test_place_1',
    name: 'Bangkok Rooftop Bar',
    address: 'Sukhumvit Road, Bangkok 10110',
    latitude: 13.7563,
    longitude: 100.5018,
    phone: '+66-2-123-4567',
    website_url: 'https://bangkokrooftop.com',
    google_rating: 4.3,
    google_review_count: 156,
    google_price_level: 3,
    google_types: ['bar', 'establishment', 'point_of_interest'],
    primary_category: 'Entertainment',
    quality_score: 85,
    curation_status: 'pending',
    discovery_source: 'Bangkok Entertainment Campaign'
  },
  {
    google_place_id: 'test_place_2', 
    name: 'Organic Health Cafe',
    address: 'Thonglor District, Bangkok 10110',
    latitude: 13.7307,
    longitude: 100.5418,
    phone: '+66-2-987-6543',
    google_rating: 4.1,
    google_review_count: 89,
    google_price_level: 2,
    google_types: ['cafe', 'restaurant', 'food'],
    primary_category: 'Restaurants',
    quality_score: 72,
    curation_status: 'pending',
    discovery_source: 'Healthy Restaurants Campaign'
  },
  {
    google_place_id: 'test_place_3',
    name: 'Luxury Spa Retreat',
    address: 'Silom Road, Bangkok 10500',
    latitude: 13.7244,
    longitude: 100.5347,
    website_url: 'https://luxuryspa.com',
    google_rating: 4.7,
    google_review_count: 234,
    google_price_level: 4,
    google_types: ['spa', 'beauty_salon', 'health'],
    primary_category: 'Wellness',
    quality_score: 92,
    curation_status: 'pending',
    discovery_source: 'Bangkok Wellness Campaign'
  }
];

async function addTestData() {
  console.log('🌱 Adding test data for curation pipeline...\n');

  try {
    // Add test suggested businesses
    const { data, error } = await supabase
      .from('suggested_businesses')
      .insert(testBusinesses)
      .select();

    if (error) {
      console.error('❌ Error adding test businesses:', error.message);
      return;
    }

    console.log(`✅ Added ${data?.length || 0} test businesses`);
    
    // Show what was added
    data?.forEach((business, index) => {
      console.log(`   ${index + 1}. ${business.name} (Quality: ${business.quality_score})`);
    });

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

addTestData().then(() => {
  console.log('\n🎉 Test data setup complete!');
}).catch(console.error); 