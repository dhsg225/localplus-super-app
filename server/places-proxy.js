// Simple Express server to proxy Google Places API calls
const express = require('express');
const cors = require('cors');
const app = express();

const GOOGLE_PLACES_API_KEY = 'AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y';

// Enable CORS for all routes
app.use(cors());

// Hua Hin Google Places proxy endpoint
app.get('/api/places', async (req, res) => {
  try {
    const { lat, lng, radius = '3000', type = 'establishment' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    console.log(`🔍 Server-side Google Places search: ${lat}, ${lng} (type: ${type})`);

    // Import fetch dynamically for Node.js
    const fetch = (await import('node-fetch')).default;

    // Call Google Places API from server-side (no CORS issues)
    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}&` +
      `radius=${radius}&` +
      `type=${type}&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(googleUrl);
    const data = await response.json();

    if (data.status === 'OK') {
      console.log(`✅ Found ${data.results?.length || 0} places for ${type}`);
      res.json(data);
    } else {
      console.log(`⚠️ Google API returned: ${data.status}`);
      res.status(400).json({ error: data.status, message: data.error_message });
    }

  } catch (error) {
    console.error('❌ Places API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Places proxy server is running' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Places proxy server running on http://localhost:${PORT}`);
  console.log(`🏖️ Ready to serve Hua Hin business data!`);
});

module.exports = app; 