// Business Onboarding Module Types
export type BusinessType = 'restaurant' | 'event-organizer' | 'service-provider' | 'other';

export type RestaurantType = 'fine-dining' | 'casual' | 'beachfront' | 'night-market' | 'food-court' | 'cafe' | 'fast-food' | 'street-food';
export type PriceRange = '฿' | '฿฿' | '฿฿฿' | '฿฿฿฿';

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface BusinessOnboardingData {
  // Step 1: Business Type
  businessType: BusinessType;
  otherBusinessType?: string;

  // Step 2: Basic Information
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  
  // Restaurant specific
  restaurantType?: RestaurantType;
  priceRange?: PriceRange;
  offersTodaysDeals?: boolean;
  
  // Event organizer specific
  venueName?: string;
  listingType?: 'individual-events' | 'venue-listing';
  
  // Service provider specific
  servicesOffered?: string[];

  // Step 3: Location & Hours
  address: string;
  city: string;
  district?: string;
  googleMapsLink?: string;
  operatingHours: OperatingHours[];

  // Step 4: Description & Media
  shortDescription: string;
  detailedDescription?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  logoFile?: File;
  photos?: File[];
  menuPhotos?: File[];

  // Agreements
  agreedToTerms: boolean;
}

export interface OnboardingFormState {
  currentStep: number;
  totalSteps: number;
  data: Partial<BusinessOnboardingData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export type OnboardingStepComponent = 'BusinessTypeStep' | 'BasicInfoStep' | 'LocationStep' | 'MediaStep' | 'ConfirmationStep'; 