export interface PassportUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: 'free' | 'premium';
  subscriptionEndDate?: Date;
  stamps: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  badges: PassportBadge[];
  joinedDate: Date;
  lastActivity: Date;
}

export interface PassportBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'district' | 'cuisine' | 'frequency' | 'special' | 'seasonal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  requirements: BadgeRequirement[];
}

export interface BadgeRequirement {
  type: 'visits' | 'spending' | 'reviews' | 'district_complete' | 'cuisine_tries' | 'streak';
  value: number;
  description: string;
  completed: boolean;
}

export interface DistrictChallenge {
  id: string;
  name: string;
  district: string;
  description: string;
  totalRestaurants: number;
  visitedRestaurants: string[];
  progress: number; // 0-100%
  isCompleted: boolean;
  completedAt?: Date;
  reward: ChallengeReward;
}

export interface ChallengeReward {
  type: 'badge' | 'stamps' | 'premium_deal' | 'discount_boost';
  value: string | number;
  description: string;
}

export interface CuisineChallenge {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  targetCount: number;
  currentCount: number;
  visitedRestaurants: string[];
  isCompleted: boolean;
  completedAt?: Date;
  reward: ChallengeReward;
}

export interface PassportActivity {
  id: string;
  type: 'booking_completed' | 'review_written' | 'deal_redeemed' | 'badge_earned' | 'level_up';
  description: string;
  stampsEarned: number;
  pointsEarned: number;
  badgeEarned?: PassportBadge;
  restaurantName?: string;
  dealType?: string;
  createdAt: Date;
}

export interface SavedDeal {
  id: string;
  dealId: string;
  restaurantName: string;
  restaurantImage: string;
  discountPercentage: number;
  dealType: 'early-bird' | 'afternoon' | 'late-night';
  description: string;
  expiresAt: Date;
  savedAt: Date;
  isUsed: boolean;
  usedAt?: Date;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  maxSavedDeals: number;
  accessLevel: 'basic' | 'premium';
  popularTag?: boolean;
}

export interface PassportStats {
  totalStamps: number;
  totalBadges: number;
  totalSavings: number;
  totalBookings: number;
  favoriteDistrict: string;
  favoriteCuisine: string;
  memberSince: Date;
  currentStreak: number;
  longestStreak: number;
} 