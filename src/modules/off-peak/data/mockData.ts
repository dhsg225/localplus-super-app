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
  // Deals for restaurants from the main restaurants page
  {
    id: 'off-peak-1',
    restaurantId: '1',
    restaurantName: 'The Spice Merchant',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Thai',
    location: 'Bangkok',
    rating: 4.7,
    reviewCount: 1850,
    originalPrice: 680,
    discountedPrice: 476,
    discountPercentage: 30,
    dealType: 'early-bird',
    description: 'Authentic Thai cuisine with modern presentation in a cozy, contemporary setting. Special early bird pricing for lunch.',
    terms: [
      'Early bird special',
      'Includes welcome drink',
      'Traditional Thai ambiance',
      'Advance booking recommended'
    ],
    paxOptions: [2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-1-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 15, maxSeats: 25 },
      { id: 'slot-1-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 18, maxSeats: 25 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-2',
    restaurantId: '1',
    restaurantName: 'The Spice Merchant',
    restaurantImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    cuisine: 'Thai',
    location: 'Bangkok',
    rating: 4.7,
    reviewCount: 1850,
    originalPrice: 950,
    discountedPrice: 570,
    discountPercentage: 40,
    dealType: 'late-night',
    description: 'Experience authentic Thai flavors during our late night dining hours with special menu selections.',
    terms: [
      'Late night special menu',
      'Cozy atmosphere',
      'Traditional Thai recipes',
      'Perfect for dinner dates'
    ],
    paxOptions: [2, 4, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-1-3', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 12, maxSeats: 20 },
      { id: 'slot-1-4', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 8, maxSeats: 20 },
    ],
    isPopular: false,
    isLimitedTime: true
  },
  {
    id: 'off-peak-3',
    restaurantId: '2',
    restaurantName: 'Siam Bistro',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    cuisine: 'Fusion',
    location: 'Bangkok',
    rating: 4.6,
    reviewCount: 1450,
    originalPrice: 1200,
    discountedPrice: 840,
    discountPercentage: 30,
    dealType: 'afternoon',
    description: 'Modern fusion dining experience with innovative Asian flavors. Perfect for afternoon dining.',
    terms: [
      'Afternoon fusion menu',
      'Chef recommended dishes',
      'Modern Asian flavors',
      'Wine pairing available'
    ],
    paxOptions: [2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-3-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 20, maxSeats: 30 },
      { id: 'slot-3-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 25, maxSeats: 30 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-4',
    restaurantId: '3',
    restaurantName: 'Riverfront Grill',
    restaurantImage: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
    cuisine: 'Seafood',
    location: 'Bangkok',
    rating: 4.8,
    reviewCount: 2100,
    originalPrice: 1500,
    discountedPrice: 900,
    discountPercentage: 40,
    dealType: 'early-bird',
    description: 'Fresh seafood with stunning river views and outdoor terrace dining. Early bird special with premium catches.',
    terms: [
      'Fresh catch of the day',
      'River view seating',
      'Outdoor terrace available',
      'Seafood specialties'
    ],
    paxOptions: [2, 4, 6, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-4-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 10, maxSeats: 20 },
      { id: 'slot-4-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 15, maxSeats: 20 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-5',
    restaurantId: '4',
    restaurantName: 'Urban Eats',
    restaurantImage: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400',
    cuisine: 'Modern',
    location: 'Bangkok',
    rating: 4.4,
    reviewCount: 980,
    originalPrice: 750,
    discountedPrice: 525,
    discountPercentage: 30,
    dealType: 'afternoon',
    description: 'Contemporary urban dining with street food inspired dishes. Perfect for casual afternoon meals.',
    terms: [
      'Street food inspired',
      'Casual dining atmosphere',
      'Urban contemporary style',
      'Local ingredients'
    ],
    paxOptions: [1, 2, 3, 4, 5, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-5-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 25, maxSeats: 35 },
      { id: 'slot-5-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 30, maxSeats: 35 },
    ],
    isPopular: false,
    isLimitedTime: false
  },
  {
    id: 'off-peak-6',
    restaurantId: '5',
    restaurantName: 'Golden Spoon',
    restaurantImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    cuisine: 'Fine Dining',
    location: 'Bangkok',
    rating: 4.9,
    reviewCount: 850,
    originalPrice: 2200,
    discountedPrice: 1540,
    discountPercentage: 30,
    dealType: 'early-bird',
    description: 'Exquisite fine dining experience with award-winning cuisine. Special early bird pricing for lunch service.',
    terms: [
      'Award-winning cuisine',
      'Fine dining experience',
      'Chef tasting menu',
      'Premium ingredients'
    ],
    paxOptions: [2, 4, 6],
    availableDates,
    timeSlots: [
      { id: 'slot-6-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 8, maxSeats: 15 },
      { id: 'slot-6-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 10, maxSeats: 15 },
    ],
    isPopular: true,
    isLimitedTime: true
  },
  {
    id: 'off-peak-7',
    restaurantId: '6',
    restaurantName: 'Thai Delights',
    restaurantImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
    cuisine: 'Authentic',
    location: 'Bangkok',
    rating: 4.5,
    reviewCount: 1650,
    originalPrice: 420,
    discountedPrice: 210,
    discountPercentage: 50,
    dealType: 'late-night',
    description: 'Traditional Thai flavors in an authentic family-run setting. Late night comfort food at its best.',
    terms: [
      'Family-run restaurant',
      'Traditional recipes',
      'Authentic Thai flavors',
      'Comfort food specials'
    ],
    paxOptions: [2, 3, 4, 5, 6, 7, 8],
    availableDates,
    timeSlots: [
      { id: 'slot-7-1', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 20, maxSeats: 30 },
      { id: 'slot-7-2', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 25, maxSeats: 30 },
    ],
    isPopular: true,
    isLimitedTime: false
  },

  // Additional variety restaurants to provide more options
  {
    id: 'off-peak-8',
    restaurantId: 'rest-8',
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
      { id: 'slot-8-1', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 12, maxSeats: 20 },
      { id: 'slot-8-2', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 8, maxSeats: 20 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-9',
    restaurantId: 'rest-9',
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
      { id: 'slot-9-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 15, maxSeats: 25 },
      { id: 'slot-9-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 20, maxSeats: 25 },
    ],
    isPopular: false,
    isLimitedTime: true
  },
  {
    id: 'off-peak-10',
    restaurantId: 'rest-10',
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
      { id: 'slot-10-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 10, maxSeats: 15 },
      { id: 'slot-10-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 12, maxSeats: 15 },
      { id: 'slot-10-3', startTime: '17:30', endTime: '19:00', isAvailable: false, remainingSeats: 0, maxSeats: 15 },
    ],
    isPopular: true,
    isLimitedTime: false
  },
  {
    id: 'off-peak-11',
    restaurantId: 'rest-11',
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
      { id: 'slot-11-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 6, maxSeats: 12 },
      { id: 'slot-11-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 8, maxSeats: 12 },
    ],
    isPopular: true,
    isLimitedTime: true
  },
  {
    id: 'off-peak-12',
    restaurantId: 'rest-12',
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
      { id: 'slot-12-1', startTime: '14:30', endTime: '16:00', isAvailable: true, remainingSeats: 18, maxSeats: 30 },
      { id: 'slot-12-2', startTime: '16:00', endTime: '17:30', isAvailable: true, remainingSeats: 25, maxSeats: 30 },
    ],
    isPopular: false,
    isLimitedTime: false
  },
  {
    id: 'off-peak-13',
    restaurantId: 'rest-13',
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
      { id: 'slot-13-1', startTime: '21:00', endTime: '22:30', isAvailable: true, remainingSeats: 30, maxSeats: 50 },
      { id: 'slot-13-2', startTime: '22:30', endTime: '00:00', isAvailable: true, remainingSeats: 35, maxSeats: 50 },
      { id: 'slot-13-3', startTime: '00:00', endTime: '01:30', isAvailable: true, remainingSeats: 40, maxSeats: 50 },
    ],
    isPopular: true,
    isLimitedTime: true
  },
  {
    id: 'off-peak-14',
    restaurantId: 'rest-14',
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
      { id: 'slot-14-1', startTime: '11:30', endTime: '13:00', isAvailable: true, remainingSeats: 14, maxSeats: 20 },
      { id: 'slot-14-2', startTime: '13:00', endTime: '14:30', isAvailable: true, remainingSeats: 16, maxSeats: 20 },
    ],
    isPopular: false,
    isLimitedTime: false
  },
  {
    id: 'off-peak-15',
    restaurantId: 'rest-15',
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