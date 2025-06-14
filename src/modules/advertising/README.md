# Advertising Module

A comprehensive advertising system for LocalPlus that supports both internal promotions and external advertisements with analytics tracking.

## Features

### 🎯 Advertisement Types
- **Internal Promotions**: Off Peak Dining, Savings Passport, etc.
- **External Ads**: Third-party business advertisements
- **Mixed Display**: Seamlessly blend internal and external content

### 📍 Placement System
- `homepage-hero` - Hero section on homepage
- `homepage-cards` - Card grid on homepage  
- `restaurants-top` - Top banner on restaurants page
- `restaurants-bottom` - Bottom section on restaurants page
- `events-sidebar` - Sidebar on events page
- `services-banner` - Banner on services page
- `cuisine-explorer` - Cuisine exploration section
- `deals-section` - Deals and offers section
- `passport-page` - Passport/subscription page
- `profile-page` - User profile page
- `loyalty-cards` - Loyalty cards section
- `business-dashboard` - Business management area
- `floating-banner` - Floating overlay banners
- `modal-overlay` - Modal advertisements

### 🎨 Display Types
- **Card Style**: Compact cards with images and CTAs
- **Banner Style**: Horizontal banners for prominent placement
- **Sizes**: Small, Medium, Large variants

### 📊 Analytics & Tracking
- **Impressions**: Track when ads are displayed
- **Clicks**: Track user interactions
- **Conversions**: Track completed actions
- **CTR Calculation**: Click-through rate metrics
- **Real-time Analytics**: Live performance data

### 🎛️ Targeting & Filtering
- **Category Filtering**: dining, wellness, technology, etc.
- **Audience Targeting**: Age, interests, location, user type
- **Priority System**: 1-10 priority levels
- **Date Ranges**: Start/end date scheduling
- **Status Control**: Active/inactive toggle

## Components

### AdContainer
Main component for displaying advertisements with filtering and rotation.

```tsx
<AdContainer 
  placement="homepage-cards"
  maxAds={3}
  showOnlyInternal={false}
  showOnlyExternal={false}
  categoryFilter={['dining', 'wellness']}
  size="medium"
  displayType="card"
  rotationInterval={30}
/>
```

### AdCard
Individual advertisement card component.

```tsx
<AdCard 
  ad={advertisement}
  placement="homepage-cards"
  size="medium"
  showImage={true}
/>
```

### AdBanner
Horizontal banner advertisement component.

```tsx
<AdBanner 
  ad={advertisement}
  placement="restaurants-top"
  dismissible={true}
  onDismiss={() => handleDismiss()}
/>
```

### AdManagementDashboard
Admin interface for managing advertisements.

```tsx
<AdManagementDashboard />
```

## Usage Examples

### Homepage Integration
```tsx
// Featured offers section
<AdContainer 
  placement="homepage-cards"
  maxAds={3}
  className="space-y-4"
  size="medium"
/>

// External ads only
<AdContainer 
  placement="homepage-cards"
  maxAds={2}
  showOnlyExternal={true}
  displayType="banner"
/>
```

### Restaurant Page Integration
```tsx
// Top banner
<AdContainer 
  placement="restaurants-top"
  maxAds={1}
  categoryFilter={['dining', 'internal-promotion']}
  size="large"
/>

// Bottom section
<AdContainer 
  placement="restaurants-bottom"
  maxAds={1}
  categoryFilter={['technology', 'services']}
  size="medium"
/>
```

## Data Structure

### Advertisement Interface
```typescript
interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl?: string;
  ctaAction?: () => void;
  type: 'internal' | 'external';
  category: AdCategory;
  placement: AdPlacement[];
  priority: number; // 1-10
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: TargetAudience;
  metrics?: AdMetrics;
  styling?: AdStyling;
}
```

## Analytics Integration

### Tracking Events
```typescript
// Track impression
trackAdInteraction(adId, 'impression', placement);

// Track click
trackAdInteraction(adId, 'click', placement);

// Track conversion
trackConversion(adId, placement, userId);
```

### Getting Metrics
```typescript
// Get ad performance
const metrics = getAdMetrics(adId);
console.log(`CTR: ${metrics.ctr}%`);

// Get placement performance
const placementMetrics = getPlacementMetrics('homepage-cards');
```

## Styling System

### Custom Styling
```typescript
const adStyling: AdStyling = {
  backgroundColor: '#FEF3C7',
  textColor: '#92400E',
  accentColor: '#F59E0B',
  borderRadius: '12px',
  gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
  animation: 'pulse'
};
```

### Animation Options
- `none` - No animation
- `pulse` - Pulsing effect
- `glow` - Glowing effect  
- `slide` - Sliding animation

## Admin Features

### Management Dashboard
- View all advertisements
- Filter by type (internal/external)
- Toggle active/inactive status
- View performance analytics
- Edit advertisement details
- Delete advertisements

### Analytics Dashboard
- Real-time metrics
- Performance comparisons
- Placement effectiveness
- Revenue tracking (future)

## Integration Points

### Current Integrations
- ✅ HomePage - Featured offers section
- ✅ RestaurantsPage - Top and bottom placements
- ✅ Admin Dashboard - Management interface

### Planned Integrations
- 🔄 EventsPage - Sidebar advertisements
- 🔄 ServicesPage - Banner placements
- 🔄 PassportPage - Subscription promotions
- 🔄 ProfilePage - Personalized offers

## Testing

### Showcase Page
Visit `/ad-showcase` to see all advertisement types and placements in action.

### Console Logging
All analytics events are logged to the browser console for debugging.

## Future Enhancements

### Revenue Tracking
- Cost-per-click (CPC) pricing
- Revenue attribution
- ROI calculations

### Advanced Targeting
- Behavioral targeting
- Location-based ads
- Time-based scheduling

### A/B Testing
- Multiple ad variants
- Performance comparison
- Automatic optimization

### External Integration
- Google Ads integration
- Facebook Ads integration
- Third-party ad networks

## File Structure

```
src/modules/advertising/
├── components/
│   ├── AdCard.tsx
│   ├── AdBanner.tsx
│   ├── AdContainer.tsx
│   ├── AdManagementDashboard.tsx
│   └── AdShowcase.tsx
├── data/
│   └── mockAds.ts
├── hooks/
│   └── useAds.ts
├── services/
│   └── adAnalytics.ts
├── types/
│   └── index.ts
├── index.ts
└── README.md
``` 