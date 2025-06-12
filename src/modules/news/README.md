# Local Plus News Module

## Overview

The News Module provides location-aware news content sourced from WordPress sites across different Thai cities. It integrates seamlessly with the Local Plus app's location detection system and provides a rich, filtered news experience.

## Features

- **Location-Aware Content**: Automatically detects user location and shows relevant city news
- **Multi-City Support**: Currently supports Hua Hin and Pattaya with easy expansion to other cities
- **Search & Filter**: Real-time search with category-based filtering
- **Responsive Design**: Mobile-friendly layout with modern UI
- **WordPress Integration**: Direct API integration with locality.guide WordPress sites
- **Location Sync**: Syncs with main app's location selection via localStorage

## Architecture

### 1. Proxy Server (server/places-proxy.js)
- **WordPress API Endpoints**:
  - `GET /api/news/:city` - Fetch news posts with optional search/filter
  - `GET /api/news/:city/categories` - Fetch available categories
- **CORS Handling**: Resolves cross-origin issues with WordPress APIs
- **City Mapping**: Maps city slugs to WordPress site URLs

### 2. News Module Components
- **NewsModule.tsx**: Main React component (in progress - TypeScript config issues)
- **news.types.ts**: TypeScript interfaces for news data
- **newsHelpers.ts**: Utility functions for formatting and data processing

### 3. Demo Implementation
- **news-module-demo.html**: Standalone demo showcasing full functionality
- **Vanilla JavaScript**: Working implementation without TypeScript dependencies

## API Integration

### WordPress Sites
- **Hua Hin**: `https://huahin.locality.guide`
- **Pattaya**: `https://pattaya.locality.guide`

### Data Structure
```typescript
interface NewsPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
  link: string;
  yoast_head_json?: {
    og_image?: Array<{ url: string; width: number; height: number }>;
  };
}
```

## Location Detection

### Priority System
1. **Manual Selection**: User-selected location in main app
2. **localStorage Sync**: Reads from `ldp_user_location` key
3. **Fallback**: Defaults to Hua Hin if no location detected

### City Mapping
```javascript
const cityMapping = {
  'Bangkok': 'bangkok',
  'Hua Hin': 'hua-hin', 
  'Pattaya': 'pattaya',
  'Phuket': 'phuket',
  'Chiang Mai': 'chiang-mai'
};
```

## Usage

### 1. Start Proxy Server
```bash
cd server && node places-proxy.js
```

### 2. View Demo
Open `news-module-demo.html` in browser (requires proxy server running)

### 3. Integration
```typescript
import { NewsModule } from '@/modules/news';

<NewsModule className="my-custom-class" />
```

## Testing

### API Endpoints
```bash
# Test Hua Hin news
curl "http://localhost:3003/api/news/hua-hin?per_page=5"

# Test Pattaya categories  
curl "http://localhost:3003/api/news/pattaya/categories"

# Search functionality
curl "http://localhost:3003/api/news/hua-hin?search=wildlife"
```

### Browser Demo
1. Ensure proxy server is running on localhost:3003
2. Open `news-module-demo.html`
3. Test city switching, search, and category filtering

## Future Enhancements

### Immediate
- [ ] Fix TypeScript/JSX configuration issues
- [ ] Implement pagination for "Load More" functionality  
- [ ] Add featured image fallbacks
- [ ] Optimize API caching

### Medium Term
- [ ] Add Bangkok, Phuket, Chiang Mai WordPress sites
- [ ] Implement national news toggle
- [ ] Add bookmark/favorite functionality
- [ ] Social sharing integration

### Long Term
- [ ] Real-time notifications for breaking news
- [ ] Personalized news recommendations
- [ ] Multi-language support
- [ ] Offline reading capability

## Configuration

### Adding New Cities
1. **Update WordPress Sites Mapping**:
```javascript
const WORDPRESS_SITES = {
  'hua-hin': 'https://huahin.locality.guide',
  'pattaya': 'https://pattaya.locality.guide',
  'new-city': 'https://newcity.locality.guide' // Add here
};
```

2. **Update Available Cities**:
```javascript
const availableCities = {
  'hua-hin': 'Hua Hin',
  'pattaya': 'Pattaya', 
  'new-city': 'New City' // Add here
};
```

### Environment Variables
```env
# Proxy server port (default: 3003)
PROXY_PORT=3003

# WordPress API timeout (default: 10s)
WP_API_TIMEOUT=10000
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure proxy server is running
2. **No News Loading**: Check WordPress site accessibility
3. **Location Not Syncing**: Verify localStorage key `ldp_user_location`

### Debug Commands
```bash
# Check proxy server health
curl http://localhost:3003/health

# Test WordPress direct access
curl https://huahin.locality.guide/wp-json/wp/v2/posts?per_page=1

# Verify categories endpoint
curl https://pattaya.locality.guide/wp-json/wp/v2/categories
```

## Dependencies

### Production
- React 18+
- Lucide React (icons)
- Tailwind CSS

### Development  
- TypeScript
- Node.js (proxy server)
- Express.js
- node-fetch

## License

Part of Local Plus Super App - Proprietary 