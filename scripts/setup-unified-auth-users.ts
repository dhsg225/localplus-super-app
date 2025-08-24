// [2024-12-19 22:50] - Setup test users for unified authentication system
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupUnifiedAuthUsers() {
  console.log('🔧 Setting up unified authentication test users...\n');

  const testUsers = [
    {
      email: 'admin@localplus.com',
      password: 'admin123',
      firstName: 'LocalPlus',
      lastName: 'Administrator',
      role: 'admin',
      description: 'System administrator with full access'
    },
    {
      email: 'shannon@localplus.com',
      password: 'testpass123',
      firstName: 'Shannon',
      lastName: 'Restaurant Owner',
      phone: '+66-89-123-4567',
      role: 'partner',
      businessId: '12345678-1234-5678-9012-123456789012',
      description: 'Partner user linked to Shannon\'s Restaurant'
    },
    {
      email: 'consumer@localplus.com',
      password: 'consumer123',
      firstName: 'Test',
      lastName: 'Consumer',
      phone: '+66-89-987-6543',
      role: 'consumer',
      description: 'Test consumer user'
    }
  ];

  for (const user of testUsers) {
    console.log(`👤 Creating user: ${user.email} (${user.role})`);
    
    try {
      // Try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          console.log(`   ⚠️  User already exists, checking profile...`);
          
          // Try to sign in to verify the user exists
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password
          });

          if (signInError) {
            console.log(`   ❌ Sign in failed: ${signInError.message}`);
            continue;
          }

          if (signInData.user) {
            console.log(`   ✅ User exists and can sign in`);
            await createUserProfiles(signInData.user.id, user);
          }
        } else {
          console.log(`   ❌ Sign up failed: ${signUpError.message}`);
          continue;
        }
      } else if (signUpData.user) {
        console.log(`   ✅ User created successfully`);
        await createUserProfiles(signUpData.user.id, user);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
  }

  console.log('\n🎉 User setup complete!');
  console.log('\n📋 Test Credentials:');
  testUsers.forEach(user => {
    console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    console.log(`   📝 ${user.description}`);
  });
}

async function createUserProfiles(userId: string, user: any) {
  try {
    // Create base user record
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        is_active: true
      }, {
        onConflict: 'id'
      });

    if (userError) {
      console.log(`   ⚠️  User record error: ${userError.message}`);
    }

    // Create role-specific profiles
    switch (user.role) {
      case 'admin':
        await createAdminProfile(userId);
        break;
      case 'partner':
        if (user.businessId) {
          await createPartnerProfile(userId, user.businessId);
        }
        break;
      case 'consumer':
        await createConsumerProfile(userId);
        break;
    }

    console.log(`   ✅ Profiles created for ${user.role}`);
  } catch (error) {
    console.log(`   ❌ Profile creation error: ${error}`);
  }
}

async function createAdminProfile(userId: string) {
  const { error } = await supabase
    .from('admin_profiles')
    .upsert({
      user_id: userId,
      permissions: ['view_dashboard', 'manage_businesses', 'approve_listings', 'system_settings'],
      department: 'operations'
    }, {
      onConflict: 'user_id'
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    console.log(`   ⚠️  Admin profile error: ${error.message}`);
  }
}

async function createPartnerProfile(userId: string, businessId: string) {
  const { error } = await supabase
    .from('partners')
    .upsert({
      user_id: userId,
      business_id: businessId,
      role: 'owner',
      permissions: ['view_bookings', 'manage_bookings', 'view_analytics', 'manage_settings'],
      is_active: true,
      accepted_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,business_id'
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    console.log(`   ⚠️  Partner profile error: ${error.message}`);
  }
}

async function createConsumerProfile(userId: string) {
  const { error } = await supabase
    .from('consumer_profiles')
    .upsert({
      user_id: userId,
      preferences: {
        language: 'en',
        currency: 'THB',
        notifications: {
          email: true,
          push: true,
          sms: false,
          deals: true,
          events: true,
          reminders: true
        },
        dietary: {
          vegetarian: false,
          vegan: false,
          halal: false,
          glutenFree: false,
          allergies: []
        },
        cuisinePreferences: ['Thai', 'International'],
        priceRange: { min: 100, max: 1000 },
        favoriteDistricts: []
      }
    }, {
      onConflict: 'user_id'
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    console.log(`   ⚠️  Consumer profile error: ${error.message}`);
  }
}

setupUnifiedAuthUsers().catch(console.error); 