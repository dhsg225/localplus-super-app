// [2024-12-19] - Apply RLS policy fix for business signup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyRlsFix() {
  console.log('Applying RLS policy fix for business signup...');
  
  try {
    // Drop existing policy
    const { error: dropError } = await supabase.rpc('execute_sql', {
      sql: 'DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON businesses;'
    });
    
    if (dropError) {
      console.log('Drop policy result:', dropError);
    } else {
      console.log('✅ Existing policy dropped');
    }
    
    // Create new policy
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: `CREATE POLICY "Businesses are viewable for signup" ON businesses
            FOR SELECT USING (true);`
    });
    
    if (createError) {
      console.error('❌ Error creating policy:', createError);
    } else {
      console.log('✅ RLS policy fix applied successfully');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

applyRlsFix(); 