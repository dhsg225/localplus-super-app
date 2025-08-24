// [2025-01-06 14:40 UTC] - Enhanced Restaurant Discovery with tier-based filtering and Som Tam Paradise card style
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Star, Clock, Utensils, Search, Heart, Music, AirVent, Car } from 'lucide-react';
import { CUISINE_TIERS } from '../../../shared/constants/restaurants';
import { restaurantService } from '../../../services/restaurantService';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  diningStyle: string[];
  location: string;
  priceRange: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  heroImage: string;
  signatureDishes: string[];
  isOpen: boolean;
  features: string[];
  dietaryOptions: string[];
  loyaltyProgram?: {
    name: string;
    pointsMultiplier: number;
  };
  openingHours?: string;
  currentPromotions?: string[];
}

const EnhancedRestaurantDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState({
    cuisines: [] as string[],
    searchQuery: '',
    openOnly: false
  });

  // Load production restaurants on component mount
  useEffect(() => {
    loadProductionRestaurants();
  }, []);

  const loadProductionRestaurants = async () => {
    try {
      console.log('🏪 Loading restaurants for enhanced discovery...');
             const productionRestaurants = await restaurantService.getRestaurantsByLocation('Hua Hin');
      console.log('🏪 Loaded restaurants for enhanced discovery:', productionRestaurants.length);
      
             // Transform production data to match component interface
       const transformedRestaurants: Restaurant[] = productionRestaurants.map(restaurant => ({
         id: restaurant.id,
         name: restaurant.name,
         cuisine: restaurant.cuisine || [],
         diningStyle: ['casual'],
         location: restaurant.address || 'Location not specified',
         priceRange: (restaurant.priceRange || 2) as 1 | 2 | 3 | 4,
         rating: restaurant.rating || 4.0,
         reviewCount: restaurant.reviewCount || 0,
         heroImage: restaurant.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
         signatureDishes: restaurant.signatureDishes || [],
         isOpen: restaurant.status === 'active',
         features: restaurant.features || [],
         dietaryOptions: [],
         openingHours: restaurant.openingHours || '9:00 AM - 10:00 PM',
         currentPromotions: restaurant.currentPromotions || []
       }));
      
      setRestaurants(transformedRestaurants);
    } catch (error) {
      console.error('🏪 Failed to load restaurants for enhanced discovery:', error);
      setRestaurants([]);
    } finally {
    }
  };

  const allCuisines = [...CUISINE_TIERS.tier1, ...CUISINE_TIERS.tier2, ...CUISINE_TIERS.tier3];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchMatch = 
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.signatureDishes.some(dish => dish.toLowerCase().includes(query));
        if (!searchMatch) return false;
      }
      
      if (filters.cuisines.length > 0) {
        const cuisineMatch = filters.cuisines.some(cuisine => 
          restaurant.cuisine.includes(cuisine)
        );
        if (!cuisineMatch) return false;
      }
      
      if (filters.openOnly && !restaurant.isOpen) {
        return false;
      }
      
      return true;
    });
  }, [restaurants, filters]);

  const toggleCuisine = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const getPriceDisplay = (priceRange: number) => {
    return '฿'.repeat(priceRange);
  };

  const getCuisineLabel = (value: string) => {
    const cuisine = allCuisines.find(c => c.value === value);
    return cuisine?.label || value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Restaurants</h1>
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

          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              {/* Quick toggles */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, openOnly: !prev.openOnly }))}
                  className={`px-3 py-2 text-sm rounded-lg border ${
                    filters.openOnly
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Open Now
                </button>
              </div>

              {/* Tier-based Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cuisine Types</h3>
                <div className="space-y-3">
                  {/* Tier 1 - Essential */}
                  <div>
                    <h4 className="text-xs font-medium text-green-700 mb-1">🏆 Most Popular</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier1.map(cuisine => (
                        <button
                          key={cuisine.value}
                          onClick={() => toggleCuisine(cuisine.value)}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            filters.cuisines.includes(cuisine.value)
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {cuisine.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier 2 - Important */}
                  <div>
                    <h4 className="text-xs font-medium text-blue-700 mb-1">🥈 Popular</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier2.map(cuisine => (
                        <button
                          key={cuisine.value}
                          onClick={() => toggleCuisine(cuisine.value)}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            filters.cuisines.includes(cuisine.value)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {cuisine.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier 3 - Growing */}
                  <div>
                    <h4 className="text-xs font-medium text-purple-700 mb-1">🥉 Emerging</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier3.map(cuisine => (
                        <button
                          key={cuisine.value}
                          onClick={() => toggleCuisine(cuisine.value)}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            filters.cuisines.includes(cuisine.value)
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {cuisine.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Som Tam Paradise Style Restaurant Cards */}
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
          <div className="space-y-4">
            {filteredRestaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Hero Image */}
                <div className="relative h-48">
                  <img 
                    src={restaurant.heroImage} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.isOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Promotions badge */}
                  {restaurant.currentPromotions && restaurant.currentPromotions.length > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        PROMO
                      </span>
                    </div>
                  )}

                  {/* Heart/Favorite button */}
                  <button className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                    <Heart size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Header: Name, Cuisine, Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {restaurant.cuisine.map(c => getCuisineLabel(c)).join(', ')}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{getPriceDisplay(restaurant.priceRange)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                      <Star size={14} className="text-amber-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                  </div>

                  {/* Signature Dishes Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.signatureDishes.slice(0, 3).map(dish => (
                      <span 
                        key={dish}
                        className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>

                  {/* Location & Timing */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      <span>{restaurant.openingHours}</span>
                    </div>
                  </div>

                  {/* Features row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {restaurant.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="p-1.5 bg-gray-100 rounded-lg">
                          {feature === 'live-music' && <Music size={14} className="text-gray-600" />}
                          {feature === 'air-conditioning' && <AirVent size={14} className="text-gray-600" />}
                          {feature === 'parking' && <Car size={14} className="text-gray-600" />}
                          {!['live-music', 'air-conditioning', 'parking'].includes(feature) && <Utensils size={14} className="text-gray-600" />}
                        </div>
                      ))}
                    </div>

                    {/* Loyalty Program Indicator */}
                    {restaurant.loyaltyProgram && (
                      <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <Star size={12} className="text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">
                          {restaurant.loyaltyProgram.pointsMultiplier}x Points
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Current Promotions */}
                  {restaurant.currentPromotions && restaurant.currentPromotions.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800">
                        🎉 {restaurant.currentPromotions[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRestaurantDiscovery; 