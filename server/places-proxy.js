// Simple Express server to proxy Google Places API calls
const express = require('express');
const cors = require('cors');
const app = express();

const GOOGLE_PLACES_API_KEY = 'AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y';

// WordPress site mappings
const WORDPRESS_SITES = {
  'hua-hin': 'https://huahin.locality.guide',
  'pattaya': 'https://pattaya.locality.guide',
  'bangkok': 'https://huahin.locality.guide', // Use Hua Hin as fallback for Bangkok
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

    // Build WordPress API URL with _embed to get featured images
    let wpUrl = `${baseUrl}/wp-json/wp/v2/posts?per_page=${per_page}&_embed`;
    if (categories) wpUrl += `&categories=${categories}`;
    if (search) wpUrl += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(wpUrl);
    const posts = await response.json();

    // Extract featured images from embedded data
    const postsWithImages = posts.map((post) => {
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        post.featured_image_url = post._embedded['wp:featuredmedia'][0].source_url;
      }
      return post;
    });

    console.log(`✅ Found ${postsWithImages.length} posts for ${city}`);
    res.json(postsWithImages);

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

// [2025-01-07 02:30 UTC] - Google Places Photos endpoints
// Get photos for a specific place ID
app.get('/api/places/photos/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    console.log(`📸 Fetching photos for place: ${placeId}`);

    const fetch = (await import('node-fetch')).default;

    // Call Google Places API Place Details to get photos
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&` +
      `fields=photos&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(googleUrl);
    const data = await response.json();

    if (data.status === 'OK') {
      const photos = data.result?.photos || [];
      console.log(`📸 Found ${photos.length} photos for place ${placeId}`);
      
      // Return photos in the format expected by the frontend
      res.json({
        success: true,
        photos: photos.map(photo => ({
          photo_reference: photo.photo_reference,
          height: photo.height,
          width: photo.width
        }))
      });
    } else {
      console.log(`⚠️ Google Places API returned: ${data.status} for place ${placeId}`);
      res.status(400).json({ 
        success: false,
        error: data.status, 
        message: data.error_message || 'Failed to fetch photos'
      });
    }

  } catch (error) {
    console.error('❌ Places Photos API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// Get photo URL (redirect to actual Google Places photo)
app.get('/api/places/photo', async (req, res) => {
  try {
    const { photo_reference, maxwidth = 600, maxheight = 400 } = req.query;

    if (!photo_reference) {
      return res.status(400).json({ error: 'Photo reference is required' });
    }

    console.log(`📸 Serving photo: ${photo_reference} (${maxwidth}x${maxheight})`);

    // Construct Google Places Photo URL
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=${maxwidth}&` +
      `maxheight=${maxheight}&` +
      `photo_reference=${photo_reference}&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    // Redirect to the actual Google Places photo URL
    // This allows the frontend to load the image directly while bypassing CORS
    res.redirect(302, photoUrl);

  } catch (error) {
    console.error('❌ Places Photo URL error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Places & News proxy server is running',
    endpoints: {
      places: '/api/places',
      'places/photos/:placeId': '/api/places/photos/:placeId',
      'places/photo': '/api/places/photo',
      news: '/api/news/:city',
      categories: '/api/news/:city/categories'
    }
  });
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`🚀 Places & News proxy server running on http://localhost:${PORT}`);
  console.log(`🏖️ Ready to serve Hua Hin business data!`);
  console.log(`📰 Ready to serve WordPress news from multiple cities!`);
});

module.exports = app; 