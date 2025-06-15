export interface BusinessProfile {
  id: string;
  name: string;
  description: string;
  category: 'restaurant' | 'event' | 'service';
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: BusinessImage[];
  openingHours: OpeningHours;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    line?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessImage {
  id: string;
  url: string;
  caption?: string;
  isMain: boolean;
  order: number;
  uploadedAt: Date;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface RestaurantProfile extends BusinessProfile {
  cuisine: string[];
  priceRange: 'budget' | 'mid-range' | 'upscale' | 'fine-dining';
  diningStyle: string[];
  hasReservation: boolean;
  hasDelivery: boolean;
  hasBeachfront: boolean;
  isHalal: boolean;
  menu: MenuItem[];
  offPeakDeals: BusinessOffPeakDeal[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  allergens?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface BusinessOffPeakDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  dealType: 'early-bird' | 'afternoon' | 'late-night';
  validDays: string[]; // ['monday', 'tuesday', ...]
  startTime: string;
  endTime: string;
  maxSeats: number;
  terms: string[];
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
}

export type FormMode = 'create' | 'edit';

export interface BusinessFormProps {
  mode: FormMode;
  initialData?: Partial<BusinessProfile>;
  onSubmit: (data: BusinessProfile) => Promise<void>;
  onCancel: () => void;
}

export interface BusinessManagementSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  isEnabled: boolean;
}

export interface BusinessAnalytics {
  id: string;
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  views: number;
  bookings: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
  date: Date;
}

export interface BusinessNotification {
  id: string;
  businessId: string;
  type: 'booking' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionRequired: boolean;
  createdAt: Date;
} 