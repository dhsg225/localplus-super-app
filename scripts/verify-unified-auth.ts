// [2024-12-19 22:30] - Verify unified authentication schema deployment
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyUnifiedAuth() {
  console.log('✅ Verifying Unified Authentication Schema Deployment...\n');

  const tablesToVerify = [
    { name: 'users', description: 'Base user profiles extending auth.users' },
    { name: 'consumer_profiles', description: 'Consumer-specific preferences and settings' },
    { name: 'admin_profiles', description: 'Admin permissions and department info' },
    { name: 'user_roles', description: 'Role assignments (consumer/partner/admin)' },
    { name: 'partners', description: 'Partner business relationships (existing)' }
  ];

  let allTablesExist = true;

  for (const table of tablesToVerify) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ Table '${table.name}' does not exist`);
          allTablesExist = false;
        } else {
          console.log(`⚠️  Table '${table.name}' exists but has access issues: ${error.message}`);
        }
      } else {
        console.log(`✅ Table '${table.name}' exists and accessible`);
        console.log(`   📝 ${table.description}`);
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table.name}':`, err);
      allTablesExist = false;
    }
  }

  console.log('\n🔍 Testing Authentication Functions...');
  
  // Test if we can access auth system
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`✅ Auth system accessible, current user: ${user?.email || 'none'}`);
  } catch (err) {
    console.log('❌ Error accessing auth system:', err);
  }

  if (allTablesExist) {
    console.log('\n🎉 SUCCESS: Unified Authentication Schema Deployed!');
    console.log('\n📋 Next Steps - Phase 2: Migrate Partner App');
    console.log('1. Update partner app to use shared/services/authService.ts');
    console.log('2. Test login with unified auth');
    console.log('3. Verify role-based access control');
    console.log('4. Test cross-app authentication');
    
    console.log('\n🧪 Ready to test? Try creating an account in the partner app!');
    console.log('🌐 Partner App: http://localhost:3010');
  } else {
    console.log('\n❌ Some tables are missing. Please check the SQL execution.');
  }
}

verifyUnifiedAuth().catch(console.error); 