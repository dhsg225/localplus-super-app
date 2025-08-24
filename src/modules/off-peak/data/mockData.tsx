// Generate date strings for the next 30 days
var generateAvailableDates = function () {
    var dates = [];
    var today = new Date();
    for (var i = 0; i < 30; i++) {
        var date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};
var availableDates = generateAvailableDates();
// Helper function to generate random deals for a restaurant
var generateRandomDeals = function (restaurantId, restaurantName, restaurantImage, cuisine, location, rating, reviewCount, basePrice) {
    var dealTypes = ['early-bird', 'afternoon', 'late-night'];
    var dealDescriptions = {
        'early-bird': 'Start your day with our special early bird menu featuring fresh ingredients and traditional recipes.',
        'afternoon': 'Perfect for a relaxed afternoon dining experience with carefully crafted dishes.',
        'late-night': 'Enjoy our late night special menu in a cozy atmosphere perfect for evening dining.'
    };
    var deals = [];
    var dealCounter = 1;
    // Generate 3 unique deals per restaurant (one per type) with unique percentages
    dealTypes.forEach(function (dealType, typeIndex) {
        var basePercentage = 20 + (typeIndex * 15); // 20%, 35%, 50% base
        var rawPercentage = basePercentage + Math.floor(Math.random() * 10); // Add variation
        var discountPercentage = Math.round(rawPercentage / 5) * 5; // Round to nearest 5%
        var priceVariation = basePrice + Math.floor(Math.random() * 400) - 200; // ±200 variation
        var originalPrice = Math.max(priceVariation, 300); // Minimum 300
        var timeSlots = {
            'early-bird': [
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter), startTime: '11:00', endTime: '12:00', isAvailable: true, remainingSeats: 8 + Math.floor(Math.random() * 15), maxSeats: 20 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 1), startTime: '12:00', endTime: '13:00', isAvailable: true, remainingSeats: 12 + Math.floor(Math.random() * 10), maxSeats: 25 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 2), startTime: '13:00', endTime: '14:00', isAvailable: true, remainingSeats: 10 + Math.floor(Math.random() * 10), maxSeats: 20 + Math.floor(Math.random() * 10) }
            ],
            'afternoon': [
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter), startTime: '14:00', endTime: '15:00', isAvailable: true, remainingSeats: 15 + Math.floor(Math.random() * 10), maxSeats: 30 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 1), startTime: '15:00', endTime: '16:00', isAvailable: true, remainingSeats: 18 + Math.floor(Math.random() * 12), maxSeats: 35 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 2), startTime: '16:00', endTime: '17:00', isAvailable: true, remainingSeats: 16 + Math.floor(Math.random() * 10), maxSeats: 30 + Math.floor(Math.random() * 10) }
            ],
            'late-night': [
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter), startTime: '21:00', endTime: '22:00', isAvailable: true, remainingSeats: 5 + Math.floor(Math.random() * 10), maxSeats: 20 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 1), startTime: '22:00', endTime: '23:00', isAvailable: true, remainingSeats: 3 + Math.floor(Math.random() * 8), maxSeats: 15 + Math.floor(Math.random() * 10) },
                { id: "slot-".concat(restaurantId, "-").concat(dealCounter + 2), startTime: '23:00', endTime: '00:00', isAvailable: true, remainingSeats: 2 + Math.floor(Math.random() * 6), maxSeats: 12 + Math.floor(Math.random() * 8) }
            ]
        };
        deals.push({
            id: "off-peak-".concat(restaurantId, "-").concat(dealCounter),
            restaurantId: restaurantId,
            restaurantName: restaurantName,
            restaurantImage: restaurantImage,
            cuisine: cuisine,
            location: location,
            rating: rating,
            reviewCount: reviewCount,
            originalPrice: originalPrice,
            discountedPrice: Math.round(originalPrice * (1 - discountPercentage / 100)),
            discountPercentage: discountPercentage,
            dealType: dealType,
            description: dealDescriptions[dealType],
            terms: [
                "".concat(discountPercentage, "% discount special"),
                'Limited time offer',
                'Advance booking recommended',
                'Subject to availability'
            ],
            paxOptions: [2, 3, 4, 5, 6, 8].slice(0, 3 + Math.floor(Math.random() * 3)),
            availableDates: availableDates,
            timeSlots: timeSlots[dealType],
            isPopular: Math.random() > 0.7,
            isLimitedTime: Math.random() > 0.6
        });
        dealCounter += 3;
    });
    return deals;
};
// Restaurant data
var restaurants = [
    { id: '1', name: 'The Spice Merchant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', cuisine: 'Thai', location: 'Hua Hin', rating: 4.7, reviewCount: 1850, basePrice: 680 },
    { id: '2', name: 'Siam Bistro', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', cuisine: 'Fusion', location: 'Hua Hin', rating: 4.6, reviewCount: 1450, basePrice: 1200 },
    { id: '3', name: 'Beachfront Grill', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400', cuisine: 'Seafood', location: 'Hua Hin', rating: 4.8, reviewCount: 2100, basePrice: 1500 },
    { id: '4', name: 'Seaside Eats', image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400', cuisine: 'Modern', location: 'Hua Hin', rating: 4.4, reviewCount: 980, basePrice: 750 },
    { id: '5', name: 'Golden Spoon', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', cuisine: 'Fine Dining', location: 'Hua Hin', rating: 4.9, reviewCount: 850, basePrice: 2200 },
    { id: '6', name: 'Thai Delights', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400', cuisine: 'Authentic', location: 'Hua Hin', rating: 4.5, reviewCount: 1320, basePrice: 580 },
    { id: '7', name: 'Ocean Breeze', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', cuisine: 'Seafood', location: 'Hua Hin Beach', rating: 4.6, reviewCount: 890, basePrice: 1100 },
    { id: '8', name: 'Mountain View', image: 'https://images.unsplash.com/photo-1590725175061-ed6bdf0bc2ac?w=400', cuisine: 'International', location: 'Hua Hin Hills', rating: 4.3, reviewCount: 670, basePrice: 950 },
    { id: '9', name: 'Sunset Café', image: 'https://images.unsplash.com/photo-1552566090-a0818202e2e8?w=400', cuisine: 'Café', location: 'Hua Hin Beach', rating: 4.4, reviewCount: 1150, basePrice: 420 },
    { id: '10', name: 'Royal Garden', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', cuisine: 'Thai', location: 'Hua Hin Town', rating: 4.7, reviewCount: 1980, basePrice: 1300 }
];
// Generate all deals
export var mockOffPeakDeals = restaurants.flatMap(function (restaurant) {
    return generateRandomDeals(restaurant.id, restaurant.name, restaurant.image, restaurant.cuisine, restaurant.location, restaurant.rating, restaurant.reviewCount, restaurant.basePrice);
});
