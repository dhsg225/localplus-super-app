import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, QrCode, Bot, Filter, MapPin, Star, Clock, Utensils, Coffee, Pizza, Fish, Map } from 'lucide-react';
import MenuModal from './MenuModal';
import { restaurantService, ProductionRestaurant } from '../../../services/restaurantService';
import { dynamicSelectorService, type LocationBasedSelectors } from '../../../shared/constants/dynamicSelectors';
import AdContainer from "../../advertising/components/AdContainer";
import ImageCarousel from '../../../ui-components/common/ImageCarousel';
import MapSearchModule from '../../../components/MapSearchModule';
import { Business } from '../../../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004';

// [2024-12-19 11:05 UTC] - Removed mock data, now using production restaurants from database

// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
// [2024-05-22] REFACTORED to use photo_gallery from the database, removing live API calls.
const RestaurantImage: React.FC<{ restaurant: ProductionRestaurant }> = ({ restaurant }) => {
  // [2025-01-03 16:20] - Fixed photo URL handling to use direct Supabase Storage URLs
  // photo_gallery now contains direct URLs, not photo_reference objects
  
  const images = (restaurant.photo_gallery || []).filter(photo => 
    typeof photo === 'string' && photo.length > 0
  );

  // [2025-01-05 10:05] - Debug logging for broken images
  console.log(`🖼️ RestaurantImage Debug for ${restaurant.name}:`);
  console.log(`🖼️ Raw photo_gallery:`, restaurant.photo_gallery);
  console.log(`🖼️ Filtered images:`, images);
  console.log(`🖼️ Images count:`, images.length);
  
  if (images.length > 0) {
    console.log(`🖼️ First image URL:`, images[0]);
    console.log(`🖼️ Passing to ImageCarousel:`, images);
  }

  // Show image gallery if available
  if (images.length > 0) {
    return (
      <div className="relative w-full h-64 rounded-t-lg overflow-hidden">
        <ImageCarousel 
          images={images} 
          alt={restaurant.name}
          className="w-full h-full"
        />
        
        {/* Photo count badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-medium">
          {images.length} photos
        </div>
      </div>
    );
  }

  // Fallback placeholder when no photos available
  return (
    <div className="relative w-full h-64 rounded-t-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No photos available</p>
      </div>
    </div>
  );
};

const RestaurantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState('Hua Hin');
  const [productionRestaurants, setProductionRestaurants] = useState<ProductionRestaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [dynamicSelectors, setDynamicSelectors] = useState<LocationBasedSelectors | null>(null);
  const [isLoadingSelectors, setIsLoadingSelectors] = useState(true);
  const [menuModal, setMenuModal] = useState<{
    isOpen: boolean;
    restaurantId: string;
    restaurantName: string;
  }>({
    isOpen: false,
    restaurantId: '',
    restaurantName: ''
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // [2025-01-07 02:40 UTC] - Added map/list toggle

  // Location detection and restaurant loading
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Check if user has manually selected location
        const storedLocation = localStorage.getItem('user-selected-location');
        if (storedLocation) {
          setCurrentLocation(storedLocation);
          return storedLocation;
        }

        // Auto-detect location via IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const detectedCity = (data.city || '').toLowerCase();
        const detectedRegion = (data.region || '').toLowerCase();
        
        let location = 'Hua Hin'; // Default to Hua Hin for coastal focus
        
        // Check for supported areas
        if (detectedCity.includes('hua hin') || detectedRegion.includes('prachuap')) {
          location = 'Hua Hin';
        } else if (detectedCity.includes('pattaya') || detectedRegion.includes('chonburi')) {
          location = 'Pattaya';
        } else if (detectedCity.includes('phuket')) {
          location = 'Phuket';
        } else if (detectedCity.includes('chiang mai')) {
          location = 'Chiang Mai';
        } else if (detectedCity.includes('hua hin') || detectedRegion.includes('prachuap khiri khan')) {
          location = 'Hua Hin';
        } else {
          location = 'Hua Hin';  // Changed default from Bangkok to Hua Hin
        }
        
        setCurrentLocation(location);
        return location;
      } catch (error) {
        console.error('Location detection failed:', error);
        setCurrentLocation('Hua Hin');
        return 'Hua Hin';
      }
    };

    const loadRestaurants = async () => {
      console.log('🚨 STARTING loadRestaurants function');
      setIsLoadingRestaurants(true);
      setIsLoadingSelectors(true);
      try {
        const location = await detectLocation();
        console.log('🏪 Loading restaurants for location:', location);
        
        // Load restaurants and dynamic selectors in parallel
        console.log('🚨 BEFORE Promise.all');
        const [restaurants, selectors] = await Promise.all([
          restaurantService.getRestaurantsByLocation(location),
          dynamicSelectorService.generateLocationSelectors(location)
        ]);
        console.log('🚨 AFTER Promise.all');
        
        console.log('🏪 Loaded restaurants:', restaurants.length, 'restaurants');
        console.log('🎯 Loaded dynamic selectors:', selectors);
        
        setProductionRestaurants(restaurants);
        setDynamicSelectors(selectors);
      } catch (error) {
        console.error('🏪 Failed to load restaurants:', error);
        console.log('🚨 ERROR in loadRestaurants:', error);
        setProductionRestaurants([]);
        setDynamicSelectors(null);
      } finally {
        console.log('🚨 SETTING LOADING STATES TO FALSE');
        setIsLoadingRestaurants(false);
        setIsLoadingSelectors(false);
        console.log('🚨 LOADING STATES SET TO FALSE');
      }
    };

    loadRestaurants();
  }, []);

  const cuisineTypes = [
    { id: "all", name: "All", icon: Utensils },
    { id: "thai", name: "Thai", icon: Coffee },
    { id: "italian", name: "Italian", icon: Pizza },
    { id: "seafood", name: "Seafood", icon: Fish },
  ];

  const filteredRestaurants = productionRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Enhanced filtering using dynamic selectors
    const matchesFilter = selectedFilter === "all" || 
      restaurant.cuisine?.some(c => c.toLowerCase() === selectedFilter) ||
      restaurant.cuisine?.some(c => c.includes(selectedFilter)) ||
      // Check if selector ID matches any cuisine types
      (dynamicSelectors && [...dynamicSelectors.mostPopular, ...dynamicSelectors.popularChoices]
        .find(s => s.id === selectedFilter)?.localPlusCuisines?.some(lc => 
          restaurant.cuisine?.includes(lc)
        ));
    
    return matchesSearch && matchesFilter;
  });

  const handleBookClick = (restaurantId: string) => {
    console.log('Book restaurant:', restaurantId);
    // TODO: Navigate to booking page
  };

  const handleMenuClick = (restaurantId: string) => {
    const restaurant = productionRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      setMenuModal({
        isOpen: true,
        restaurantId: restaurantId,
        restaurantName: restaurant.name
      });
    }
  };

  const handleOffPeakClick = (restaurantId: string) => {
    const restaurant = productionRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      // Navigate to off-peak page with restaurant filter
      navigate(`/off-peak?restaurant=${encodeURIComponent(restaurant.name)}`);
    }
  };

  const closeMenuModal = () => {
    setMenuModal({
      isOpen: false,
      restaurantId: '',
      restaurantName: ''
    });
  };

  const handleExploreClick = (type: string) => {
    switch (type) {
      case 'explore-cuisines':
        // Navigate to dedicated cuisine explorer page
        navigate('/explore-cuisines');
        break;
      case 'discount-book':
        // Navigate to discount/deals page
        navigate('/off-peak');
        break;
      case 'todays-deals':
        // Navigate to dedicated today's deals page
        navigate('/todays-deals');
        break;
      case 'ai-assistant':
        // Navigate to AI assistant
        navigate('/ai-assistant');
        break;
      default:
        console.log('Explore:', type);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Restaurants</h1>
              <p className="text-sm text-gray-600">Discover amazing local dining in {currentLocation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* [2025-01-07 02:40 UTC] - View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Utensils size={16} className="inline mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map size={16} className="inline mr-2" />
              Map View
            </button>
          </div>
        </div>

        {/* [2025-01-07 02:40 UTC] - Conditional rendering: Map or List */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-lg shadow-sm">
            <MapSearchModule
              context="consumer"
              resultCardType="restaurant"
              actions={['view', 'call', 'directions', 'book', 'menu']}
              onDirections={(business: Business) => {
                const address = encodeURIComponent(business.address || business.name);
                window.open(`https://maps.google.com?daddr=${address}`, '_blank');
              }}
              onBook={(business: Business) => navigate(`/restaurants/${business.id}/book`)}
              onMenu={(business: Business) => handleMenuClick(business.id)}
              className="h-[600px]"
            />
          </div>
        ) : (
          <>
            {/* Original List View Content */}
        {/* Restaurant Service Tiles */}
        <section className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleExploreClick('todays-deals')}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 hover:shadow-md transition-all"
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">Today's Deals</h3>
              <p className="text-xs text-gray-600 mt-0.5">Special offers</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/passport')}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-xl border-2 border-yellow-300 hover:shadow-md transition-all"
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <QrCode size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">Savings Passport</h3>
              <p className="text-xs text-gray-600 mt-0.5">Instant savings</p>
            </div>
          </button>
          
          <button
            onClick={() => handleExploreClick('ai-assistant')}
            className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-xl border border-purple-200 hover:shadow-md transition-all relative"
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bot size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">AI Concierge</h3>
              <p className="text-xs text-gray-600 mt-0.5">Coming soon</p>
            </div>
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
              SOON
            </div>
          </button>
        </section>

        {/* [2024-05-10 17:30 UTC] - Top Advertising Section */}
        <section>
          <AdContainer 
            placement="restaurants-top"
            maxAds={1}
            categoryFilter={['dining', 'internal-promotion']}
            size="large"
          />
        </section>

        {/* Search and Filter */}
        <section className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Dynamic Smart Selectors */}
          {isLoadingSelectors ? (
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-gray-100 rounded-full w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : dynamicSelectors ? (
            <div className="space-y-3">
              {/* Most Popular in Location */}
              {dynamicSelectors.mostPopular.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-green-700 mb-2">
                    🏆 Most Popular in {currentLocation}
                  </h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.mostPopular.map(selector => (
                      <button
                        key={selector.id}
                        onClick={() => setSelectedFilter(selector.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap border transition-colors ${
                          selectedFilter === selector.id
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (
                          <span className="text-xs bg-green-200 text-green-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Choices */}
              {dynamicSelectors.popularChoices.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-blue-700 mb-2">🥈 Popular Choices</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.popularChoices.map(selector => (
                      <button
                        key={selector.id}
                        onClick={() => setSelectedFilter(selector.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap border transition-colors ${
                          selectedFilter === selector.id
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (
                          <span className="text-xs bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              {dynamicSelectors.quickFilters.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-gray-700 mb-2">⚡ Quick Filters</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.quickFilters.map(selector => (
                      <button
                        key={selector.id}
                        onClick={() => console.log('Quick filter:', selector.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-800 rounded-full whitespace-nowrap border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Data source indicator */}
              <div className="text-xs text-gray-500 mt-2">
                🎯 Smart suggestions based on real data • Updated {dynamicSelectors.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Unable to load cuisine options</p>
            </div>
          )}
        </section>

        {/* External Ads Section */}
        <section>
          <AdContainer 
            placement="restaurants-top"
            maxAds={2}
            showOnlyExternal={true}
            displayType="banner"
            categoryFilter={['dining', 'technology']}
            className="space-y-3"
          />
        </section>

        {/* Restaurant List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLoadingRestaurants ? 'Loading restaurants...' : `${filteredRestaurants.length} restaurants found`}
            </h2>
            <button className="flex items-center space-x-1 text-red-500 text-sm font-medium">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {isLoadingRestaurants ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="flex space-x-2 mb-3">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Som Tam Paradise Style Cards - Production Data */}
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                  {/* Hero Image */}
                  
                  <RestaurantImage restaurant={restaurant} />

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
                            {restaurant.cuisine?.join(', ') || 'Restaurant'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">
                            {'฿'.repeat(restaurant.priceRange || 2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                        <Star size={14} className="text-amber-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">4.{Math.floor(Math.random() * 9) + 1}</span>
                        <span className="text-xs text-gray-500">({Math.floor(Math.random() * 1000) + 100})</span>
                      </div>
                    </div>

                    {/* Signature Dishes Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.signatureDishes?.slice(0, 3).map((dish, index) => (
                        <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                          {dish}
                        </span>
                      )) || (
                        <>
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                            Local Specialty
                          </span>
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                            Fresh Daily
                          </span>
                        </>
                      )}
                    </div>

                    {/* Location & Timing */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{restaurant.address.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span>{restaurant.openingHours || '11:00 AM - 10:00 PM'}</span>
                      </div>
                    </div>

                    {/* Features row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {restaurant.features?.slice(0, 3).map((feature, index) => (
                          <div key={index} className="p-1.5 bg-gray-100 rounded-lg">
                            {feature === 'beachfront-view' && <MapPin size={14} className="text-gray-600" />}
                            {feature === 'air-conditioning' && <Clock size={14} className="text-gray-600" />}
                            {feature === 'parking' && <Utensils size={14} className="text-gray-600" />}
                            {!['beachfront-view', 'air-conditioning', 'parking'].includes(feature) && <Utensils size={14} className="text-gray-600" />}
                          </div>
                        )) || (
                          <>
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Utensils size={14} className="text-gray-600" />
                            </div>
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Clock size={14} className="text-gray-600" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Loyalty Program Indicator */}
                      {restaurant.loyaltyProgram ? (
                        <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                          <Star size={12} className="text-purple-600" />
                          <span className="text-xs font-medium text-purple-700">
                            {restaurant.loyaltyProgram.pointsMultiplier}x Points
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                          <span className="text-xs font-medium text-gray-600">
                            Call: {restaurant.phone}
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
        </section>

        {/* [2024-05-10 17:30 UTC] - Bottom Advertising Section */}
        <section>
          <AdContainer 
            placement="restaurants-bottom"
            maxAds={1}
            categoryFilter={['technology', 'services']}
            size="medium"
          />
        </section>
          </>
        )}
      </div>
      
      {/* Menu Modal */}
      <MenuModal
        isOpen={menuModal.isOpen}
        onClose={closeMenuModal}
        restaurantName={menuModal.restaurantName}
      />
    </div>
  );
};

export default RestaurantsPage;
