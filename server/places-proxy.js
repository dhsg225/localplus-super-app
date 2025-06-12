// Simple Express server to proxy Google Places API calls
const express = require('express');
const cors = require('cors');
const app = express();

const GOOGLE_PLACES_API_KEY = 'AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y';

// WordPress site mappings
const WORDPRESS_SITES = {
  'hua-hin': 'https://huahin.locality.guide',
  'pattaya': 'https://pattaya.locality.guide',
  // Add more as needed
};

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

// WordPress news proxy endpoint
app.get('/api/news/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { per_page = 10, categories, search } = req.query;

    const baseUrl = WORDPRESS_SITES[city];
    if (!baseUrl) {
      return res.status(400).json({ error: `Unsupported city: ${city}` });
    }

    console.log(`📰 Fetching news for ${city} from ${baseUrl}`);

    const fetch = (await import('node-fetch')).default;

    // Build WordPress API URL
    let wpUrl = `${baseUrl}/wp-json/wp/v2/posts?per_page=${per_page}`;
    if (categories) wpUrl += `&categories=${categories}`;
    if (search) wpUrl += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(wpUrl);
    const posts = await response.json();

    console.log(`✅ Found ${posts.length} posts for ${city}`);
    res.json(posts);

  } catch (error) {
    console.error('❌ WordPress API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// WordPress categories proxy endpoint
app.get('/api/news/:city/categories', async (req, res) => {
  try {
    const { city } = req.params;

    const baseUrl = WORDPRESS_SITES[city];
    if (!baseUrl) {
      return res.status(400).json({ error: `Unsupported city: ${city}` });
    }

    console.log(`📂 Fetching categories for ${city} from ${baseUrl}`);

    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/categories`);
    const categories = await response.json();

    console.log(`✅ Found ${categories.length} categories for ${city}`);
    res.json(categories);

  } catch (error) {
    console.error('❌ WordPress Categories API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Places & News proxy server is running',
    endpoints: {
      places: '/api/places',
      news: '/api/news/:city',
      categories: '/api/news/:city/categories'
    }
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Places & News proxy server running on http://localhost:${PORT}`);
  console.log(`🏖️ Ready to serve Hua Hin business data!`);
  console.log(`📰 Ready to serve WordPress news from multiple cities!`);
});

module.exports = app; 