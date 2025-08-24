// [2024-12-19 22:25] - Deploy unified authentication schema
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deployUnifiedAuth() {
  console.log('🚀 Deploying Unified Authentication Schema...\n');

  try {
    // Read the schema file
    const schemaPath = join(process.cwd(), 'shared', 'database', 'unified-auth-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('📄 Schema file loaded successfully');
    console.log(`📏 Schema size: ${schema.length} characters\n`);

    // Note: We can't execute raw SQL directly with the anon key
    // This would need to be done via Supabase Dashboard or with service role key
    console.log('⚠️  IMPORTANT: Raw SQL execution requires admin access');
    console.log('📋 Manual deployment steps:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy the contents of shared/database/unified-auth-schema.sql');
    console.log('3. Paste and execute the SQL');
    console.log('4. Verify tables are created\n');

    // Instead, let's try to verify what we can access
    console.log('🔍 Testing current database access...');
    
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id, name')
      .limit(3);

    if (bizError) {
      console.log('❌ Cannot access businesses table:', bizError.message);
    } else {
      console.log(`✅ Can access businesses table (${businesses?.length || 0} records)`);
    }

    const { data: partners, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .limit(1);

    if (partnerError) {
      console.log('❌ Cannot access partners table:', partnerError.message);
    } else {
      console.log(`✅ Can access partners table (${partners?.length || 0} records)`);
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Manually deploy the schema via Supabase Dashboard');
    console.log('2. Run: npx tsx scripts/verify-unified-auth.ts');
    console.log('3. Update partner app to use unified auth');
    console.log('4. Test authentication flow');

  } catch (error) {
    console.error('❌ Error during deployment:', error);
  }
}

deployUnifiedAuth().catch(console.error); 