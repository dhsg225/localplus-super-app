import { 
  PassportUser, 
  PassportBadge, 
  DistrictChallenge, 
  CuisineChallenge, 
  PassportActivity, 
  SavedDeal, 
  SubscriptionTier, 
  PassportStats 
} from '../types';

// Mock Current User
export const mockPassportUser: PassportUser = {
  id: 'b3e1c2d4-1234-5678-9abc-def012345678',
  email: 'foodie@localplus.co.th',
  firstName: 'Siriporn',
  lastName: 'Tanaka',
  subscriptionTier: 'premium',
  subscriptionEndDate: new Date('2025-01-15'),
  stamps: 47,
  level: 'silver',
  badges: [],
  joinedDate: new Date('2024-08-15'),
  lastActivity: new Date()
};

// Available Badges
export const mockPassportBadges: PassportBadge[] = [
  // District Badges
  {
    id: 'badge-silom-master',
    name: 'Silom Master',
    description: 'Visited 5 different restaurants in Silom district',
    icon: '🏢',
    category: 'district',
    rarity: 'common',
    unlockedAt: new Date('2024-11-20'),
    requirements: [
      { type: 'district_complete', value: 5, description: 'Visit 5 restaurants in Silom', completed: true }
    ]
  },
  {
    id: 'badge-sathorn-explorer',
    name: 'Sathorn Explorer',
    description: 'Discovered 5 restaurants in trendy Sathorn',
    icon: '🌆',
    category: 'district',
    rarity: 'common',
    unlockedAt: new Date('2024-12-01'),
    requirements: [
      { type: 'district_complete', value: 5, description: 'Visit 5 restaurants in Sathorn', completed: true }
    ]
  },
  {
    id: 'badge-thonglor-trendsetter',
    name: 'Thonglor Trendsetter',
    description: 'Conquered the hip Thonglor dining scene',
    icon: '✨',
    category: 'district',
    rarity: 'rare',
    unlockedAt: new Date('2024-12-10'),
    requirements: [
      { type: 'district_complete', value: 8, description: 'Visit 8 restaurants in Thonglor', completed: true }
    ]
  },

  // Cuisine Badges
  {
    id: 'badge-thai-expert',
    name: 'Thai Expert',
    description: 'Experienced authentic Thai cuisine at 10 restaurants',
    icon: '🇹🇭',
    category: 'cuisine',
    rarity: 'rare',
    unlockedAt: new Date('2024-11-25'),
    requirements: [
      { type: 'cuisine_tries', value: 10, description: 'Try Thai cuisine 10 times', completed: true }
    ]
  },
  {
    id: 'badge-fusion-fanatic',
    name: 'Fusion Fanatic',
    description: 'Explored modern fusion dining 5 times',
    icon: '🎨',
    category: 'cuisine',
    rarity: 'common',
    unlockedAt: new Date('2024-12-05'),
    requirements: [
      { type: 'cuisine_tries', value: 5, description: 'Try fusion cuisine 5 times', completed: true }
    ]
  },

  // Frequency Badges
  {
    id: 'badge-weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Booked deals 10 weekends in a row',
    icon: '⚔️',
    category: 'frequency',
    rarity: 'epic',
    unlockedAt: new Date('2024-12-08'),
    requirements: [
      { type: 'streak', value: 10, description: 'Book on 10 consecutive weekends', completed: true }
    ]
  },
  {
    id: 'badge-early-bird',
    name: 'Early Bird Champion',
    description: 'Used 20 early bird deals',
    icon: '🌅',
    category: 'frequency',
    rarity: 'rare',
    unlockedAt: new Date('2024-11-30'),
    requirements: [
      { type: 'visits', value: 20, description: 'Use 20 early bird deals', completed: true }
    ]
  },

  // Special Badges
  {
    id: 'badge-first-booking',
    name: 'First Steps',
    description: 'Made your first LocalPlus booking',
    icon: '👶',
    category: 'special',
    rarity: 'common',
    unlockedAt: new Date('2024-08-16'),
    requirements: [
      { type: 'visits', value: 1, description: 'Make your first booking', completed: true }
    ]
  },
  {
    id: 'badge-premium-member',
    name: 'Premium Explorer',
    description: 'Upgraded to LocalPlus Premium',
    icon: '💎',
    category: 'special',
    rarity: 'rare',
    unlockedAt: new Date('2024-09-01'),
    requirements: [
      { type: 'visits', value: 1, description: 'Upgrade to Premium', completed: true }
    ]
  },

  // Seasonal Badges  
  {
    id: 'badge-songkran-2024',
    name: 'Songkran Foodie 2024',
    description: 'Celebrated Songkran with special dining deals',
    icon: '💦',
    category: 'seasonal',
    rarity: 'legendary',
    unlockedAt: new Date('2024-04-15'),
    requirements: [
      { type: 'visits', value: 3, description: 'Book 3 deals during Songkran', completed: true }
    ]
  }
];

// Set earned badges on user
mockPassportUser.badges = mockPassportBadges.filter(badge => badge.unlockedAt <= new Date());

// District Challenges
export const mockDistrictChallenges: DistrictChallenge[] = [
  {
    id: 'challenge-silom',
    name: 'Silom Business District',
    district: 'Silom',
    description: 'Experience the diverse dining scene in Bangkok\'s financial heart',
    totalRestaurants: 5,
    visitedRestaurants: ['1', '2', '5'], // restaurant IDs
    progress: 60,
    isCompleted: true,
    completedAt: new Date('2024-11-20'),
    reward: {
      type: 'badge',
      value: 'badge-silom-master',
      description: 'Silom Master badge + 5 bonus stamps'
    }
  },
  {
    id: 'challenge-sathorn',
    name: 'Sathorn Sophistication',
    district: 'Sathorn',
    description: 'Discover upscale dining in modern Sathorn',
    totalRestaurants: 5,
    visitedRestaurants: ['3', '4'], 
    progress: 40,
    isCompleted: false,
    reward: {
      type: 'badge',
      value: 'badge-sathorn-explorer',
      description: 'Sathorn Explorer badge + 10% off next booking'
    }
  },
  {
    id: 'challenge-thonglor',
    name: 'Thonglor Trendy Scene',
    district: 'Thonglor',
    description: 'Explore the hippest restaurants in trendy Thonglor',
    totalRestaurants: 8,
    visitedRestaurants: ['6'],
    progress: 12.5,
    isCompleted: false,
    reward: {
      type: 'badge',
      value: 'badge-thonglor-trendsetter',
      description: 'Thonglor Trendsetter badge + Premium deal access'
    }
  },
  {
    id: 'challenge-asoke',
    name: 'Asoke Junction',
    district: 'Asoke',
    description: 'Navigate the bustling intersection of flavors',
    totalRestaurants: 6,
    visitedRestaurants: [],
    progress: 0,
    isCompleted: false,
    reward: {
      type: 'stamps',
      value: 15,
      description: '15 bonus stamps + featured restaurant access'
    }
  }
];

// Cuisine Challenges
export const mockCuisineCallenges: CuisineChallenge[] = [
  {
    id: 'challenge-thai-master',
    name: 'Thai Cuisine Master',
    cuisine: 'Thai',
    description: 'Become an expert in authentic Thai flavors',
    targetCount: 10,
    currentCount: 8,
    visitedRestaurants: ['1', '2', '5', '6', '7', '8', '9', '10'],
    isCompleted: false,
    reward: {
      type: 'badge',
      value: 'badge-thai-expert',
      description: 'Thai Expert badge + exclusive Thai restaurant deals'
    }
  },
  {
    id: 'challenge-seafood-explorer',
    name: 'Seafood Explorer',
    cuisine: 'Seafood',
    description: 'Dive deep into Thailand\'s amazing seafood scene',
    targetCount: 5,
    currentCount: 2,
    visitedRestaurants: ['3', '7'],
    isCompleted: false,
    reward: {
      type: 'premium_deal',
      value: 'seafood-weekend-special',
      description: 'Exclusive 60% off seafood weekend deals'
    }
  }
];

// Recent Activities
export const mockPassportActivities: PassportActivity[] = [
  {
    id: 'activity-1',
    type: 'badge_earned',
    description: 'Earned "Weekend Warrior" badge',
    stampsEarned: 5,
    pointsEarned: 50,
    badgeEarned: mockPassportBadges.find(b => b.id === 'badge-weekend-warrior'),
    createdAt: new Date('2024-12-08T18:30:00')
  },
  {
    id: 'activity-2', 
    type: 'booking_completed',
    description: 'Completed booking at The Spice Merchant',
    stampsEarned: 2,
    pointsEarned: 20,
    restaurantName: 'The Spice Merchant',
    dealType: 'Afternoon 55% Off',
    createdAt: new Date('2024-12-07T15:30:00')
  },
  {
    id: 'activity-3',
    type: 'review_written',
    description: 'Wrote review for Siam Bistro',
    stampsEarned: 1,
    pointsEarned: 10,
    restaurantName: 'Siam Bistro',
    createdAt: new Date('2024-12-06T20:15:00')
  },
  {
    id: 'activity-4',
    type: 'deal_redeemed',
    description: 'Used Early Bird deal at Riverfront Grill',
    stampsEarned: 2,
    pointsEarned: 25,
    restaurantName: 'Riverfront Grill',
    dealType: 'Early Bird 40% Off',
    createdAt: new Date('2024-12-05T11:45:00')
  },
  {
    id: 'activity-5',
    type: 'badge_earned',
    description: 'Earned "Thonglor Trendsetter" badge',
    stampsEarned: 10,
    pointsEarned: 100,
    badgeEarned: mockPassportBadges.find(b => b.id === 'badge-thonglor-trendsetter'),
    createdAt: new Date('2024-12-01T14:20:00')
  }
];

// Saved Deals
export const mockSavedDeals: SavedDeal[] = [
  {
    id: 'saved-1',
    dealId: 'deal-123',
    restaurantName: 'The Spice Merchant',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    discountPercentage: 55,
    dealType: 'afternoon',
    description: 'Perfect for a relaxed afternoon dining experience',
    expiresAt: new Date('2024-12-31T23:59:59'),
    savedAt: new Date('2024-12-01T10:00:00'),
    isUsed: false
  },
  {
    id: 'saved-2',
    dealId: 'deal-456',
    restaurantName: 'Ocean Breeze',
    restaurantImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    discountPercentage: 40,
    dealType: 'early-bird',
    description: 'Start your day with fresh seafood',
    expiresAt: new Date('2024-12-25T23:59:59'),
    savedAt: new Date('2024-11-28T15:30:00'),
    isUsed: true,
    usedAt: new Date('2024-12-05T11:45:00')
  },
  {
    id: 'saved-3',
    dealId: 'deal-789',
    restaurantName: 'Golden Spoon',
    restaurantImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    discountPercentage: 60,
    dealType: 'late-night',
    description: 'Premium late night dining experience',
    expiresAt: new Date('2025-01-15T23:59:59'),
    savedAt: new Date('2024-12-10T19:00:00'),
    isUsed: false
  }
];

// Subscription Tiers
export const mockSubscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Passport',
    price: 0,
    currency: 'THB',
    billingPeriod: 'monthly',
    features: [
      'Access to basic deals (up to 25% off)',
      'Save up to 5 deals',
      'Basic restaurant discovery',
      'Stamp collection',
      'Community badges'
    ],
    maxSavedDeals: 5,
    accessLevel: 'basic'
  },
  {
    id: 'premium-monthly',
    name: 'Premium Passport',
    price: 199,
    currency: 'THB',
    billingPeriod: 'monthly',
    features: [
      'Access to exclusive deals (30-60% off)',
      'Unlimited deal bookmarks',
      'Early access to flash deals',
      'Priority booking slots',
      'Ad-free experience',
      'Group booking features',
      'Premium customer support',
      'Exclusive premium badges'
    ],
    maxSavedDeals: -1, // unlimited
    accessLevel: 'premium',
    popularTag: true
  },
  {
    id: 'premium-yearly',
    name: 'Premium Passport Annual',
    price: 1990,
    currency: 'THB',
    billingPeriod: 'yearly',
    features: [
      'All Premium features',
      '17% savings vs monthly',
      'Bonus welcome stamps',
      'Anniversary exclusive deals',
      'VIP customer support'
    ],
    maxSavedDeals: -1, // unlimited
    accessLevel: 'premium'
  }
];

// User Stats
export const mockPassportStats: PassportStats = {
  totalStamps: 47,
  totalBadges: 8,
  totalSavings: 2450, // THB saved
  totalBookings: 23,
  favoriteDistrict: 'Silom',
  favoriteCuisine: 'Thai',
  memberSince: new Date('2024-08-15'),
  currentStreak: 4, // consecutive weeks
  longestStreak: 6 // consecutive weeks
}; 