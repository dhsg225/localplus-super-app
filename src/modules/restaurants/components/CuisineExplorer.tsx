import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Star, DollarSign, Utensils } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  priceRange: number; // 1-4 scale
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specialties: string[];
  isOpen: boolean;
  estimatedDeliveryTime?: string;
}

// Mock restaurant data for Thailand
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Som Tam Paradise',
    cuisine: 'Thai Street Food',
    location: 'Hua Hin Center',
    priceRange: 1,
    rating: 4.6,
    reviewCount: 1250,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Authentic Isaan-style som tam and northeastern Thai specialties',
    specialties: ['Som Tam', 'Larb', 'Sticky Rice'],
    isOpen: true,
    estimatedDeliveryTime: '25-35 min'
  },
  {
    id: '2',
    name: 'Blue Elephant',
    cuisine: 'Fine Dining Thai',
    location: 'Hua Hin Center',
    priceRange: 4,
    rating: 4.8,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Royal Thai cuisine in an elegant colonial setting',
    specialties: ['Royal Thai Curry', 'Tom Kha Gai', 'Mango Sticky Rice'],
    isOpen: true,
    estimatedDeliveryTime: '45-60 min'
  },
  {
    id: '3',
    name: 'Sushi Masato',
    cuisine: 'Japanese',
    location: 'Night Market Area',
    priceRange: 3,
    rating: 4.7,
    reviewCount: 650,
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Premium omakase experience with fresh daily catches',
    specialties: ['Omakase Set', 'Otoro Sashimi', 'Chirashi Bowl'],
    isOpen: false,
    estimatedDeliveryTime: 'Closed'
  },
  {
    id: '4',
    name: 'Chez Laurent',
    cuisine: 'French',
    location: 'Khao Takiab',
    priceRange: 4,
    rating: 4.5,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Classic French bistro with ocean views and wine selection',
    specialties: ['Bouillabaisse', 'Duck Confit', 'Crème Brûlée'],
    isOpen: true,
    estimatedDeliveryTime: '50-70 min'
  },
  {
    id: '5',
    name: 'Nonna Sofia',
    cuisine: 'Italian',
    location: 'Cicada Market',
    priceRange: 2,
    rating: 4.4,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Homemade pasta and wood-fired pizzas in a cozy trattoria',
    specialties: ['Carbonara', 'Margherita Pizza', 'Tiramisu'],
    isOpen: true,
    estimatedDeliveryTime: '30-45 min'
  },
  {
    id: '6',
    name: 'Baan Khao Tom',
    cuisine: 'Modern Thai',
    location: 'Suan Son Beach',
    priceRange: 2,
    rating: 4.3,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Contemporary Thai dishes with creative presentations',
    specialties: ['Khao Tom Pla', 'Green Curry Risotto', 'Coconut Ice Cream'],
    isOpen: true,
    estimatedDeliveryTime: '25-40 min'
  },
  {
    id: '7',
    name: 'Pad Thai Thip Samai',
    cuisine: 'Thai Street Food',
    location: 'Railway Station Area',
    priceRange: 1,
    rating: 4.3,
    reviewCount: 2100,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Famous for the best Pad Thai in Hua Hin since 1966',
    specialties: ['Pad Thai Superb', 'Pad Thai with Crab', 'Thai Tea'],
    isOpen: true,
    estimatedDeliveryTime: '15-25 min'
  },
  {
    id: '8',
    name: 'Nahm Bangkok',
    cuisine: 'Modern Thai',
    location: 'Sathorn',
    priceRange: 4,
    rating: 4.9,
    reviewCount: 560,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Michelin-starred modern interpretations of traditional Thai cuisine',
    specialties: ['Tasting Menu', 'Green Curry', 'Thai Herbs Salad'],
    isOpen: false,
    estimatedDeliveryTime: 'Closed'
  },
  // Pattaya restaurants
  {
    id: '9',
    name: 'Rimpa Lapin',
    cuisine: 'Modern Thai',
    location: 'Central Pattaya',
    priceRange: 3,
    rating: 4.5,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1571104508999-893933ded431?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Contemporary Thai dishes in a stylish beachside setting',
    specialties: ['Tom Yum Goong', 'Massaman Curry', 'Mango Tango'],
    isOpen: true,
    estimatedDeliveryTime: '35-50 min'
  },
  {
    id: '10',
    name: 'The Sky Gallery Pattaya',
    cuisine: 'Fine Dining Thai',
    location: 'North Pattaya',
    priceRange: 4,
    rating: 4.7,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Rooftop fine dining with panoramic views of Pattaya Bay',
    specialties: ['Royal Thai Set', 'Lobster Thermidor', 'Chocolate Soufflé'],
    isOpen: true,
    estimatedDeliveryTime: '60-75 min'
  },
  {
    id: '11',
    name: 'Walking Street Seafood',
    cuisine: 'Thai Street Food',
    location: 'Walking Street',
    priceRange: 2,
    rating: 4.2,
    reviewCount: 650,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Fresh seafood and street food in the heart of Pattaya nightlife',
    specialties: ['Grilled Fish', 'Som Tam', 'Beer Towers'],
    isOpen: true,
    estimatedDeliveryTime: '20-30 min'
  }
];

interface CuisineFilters {
  selectedCuisines: string[];
  selectedLocations: string[];
  priceRange: { min: number; max: number }; // 1-4 scale
  openOnly: boolean;
}

// Location data structure for different cities
const LOCATION_DATA = {
  'Bangkok': {
    displayName: 'Bangkok',
    areas: [
      'Thonglor', 'Phrom Phong', 'Ekkamai', 'Asok', 'Nana',
      'Silom', 'Sathorn', 'Sukhumvit', 'Phra Nakhon', 'Chinatown'
    ]
  },
  'Hua Hin': {
    displayName: 'Hua Hin',
    areas: [
      'Hua Hin Center', 'Khao Takiab', 'Khao Tao', 'Soi 88', 'Night Market Area',
      'Cicada Market', 'Hin Lek Fai', 'Suan Son Beach', 'Railway Station Area'
    ]
  },
  'Pattaya': {
    displayName: 'Pattaya',
    areas: [
      'Central Pattaya', 'North Pattaya', 'South Pattaya', 'Jomtien', 'Naklua',
      'Walking Street', 'Second Road', 'Third Road', 'Soi Buakhao'
    ]
  },
  'Phuket': {
    displayName: 'Phuket',
    areas: [
      'Patong', 'Kata', 'Karon', 'Kamala', 'Surin', 'Bang Tao',
      'Phuket Town', 'Chalong', 'Rawai', 'Nai Harn'
    ]
  },
  'Chiang Mai': {
    displayName: 'Chiang Mai',
    areas: [
      'Old City', 'Nimman', 'Night Bazaar', 'Chang Puak', 'Santitham',
      'Mae Rim', 'Hang Dong', 'San Kamphaeng'
    ]
  },
  'Phuket Town': {
    displayName: 'Phuket Town',
    areas: ['Old Town', 'Talad Yai', 'Talad Nuea', 'Rassada', 'Koh Kaew']
  },
  'Krabi': {
    displayName: 'Krabi',
    areas: ['Krabi Town', 'Ao Nang', 'Railay', 'Klong Muang', 'Tup Kaek']
  },
  'Samui': {
    displayName: 'Koh Samui',
    areas: ['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon', 'Choeng Mon']
  }
} as const;

type SupportedCity = keyof typeof LOCATION_DATA;

// Function to get location from localStorage (set by main app)
const getStoredLocation = (): string | null => {
  try {
    const stored = localStorage.getItem('localplus-current-location');
    return stored ? JSON.parse(stored).city : null;
  } catch {
    return null;
  }
};

// Function to handle unknown cities gracefully
const getCityWithFallback = (cityName: string): { city: SupportedCity; areas: string[]; isSupported: boolean } => {
  // Check if city is directly supported
  if (cityName in LOCATION_DATA) {
    return {
      city: cityName as SupportedCity,
      areas: LOCATION_DATA[cityName as SupportedCity].areas,
      isSupported: true
    };
  }

  // For unknown cities, provide generic areas
  const genericAreas = [
    'City Center', 'Downtown', 'Old Town', 'New Town',
    'Beach Area', 'Shopping District', 'Business District',
    'Residential Area', 'Tourist Area', 'Market Area'
  ];

  // Use Bangkok as fallback but with generic areas for unknown cities
  return {
    city: 'Bangkok' as SupportedCity,
    areas: genericAreas,
    isSupported: false
  };
};

const CuisineExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [currentCity, setCurrentCity] = useState<SupportedCity>('Bangkok'); // Default to Bangkok
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [filters, setFilters] = useState<CuisineFilters>({
    selectedCuisines: [],
    selectedLocations: [],
    priceRange: { min: 1, max: 4 },
    openOnly: false
  });

  // Location detection
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // PRIORITY 1: Check if user manually selected location in main app
      const storedLocation = getStoredLocation();
      if (storedLocation) {
        console.log('Using stored location from main app:', storedLocation);
        const cityWithFallback = getCityWithFallback(storedLocation);
        setCurrentCity(cityWithFallback.city);
        setIsLoadingLocation(false);
        return;
      }

      // PRIORITY 2: Try GPS detection
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const detectedCity = await getLocationFromCoordinates(latitude, longitude);
            const cityWithFallback = getCityWithFallback(detectedCity);
            setCurrentCity(cityWithFallback.city);
            setIsLoadingLocation(false);
          },
          async () => {
            // PRIORITY 3: IP geolocation fallback
            const detectedCity = await getLocationFromIP();
            const cityWithFallback = getCityWithFallback(detectedCity);
            setCurrentCity(cityWithFallback.city);
            setIsLoadingLocation(false);
          }
        );
      } else {
        // PRIORITY 4: Final fallback
        const detectedCity = await getLocationFromIP();
        const cityWithFallback = getCityWithFallback(detectedCity);
        setCurrentCity(cityWithFallback.city);
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setCurrentCity('Bangkok'); // Ultimate fallback
      setIsLoadingLocation(false);
    }
  };

  // Listen for location changes from main app
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLocation = getStoredLocation();
      if (storedLocation) {
        const cityWithFallback = getCityWithFallback(storedLocation);
        setCurrentCity(cityWithFallback.city);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getLocationFromCoordinates = async (lat: number, lng: number): Promise<SupportedCity> => {
    // Real-world coordinates for Thailand locations
    const locations = [
      { name: 'Bangkok' as SupportedCity, lat: 13.7563, lng: 100.5018, radius: 0.5 },
      { name: 'Pattaya' as SupportedCity, lat: 12.9329, lng: 100.8825, radius: 0.3 },
      { name: 'Hua Hin' as SupportedCity, lat: 12.5684, lng: 99.9578, radius: 0.3 },
      { name: 'Phuket' as SupportedCity, lat: 7.8804, lng: 98.3923, radius: 0.3 },
      { name: 'Chiang Mai' as SupportedCity, lat: 18.7883, lng: 98.9853, radius: 0.3 }
    ];
    
    // Find closest matching location
    for (const location of locations) {
      if (Math.abs(lat - location.lat) < location.radius && Math.abs(lng - location.lng) < location.radius) {
        return location.name;
      }
    }
    
    return 'Bangkok'; // Default if no close match
  };

  const getLocationFromIP = async (): Promise<SupportedCity> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const detectedCity = (data.city || '').toLowerCase();
      const detectedRegion = (data.region || '').toLowerCase();
      
      // Check for Hua Hin and surrounding areas
      const huaHinKeywords = ['hua hin', 'hin lek fai', 'nong khon', 'prachuap'];
      if (huaHinKeywords.some(keyword => 
        detectedCity.includes(keyword) || detectedRegion.includes(keyword)
      )) {
        return 'Hua Hin';
      }
      
      // Check for Pattaya area
      const pattayaKeywords = ['pattaya', 'chonburi', 'banglamung'];
      if (pattayaKeywords.some(keyword => 
        detectedCity.includes(keyword) || detectedRegion.includes(keyword)
      )) {
        return 'Pattaya';
      }
      
      // Check for other supported cities
      const supportedCities: SupportedCity[] = ['Phuket', 'Chiang Mai'];
      for (const city of supportedCities) {
        if (detectedCity.includes(city.toLowerCase())) {
          return city;
        }
      }
      
      return 'Bangkok'; // Default fallback
    } catch (error) {
      console.error('IP geolocation failed:', error);
      return 'Bangkok';
    }
  };

  // Get areas for current city (with fallback handling)
  const cityData = getCityWithFallback(currentCity);
  const availableAreas = cityData.areas;

  // Extract unique cuisines and locations
  const availableCuisines = useMemo(() => 
    Array.from(new Set(mockRestaurants.map(restaurant => restaurant.cuisine))).sort()
  , []);

  const availableLocations = useMemo(() => 
    Array.from(new Set(mockRestaurants.map(restaurant => restaurant.location))).sort()
  , []);

  // Filter restaurants based on current filters AND current city
  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter(restaurant => {
      // First filter by current city - only show restaurants from detected city areas
      const isFromCurrentCity = availableAreas.includes(restaurant.location);
      if (!isFromCurrentCity) return false;
      
      const cuisineMatch = filters.selectedCuisines.length === 0 || 
        filters.selectedCuisines.includes(restaurant.cuisine);
      
      const locationMatch = filters.selectedLocations.length === 0 || 
        filters.selectedLocations.includes(restaurant.location);
      
      const priceMatch = restaurant.priceRange >= filters.priceRange.min && 
        restaurant.priceRange <= filters.priceRange.max;
      
      const openMatch = !filters.openOnly || restaurant.isOpen;
      
      return cuisineMatch && locationMatch && priceMatch && openMatch;
    });
  }, [filters, availableAreas]);

  const handleCuisineToggle = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCuisines: prev.selectedCuisines.includes(cuisine)
        ? prev.selectedCuisines.filter(c => c !== cuisine)
        : [...prev.selectedCuisines, cuisine]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(location)
        ? prev.selectedLocations.filter(l => l !== location)
        : [...prev.selectedLocations, location]
    }));
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value }
    }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCuisines: [],
      selectedLocations: [],
      priceRange: { min: 1, max: 4 },
      openOnly: false
    });
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    // Navigate to restaurant detail or menu page
    navigate(`/restaurants/${restaurant.id}`);
  };

  const getPriceDisplay = (priceRange: number) => {
    return '฿'.repeat(priceRange) + '฿'.repeat(4 - priceRange).replace(/฿/g, '○');
  };

  const getPriceLabel = (priceRange: number) => {
    switch (priceRange) {
      case 1: return 'Budget';
      case 2: return 'Moderate';
      case 3: return 'Upscale';
      case 4: return 'Fine Dining';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/restaurants')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Explore Cuisines</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{filteredRestaurants.length} restaurants found</span>
                  {!isLoadingLocation && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span>{currentCity}</span>
                      </div>
                    </>
                  )}
                  {isLoadingLocation && (
                    <>
                      <span>•</span>
                      <span className="text-gray-400">Detecting location...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Filter size={16} />
              <span>{showFilters ? 'Hide Filter' : 'Show Filter'}</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              {/* Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cuisine Types</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCuisines.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => handleCuisineToggle(cuisine)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        filters.selectedCuisines.includes(cuisine)
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Locations in {currentCity}</h3>
                <div className="flex flex-wrap gap-2">
                  {availableAreas.map(location => (
                    <button
                      key={location}
                      onClick={() => handleLocationToggle(location)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        filters.selectedLocations.includes(location)
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Price Range: {getPriceDisplay(filters.priceRange.min)} - {getPriceDisplay(filters.priceRange.max)}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>฿ Budget</span>
                    <span>฿฿ Moderate</span>
                    <span>฿฿฿ Upscale</span>
                    <span>฿฿฿฿ Fine Dining</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Min: {getPriceLabel(filters.priceRange.min)} ({getPriceDisplay(filters.priceRange.min)})
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Max: {getPriceLabel(filters.priceRange.max)} ({getPriceDisplay(filters.priceRange.max)})
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Only Filter */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="openOnly"
                  checked={filters.openOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, openOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="openOnly" className="text-sm text-gray-700">
                  Show only open restaurants
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Utensils size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRestaurants.map(restaurant => (
              <button
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="p-4">
                  {/* Top Row: Name, Cuisine, Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">{restaurant.cuisine}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex-shrink-0">
                      <Star size={14} className="text-amber-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                  </div>

                  {/* Image and Description Row */}
                  <div className="flex space-x-4 mb-3">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {restaurant.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Location, Price, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{restaurant.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="font-medium">
                          {restaurant.priceRange === 1 && 'Budget'}
                          {restaurant.priceRange === 2 && 'Moderate'}
                          {restaurant.priceRange === 3 && 'Upscale'}
                          {restaurant.priceRange === 4 && 'Fine Dining'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {restaurant.isOpen ? (
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">Open</span>
                          <span className="text-sm text-gray-500">• {restaurant.estimatedDeliveryTime}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-600 font-medium">Closed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialties Row */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {restaurant.specialties.slice(0, 4).map(specialty => (
                      <span
                        key={specialty}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                      >
                        {specialty}
                      </span>
                    ))}
                    {restaurant.specialties.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{restaurant.specialties.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CuisineExplorer; 