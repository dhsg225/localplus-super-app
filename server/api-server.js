// [2024-12-19] - Secure Express API server for business operations
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// [2024-12-19] - Security: Service role key only on server
const supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Security middleware
app.use(cors({
  origin: ['http://localhost:3014', 'http://localhost:5176'], // Partner and Admin apps
  credentials: true
}));
app.use(express.json());

// [2024-12-19] - Secure business fetching endpoint
app.get('/api/businesses', async (req, res) => {
  try {
    console.log('🔒 Secure business fetch request received');
    
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, partnership_status')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching businesses:', error);
      return res.status(500).json({ error: 'Failed to fetch businesses' });
    }
    
    console.log(`✅ Securely fetched ${data?.length || 0} businesses`);
    res.json({ businesses: data || [] });
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// [2024-12-19] - Secure user-business linking endpoint
app.post('/api/link-user-business', async (req, res) => {
  try {
    const { userId, businessId, role = 'owner' } = req.body;
    
    if (!userId || !businessId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🔒 Secure user-business link request:', { userId, businessId, role });
    
    const { error } = await supabase
      .from('partners')
      .insert({
        user_id: userId,
        business_id: businessId,
        role: role,
        is_active: true,
        accepted_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('❌ Error linking user to business:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to link user to business' 
      });
    }
    
    console.log('✅ User linked to business successfully');
    res.json({ success: true });
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🔒 Secure API server running on port ${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`   GET  /api/businesses`);
  console.log(`   POST /api/link-user-business`);
  console.log(`   GET  /api/health`);
}); 