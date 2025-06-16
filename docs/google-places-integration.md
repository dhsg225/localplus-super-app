# Google Places API Integration & Curated Cuisine System

## Overview

This document outlines the comprehensive Google Places API integration and curated cuisine categorization system implemented for LocalPlus. The system combines the power of Google's extensive business database with human curation to ensure high-quality, relevant restaurant data for the Thailand market.

## Architecture

### 1. Database Schema Enhancement

#### New Tables Created:

**`cuisine_categories_localplus`** - Curated cuisine categories specific to Thailand market
- Contains 30+ predefined cuisine categories (Thai Traditional, Royal Thai, Seafood Grilled, etc.)
- Hierarchical structure with parent categories
- Designed for Thailand's unique food landscape

**`google_places_sync_jobs`** - Track Google Places API discovery operations
- Records search parameters, status, and results
- Enables monitoring and debugging of API operations

**`suggested_businesses`** - Queue for businesses discovered via Google Places
- Stores full Google API response data
- Tracks curation status and reviewer assignments
- Confidence scoring system

#### Enhanced `businesses` Table:
- `google_place_id` - Link to Google Places
- `google_types` - Raw Google Place Types
- `cuisine_types_google` - Google-derived cuisine classifications
- `cuisine_types_localplus` - Curated LocalPlus categories
- `discovery_source` - How business was found
- `curation_status` - Human review status

### 2. Service Layer

#### `GooglePlacesService` - Core integration service
- **Restaurant Discovery**: Automated nearby search for restaurants
- **Cuisine Mapping**: Converts Google types to LocalPlus categories
- **Confidence Scoring**: Evaluates data quality (0.0-1.0)
- **Curation Queue**: Manages suggested businesses workflow

#### Enhanced `RestaurantService`
- **Multi-source Data**: Combines Google data with curation
- **Cuisine Filtering**: Query by LocalPlus cuisine categories
- **Enhanced Descriptions**: Uses curated data for better content
- **No Fallback**: Returns empty arrays instead of mock data

## Workflow

### 1. Automated Discovery Phase

```javascript
// Start restaurant discovery for Hua Hin area
const syncJobId = await googlePlacesService.startNearbyRestaurantDiscovery(
  { lat: 12.5681, lng: 99.9592 }, // Hua Hin coordinates
  5000 // 5km radius
);
```

**Process:**
1. Google Places Nearby Search API call
2. Filter results for restaurant types
3. Extract cuisine information from Google types
4. Calculate confidence scores
5. Store in `suggested_businesses` table

### 2. Human Curation Phase

**LDP Team Review Dashboard** (to be built):
- View suggested businesses by confidence score
- See Google-suggested cuisine types
- Select appropriate LocalPlus cuisine categories
- Add curation notes
- Approve/reject businesses

**Curation Actions:**
```javascript
// Approve a suggested business with curated cuisine types
await googlePlacesService.approveSuggestedBusiness(
  suggestedBusinessId,
  ['thai_traditional', 'seafood_grilled'], // Curated categories
  'Verified as authentic Thai seafood restaurant'
);
```

### 3. Production Integration

**Enhanced Restaurant Queries:**
```javascript
// Get restaurants by cuisine
const thaiRestaurants = await restaurantService.getRestaurantsByCuisine([
  'thai_traditional', 'thai_royal'
], 'Hua Hin');

// Get available cuisine categories
const cuisineCategories = await restaurantService.getCuisineCategories();
```

## Cuisine Categorization Strategy

### Google Places Types → LocalPlus Categories Mapping

| Google Type | LocalPlus Categories |
|-------------|---------------------|
| `thai_restaurant` | `thai_traditional` |
| `seafood_restaurant` | `seafood_grilled` |
| `japanese_restaurant` | `japanese_sushi` |
| `sushi_restaurant` | `japanese_sushi` |
| `ramen_restaurant` | `japanese_ramen` |
| `italian_restaurant` | `italian_pasta` |
| `pizza_restaurant` | `italian_pizza` |

### Thailand-Specific Categories

- **Thai Regional**: Traditional, Royal, Street Food, Northern (Lanna), Northeastern (Isaan), Southern
- **Seafood Styles**: Grilled, Steamed, Spicy Thai-style
- **International**: Japanese (Sushi, Ramen, Teppanyaki), Italian (Pasta, Pizza), etc.
- **Dietary**: Vegetarian, Vegan, Halal

## Benefits

### 1. Data Quality
- **No Mock Data**: Real businesses from Google's database
- **Human Verification**: LDP team ensures accuracy
- **Local Expertise**: Thailand-specific categorization

### 2. Scalability
- **Automated Discovery**: Reduce manual data entry
- **Batch Processing**: Handle large areas efficiently
- **API Integration**: Always up-to-date information

### 3. User Experience
- **Relevant Filtering**: Cuisine categories users understand
- **Accurate Information**: Verified contact details and locations
- **Rich Content**: Enhanced descriptions and features

## Implementation Status

### ✅ Completed
- Database schema migration
- Google Places service implementation
- Enhanced restaurant service
- Cuisine categorization system
- Migration scripts and documentation

### 🔧 Next Steps
1. **Run Database Migration**: Execute `scripts/database-migration-google-places.sql` in Supabase
2. **Google API Setup**: Add `VITE_GOOGLE_PLACES_API_KEY` to environment
3. **Test Discovery**: Run a small-scale restaurant discovery job
4. **Build Curation UI**: LDP team review dashboard
5. **Integration Testing**: Verify frontend components work with new data

## Usage Examples

### Restaurant Discovery
```javascript
// Discover restaurants in Hua Hin
const syncJobId = await googlePlacesService.startNearbyRestaurantDiscovery(
  { lat: 12.5681, lng: 99.9592 },
  3000 // 3km radius
);

// Check job status
const status = await googlePlacesService.getSyncJobStatus(syncJobId);
console.log(`Found ${status.businesses_found} restaurants`);
```

### Curation Workflow
```javascript
// Get businesses awaiting curation
const suggested = await googlePlacesService.getSuggestedBusinessesForCuration();

// Approve with curated categories
await googlePlacesService.approveSuggestedBusiness(
  suggested[0].id,
  ['thai_traditional', 'seafood_grilled']
);
```

### Frontend Integration
```javascript
// Get Thai restaurants
const restaurants = await restaurantService.getRestaurantsByCuisine([
  'thai_traditional'
], 'Hua Hin');

// Display with cuisine names
restaurants.forEach(restaurant => {
  console.log(`${restaurant.name}: ${restaurant.cuisine_display_names?.join(', ')}`);
});
```

## Configuration

### Environment Variables Required
```bash
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Google Places API Setup
1. Enable Places API (New) in Google Cloud Console
2. Create API key with Places API permissions
3. Restrict key to your domain/IP for security
4. Monitor usage and set quotas

## Monitoring & Maintenance

### Key Metrics to Track
- **Discovery Success Rate**: Successful API calls vs failures
- **Curation Throughput**: Businesses reviewed per day
- **Data Quality**: Confidence scores of approved businesses
- **Coverage**: Restaurant density by area

### Regular Maintenance
- **Weekly**: Review curation queue, approve high-confidence businesses
- **Monthly**: Analyze cuisine category usage, add new categories if needed
- **Quarterly**: Re-scan high-traffic areas for new businesses

## Security Considerations

### API Key Protection
- Store Google API key in environment variables only
- Use domain/IP restrictions
- Monitor usage for suspicious activity
- Implement rate limiting

### Data Privacy
- Store only business information, not user data
- Follow Google Places API terms of service
- Implement data retention policies
- Regular security audits

---

This integration transforms LocalPlus from a platform with mock restaurant data to one powered by real, curated business information that reflects the actual dining landscape of Thailand. 