// [2024-05-10 17:30 UTC] - Advertising Module Types

export interface Advertisement {
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
  priority: number; // 1-10, higher = more priority
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetAudience?: TargetAudience;
  metrics?: AdMetrics;
  styling?: AdStyling;
}

export type AdCategory = 
  | 'dining'
  | 'entertainment' 
  | 'services'
  | 'retail'
  | 'travel'
  | 'wellness'
  | 'technology'
  | 'finance'
  | 'education'
  | 'real-estate'
  | 'automotive'
  | 'internal-promotion';

export type AdPlacement = 
  | 'homepage-hero'
  | 'homepage-cards'
  | 'restaurants-top'
  | 'restaurants-bottom'
  | 'events-sidebar'
  | 'services-banner'
  | 'cuisine-explorer'
  | 'deals-section'
  | 'passport-page'
  | 'profile-page'
  | 'loyalty-cards'
  | 'business-dashboard'
  | 'floating-banner'
  | 'modal-overlay';

export interface TargetAudience {
  ageRange?: [number, number];
  interests?: string[];
  location?: string[];
  userType?: 'consumer' | 'business' | 'both';
  subscriptionTier?: 'free' | 'premium' | 'business';
}

export interface AdMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  lastUpdated: Date;
}

export interface AdStyling {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  shadow?: string;
  gradient?: string;
  animation?: 'none' | 'pulse' | 'glow' | 'slide';
}

export interface AdDisplayOptions {
  placement: AdPlacement;
  maxAds?: number;
  showOnlyInternal?: boolean;
  showOnlyExternal?: boolean;
  categoryFilter?: AdCategory[];
  priorityThreshold?: number;
}

export interface AdAnalytics {
  adId: string;
  userId?: string;
  action: 'impression' | 'click' | 'conversion';
  timestamp: Date;
  placement: AdPlacement;
  metadata?: Record<string, any>;
} 