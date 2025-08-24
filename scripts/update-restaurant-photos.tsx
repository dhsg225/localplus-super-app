// [2025-01-07 02:35 UTC] - Update existing restaurants with Google Place IDs for photo testing
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bvbfkskepfektkijkzzl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YmZrc2tlcGZla3RraWprenpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDg4NjIsImV4cCI6MjA1MDAyNDg2Mn0.n5-Y1e4-Ll71U7WOlgLfqJRSDmVWcg1RrYAcV7QZbks';

async function updateRestaurantPhotos() {
  console.log('🔄 Updating restaurants with Google Place IDs for photo testing...\n');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
      }
    });

    // Get existing restaurants without Google Place IDs
    console.log('📋 Checking existing restaurants...');
    const { data: restaurants, error } = await supabase
      .from('businesses')
      .select('id, name, category, google_place_id')
      .eq('partnership_status', 'active')
      .is('google_place_id', null)
      .limit(5);

    if (error) {
      console.error('❌ Database error:', error);
      return;
    }

    console.log(`📊 Found ${restaurants?.length || 0} restaurants without Google Place IDs\n`);

    if (!restaurants || restaurants.length === 0) {
      console.log('✅ All restaurants already have Google Place IDs');
      return;
    }

    // Test Google Place IDs that we know have photos
    const testPlaceIds = [
      'ChIJN1t_tDeuEmsRUsoyG83frY4', // Google Sydney office - has many photos
      'ChIJ2eUgeAK6EmsRZ4BZ84-TLio', // Sydney Opera House - iconic photos
      'ChIJrTLr-GyuEmsRBfy61i59si0', // Circular Quay - waterfront photos
      'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', // Darling Harbour - tourist photos
      'ChIJu46S-DipEmsROUHe0AWRgU0'  // Sydney Harbour Bridge - landmark photos
    ];

    // Update restaurants with test Google Place IDs
    for (let i = 0; i < Math.min(restaurants.length, testPlaceIds.length); i++) {
      const restaurant = restaurants[i];
      const placeId = testPlaceIds[i];
      
      console.log(`🔄 [${i + 1}/${restaurants.length}] Updating: ${restaurant.name}`);
      console.log(`   🆔 Adding Google Place ID: ${placeId}`);
      
      const { data, error: updateError } = await supabase
        .from('businesses')
        .update({ 
          google_place_id: placeId,
          source: 'google_places_test',
          curation_notes: `Test Google Place ID added for photo testing - ${new Date().toISOString()}`
        })
        .eq('id', restaurant.id)
        .select();

      if (updateError) {
        console.error(`   ❌ Failed to update ${restaurant.name}:`, updateError);
      } else {
        console.log(`   ✅ Successfully updated ${restaurant.name}`);
      }
      console.log('');
    }

    // Test photo endpoint with first updated restaurant
    if (restaurants.length > 0) {
      const testPlaceId = testPlaceIds[0];
      console.log('🧪 Testing photo endpoint with updated restaurant...');
      console.log(`🆔 Testing Place ID: ${testPlaceId}\n`);

      const fetch = (await import('node-fetch')).default;
      
      try {
        console.log('📸 Fetching photos...');
        const response = await fetch(`http://localhost:3004/api/places/photos/${testPlaceId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success! Found ${data.photos?.length || 0} photos`);
          
          if (data.photos && data.photos.length > 0) {
            const photo = data.photos[0];
            console.log(`📸 First photo: ${photo.width}x${photo.height}`);
            
            const photoUrl = `http://localhost:3004/api/places/photo?photo_reference=${photo.photo_reference}&maxwidth=600&maxheight=400`;
            console.log(`🔗 Photo URL: ${photoUrl.substring(0, 80)}...`);
            
            const photoResponse = await fetch(photoUrl, { method: 'HEAD' });
            if (photoResponse.ok) {
              console.log(`✅ Photo URL working! (${photoResponse.status})`);
            } else {
              console.log(`❌ Photo URL failed: ${photoResponse.status}`);
            }
          }
        } else {
          console.log(`❌ Photos endpoint failed: ${response.status}`);
        }
      } catch (fetchError) {
        console.log(`❌ Network error: ${fetchError.message}`);
      }
    }

    console.log('\n🎉 Update completed!');
    console.log('💡 Now refresh your app to see real Google Places photos');
    console.log('💡 Check browser console for image loading logs');

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

updateRestaurantPhotos(); 