// [2024-12-19] - Secure server-side script for fetching businesses
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fetchBusinessesSecure() {
  try {
    console.log('🔒 Fetching businesses securely...');
    
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, partnership_status')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching businesses:', error);
      return [];
    }
    
    console.log(`✅ Successfully fetched ${data?.length || 0} businesses securely`);
    return data || [];
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return [];
  }
}

// Export for use in other scripts
module.exports = { fetchBusinessesSecure };

// Run directly if called from command line
if (require.main === module) {
  fetchBusinessesSecure().then(businesses => {
    console.log('Businesses:', businesses);
  });
} 