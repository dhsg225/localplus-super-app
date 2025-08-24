// [2024-12-19 22:25] - Check existing authentication tables before migration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAuthTables() {
  console.log('🔍 Checking existing authentication tables...\n');

  // Check for existing tables
  const tablesToCheck = [
    'users',
    'consumer_profiles', 
    'admin_profiles',
    'user_roles',
    'partners'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') { // Table does not exist
          console.log(`❌ Table '${table}' does not exist`);
        } else {
          console.log(`⚠️  Table '${table}' exists but error: ${error.message}`);
        }
      } else {
        console.log(`✅ Table '${table}' exists (${data?.length || 0} sample records)`);
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table}':`, err);
    }
  }

  console.log('\n🔍 Checking auth.users table...');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`✅ Auth system accessible, current user: ${user?.email || 'none'}`);
  } catch (err) {
    console.log('❌ Error accessing auth system:', err);
  }

  console.log('\n📋 Migration Plan:');
  console.log('1. Deploy unified-auth-schema.sql');
  console.log('2. Migrate existing partner data');
  console.log('3. Update apps to use unified auth service');
  console.log('4. Test cross-app authentication');
}

checkAuthTables().catch(console.error); 