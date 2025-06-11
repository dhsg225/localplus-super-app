import React, { useState, useMemo } from 'react';
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
    location: 'Silom, Bangkok',
    priceRange: 1,
    rating: 4.6,
    reviewCount: 1250,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Authentic Isaan-style som tam and northeastern Thai specialties',
    specialties: ['Som Tam', 'Larb', 'Sticky Rice'],
    isOpen: true,
    estimatedDeliveryTime: '25-35 min'
  },
  {
    id: '2',
    name: 'Blue Elephant',
    cuisine: 'Fine Dining Thai',
    location: 'Sathorn, Bangkok',
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
    location: 'Thonglor, Bangkok',
    priceRange: 3,
    rating: 4.7,
    reviewCount: 650,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Premium omakase experience with fresh daily imports',
    specialties: ['Omakase Set', 'Otoro Sashimi', 'Chirashi Bowl'],
    isOpen: false,
    estimatedDeliveryTime: 'Closed'
  },
  {
    id: '4',
    name: 'Gaga Milano',
    cuisine: 'Italian',
    location: 'Asok, Bangkok',
    priceRange: 3,
    rating: 4.5,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Authentic Italian pasta and wood-fired pizzas',
    specialties: ['Truffle Pasta', 'Margherita Pizza', 'Tiramisu'],
    isOpen: true,
    estimatedDeliveryTime: '30-40 min'
  },
  {
    id: '5',
    name: 'Krua Ban Kluay',
    cuisine: 'Southern Thai',
    location: 'Chinatown, Bangkok',
    priceRange: 2,
    rating: 4.4,
    reviewCount: 780,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Spicy southern Thai curries and fresh seafood',
    specialties: ['Gaeng Som', 'Satay', 'Massaman Curry'],
    isOpen: true,
    estimatedDeliveryTime: '20-30 min'
  },
  {
    id: '6',
    name: 'Bistro M',
    cuisine: 'French',
    location: 'Sukhumvit, Bangkok',
    priceRange: 4,
    rating: 4.6,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Classic French bistro with modern presentation',
    specialties: ['Coq au Vin', 'Bouillabaisse', 'Crème Brûlée'],
    isOpen: true,
    estimatedDeliveryTime: '40-50 min'
  },
  {
    id: '7',
    name: 'Pad Thai Thip Samai',
    cuisine: 'Thai Street Food',
    location: 'Phra Nakhon, Bangkok',
    priceRange: 1,
    rating: 4.3,
    reviewCount: 2100,
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Famous for the best Pad Thai in Bangkok since 1966',
    specialties: ['Pad Thai Superb', 'Pad Thai with Crab', 'Thai Tea'],
    isOpen: true,
    estimatedDeliveryTime: '15-25 min'
  },
  {
    id: '8',
    name: 'Nahm',
    cuisine: 'Modern Thai',
    location: 'Sathorn, Bangkok',
    priceRange: 4,
    rating: 4.9,
    reviewCount: 560,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Michelin-starred modern interpretations of traditional Thai cuisine',
    specialties: ['Tasting Menu', 'Green Curry', 'Thai Herbs Salad'],
    isOpen: false,
    estimatedDeliveryTime: 'Closed'
  }
];

interface CuisineFilters {
  selectedCuisines: string[];
  selectedLocations: string[];
  priceRange: { min: number; max: number }; // 1-4 scale
  openOnly: boolean;
}

const CuisineExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CuisineFilters>({
    selectedCuisines: [],
    selectedLocations: [],
    priceRange: { min: 1, max: 4 },
    openOnly: false
  });

  // Extract unique cuisines and locations
  const availableCuisines = useMemo(() => 
    Array.from(new Set(mockRestaurants.map(restaurant => restaurant.cuisine))).sort()
  , []);

  const availableLocations = useMemo(() => 
    Array.from(new Set(mockRestaurants.map(restaurant => restaurant.location))).sort()
  , []);

  // Filter restaurants based on current filters
  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter(restaurant => {
      const cuisineMatch = filters.selectedCuisines.length === 0 || 
        filters.selectedCuisines.includes(restaurant.cuisine);
      
      const locationMatch = filters.selectedLocations.length === 0 || 
        filters.selectedLocations.includes(restaurant.location);
      
      const priceMatch = restaurant.priceRange >= filters.priceRange.min && 
        restaurant.priceRange <= filters.priceRange.max;
      
      const openMatch = !filters.openOnly || restaurant.isOpen;
      
      return cuisineMatch && locationMatch && priceMatch && openMatch;
    });
  }, [filters]);

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
                <p className="text-sm text-gray-600">{filteredRestaurants.length} restaurants found</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Filter size={16} />
              <span>Filter</span>
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
                <h3 className="text-sm font-medium text-gray-900 mb-2">Locations in Bangkok</h3>
                <div className="flex flex-wrap gap-2">
                  {availableLocations.map(location => (
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
                  Price Range: {getPriceLabel(filters.priceRange.min)} - {getPriceLabel(filters.priceRange.max)}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Min</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Max</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                      className="w-full"
                    />
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
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow text-left"
              >
                <div className="flex">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-24 h-24 object-cover"
                  />
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{restaurant.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{restaurant.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign size={14} />
                          <span>{getPriceDisplay(restaurant.priceRange)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {restaurant.isOpen ? (
                          <span className="text-xs text-green-600 font-medium">
                            Open • {restaurant.estimatedDeliveryTime}
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Closed</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {restaurant.specialties.slice(0, 3).map(specialty => (
                        <span
                          key={specialty}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
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