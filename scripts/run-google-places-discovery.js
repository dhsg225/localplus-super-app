#!/usr/bin/env node

// [2025-01-06 18:30 UTC] - Google Places Restaurant Discovery Script
// Populates database with real restaurant data to enable dynamic selectors

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Google Places API setup
const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ Missing Google Places API key');
  console.error('Required: VITE_GOOGLE_PLACES_API_KEY');
  process.exit(1);
}

// Hua Hin coordinates
const HUA_HIN_CENTER = {
  lat: 12.5681,
  lng: 99.9592
};

// Google Places type to LocalPlus cuisine mapping
const CUISINE_MAPPING = {
  'thai_restaurant': ['thai_traditional'],
  'seafood_restaurant': ['seafood_grilled'],
  'japanese_restaurant': ['japanese_sushi'],
  'sushi_restaurant': ['japanese_sushi'],
  'ramen_restaurant': ['japanese_ramen'],
  'italian_restaurant': ['italian_pasta'],
  'pizza_restaurant': ['italian_pizza'],
  'chinese_restaurant': ['chinese_cantonese'],
  'indian_restaurant': ['indian_north'],
  'korean_restaurant': ['korean_bbq'],
  'vietnamese_restaurant': ['vietnamese_pho'],
  'american_restaurant': ['american_burger'],
  'burger_restaurant': ['american_burger'],
  'cafe': ['cafe_coffee'],
  'coffee_shop': ['cafe_coffee'],
  'bar': ['bar_cocktails'],
  'restaurant': ['thai_traditional'] // Default for Thailand
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

async function getPlaceDetails(placeId) {
  console.log(`📍 Getting details for place: ${placeId}`);
  
  const fields = 'place_id,name,formatted_address,geometry,types,rating,user_ratings_total,price_level,opening_hours,formatted_phone_number,website,photos';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('❌ Place details error:', data.status);
      return null;
    }
    
    return data.result;
  } catch (error) {
    console.error('❌ Place details network error:', error);
    return null;
  }
}

function extractCuisineTypes(googleTypes) {
  const cuisineTypes = new Set();
  
  for (const googleType of googleTypes) {
    const mappedCuisines = CUISINE_MAPPING[googleType];
    if (mappedCuisines) {
      mappedCuisines.forEach(cuisine => cuisineTypes.add(cuisine));
    }
  }
  
  // If no specific cuisine mapping found, default to Thai for Thailand
  if (cuisineTypes.size === 0 && googleTypes.includes('restaurant')) {
    cuisineTypes.add('thai_traditional');
  }
  
  return Array.from(cuisineTypes);
}

function determinePrimaryCategory(googleTypes) {
  const categoryPriority = [
    'thai_restaurant',
    'seafood_restaurant', 
    'japanese_restaurant',
    'italian_restaurant',
    'chinese_restaurant',
    'indian_restaurant',
    'korean_restaurant',
    'restaurant',
    'cafe',
    'bar',
    'food'
  ];
  
  for (const priority of categoryPriority) {
    if (googleTypes.includes(priority)) {
      return priority;
    }
  }
  
  return 'restaurant';
}

async function saveRestaurantToDatabase(place) {
  const localPlusCuisines = extractCuisineTypes(place.types);
  const primaryCategory = determinePrimaryCategory(place.types);
  
  console.log(`💾 Saving: ${place.name}`);
  console.log(`   📍 Address: ${place.formatted_address}`);
  console.log(`   🍽️ Cuisines: ${localPlusCuisines.join(', ')}`);
  console.log(`   ⭐ Rating: ${place.rating} (${place.user_ratings_total} reviews)`);
  
  const businessData = {
    name: place.name,
    address: place.formatted_address,
    latitude: place.geometry?.location?.lat || 0,
    longitude: place.geometry?.location?.lng || 0,
    phone: place.formatted_phone_number || '',
    email: '', // Not available from Google Places
    description: `${place.name} - ${primaryCategory.replace('_', ' ')} in Hua Hin`,
    status: 'active',
    partnership_status: 'active',
    
    // Google Places integration fields
    google_place_id: place.place_id,
    google_types: place.types,
    google_primary_type: primaryCategory,
    cuisine_types_google: place.types.filter(type => type.includes('restaurant') || type === 'cafe' || type === 'bar'),
    cuisine_types_localplus: localPlusCuisines,
    discovery_source: 'google_places',
    curation_status: 'approved', // Auto-approve for demo
    curation_notes: `Auto-discovered from Google Places API on ${new Date().toISOString()}`,
    last_google_sync: new Date().toISOString()
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
    
    console.log(`   ✅ Saved to database`);
    return true;
  } catch (error) {
    console.error(`   ❌ Save error for ${place.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Google Places Restaurant Discovery for Hua Hin');
  console.log('================================================');
  
  // Search for restaurants in Hua Hin
  const restaurants = await searchNearbyRestaurants(
    HUA_HIN_CENTER.lat, 
    HUA_HIN_CENTER.lng, 
    5000 // 5km radius
  );
  
  if (restaurants.length === 0) {
    console.log('❌ No restaurants found');
    return;
  }
  
  console.log(`\n📊 Processing ${restaurants.length} restaurants...`);
  console.log('================================================');
  
  let saved = 0;
  let errors = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    console.log(`\n[${i + 1}/${restaurants.length}] Processing: ${restaurant.name}`);
    
    // Get detailed information
    const details = await getPlaceDetails(restaurant.place_id);
    if (!details) {
      console.log(`   ⚠️  Skipping - couldn't get details`);
      errors++;
      continue;
    }
    
    // Save to database
    const success = await saveRestaurantToDatabase(details);
    if (success) {
      saved++;
    } else {
      errors++;
    }
    
    // Rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Discovery Complete!');
  console.log('================================================');
  console.log(`✅ Successfully saved: ${saved} restaurants`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total processed: ${restaurants.length}`);
  
  // Test the dynamic selectors
  console.log('\n🎯 Testing Dynamic Selectors...');
  console.log('================================================');
  
  try {
    const { data: testData, error: testError } = await supabase
      .from('business_discovery_view')
      .select('name, cuisine_types_localplus')
      .ilike('address', '%Hua Hin%')
      .limit(5);
    
    if (testError) {
      console.error('❌ Test query error:', testError);
    } else {
      console.log(`✅ Found ${testData.length} restaurants in business_discovery_view`);
      testData.forEach(restaurant => {
        console.log(`   🍽️  ${restaurant.name}: ${restaurant.cuisine_types_localplus?.join(', ') || 'No cuisines'}`);
      });
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Refresh your restaurant page to see dynamic selectors with counts');
  console.log('2. Check browser console for selector generation logs');
  console.log('3. Dynamic selectors should now show actual restaurant counts!');
}

if (require.main === module) {
  main().catch(console.error);
} 