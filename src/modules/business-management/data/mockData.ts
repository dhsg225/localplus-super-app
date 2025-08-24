import { RestaurantProfile, BusinessManagementSection, BusinessAnalytics, BusinessNotification } from '../types';

// Mock restaurant profile (extending our existing restaurant data)
export const mockRestaurantProfile: RestaurantProfile = {
  id: '1',
  name: 'The Spice Merchant',
  description: 'Authentic Thai cuisine with modern presentation in a cozy, contemporary setting',
  category: 'restaurant',
  email: 'info@spicemerchant.co.th',
  phone: '+66-2-123-4567',
  website: 'https://spicemerchant.co.th',
  address: {
    street: '123 Petchkasem Road',
    city: 'Hua Hin',
    district: 'Hua Hin Beach',
    postalCode: '77110',
    coordinates: {
      lat: 12.5684,
      lng: 99.9578
    }
  },
  images: [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      caption: 'Main dining area with traditional Thai decor',
      isMain: true,
      order: 1,
      uploadedAt: new Date('2024-01-15')
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=400',
      caption: 'Signature Pad Thai preparation',
      isMain: false,
      order: 2,
      uploadedAt: new Date('2024-01-15')
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      caption: 'Fresh ingredients and herbs',
      isMain: false,
      order: 3,
      uploadedAt: new Date('2024-01-15')
    }
  ],
  openingHours: {
    monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    sunday: { isOpen: true, openTime: '12:00', closeTime: '22:00' }
  },
  socialMedia: {
    facebook: 'https://facebook.com/spicemerchantbkk',
    instagram: 'https://instagram.com/spicemerchantbkk',
    line: '@spicemerchant'
  },
  isVerified: true,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-15'),
  
  // Restaurant-specific fields
  cuisine: ['Thai', 'Asian Fusion'],
  priceRange: 'mid-range',
  diningStyle: ['Casual Dining', 'Family Friendly'],
  hasReservation: true,
  hasDelivery: true,
  hasBeachfront: false,
  isHalal: false,
  menu: [
    {
      id: 'menu-1',
      name: 'Pad Thai Goong',
      description: 'Traditional stir-fried rice noodles with shrimp, bean sprouts, and tamarind sauce',
      price: 320,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657da5a6?w=300',
      isAvailable: true,
      allergens: ['Shellfish', 'Soy'],
      isSpicy: true,
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 'menu-2',
      name: 'Tom Yum Goong',
      description: 'Spicy and sour soup with shrimp, mushrooms, and aromatic herbs',
      price: 280,
      category: 'Soup',
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300',
      isAvailable: true,
      allergens: ['Shellfish'],
      isSpicy: true,
      isVegetarian: false,
      isVegan: false
    },
    {
      id: 'menu-3',
      name: 'Green Curry Vegetables',
      description: 'Coconut milk curry with seasonal vegetables and Thai basil',
      price: 240,
      category: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300',
      isAvailable: true,
      allergens: [],
      isSpicy: true,
      isVegetarian: true,
      isVegan: true
    },
    {
      id: 'menu-4',
      name: 'Mango Sticky Rice',
      description: 'Traditional Thai dessert with sweet coconut milk',
      price: 180,
      category: 'Dessert',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d34a?w=300',
      isAvailable: true,
      allergens: [],
      isSpicy: false,
      isVegetarian: true,
      isVegan: false
    }
  ],
  offPeakDeals: [
    {
      id: 'deal-1',
      title: 'Early Bird Special',
      description: 'Special lunch pricing with complimentary welcome drink',
      originalPrice: 680,
      discountedPrice: 476,
      discountPercentage: 30,
      dealType: 'early-bird',
      validDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '11:30',
      endTime: '14:30',
      maxSeats: 25,
      terms: [
        'Valid for lunch menu only',
        'Includes welcome drink',
        'Advance booking recommended',
        'Cannot be combined with other offers'
      ],
      isActive: true,
      validFrom: new Date('2024-06-01'),
      validUntil: new Date('2024-12-31')
    },
    {
      id: 'deal-2',
      title: 'Late Night Dining',
      description: 'Evening special with romantic ambiance and extended menu',
      originalPrice: 950,
      discountedPrice: 570,
      discountPercentage: 40,
      dealType: 'late-night',
      validDays: ['friday', 'saturday', 'sunday'],
      startTime: '21:00',
      endTime: '23:30',
      maxSeats: 20,
      terms: [
        'Extended dinner menu available',
        'Perfect for romantic dates',
        'Special lighting and music',
        'Minimum 2 people required'
      ],
      isActive: true,
      validFrom: new Date('2024-06-01'),
      validUntil: new Date('2024-12-31')
    }
  ]
};

export const businessManagementSections: BusinessManagementSection[] = [
  {
    id: 'profile',
    title: 'Business Profile',
    description: 'Edit basic information, contact details, and location',
    icon: 'Building2',
    path: '/business/profile',
    isEnabled: true
  },
  {
    id: 'images',
    title: 'Photos & Gallery',
    description: 'Manage your business photos and image gallery',
    icon: 'Camera',
    path: '/business/images',
    isEnabled: true
  },
  {
    id: 'hours',
    title: 'Opening Hours',
    description: 'Set your operating hours and holiday schedules',
    icon: 'Clock',
    path: '/business/hours',
    isEnabled: true
  },
  {
    id: 'menu',
    title: 'Menu Management',
    description: 'Add, edit, and organize your menu items',
    icon: 'Menu',
    path: '/business/menu',
    isEnabled: true
  },
  {
    id: 'deals',
    title: 'Deals & Offers',
    description: 'Create special offers and promotional deals',
    icon: 'Percent',
    path: '/business/deals',
    isEnabled: true
  },
  {
    id: 'loyalty',
    title: 'Loyalty Program',
    description: 'Set up and manage customer loyalty rewards',
    icon: 'Star',
    path: '/business/loyalty',
    isEnabled: true
  },
  {
    id: 'advertising',
    title: 'Advertisement Management',
    description: 'Create and manage your business advertisements',
    icon: 'Megaphone',
    path: '/admin/advertising',
    isEnabled: true
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'View performance metrics and customer insights',
    icon: 'TrendingUp',
    path: '/business/analytics',
    isEnabled: false
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage alerts and communication preferences',
    icon: 'Bell',
    path: '/business/notifications',
    isEnabled: false
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure account settings and preferences',
    icon: 'Settings',
    path: '/business/settings',
    isEnabled: false
  }
];

export const mockBusinessAnalytics: BusinessAnalytics[] = [
  {
    id: 'analytics-1',
    businessId: '1',
    period: 'week',
    views: 1247,
    bookings: 89,
    revenue: 45600,
    averageRating: 4.7,
    reviewCount: 23,
    date: new Date('2024-06-15')
  },
  {
    id: 'analytics-2',
    businessId: '1',
    period: 'month',
    views: 5890,
    bookings: 367,
    revenue: 189400,
    averageRating: 4.6,
    reviewCount: 94,
    date: new Date('2024-06-01')
  }
];

export const mockBusinessNotifications: BusinessNotification[] = [
  {
    id: 'notif-1',
    businessId: '1',
    type: 'booking',
    title: 'New Reservation',
    message: 'New booking for 4 people on June 20th at 7:00 PM',
    isRead: false,
    actionRequired: true,
    createdAt: new Date('2024-06-18T14:30:00')
  },
  {
    id: 'notif-2',
    businessId: '1',
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review from Sarah M.',
    isRead: false,
    actionRequired: false,
    createdAt: new Date('2024-06-18T12:15:00')
  },
  {
    id: 'notif-3',
    businessId: '1',
    type: 'system',
    title: 'Profile Update',
    message: 'Your business profile was successfully updated',
    isRead: true,
    actionRequired: false,
    createdAt: new Date('2024-06-17T16:45:00')
  }
]; 