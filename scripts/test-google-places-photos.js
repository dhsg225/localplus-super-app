// [2025-01-07 02:20 UTC] - Test Google Places photo endpoints
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bvbfkskepfektkijkzzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YmZrc2tlcGZla3RraWprenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDg4NjIsImV4cCI6MjA1MDAyNDg2Mn0.n5-Y1e4-Ll71U7WOlgLfqJRSDmVWcg1RrYAcV7QZbks';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPhotosEndpoints() {
  console.log('🔍 Testing Google Places photo endpoints...\n');
  
  try {
    // 1. Check restaurants with Google Place IDs
    console.log('📋 Checking restaurants with Google Place IDs...');
    const { data: restaurants, error } = await supabase
      .from('businesses')
      .select('id, name, google_place_id, category, address')
      .eq('partnership_status', 'active')
      .not('google_place_id', 'is', null)
      .limit(10);

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    console.log(`📊 Found ${restaurants?.length || 0} restaurants with Google Place IDs\n`);

    if (!restaurants || restaurants.length === 0) {
      console.log('❌ No restaurants have Google Place IDs yet');
      console.log('💡 You need to run Google Places discovery first');
      console.log('💡 Try running: node scripts/run-google-places-discovery-simple.js\n');
      return;
    }

    // Display the restaurants with Google Place IDs
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name}`);
      console.log(`   🆔 Place ID: ${restaurant.google_place_id}`);
      console.log(`   🍽️ Category: ${restaurant.category}`);
      console.log(`   📍 Address: ${restaurant.address.substring(0, 50)}...`);
      console.log('');
    });

    // 2. Test photo endpoints with first restaurant
    const testRestaurant = restaurants[0];
    console.log(`🧪 Testing photo endpoints with: ${testRestaurant.name}`);
    console.log(`🆔 Google Place ID: ${testRestaurant.google_place_id}\n`);

    // Test photos list endpoint
    console.log('📸 Testing photos list endpoint...');
    const photosResponse = await fetch(`http://localhost:3001/api/places/photos/${testRestaurant.google_place_id}`);
    
    if (photosResponse.ok) {
      const photosData = await photosResponse.json();
      console.log(`✅ Photos endpoint responded successfully`);
      console.log(`📊 Found ${photosData.photos?.length || 0} photos`);
      
      if (photosData.photos && photosData.photos.length > 0) {
        const firstPhoto = photosData.photos[0];
        console.log(`📸 First photo: ${firstPhoto.width}x${firstPhoto.height}`);
        console.log(`🔗 Photo reference: ${firstPhoto.photo_reference.substring(0, 50)}...`);

        // Test photo URL endpoint
        console.log('\n🌐 Testing photo URL endpoint...');
        const photoUrl = `http://localhost:3001/api/places/photo?photo_reference=${firstPhoto.photo_reference}&maxwidth=600&maxheight=400`;
        console.log(`🔗 Photo URL: ${photoUrl}`);
        
        const photoResponse = await fetch(photoUrl, { method: 'HEAD' });
        if (photoResponse.ok) {
          console.log(`✅ Photo URL endpoint working (${photoResponse.status})`);
          console.log(`📄 Content-Type: ${photoResponse.headers.get('content-type')}`);
        } else {
          console.log(`❌ Photo URL endpoint failed (${photoResponse.status})`);
        }
      } else {
        console.log('⚠️ No photos found for this place');
      }
    } else {
      console.log(`❌ Photos endpoint failed (${photosResponse.status})`);
      const errorText = await photosResponse.text();
      console.log(`❌ Error: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test individual endpoint functions
async function testDirectApiCall() {
  console.log('\n🧪 Testing direct Google Places API call...');
  
  const GOOGLE_PLACES_API_KEY = 'AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y';
  
  // Use a known Google Place ID (Google Sydney office as example)
  const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${testPlaceId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    );
    
    const data = await response.json();
    console.log('🔗 Direct API Response:', data.status);
    
    if (data.status === 'OK' && data.result?.photos) {
      console.log(`📸 Found ${data.result.photos.length} photos via direct API`);
    } else {
      console.log('⚠️ No photos or API error:', data.error_message);
    }
  } catch (error) {
    console.log('❌ Direct API call failed (likely CORS):', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testPhotosEndpoints();
  await testDirectApiCall();
  
  console.log('\n✨ Test completed!');
  console.log('💡 If you see CORS errors, that\'s expected - the backend proxy should handle them');
}

runAllTests(); 