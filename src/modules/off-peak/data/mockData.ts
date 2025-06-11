import { OffPeakDeal } from '../types';

// Generate date strings for the next 30 days
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const availableDates = generateAvailableDates();

export const mockOffPeakDeals: OffPeakDeal[] = [
  {
    id: 'off-peak-1',
    restaurantId: 'rest-1',
    restaurantName: 'Sirocco Sky Bar',
    restaurantImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'International',
    location: 'Bangkok',
    rating: 4.8,
    reviewCount: 2150,
    originalPrice: 1800,
    discountedPrice: 1260,
    discountPercentage: 30,
    dealType: 'late-night',
    description: 'Experience breathtaking city views at one of Bangkok\'s most iconic rooftop restaurants with premium international cuisine.',
    terms: [
      'Valid for dinner only',
      'Smart casual dress code required',
      'Subject to weather conditions',
      'Non-refundable booking'
    ],
    paxOptions: [2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-1-1', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 12, maxSeats: 20 },
      { id: 'slot-1-2', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 8, maxSeats: 20 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-2',
    restaurantId: 'rest-2',
    restaurantName: 'Blue Elephant',
    restaurantImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Thai',
    location: 'Phuket',
    rating: 4.6,
    reviewCount: 1850,
    originalPrice: 950,
    discountedPrice: 665,
    discountPercentage: 30,
    dealType: 'early-bird',
    description: 'Authentic Royal Thai cuisine in an elegant colonial mansion setting with traditional cooking classes available.',
    terms: [
      'Early bird special',
      'Includes welcome drink',
      'Advance booking required',
      'Cancellation 24hrs prior'
    ],
    paxOptions: [2, 4, 6, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-2-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 15, maxSeats: 25 },
      { id: 'slot-2-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 20, maxSeats: 25 },
    ],
    isPopular: false,
    isLimitedTime: true
  },
  {
    id: 'off-peak-3',
    restaurantId: 'rest-3',
    restaurantName: 'Sunset Grill Krabi',
    restaurantImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Seafood',
    location: 'Krabi',
    rating: 4.7,
    reviewCount: 1250,
    originalPrice: 780,
    discountedPrice: 468,
    discountPercentage: 40,
    dealType: 'afternoon',
    description: 'Fresh seafood with stunning Andaman Sea views. Perfect for a relaxed afternoon dining experience.',
    terms: [
      'Afternoon dining special',
      'Fresh catch of the day included',
      'Beachfront seating subject to availability',
      'Valid for lunch and early dinner'
    ],
    paxOptions: [2, 3, 4, 5, 6, 7, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-3-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 10, maxSeats: 15 },
      { id: 'slot-3-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 12, maxSeats: 15 },
      { id: 'slot-3-3', startTime: '17:30', endTime: '19:00', isAvailable: false, remainingSeats: 0, maxSeats: 15 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-4',
    restaurantId: 'rest-4',
    restaurantName: 'Nobu Samui',
    restaurantImage: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Japanese',
    location: 'Samui',
    rating: 4.9,
    reviewCount: 980,
    originalPrice: 2200,
    discountedPrice: 1540,
    discountPercentage: 30,
    dealType: 'early-bird',
    description: 'World-renowned Japanese cuisine with innovative flavors in a tropical island setting.',
    terms: [
      'Omakase menu included',
      'Sake pairing available',
      'Chef\'s table seating on request',
      'Dress code: Smart casual'
    ],
    paxOptions: [2, 4, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-4-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 6, maxSeats: 12 },
      { id: 'slot-4-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 8, maxSeats: 12 },
    ],
    isPopular: true,
    isLimitedTime: true
  },
  {
    id: 'off-peak-5',
    restaurantId: 'rest-5',
    restaurantName: 'Hua Hin Hills',
    restaurantImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'International',
    location: 'Hua Hin',
    rating: 4.5,
    reviewCount: 1450,
    originalPrice: 680,
    discountedPrice: 476,
    discountPercentage: 30,
    dealType: 'afternoon',
    description: 'Hilltop dining with panoramic views of Hua Hin coastline. Perfect for afternoon tea and light meals.',
    terms: [
      'Afternoon set menu',
      'Includes coffee/tea',
      'Scenic views guaranteed',
      'Free shuttle from city center'
    ],
    paxOptions: [2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-5-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 18, maxSeats: 30 },
      { id: 'slot-5-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 25, maxSeats: 30 },
    ],
    isPopular: false,
    isLimitedTime: false
  },
  {
    id: 'off-peak-6',
    restaurantId: 'rest-6',
    restaurantName: 'Night Bazaar Kitchen',
    restaurantImage: 'https://images.unsplash.com/photo-1552566681-b5c7a47d1201?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Thai',
    location: 'Pattaya',
    rating: 4.4,
    reviewCount: 2100,
    originalPrice: 420,
    discountedPrice: 210,
    discountPercentage: 50,
    dealType: 'late-night',
    description: 'Authentic street food experience with a modern twist. Late night dining with live cooking stations.',
    terms: [
      'Late night special',
      'All-you-can-eat option',
      'Live cooking demonstrations',
      'Minimum 2 people required'
    ],
    paxOptions: [2, 4, 6, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-6-1', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 30, maxSeats: 50 },
      { id: 'slot-6-2', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 35, maxSeats: 50 },
      { id: 'slot-6-3', startTime: '00:00', endTime: '01:30', isAvailable: true, remainingSeats: 40, maxSeats: 50 },
    ],
    isPopular: true,
    isLimitedTime: true
  },
  {
    id: 'off-peak-7',
    restaurantId: 'rest-7',
    restaurantName: 'La Scala Bangkok',
    restaurantImage: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian',
    location: 'Bangkok',
    rating: 4.6,
    reviewCount: 1750,
    originalPrice: 1200,
    discountedPrice: 840,
    discountPercentage: 30,
    dealType: 'early-bird',
    description: 'Authentic Italian cuisine with fresh imported ingredients and an extensive wine cellar.',
    terms: [
      'Wine pairing included',
      'Fresh pasta made daily',
      'Private dining rooms available',
      'Chef recommendation menu'
    ],
    paxOptions: [2, 4, 6, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-7-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 14, maxSeats: 20 },
      { id: 'slot-7-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 16, maxSeats: 20 },
    ],
    isPopular: false,
    isLimitedTime: false
  },
  {
    id: 'off-peak-8',
    restaurantId: 'rest-8',
    restaurantName: 'Kimchi House',
    restaurantImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Korean',
    location: 'Bangkok',
    rating: 4.3,
    reviewCount: 890,
    originalPrice: 580,
    discountedPrice: 348,
    discountPercentage: 40,
    dealType: 'afternoon',
    description: 'Authentic Korean BBQ and traditional dishes in a cozy atmosphere with premium beef selections.',
    terms: [
      'Premium beef cuts included',
      'Unlimited banchan',
      'Korean BBQ experience',
      'Soju pairing available'
    ],
    paxOptions: [2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-8-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 20, maxSeats: 25 },
      { id: 'slot-8-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 22, maxSeats: 25 },
    ],
    isPopular: false,
    isLimitedTime: true
  }
]; 