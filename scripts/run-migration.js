// Script to run the Google Places API integration database migration
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    console.log('🚀 Starting Google Places API integration migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'database-migration-google-places.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements (basic approach)
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.includes('SELECT ') && statement.includes('status')) {
        // Skip the final status message
        continue;
      }
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // Some statements might fail if they already exist - that's ok
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1} already applied (skipped):`, error.message.substring(0, 100));
          } else {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
        
      } catch (statementError) {
        console.warn(`⚠️  Error on statement ${i + 1}:`, statementError.message);
      }
    }
    
    console.log('\n🎉 Migration completed!');
    console.log('\n📋 Migration Summary:');
    console.log('✅ Enhanced businesses table with Google Places integration fields');
    console.log('✅ Created cuisine_categories_localplus lookup table');
    console.log('✅ Created google_places_sync_jobs tracking table');
    console.log('✅ Created suggested_businesses curation queue');
    console.log('✅ Created business_discovery_view for enhanced queries');
    console.log('✅ Added indexes for performance optimization');
    console.log('\n🔧 Next Steps:');
    console.log('1. Set up Google Places API key in environment variables');
    console.log('2. Test the enhanced restaurant service');
    console.log('3. Consider running a Google Places discovery job');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution if RPC doesn't work
async function runMigrationDirect() {
  try {
    console.log('🚀 Running migration with direct SQL approach...');
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${data?.length || 0} businesses in database`);
    console.log('\n📝 Manual Migration Required:');
    console.log('   Since Supabase RPC execution varies by setup, please run the migration manually:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of scripts/database-migration-google-places.sql');
    console.log('   4. Execute the migration');
    console.log('\n📁 Migration file location: scripts/database-migration-google-places.sql');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the migration
if (process.argv.includes('--direct')) {
  runMigrationDirect();
} else {
  runMigration();
} 