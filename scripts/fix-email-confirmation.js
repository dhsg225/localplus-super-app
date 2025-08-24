const { createClient } = require('@supabase/supabase-js');

// Use the correct anon key from shared config
const supabase = createClient(
  'https://joknprahhqdhvdhzmuwl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk'
);

async function checkAndFixEmailConfirmation() {
  console.log('🔍 Checking email confirmation status...');
  
  // Check unified_users table
  const { data: users, error } = await supabase
    .from('unified_users')
    .select('*')
    .eq('email', 'shannon@localplus.com');
    
  if (error) {
    console.error('❌ Error checking unified_users:', error);
    return;
  }
  
  console.log('📊 Shannon user in unified_users:', users);
  
  if (users && users.length > 0) {
    const user = users[0];
    console.log('📧 Current email_confirmed status:', user.email_confirmed);
    
    if (!user.email_confirmed) {
      console.log('🔧 Confirming email for shannon@localplus.com...');
      
      const { error: updateError } = await supabase
        .from('unified_users')
        .update({ 
          email_confirmed: true,
          email_confirmed_at: new Date().toISOString()
        })
        .eq('email', 'shannon@localplus.com');
        
      if (updateError) {
        console.error('❌ Error updating email confirmation:', updateError);
      } else {
        console.log('✅ Email confirmed successfully!');
      }
    } else {
      console.log('✅ Email already confirmed');
    }
  } else {
    console.log('❌ User not found in unified_users table');
  }
  
  // Try to sign in to test
  console.log('\n🔍 Testing sign in...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'shannon@localplus.com',
    password: 'testpass123'
  });
  
  if (signInError) {
    console.error('❌ Sign in error:', signInError.message);
    
    // If it's email not confirmed, let's try to resend confirmation
    if (signInError.message.includes('Email not confirmed')) {
      console.log('🔄 Attempting to resend confirmation email...');
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: 'shannon@localplus.com'
      });
      
      if (resendError) {
        console.error('❌ Resend error:', resendError.message);
      } else {
        console.log('✅ Confirmation email resent');
      }
    }
  } else {
    console.log('✅ Sign in successful!');
    console.log('📧 User session:', signInData.user?.email);
  }
}

checkAndFixEmailConfirmation().catch(console.error); 