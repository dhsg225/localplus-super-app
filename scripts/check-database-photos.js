// [2025-01-07 02:25 UTC] - Check database for Google Place IDs
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bvbfkskepfektkijkzzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YmZrc2tlcGZla3RraWprenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDg4NjIsImV4cCI6MjA1MDAyNDg2Mn0.n5-Y1e4-Ll71U7WOlgLfqJRSDmVWcg1RrYAcV7QZbks';

async function checkDatabase() {
  console.log('🔍 Checking database for Google Place IDs...\n');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
      }
    });

    // 1. Check all restaurants first
    console.log('📋 Checking all active restaurants...');
    const { data: allRestaurants, error: allError } = await supabase
      .from('businesses')
      .select('id, name, google_place_id, category, address')
      .eq('partnership_status', 'active')
      .limit(20);

    if (allError) {
      console.error('❌ Database error:', allError);
      return;
    }

    console.log(`📊 Found ${allRestaurants?.length || 0} active restaurants total\n`);

    if (!allRestaurants || allRestaurants.length === 0) {
      console.log('❌ No active restaurants found in database');
      return;
    }

    // Show all restaurants
    allRestaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name}`);
      console.log(`   🆔 Google Place ID: ${restaurant.google_place_id || '❌ None'}`);
      console.log(`   🍽️ Category: ${restaurant.category}`);
      console.log(`   📍 Address: ${restaurant.address.substring(0, 50)}...`);
      console.log('');
    });

    // 2. Check how many have Google Place IDs
    const withGoogleIds = allRestaurants.filter(r => r.google_place_id);
    console.log(`\n📊 Summary:`);
    console.log(`   Total restaurants: ${allRestaurants.length}`);
    console.log(`   With Google Place IDs: ${withGoogleIds.length}`);
    console.log(`   Without Google Place IDs: ${allRestaurants.length - withGoogleIds.length}\n`);

    if (withGoogleIds.length === 0) {
      console.log('❌ No restaurants have Google Place IDs yet');
      console.log('💡 You need to run Google Places discovery first');
      console.log('💡 Try running: node scripts/run-google-places-discovery-simple.js\n');
      return;
    }

    // 3. Test our photo endpoints with a known Google Place ID
    console.log('🧪 Testing endpoints with sample Google Place ID...');
    
    // Use a well-known place for testing (Google Sydney)
    const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
    console.log(`🆔 Test Place ID: ${testPlaceId}`);
    
    // Import fetch for Node.js
    const fetch = (await import('node-fetch')).default;
    
    console.log('\n📸 Testing photos list endpoint...');
    try {
      const response = await fetch(`http://localhost:3001/api/places/photos/${testPlaceId}`);
      console.log(`📡 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Found ${data.photos?.length || 0} photos`);
        
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          console.log(`📸 First photo: ${photo.width}x${photo.height}`);
          console.log(`🔗 Photo reference: ${photo.photo_reference.substring(0, 30)}...`);
          
          // Test photo URL
          console.log('\n🌐 Testing photo URL endpoint...');
          const photoUrl = `http://localhost:3001/api/places/photo?photo_reference=${photo.photo_reference}&maxwidth=600&maxheight=400`;
          console.log(`🔗 Generated URL: ${photoUrl.substring(0, 80)}...`);
          
          const photoResponse = await fetch(photoUrl, { method: 'HEAD' });
          console.log(`📡 Photo response: ${photoResponse.status}`);
          
          if (photoResponse.ok) {
            console.log(`✅ Photo endpoint working! Content-Type: ${photoResponse.headers.get('content-type')}`);
          } else {
            console.log(`❌ Photo endpoint failed: ${photoResponse.status}`);
          }
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Photos endpoint failed: ${response.status}`);
        console.log(`❌ Error: ${errorText.substring(0, 200)}...`);
      }
    } catch (fetchError) {
      console.log(`❌ Network error testing endpoints: ${fetchError.message}`);
      console.log('💡 Make sure dev server is running on http://localhost:3001');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

checkDatabase(); 