#!/usr/bin/env node

// [2025-01-06 18:45 UTC] - Simplified Google Places Restaurant Discovery
// Works with existing businesses table structure

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Google Places API setup
const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ Missing Google Places API key');
  process.exit(1);
}

// Hua Hin coordinates
const HUA_HIN_CENTER = {
  lat: 12.5681,
  lng: 99.9592
};

// Map Google types to simple categories that work with existing selector system
const CATEGORY_MAPPING = {
  'thai_restaurant': 'Thai Traditional',
  'seafood_restaurant': 'Fresh Seafood', 
  'japanese_restaurant': 'Japanese',
  'sushi_restaurant': 'Japanese',
  'ramen_restaurant': 'Japanese',
  'italian_restaurant': 'Italian',
  'pizza_restaurant': 'Italian',
  'chinese_restaurant': 'Chinese',
  'indian_restaurant': 'Indian',
  'korean_restaurant': 'Korean',
  'vietnamese_restaurant': 'Vietnamese',
  'american_restaurant': 'International',
  'burger_restaurant': 'International',
  'cafe': 'Cafe',
  'coffee_shop': 'Cafe',
  'bar': 'Bar',
  'restaurant': 'Thai Traditional' // Default for Thailand
};

async function searchNearbyRestaurants(lat, lng, radius = 5000) {
  console.log(`🔍 Searching for restaurants near ${lat}, ${lng} (radius: ${radius}m)`);
  
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('❌ Google Places API error:', data.status, data.error_message);
      return [];
    }
    
    console.log(`✅ Found ${data.results.length} restaurants`);
    return data.results;
  } catch (error) {
    console.error('❌ Network error:', error);
    return [];
  }
}

function categorizeRestaurant(googleTypes) {
  // Try to find the most specific category
  for (const googleType of googleTypes) {
    if (CATEGORY_MAPPING[googleType]) {
      return CATEGORY_MAPPING[googleType];
    }
  }
  
  // Default fallback
  return 'Thai Traditional';
}

async function saveRestaurantToDatabase(place) {
  const category = categorizeRestaurant(place.types);
  
  console.log(`💾 Saving: ${place.name}`);
  console.log(`   📍 Address: ${place.formatted_address}`);
  console.log(`   🍽️ Category: ${category}`);
  console.log(`   ⭐ Rating: ${place.rating || 'N/A'}`);
  console.log(`   🏷️ Google Types: ${place.types.join(', ')}`);
  
  const businessData = {
    name: place.name,
    category: category,
    address: place.formatted_address,
    latitude: place.geometry?.location?.lat || 0,
    longitude: place.geometry?.location?.lng || 0,
    phone: '',
    email: '',
    website_url: '',
    description: `${category} restaurant in Hua Hin`,
    partnership_status: 'active',
    google_place_id: place.place_id,
    google_rating: place.rating || null,
    google_review_count: place.user_ratings_total || 0,
    source: 'google_places',
    curation_notes: `Auto-discovered via Google Places API. Types: ${place.types.join(', ')}`
  };
  
  try {
    const { data, error } = await supabase
      .from('businesses')
      .upsert(businessData, { 
        onConflict: 'google_place_id',
        ignoreDuplicates: false 
      })
      .select();
    
    if (error) {
      console.error(`   ❌ Database error for ${place.name}:`, error);
      return false;
    }
    
    console.log(`   ✅ Saved to database with ID: ${data[0]?.id}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Save error for ${place.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Simplified Google Places Restaurant Discovery for Hua Hin');
  console.log('================================================');
  
  // Search for restaurants in Hua Hin
  const restaurants = await searchNearbyRestaurants(
    HUA_HIN_CENTER.lat, 
    HUA_HIN_CENTER.lng, 
    3000 // 3km radius for more focused results
  );
  
  if (restaurants.length === 0) {
    console.log('❌ No restaurants found');
    return;
  }
  
  console.log(`\n📊 Processing ${restaurants.length} restaurants...`);
  console.log('================================================');
  
  let saved = 0;
  let errors = 0;
  
  // Process only the first 10 to avoid rate limits
  const restaurantsToProcess = restaurants.slice(0, 10);
  
  for (let i = 0; i < restaurantsToProcess.length; i++) {
    const restaurant = restaurantsToProcess[i];
    console.log(`\n[${i + 1}/${restaurantsToProcess.length}] Processing: ${restaurant.name}`);
    
    // Save to database (using the nearby search data directly)
    const success = await saveRestaurantToDatabase(restaurant);
    if (success) {
      saved++;
    } else {
      errors++;
    }
    
    // Rate limiting - wait 200ms between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n🎉 Discovery Complete!');
  console.log('================================================');
  console.log(`✅ Successfully saved: ${saved} restaurants`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total processed: ${restaurantsToProcess.length}`);
  
  // Test the results
  console.log('\n🎯 Testing Results...');
  console.log('================================================');
  
  try {
    const { data: testData, error: testError } = await supabase
      .from('businesses')
      .select('name, category, address, source')
      .eq('source', 'google_places')
      .ilike('address', '%Hua Hin%')
      .limit(5);
    
    if (testError) {
      console.error('❌ Test query error:', testError);
    } else {
      console.log(`✅ Found ${testData.length} Google Places restaurants in database`);
      testData.forEach(restaurant => {
        console.log(`   🍽️  ${restaurant.name} (${restaurant.category})`);
      });
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Refresh your restaurant page');
  console.log('2. Check the browser console for selector generation logs');
  console.log('3. You should now see restaurants with categories populated from Google Places!');
}

if (require.main === module) {
  main().catch(console.error);
} 