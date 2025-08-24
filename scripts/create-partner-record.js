const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPartnerRecord() {
  console.log('🔗 Creating partner record...');
  
  const partnerData = {
    user_id: '550e8400-e29b-41d4-a716-446655440000', // Dev user ID
    business_id: '550e8400-e29b-41d4-a716-446655440000', // New business ID
    role: 'owner',
    permissions: ['manage_bookings', 'manage_notifications', 'view_analytics'],
    is_active: true,
    accepted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    const { data, error } = await supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating partner record:', error);
      return;
    }
    
    console.log('✅ Partner record created successfully:', data);
    console.log('💡 Now the RLS policies should allow access to notification preferences.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createPartnerRecord(); 