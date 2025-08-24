// [2025-01-06 14:30 UTC] - Enhanced restaurant categorization for Thai coastal areas
// Tier-based system prioritizing local market preferences
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var CUISINE_TIERS = {
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
};
export var DINING_STYLES = {
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
};
export var DIETARY_FILTERS = [
    { value: 'halal', label: 'Halal Certified', icon: '🕌' },
    { value: 'vegetarian', label: 'Vegetarian Options', icon: '🥬' },
    { value: 'vegan', label: 'Vegan Options', icon: '🌱' },
    { value: 'gluten-free', label: 'Gluten-Free Options', icon: '🌾' },
    { value: 'spicy', label: 'Spicy Available', icon: '🌶️' },
    { value: 'kid-friendly', label: 'Kid-Friendly', icon: '👶' }
];
export var SPECIAL_FEATURES = [
    { value: 'beachfront-view', label: 'Beach/Sea View', icon: '🌊' },
    { value: 'live-music', label: 'Live Music', icon: '🎵' },
    { value: 'air-conditioning', label: 'Air Conditioning', icon: '❄️' },
    { value: 'outdoor-seating', label: 'Outdoor Seating', icon: '🌴' },
    { value: 'parking', label: 'Parking Available', icon: '🚗' },
    { value: 'delivery', label: 'Delivery Available', icon: '🛵' },
    { value: 'reservations', label: 'Accepts Reservations', icon: '📞' },
    { value: 'groups', label: 'Large Groups Welcome', icon: '👥' }
];
// Flatten all cuisines for easy access
export var ALL_CUISINES = __spreadArray(__spreadArray(__spreadArray([], CUISINE_TIERS.tier1, true), CUISINE_TIERS.tier2, true), CUISINE_TIERS.tier3, true);
export var ALL_DINING_STYLES = __spreadArray(__spreadArray([], DINING_STYLES.coastal, true), DINING_STYLES.traditional, true);
// Priority order for filtering UI
export var CUISINE_PRIORITY_ORDER = [
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
];
export var DINING_STYLE_PRIORITY_ORDER = [
    'beachfront',
    'casual',
    'fine-dining',
    'night-market',
    'food-court',
    'street-side',
    'fast-food'
];
