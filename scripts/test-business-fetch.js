// [2024-12-19] - Test business fetching from signup form perspective
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBusinessFetch() {
  console.log('Testing business fetch from signup form...');
  
  try {
    const { data, error } = await supabase.from('businesses').select('id, name');
    
    if (error) {
      console.error('❌ Error fetching businesses:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Successfully fetched businesses:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample businesses:');
        data.slice(0, 3).forEach(business => {
          console.log(`- ${business.name} (${business.id})`);
        });
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testBusinessFetch(); 