// [2024-12-19 22:55] - Check existing users in unified authentication system
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingUsers() {
  console.log('🔍 Checking existing users in unified auth system...\n');

  try {
    // Check current auth user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log('Current authenticated user:', currentUser?.email || 'None');

    // Try to get users table (might be restricted by RLS)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log(`✅ Found ${users?.length || 0} users in users table`);
      users?.forEach(user => {
        console.log(`   📧 ${user.email} - ${user.first_name} ${user.last_name}`);
      });
    }

    // Check admin profiles
    const { data: adminProfiles, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*');

    if (adminError) {
      console.log('❌ Admin profiles error:', adminError.message);
    } else {
      console.log(`✅ Found ${adminProfiles?.length || 0} admin profiles`);
    }

    // Check partner profiles
    const { data: partnerProfiles, error: partnerError } = await supabase
      .from('partners')
      .select('*');

    if (partnerError) {
      console.log('❌ Partner profiles error:', partnerError.message);
    } else {
      console.log(`✅ Found ${partnerProfiles?.length || 0} partner profiles`);
    }

    // Check consumer profiles
    const { data: consumerProfiles, error: consumerError } = await supabase
      .from('consumer_profiles')
      .select('*');

    if (consumerError) {
      console.log('❌ Consumer profiles error:', consumerError.message);
    } else {
      console.log(`✅ Found ${consumerProfiles?.length || 0} consumer profiles`);
    }

    // Test specific user logins
    console.log('\n🧪 Testing user logins...');
    
    const testCredentials = [
      { email: 'admin@localplus.com', password: 'admin123' },
      { email: 'shannon@localplus.com', password: 'testpass123' },
      { email: 'consumer@localplus.com', password: 'consumer123' }
    ];

    for (const cred of testCredentials) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: cred.email,
          password: cred.password
        });

        if (error) {
          console.log(`❌ ${cred.email}: ${error.message}`);
        } else {
          console.log(`✅ ${cred.email}: Login successful`);
          // Sign out immediately
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.log(`❌ ${cred.email}: ${err}`);
      }
    }

  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkExistingUsers().catch(console.error); 