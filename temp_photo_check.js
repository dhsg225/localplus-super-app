import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPhotoData() {
  console.log('🔍 Checking photo_gallery data structure...\n');

  const { data: restaurants, error } = await supabase
    .from('businesses')
    .select('id, name, address, photo_gallery')
    .ilike('name', '%Feast Thailand%')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  if (restaurants && restaurants.length > 0) {
    const restaurant = restaurants[0];
    console.log('🏪 Restaurant found:', restaurant.name);
    console.log('📍 Address:', restaurant.address);
    console.log('🔍 photo_gallery type:', typeof restaurant.photo_gallery);
    console.log('🔍 photo_gallery isArray:', Array.isArray(restaurant.photo_gallery));
    console.log('🔍 photo_gallery length:', restaurant.photo_gallery?.length || 'N/A');
    console.log('🔍 photo_gallery content:');
    console.log(JSON.stringify(restaurant.photo_gallery, null, 2));
    
    if (Array.isArray(restaurant.photo_gallery) && restaurant.photo_gallery.length > 0) {
      console.log('\n🔍 First photo analysis:');
      const firstPhoto = restaurant.photo_gallery[0];
      console.log('Type:', typeof firstPhoto);
      console.log('Content:', firstPhoto);
      console.log('Is string?:', typeof firstPhoto === 'string');
      console.log('Starts with https?:', typeof firstPhoto === 'string' && firstPhoto.startsWith('https'));
    }
  } else {
    console.log('❌ No restaurant found with name containing "Feast Thailand"');
  }
}

checkPhotoData();
