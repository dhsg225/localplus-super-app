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
    businessType: BusinessType;
    otherBusinessType?: string;
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    category: string;
    restaurantType?: RestaurantType;
    priceRange?: PriceRange;
    offersTodaysDeals?: boolean;
    venueName?: string;
    listingType?: 'individual-events' | 'venue-listing';
    servicesOffered?: string[];
    address: string;
    city: string;
    district?: string;
    googleMapsLink?: string;
    operatingHours: OperatingHours[];
    shortDescription: string;
    detailedDescription?: string;
    website?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    logoFile?: File;
    photos?: File[];
    menuPhotos?: File[];
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
