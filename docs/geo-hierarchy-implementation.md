# Thailand Geographic Hierarchy Implementation

## Overview

This implementation provides a robust, scalable geographic hierarchy system for LocalPlus, specifically designed for Thailand's administrative structure. It replaces basic city/district filtering with precision-based Province → District → Sub-district hierarchy matching Thailand's official administrative divisions.

## Benefits for LocalPlus

### 🎯 Enhanced User Experience
- **Precision Filtering**: Users can drill down from Province → District → Sub-district for exact location targeting
- **Familiar Navigation**: Uses Thailand's official administrative terms (จังหวัด/อำเภอ/ตำบล)
- **Cascading Dropdowns**: Intuitive selection flow that populates districts when province is selected
- **Bilingual Support**: Full Thai and English naming throughout

### 🚀 Improved Performance & Scalability
- **Indexed Queries**: Fast filtering on geographic IDs instead of string parsing
- **Structured Expansion**: Easy addition of new provinces/areas with consistent framework
- **Data Integrity**: Foreign key constraints ensure valid geographic relationships

### 📊 Business Intelligence & Analytics
- **Granular Analytics**: Track business density, user engagement by sub-district level
- **LDP Area Focus**: Built-in priority area configuration for strategic expansion
- **Targeted Marketing**: Precise geographic segmentation for campaigns

## Database Schema

### Core Tables

```sql
provinces (
  id UUID PK,
  code VARCHAR(10) UNIQUE,     -- Official province code (e.g., "77" for Prachuap Khiri Khan)
  name_en VARCHAR(100),        -- "Prachuap Khiri Khan"
  name_th VARCHAR(100),        -- "ประจวบคีรีขันธ์"
  region VARCHAR(20)           -- "southern", "northern", etc.
)

districts (
  id UUID PK,
  code VARCHAR(10) UNIQUE,     -- Official district code (e.g., "7703" for Hua Hin)
  province_id UUID FK,
  name_en VARCHAR(100),        -- "Hua Hin"
  name_th VARCHAR(100)         -- "หัวหิน"
)

sub_districts (
  id UUID PK,
  code VARCHAR(10) UNIQUE,     -- Official sub-district code (e.g., "770301")
  district_id UUID FK,
  name_en VARCHAR(100),        -- "Hua Hin"
  name_th VARCHAR(100),        -- "หัวหิน"
  postal_codes TEXT[]          -- ["77110"] - array of postal codes
)
```

### Enhanced Business Table

```sql
businesses (
  -- Existing fields...
  province_id UUID FK,         -- Links to provinces table
  district_id UUID FK,         -- Links to districts table
  sub_district_id UUID FK,     -- Links to sub_districts table
  address_line TEXT,           -- Street address (building, road name)
  postal_code VARCHAR(10)      -- For verification/matching
)
```

## LDP Priority Areas Configuration

Built-in configuration for LocalPlus priority markets:

```typescript
const LDP_PRIORITY_AREAS = [
  {
    id: 'hua-hin',
    name: 'Hua Hin',
    province_id: 'prachuap-khiri-khan',
    priority_level: 'primary',
    is_active: true
  },
  {
    id: 'pattaya', 
    name: 'Pattaya',
    province_id: 'chonburi',
    priority_level: 'primary',
    is_active: true
  },
  // ... additional areas
];
```

## Implementation Components

### 1. Geography Service (`src/services/geographyService.ts`)
Central service for all geographic operations:
- Province/District/Sub-district data fetching
- Cascading dropdown support
- Google Places integration
- Business filtering by geographic hierarchy
- Full address construction

### 2. GeoLocationSelector Component (`src/components/business/GeoLocationSelector.tsx`)
Reusable React component providing:
- Cascading Province → District → Sub-district dropdowns
- Real-time validation and loading states
- Bilingual display (English/Thai)
- Business onboarding integration

### 3. Type Definitions (`src/types/geography.ts`)
Comprehensive TypeScript interfaces for:
- Administrative hierarchy structures
- Geographic filtering options
- Google Places address parsing
- LDP area configuration

## Usage Examples

### Business Filtering by Geographic Hierarchy

```typescript
import { geographyService } from '@/services/geographyService';

// Get all restaurants in Hua Hin sub-district
const huaHinRestaurants = await geographyService.getBusinessesByGeoFilter({
  province_id: 'prachuap-khiri-khan',
  district_id: 'hua-hin-district',
  sub_district_id: 'hua-hin-subdistrict'
});

// Get all businesses in Chonburi province
const chonburiBusinesses = await geographyService.getBusinessesByGeoFilter({
  province_id: 'chonburi'
});
```

### Cascading Location Selector in Forms

```tsx
import { GeoLocationSelector } from '@/components/business/GeoLocationSelector';

<GeoLocationSelector
  onLocationChange={(location) => {
    setBusinessLocation(location);
  }}
  initialValues={{
    province_id: 'prachuap-khiri-khan',
    district_id: 'hua-hin-district'
  }}
  required={true}
/>
```

### Google Places Integration

```typescript
// Parse Google Places result into geographic IDs
const addressComponents = extractAddressComponents(googlePlacesResult);
const geoIds = await geographyService.parseAddressComponents(addressComponents);

// Result: { province_id: "...", district_id: "...", sub_district_id: "..." }
```

## Setup Instructions

### 1. Database Migration

Run the SQL migration script in your Supabase SQL editor:

```bash
# Execute the contents of scripts/setup-geo-hierarchy.sql
# This creates all tables, indexes, and sample data for LDP areas
```

### 2. Data Population Options

**Option A: LDP Areas Only (Immediate)**
- Use the included sample data for Hua Hin, Pattaya, Phuket, Chiang Mai
- Perfect for MVP and early testing

**Option B: Complete Thailand Data (Recommended for Production)**
- Import comprehensive Thailand administrative data
- Sources: Official government data or open datasets
- ~77 provinces, ~928 districts, ~7,255 sub-districts

### 3. Application Integration

```typescript
// Import the geography service
import { geographyService } from '@/services/geographyService';

// Use in React components
import { GeoLocationSelector } from '@/components/business/GeoLocationSelector';
```

## Migration Strategy for Existing Data

### Step 1: Backup Existing Data
```sql
-- Create backup of current business addresses
CREATE TABLE businesses_backup AS SELECT * FROM businesses;
```

### Step 2: Geographic ID Assignment
```sql
-- Example migration script for Hua Hin businesses
UPDATE businesses 
SET 
  province_id = '11111111-1111-1111-1111-111111111111',  -- Prachuap Khiri Khan
  district_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',   -- Hua Hin District
  sub_district_id = '11111111-aaaa-aaaa-aaaa-111111111111' -- Hua Hin Sub-district
WHERE address ILIKE '%hua hin%';
```

### Step 3: Validation & Cleanup
```sql
-- Verify all active businesses have geographic assignment
SELECT COUNT(*) FROM businesses 
WHERE partnership_status = 'active' 
AND (province_id IS NULL OR district_id IS NULL);
```

## Performance Considerations

### Indexing Strategy
```sql
-- Geographic hierarchy indexes (already included in migration)
CREATE INDEX idx_businesses_province_id ON businesses(province_id);
CREATE INDEX idx_businesses_district_id ON businesses(district_id);
CREATE INDEX idx_businesses_sub_district_id ON businesses(sub_district_id);

-- Composite indexes for common queries
CREATE INDEX idx_businesses_geo_status ON businesses(province_id, district_id, status);
```

### Query Optimization
- Use geographic IDs instead of text-based address filtering
- Leverage the `business_locations` view for full address display
- Implement proper caching for geographic data (rarely changes)

## Future Enhancements

### 1. Map Integration
- Define geographic boundaries for each administrative division
- Enable map-based filtering and exploration
- Implement geofencing for location-based notifications

### 2. Advanced Analytics
```sql
-- Business density analysis
SELECT 
  p.name_en as province,
  d.name_en as district,
  COUNT(b.id) as business_count
FROM businesses b
JOIN districts d ON b.district_id = d.id
JOIN provinces p ON d.province_id = p.id
WHERE b.partnership_status = 'active'
GROUP BY p.id, d.id
ORDER BY business_count DESC;
```

### 3. Localization Features
- Route-based language switching (Thai/English)
- Cultural region-specific recommendations
- Local holiday and event integration

## Support & Maintenance

### Data Updates
- Administrative boundaries rarely change but should be monitored
- Postal code updates can be managed through the `postal_codes` array
- New LDP area expansion follows the established pattern

### Common Issues & Solutions

**Issue**: Businesses not appearing in geographic filters
**Solution**: Check that businesses have proper `province_id`, `district_id` assignments

**Issue**: Dropdown not populating districts
**Solution**: Verify province selection and check network connectivity

**Issue**: Address parsing from Google Places not working
**Solution**: Ensure address components mapping is correctly configured for Thailand format

## Conclusion

This geographic hierarchy implementation provides LocalPlus with:
- **Precision**: Exact location targeting at sub-district level
- **Performance**: Fast, indexed queries instead of text parsing
- **Scalability**: Clear framework for expanding to new regions
- **User Experience**: Intuitive, familiar navigation using official Thai administrative terms
- **Business Intelligence**: Granular analytics and targeted marketing capabilities

The system is production-ready for LDP priority areas and provides a solid foundation for nationwide expansion. 