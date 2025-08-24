// [2024-12-19 23:15] - Migrate existing users to unified authentication system
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4ODQ3MDQsImV4cCI6MjA0ODQ2MDcwNH0.VYITvmhZYzqRLnNTwxnqtJjZjNOLSuiILGfZBfOKSh8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OldUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  // Add other fields as needed
}

async function migrateExistingUsers() {
  console.log('🔄 Starting user migration to unified authentication system...');
  
  try {
    // Step 1: Get all existing users from auth.users
    console.log('📋 Fetching existing users from auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log(`📊 Found ${authUsers.users.length} users in auth.users`);
    
    // Step 2: Check what users already exist in unified system
    const { data: existingUnifiedUsers, error: unifiedError } = await supabase
      .from('users')
      .select('id, email');
    
    if (unifiedError) {
      console.error('❌ Error fetching unified users:', unifiedError);
      return;
    }
    
    const existingIds = new Set(existingUnifiedUsers?.map(u => u.id) || []);
    console.log(`📊 Found ${existingUnifiedUsers?.length || 0} users already in unified system`);
    
    // Step 3: Migrate users who don't exist in unified system
    let migratedCount = 0;
    
    for (const authUser of authUsers.users) {
      if (existingIds.has(authUser.id)) {
        console.log(`⏭️  Skipping ${authUser.email} - already in unified system`);
        continue;
      }
      
      console.log(`🔄 Migrating user: ${authUser.email}`);
      
      try {
        // Insert into users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            first_name: authUser.user_metadata?.firstName || authUser.user_metadata?.first_name || '',
            last_name: authUser.user_metadata?.lastName || authUser.user_metadata?.last_name || '',
            phone: authUser.user_metadata?.phone || authUser.phone || '',
            avatar_url: authUser.user_metadata?.avatar_url || '',
            is_active: true,
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          });
        
        if (userError) {
          console.error(`❌ Error inserting user ${authUser.email}:`, userError);
          continue;
        }
        
        // Determine user role based on email or metadata
        let userRole = 'consumer'; // default
        
        if (authUser.email.includes('admin') || authUser.user_metadata?.role === 'admin') {
          userRole = 'admin';
        } else if (authUser.user_metadata?.role === 'partner') {
          userRole = 'partner';
        }
        
        // Insert user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authUser.id,
            role: userRole
          });
        
        if (roleError) {
          console.error(`❌ Error inserting role for ${authUser.email}:`, roleError);
        }
        
        // Create role-specific profiles
        if (userRole === 'admin') {
          const { error: adminError } = await supabase
            .from('admin_profiles')
            .insert({
              user_id: authUser.id,
              permissions: ['view_dashboard', 'manage_businesses'],
              department: 'operations'
            });
          
          if (adminError) {
            console.error(`❌ Error creating admin profile for ${authUser.email}:`, adminError);
          }
        } else if (userRole === 'consumer') {
          const { error: consumerError } = await supabase
            .from('consumer_profiles')
            .insert({
              user_id: authUser.id,
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
                cuisinePreferences: [],
                priceRange: { min: 100, max: 1000 },
                favoriteDistricts: []
              }
            });
          
          if (consumerError) {
            console.error(`❌ Error creating consumer profile for ${authUser.email}:`, consumerError);
          }
        }
        
        migratedCount++;
        console.log(`✅ Successfully migrated ${authUser.email} as ${userRole}`);
        
      } catch (error) {
        console.error(`❌ Error migrating user ${authUser.email}:`, error);
      }
    }
    
    console.log(`🎉 Migration completed! Migrated ${migratedCount} users to unified system`);
    
    // Step 4: Verify migration
    const { data: finalCount, error: countError } = await supabase
      .from('users')
      .select('id', { count: 'exact' });
    
    if (!countError) {
      console.log(`📊 Total users in unified system: ${finalCount?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateExistingUsers()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateExistingUsers }; 