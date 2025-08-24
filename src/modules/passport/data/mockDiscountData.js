export var mockDiscountBusinesses = [
    // Restaurants & Cafés
    {
        id: 'rest-001',
        name: 'The Spice Merchant',
        category: 'restaurant',
        subcategory: 'Thai Cuisine',
        description: 'Authentic Thai flavors with a modern twist in a beachside setting',
        location: 'Hua Hin Beach',
        address: '123 Petchkasem Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        discount: {
            percentage: 20,
            description: '20% off all meals',
            terms: ['Valid for dine-in only', 'Cannot be combined with other offers', 'Show LocalPlus Passport']
        },
        rating: 4.7,
        reviewCount: 1850,
        phone: '+66-32-123-456',
        openingHours: {
            'Monday': { open: '11:00', close: '22:00' },
            'Tuesday': { open: '11:00', close: '22:00' },
            'Wednesday': { open: '11:00', close: '22:00' },
            'Thursday': { open: '11:00', close: '22:00' },
            'Friday': { open: '11:00', close: '23:00' },
            'Saturday': { open: '11:00', close: '23:00' },
            'Sunday': { open: '12:00', close: '22:00' }
        },
        features: ['Air Conditioned', 'Beachfront', 'Vegetarian Options'],
        isPopular: true
    },
    {
        id: 'rest-002',
        name: 'Beachfront Grill',
        category: 'restaurant',
        subcategory: 'Seafood',
        description: 'Fresh seafood with stunning ocean views',
        location: 'Hua Hin Beach',
        address: '456 Beach Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
        discount: {
            percentage: 25,
            description: '25% off seafood dishes',
            terms: ['Valid for dinner only', 'Minimum 2 persons', 'Advance booking recommended']
        },
        rating: 4.8,
        reviewCount: 2100,
        phone: '+66-32-123-457',
        openingHours: {
            'Monday': { open: '17:00', close: '23:00' },
            'Tuesday': { open: '17:00', close: '23:00' },
            'Wednesday': { open: '17:00', close: '23:00' },
            'Thursday': { open: '17:00', close: '23:00' },
            'Friday': { open: '17:00', close: '24:00' },
            'Saturday': { open: '17:00', close: '24:00' },
            'Sunday': { open: '17:00', close: '23:00' }
        },
        features: ['Ocean View', 'Live Music', 'Outdoor Seating'],
        isNew: true
    },
    // Spa & Wellness
    {
        id: 'spa-001',
        name: 'Serenity Spa Hua Hin',
        category: 'spa',
        subcategory: 'Day Spa',
        description: 'Traditional Thai massage and wellness treatments',
        location: 'Hua Hin Town Center',
        address: '789 Damnoenkasem Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
        discount: {
            percentage: 30,
            description: '30% off all spa treatments',
            terms: ['Advance booking required', 'Valid Monday-Thursday', 'Excludes packages']
        },
        rating: 4.9,
        reviewCount: 850,
        phone: '+66-32-234-567',
        openingHours: {
            'Monday': { open: '09:00', close: '21:00' },
            'Tuesday': { open: '09:00', close: '21:00' },
            'Wednesday': { open: '09:00', close: '21:00' },
            'Thursday': { open: '09:00', close: '21:00' },
            'Friday': { open: '09:00', close: '22:00' },
            'Saturday': { open: '09:00', close: '22:00' },
            'Sunday': { open: '10:00', close: '21:00' }
        },
        features: ['Traditional Thai Massage', 'Herbal Steam', 'Private Rooms'],
        isPopular: true
    },
    // Shopping & Retail
    {
        id: 'shop-001',
        name: 'Hua Hin Night Market',
        category: 'shopping',
        subcategory: 'Local Market',
        description: 'Local handicrafts, clothing, and souvenirs',
        location: 'Hua Hin Town Center',
        address: 'Dechanuchit Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        discount: {
            percentage: 15,
            description: '15% off at participating stalls',
            terms: ['Valid at marked stalls only', 'Minimum purchase ฿500', 'Show LocalPlus Passport']
        },
        rating: 4.4,
        reviewCount: 1200,
        openingHours: {
            'Monday': { open: '17:00', close: '23:00' },
            'Tuesday': { open: '17:00', close: '23:00' },
            'Wednesday': { open: '17:00', close: '23:00' },
            'Thursday': { open: '17:00', close: '23:00' },
            'Friday': { open: '17:00', close: '24:00' },
            'Saturday': { open: '17:00', close: '24:00' },
            'Sunday': { open: '17:00', close: '23:00' }
        },
        features: ['Local Handicrafts', 'Street Food', 'Live Entertainment']
    },
    // Activities & Tours
    {
        id: 'act-001',
        name: 'Hua Hin Adventure Tours',
        category: 'activities',
        subcategory: 'Tours & Excursions',
        description: 'Elephant sanctuaries, temples, and nature tours',
        location: 'Hua Hin Hills',
        address: '321 Mountain View Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        discount: {
            percentage: 35,
            description: '35% off all day tours',
            terms: ['Advance booking required', 'Valid for groups of 2+', 'Includes transportation']
        },
        rating: 4.6,
        reviewCount: 650,
        phone: '+66-32-345-678',
        website: 'www.huahintours.com',
        openingHours: {
            'Monday': { open: '08:00', close: '18:00' },
            'Tuesday': { open: '08:00', close: '18:00' },
            'Wednesday': { open: '08:00', close: '18:00' },
            'Thursday': { open: '08:00', close: '18:00' },
            'Friday': { open: '08:00', close: '18:00' },
            'Saturday': { open: '08:00', close: '18:00' },
            'Sunday': { open: '08:00', close: '18:00' }
        },
        features: ['Professional Guides', 'Small Groups', 'Hotel Pickup'],
        isPopular: true
    },
    // Hotels & Resorts
    {
        id: 'hotel-001',
        name: 'Royal Beach Resort',
        category: 'hotel',
        subcategory: 'Beach Resort',
        description: 'Luxury beachfront resort with world-class amenities',
        location: 'Hua Hin Beach',
        address: '555 Beach Front Avenue, Hua Hin',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        discount: {
            percentage: 15,
            description: '15% off room rates',
            terms: ['Minimum 2 nights stay', 'Subject to availability', 'Advance booking required']
        },
        rating: 4.8,
        reviewCount: 980,
        phone: '+66-32-456-789',
        website: 'www.royalbeachhua.com',
        openingHours: {
            'Monday': { open: '24h', close: '24h' },
            'Tuesday': { open: '24h', close: '24h' },
            'Wednesday': { open: '24h', close: '24h' },
            'Thursday': { open: '24h', close: '24h' },
            'Friday': { open: '24h', close: '24h' },
            'Saturday': { open: '24h', close: '24h' },
            'Sunday': { open: '24h', close: '24h' }
        },
        features: ['Beachfront', 'Pool', 'Spa', 'Restaurant']
    },
    // Transport & Services
    {
        id: 'trans-001',
        name: 'Hua Hin Car Rental',
        category: 'transport',
        subcategory: 'Car Rental',
        description: 'Reliable car and motorbike rental service',
        location: 'Hua Hin Town Center',
        address: '777 Phetkasem Road, Hua Hin',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
        discount: {
            percentage: 20,
            description: '20% off daily rental rates',
            terms: ['Valid driver license required', 'Minimum 1 day rental', 'Insurance included']
        },
        rating: 4.3,
        reviewCount: 420,
        phone: '+66-32-567-890',
        openingHours: {
            'Monday': { open: '08:00', close: '19:00' },
            'Tuesday': { open: '08:00', close: '19:00' },
            'Wednesday': { open: '08:00', close: '19:00' },
            'Thursday': { open: '08:00', close: '19:00' },
            'Friday': { open: '08:00', close: '19:00' },
            'Saturday': { open: '08:00', close: '20:00' },
            'Sunday': { open: '09:00', close: '18:00' }
        },
        features: ['Multiple Vehicle Types', 'GPS Included', 'Free Delivery']
    }
];
export var getBusinessesByCategory = function (category) {
    return mockDiscountBusinesses.filter(function (business) { return business.category === category; });
};
export var getPopularBusinesses = function () {
    return mockDiscountBusinesses.filter(function (business) { return business.isPopular; });
};
export var getNewBusinesses = function () {
    return mockDiscountBusinesses.filter(function (business) { return business.isNew; });
};
export var getCategoryStats = function () {
    var categories = mockDiscountBusinesses.reduce(function (acc, business) {
        if (!acc[business.category]) {
            acc[business.category] = { count: 0, avgDiscount: 0 };
        }
        acc[business.category].count++;
        acc[business.category].avgDiscount += business.discount.percentage;
        return acc;
    }, {});
    // Calculate averages
    Object.keys(categories).forEach(function (category) {
        categories[category].avgDiscount = Math.round(categories[category].avgDiscount / categories[category].count);
    });
    return categories;
};
