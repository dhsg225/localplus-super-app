// [2025-01-06 14:30 UTC] - Enhanced restaurant categorization for Thai coastal areas
// Tier-based system prioritizing local market preferences

export const CUISINE_TIERS = {
  // Tier 1 - Essential for Thai coastal areas
  tier1: [
    { value: 'thai-traditional', label: 'Thai Traditional', description: 'Som tam, larb, pad thai, authentic curry' },
    { value: 'fresh-seafood', label: 'Fresh Seafood', description: 'Grilled fish, prawns, crab, oysters' },
    { value: 'street-food', label: 'Street Food', description: 'Local vendors, authentic Thai snacks' },
    { value: 'chinese-thai', label: 'Chinese-Thai', description: 'Wonton noodles, fried rice, Chinese-influenced' },
    { value: 'international', label: 'International', description: 'Western comfort food for expats/tourists' }
  ],
  
  // Tier 2 - Important (High Demand)
  tier2: [
    { value: 'indian', label: 'Indian', description: 'Curry, naan, tandoori - strong expat community' },
    { value: 'japanese', label: 'Japanese', description: 'Sushi, ramen, tempura - popular with tourists' },
    { value: 'italian', label: 'Italian', description: 'Pizza, pasta - tourist staple' },
    { value: 'fusion', label: 'Fusion', description: 'Thai-Western combinations, creative cuisine' },
    { value: 'bbq-grill', label: 'BBQ & Grill', description: 'Grilled meats, beach-style BBQ' }
  ],
  
  // Tier 3 - Growing Market
  tier3: [
    { value: 'korean', label: 'Korean', description: 'Korean BBQ, kimchi, emerging popularity' },
    { value: 'vietnamese', label: 'Vietnamese', description: 'Pho, fresh rolls, banh mi' },
    { value: 'halal', label: 'Halal', description: 'Muslim-friendly, growing tourism segment' },
    { value: 'vegetarian-vegan', label: 'Vegetarian/Vegan', description: 'Plant-based, health-conscious tourists' },
    { value: 'cafe-coffee', label: 'Cafe & Coffee', description: 'Coffee shops, light meals, co-working spaces' }
  ]
} as const;

export const DINING_STYLES = {
  // Coastal-specific dining experiences
  coastal: [
    { value: 'beachfront', label: 'Beachfront/Waterfront', description: 'Sea views, beach access, sunset dining' },
    { value: 'night-market', label: 'Night Market', description: 'Hua Hin Night Market, Cicada Market style' },
    { value: 'food-court', label: 'Food Court', description: 'Market Village, local market food courts' }
  ],
  
  // Traditional dining styles
  traditional: [
    { value: 'fine-dining', label: 'Fine Dining', description: 'Resort-style, upscale atmosphere' },
    { value: 'casual', label: 'Casual Dining', description: 'Relaxed family-friendly atmosphere' },
    { value: 'street-side', label: 'Street-side', description: 'Local roadside eateries' },
    { value: 'fast-food', label: 'Fast Food', description: 'Quick service, takeaway options' }
  ]
} as const;

export const DIETARY_FILTERS = [
  { value: 'halal', label: 'Halal Certified', icon: '🕌' },
  { value: 'vegetarian', label: 'Vegetarian Options', icon: '🥬' },
  { value: 'vegan', label: 'Vegan Options', icon: '🌱' },
  { value: 'gluten-free', label: 'Gluten-Free Options', icon: '🌾' },
  { value: 'spicy', label: 'Spicy Available', icon: '🌶️' },
  { value: 'kid-friendly', label: 'Kid-Friendly', icon: '👶' }
] as const;

export const SPECIAL_FEATURES = [
  { value: 'beachfront-view', label: 'Beach/Sea View', icon: '🌊' },
  { value: 'live-music', label: 'Live Music', icon: '🎵' },
  { value: 'air-conditioning', label: 'Air Conditioning', icon: '❄️' },
  { value: 'outdoor-seating', label: 'Outdoor Seating', icon: '🌴' },
  { value: 'parking', label: 'Parking Available', icon: '🚗' },
  { value: 'delivery', label: 'Delivery Available', icon: '🛵' },
  { value: 'reservations', label: 'Accepts Reservations', icon: '📞' },
  { value: 'groups', label: 'Large Groups Welcome', icon: '👥' }
] as const;

// Flatten all cuisines for easy access
export const ALL_CUISINES = [
  ...CUISINE_TIERS.tier1,
  ...CUISINE_TIERS.tier2,
  ...CUISINE_TIERS.tier3
] as const;

export const ALL_DINING_STYLES = [
  ...DINING_STYLES.coastal,
  ...DINING_STYLES.traditional
] as const;

// Priority order for filtering UI
export const CUISINE_PRIORITY_ORDER = [
  'thai-traditional',
  'fresh-seafood', 
  'indian',
  'italian',
  'japanese',
  'street-food',
  'chinese-thai',
  'international',
  'fusion',
  'bbq-grill',
  'korean',
  'vietnamese',
  'halal',
  'vegetarian-vegan',
  'cafe-coffee'
] as const;

export const DINING_STYLE_PRIORITY_ORDER = [
  'beachfront',
  'casual',
  'fine-dining',
  'night-market',
  'food-court',
  'street-side',
  'fast-food'
] as const; 