// [2024-12-19] - Apply RLS policy fix using direct table operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyRlsFixDirect() {
  console.log('Applying RLS policy fix using direct table operations...');
  
  try {
    // Test if we can access businesses with service role
    const { data: businesses, error: fetchError } = await supabase
      .from('businesses')
      .select('id, name, partnership_status')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Error fetching businesses:', fetchError);
      return;
    }
    
    console.log('✅ Service role can access businesses:', businesses?.length || 0);
    
    // Test if we can update a business (to verify service role permissions)
    if (businesses && businesses.length > 0) {
      const testBusiness = businesses[0];
      console.log('Testing with business:', testBusiness.name);
      
      // Try to update the business (this should work with service role)
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testBusiness.id);
      
      if (updateError) {
        console.error('❌ Error updating business:', updateError);
      } else {
        console.log('✅ Service role has update permissions');
      }
    }
    
    // Since we can't modify RLS policies directly, let's create a workaround
    // by updating the signup form to use a different approach
    console.log('💡 RLS policy modification requires database admin access');
    console.log('💡 Alternative: Update signup form to handle RLS restrictions');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

applyRlsFixDirect(); 