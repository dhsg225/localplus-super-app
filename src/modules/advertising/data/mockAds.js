// [2024-05-10 17:30 UTC] - Mock Advertisement Data
export var mockAdvertisements = [
    // Internal Promotions (existing designs)
    {
        id: 'internal-off-peak',
        title: 'Off Peak Dining',
        description: 'Save up to 50% during off-peak hours',
        ctaText: 'UP TO 50% OFF',
        ctaUrl: '/off-peak',
        type: 'internal',
        category: 'internal-promotion',
        placement: ['homepage-cards', 'homepage-hero', 'restaurants-top', 'deals-section'],
        priority: 9,
        status: 'active',
        isActive: true,
        styling: {
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
            textColor: '#FFFFFF',
            borderRadius: '16px',
            animation: 'glow'
        }
    },
    {
        id: 'internal-passport',
        title: 'Savings Passport',
        description: 'Instant savings at 500+ businesses',
        ctaText: '฿199/MONTH',
        ctaUrl: '/passport',
        type: 'internal',
        category: 'internal-promotion',
        placement: ['homepage-cards', 'homepage-hero', 'profile-page', 'passport-page'],
        priority: 8,
        status: 'active',
        isActive: true,
        styling: {
            gradient: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
            textColor: '#FFFFFF',
            borderRadius: '16px',
            animation: 'pulse'
        }
    },
    // External Ads - Dining
    {
        id: 'ext-thai-restaurant',
        title: 'Authentic Thai Cuisine',
        description: 'Experience traditional flavors at Bangkok Garden Restaurant',
        imageUrl: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop',
        ctaText: 'Book Now',
        ctaUrl: 'https://bangkokgarden.com/book',
        type: 'external',
        category: 'dining',
        placement: ['restaurants-top', 'homepage-hero', 'cuisine-explorer', 'deals-section'],
        priority: 7,
        status: 'active',
        isActive: true,
        targetAudience: {
            interests: ['thai-food', 'dining', 'authentic-cuisine'],
            userType: 'consumer'
        },
        styling: {
            backgroundColor: '#FEF3C7',
            textColor: '#92400E',
            accentColor: '#F59E0B',
            borderRadius: '12px'
        }
    },
    // External Ads - Services
    {
        id: 'ext-spa-wellness',
        title: 'Luxury Spa Experience',
        description: 'Rejuvenate your body and mind with our premium treatments',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
        ctaText: 'Book Treatment',
        ctaUrl: 'https://luxuryspa.com',
        type: 'external',
        category: 'wellness',
        placement: ['services-banner', 'homepage-hero', 'homepage-cards'],
        priority: 6,
        status: 'active',
        isActive: true,
        targetAudience: {
            ageRange: [25, 55],
            interests: ['wellness', 'spa', 'relaxation'],
            userType: 'consumer'
        },
        styling: {
            backgroundColor: '#ECFDF5',
            textColor: '#065F46',
            accentColor: '#10B981',
            borderRadius: '12px'
        }
    },
    // External Ads - Technology
    {
        id: 'ext-food-delivery',
        title: 'FastFood Delivery App',
        description: 'Get your favorite meals delivered in 30 minutes or less',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        ctaText: 'Download App',
        ctaUrl: 'https://fastfoodapp.com/download',
        type: 'external',
        category: 'technology',
        placement: ['restaurants-bottom', 'homepage-hero', 'homepage-cards'],
        priority: 5,
        status: 'active',
        isActive: true,
        targetAudience: {
            ageRange: [18, 45],
            interests: ['food-delivery', 'convenience', 'mobile-apps'],
            userType: 'consumer'
        },
        styling: {
            backgroundColor: '#FEF2F2',
            textColor: '#991B1B',
            accentColor: '#EF4444',
            borderRadius: '12px'
        }
    },
    // External Ads - Travel
    {
        id: 'ext-hotel-booking',
        title: 'Hua Hin Beach Resort',
        description: 'Luxury beachfront accommodation with stunning ocean views',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
        ctaText: 'Check Rates',
        ctaUrl: 'https://huahinresort.com',
        type: 'external',
        category: 'travel',
        placement: ['events-sidebar', 'homepage-hero', 'passport-page'],
        priority: 6,
        status: 'active',
        isActive: true,
        targetAudience: {
            interests: ['travel', 'hotels', 'beach', 'vacation'],
            userType: 'consumer'
        },
        styling: {
            backgroundColor: '#EFF6FF',
            textColor: '#1E40AF',
            accentColor: '#3B82F6',
            borderRadius: '12px'
        }
    },
    // External Ads - Retail
    {
        id: 'ext-fashion-store',
        title: 'Summer Fashion Sale',
        description: 'Up to 70% off on trendy summer collections',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        ctaText: 'Shop Now',
        ctaUrl: 'https://fashionstore.com/sale',
        type: 'external',
        category: 'retail',
        placement: ['homepage-cards', 'homepage-hero', 'profile-page'],
        priority: 4,
        status: 'active',
        isActive: true,
        targetAudience: {
            ageRange: [18, 40],
            interests: ['fashion', 'shopping', 'style'],
            userType: 'consumer'
        },
        styling: {
            backgroundColor: '#FDF4FF',
            textColor: '#86198F',
            accentColor: '#C026D3',
            borderRadius: '12px'
        }
    },
    // Business-focused ads
    {
        id: 'ext-business-tools',
        title: 'Business Management Suite',
        description: 'Streamline your operations with our all-in-one platform',
        ctaText: 'Free Trial',
        ctaUrl: 'https://businesstools.com/trial',
        type: 'external',
        category: 'technology',
        placement: ['business-dashboard', 'homepage-hero'],
        priority: 7,
        status: 'active',
        isActive: true,
        targetAudience: {
            userType: 'business',
            interests: ['business-tools', 'management', 'efficiency']
        },
        styling: {
            backgroundColor: '#F0FDF4',
            textColor: '#14532D',
            accentColor: '#22C55E',
            borderRadius: '12px'
        }
    }
];
// Helper functions for filtering ads
export var getAdsByPlacement = function (placement) {
    return mockAdvertisements.filter(function (ad) {
        return ad.isActive && ad.placement.includes(placement);
    }).sort(function (a, b) { return b.priority - a.priority; });
};
export var getInternalAds = function () {
    return mockAdvertisements.filter(function (ad) { return ad.type === 'internal' && ad.isActive; });
};
export var getExternalAds = function () {
    return mockAdvertisements.filter(function (ad) { return ad.type === 'external' && ad.isActive; });
};
export var getAdsByCategory = function (category) {
    return mockAdvertisements.filter(function (ad) {
        return ad.category === category && ad.isActive;
    }).sort(function (a, b) { return b.priority - a.priority; });
};
