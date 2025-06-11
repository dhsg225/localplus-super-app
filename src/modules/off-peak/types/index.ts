export interface OffPeakDeal {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  cuisine: string;
  location: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  timeSlots: TimeSlot[];
  availableDates: string[];
  dealType: 'early-bird' | 'afternoon' | 'late-night';
  description: string;
  terms: string[];
  paxOptions: number[];
  isPopular?: boolean;
  isLimitedTime?: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  remainingSeats: number;
  maxSeats: number;
}

export interface OffPeakFilters {
  cuisine: string[];
  location: string[];
  dealType: string[];
  priceRange: {
    min: number;
    max: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
  pax: number;
}

export interface OffPeakBooking {
  id: string;
  dealId: string;
  timeSlotId: string;
  date: string;
  pax: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  bookingReference: string;
} 