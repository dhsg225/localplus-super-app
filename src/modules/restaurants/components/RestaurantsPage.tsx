import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, QrCode, ChefHat, Calendar, Bot, Filter, MapPin, Star, Clock, Utensils, Coffee, Pizza, Fish } from 'lucide-react';
import RestaurantCard from '@/ui-components/cards/RestaurantCard';
import ExploreCard from '@/ui-components/common/ExploreCard';
import Button from '@/ui-components/common/Button';
import MenuModal from './MenuModal';
import { Restaurant } from '../types';

// Import advertising system
import AdContainer from "../../advertising/components/AdContainer";

// Mock data - in real app this would come from API
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Spice Merchant',
    description: 'Authentic Thai cuisine with modern presentation in a cozy, contemporary setting',
    cuisine: ['Thai'],
    priceRange: 'mid-range',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      'https://images.unsplash.com/photo-1571104508999-893933ded431?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: true,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    todaysDeal: {
      id: '1',
      restaurantId: '1',
      title: '20% off dinner',
      description: 'Valid until 9pm',
      discount: 20,
      validUntil: new Date(),
      isActive: true
    }
  },
  {
    id: '2',
    name: 'Siam Bistro',
    description: 'Modern fusion dining experience with innovative Asian flavors',
    cuisine: ['Fusion'],
    priceRange: 'upscale',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: true,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Riverfront Grill',
    description: 'Fresh seafood with stunning river views and outdoor terrace dining',
    cuisine: ['Seafood'],
    priceRange: 'upscale',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
    photos: [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: true,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Urban Eats',
    description: 'Contemporary urban dining with street food inspired dishes',
    cuisine: ['Modern'],
    priceRange: 'mid-range',
    imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400',
    photos: [
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: false,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Golden Spoon',
    description: 'Exquisite fine dining experience with award-winning cuisine',
    cuisine: ['Fine Dining'],
    priceRange: 'fine-dining',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    photos: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      'https://images.unsplash.com/photo-1571104508999-893933ded431?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: true,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Thai Delights',
    description: 'Traditional Thai flavors in an authentic family-run setting',
    cuisine: ['Authentic'],
    priceRange: 'budget',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
    photos: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'
    ],
    location: { id: '1', name: 'Bangkok', slug: 'bangkok', type: 'city' },
    hasReservation: true,
    openingHours: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const RestaurantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'book' | 'offpeak'>('menu');
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

  const cuisineTypes = [
    { id: "all", name: "All", icon: Utensils },
    { id: "thai", name: "Thai", icon: Coffee },
    { id: "italian", name: "Italian", icon: Pizza },
    { id: "seafood", name: "Seafood", icon: Fish },
  ];

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || restaurant.cuisine.some(c => c.toLowerCase() === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const handleBookClick = (restaurantId: string) => {
    console.log('Book restaurant:', restaurantId);
    // TODO: Navigate to booking page
  };

  const handleMenuClick = (restaurantId: string) => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      setMenuModal({
        isOpen: true,
        restaurantId,
        restaurantName: restaurant.name
      });
    }
  };

  const handleOffPeakClick = (restaurantId: string) => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
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
              <p className="text-sm text-gray-600">Discover amazing local dining</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
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

          {/* Enhanced Tier-Based Cuisine Filter */}
          <div className="space-y-3">
            {/* Tier 1 - Most Popular */}
            <div>
              <h3 className="text-xs font-medium text-green-700 mb-2">🏆 Most Popular in Coastal Areas</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-800 rounded-full whitespace-nowrap border border-green-200 hover:bg-green-100 transition-colors">
                  <span>🍛</span>
                  <span className="text-sm">Thai Traditional</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-800 rounded-full whitespace-nowrap border border-green-200 hover:bg-green-100 transition-colors">
                  <span>🦐</span>
                  <span className="text-sm">Fresh Seafood</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-800 rounded-full whitespace-nowrap border border-green-200 hover:bg-green-100 transition-colors">
                  <span>🍜</span>
                  <span className="text-sm">Street Food</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-800 rounded-full whitespace-nowrap border border-green-200 hover:bg-green-100 transition-colors">
                  <span>🥢</span>
                  <span className="text-sm">Chinese-Thai</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-800 rounded-full whitespace-nowrap border border-green-200 hover:bg-green-100 transition-colors">
                  <span>🌍</span>
                  <span className="text-sm">International</span>
                </button>
              </div>
            </div>

            {/* Tier 2 - Popular */}
            <div>
              <h3 className="text-xs font-medium text-blue-700 mb-2">🥈 Popular Choices</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-full whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span>🍛</span>
                  <span className="text-sm">Indian</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-full whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span>🍱</span>
                  <span className="text-sm">Japanese</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-full whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span>🍝</span>
                  <span className="text-sm">Italian</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-full whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span>🍽️</span>
                  <span className="text-sm">Fusion</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-full whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition-colors">
                  <span>🔥</span>
                  <span className="text-sm">BBQ & Grill</span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-xs font-medium text-gray-700 mb-2">⚡ Quick Filters</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-orange-50 text-orange-800 rounded-full whitespace-nowrap border border-orange-200 hover:bg-orange-100 transition-colors">
                  <span>🟢</span>
                  <span className="text-sm">Open Now</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-800 rounded-full whitespace-nowrap border border-red-200 hover:bg-red-100 transition-colors">
                  <span>💰</span>
                  <span className="text-sm">Current Promotions</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-800 rounded-full whitespace-nowrap border border-purple-200 hover:bg-purple-100 transition-colors">
                  <span>🏖️</span>
                  <span className="text-sm">Beachfront</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-800 rounded-full whitespace-nowrap border border-gray-200 hover:bg-gray-100 transition-colors">
                  <span>🌶️</span>
                  <span className="text-sm">Spicy Food</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleExploreClick('todays-deals')}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Today's Deals</h3>
              <p className="text-xs text-gray-600 mt-1">Special offers</p>
            </div>
          </button>
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
              {filteredRestaurants.length} restaurants found
            </h2>
            <button className="flex items-center space-x-1 text-red-500 text-sm font-medium">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Som Tam Paradise Style Cards */}
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Hero Image */}
                <div className="relative h-48">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.hasReservation 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.hasReservation ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Promotions badge */}
                  {restaurant.todaysDeal && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {restaurant.todaysDeal.discount}% OFF
                      </span>
                    </div>
                  )}

                  {/* Heart/Favorite button */}
                  <button className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                    <Star size={16} className="text-gray-600" />
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
                          {restaurant.cuisine.join(', ')}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
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
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                      Pad Thai
                    </span>
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                      Tom Yum
                    </span>
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                      Mango Sticky Rice
                    </span>
                  </div>

                  {/* Location & Timing */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{restaurant.location.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      <span>11:00 AM - 10:00 PM</span>
                    </div>
                  </div>

                  {/* Features row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Utensils size={14} className="text-gray-600" />
                      </div>
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <MapPin size={14} className="text-gray-600" />
                      </div>
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Clock size={14} className="text-gray-600" />
                      </div>
                    </div>

                    {/* Loyalty Program Indicator */}
                    <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                      <Star size={12} className="text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">
                        2x Points
                      </span>
                    </div>
                  </div>

                  {/* Current Promotions */}
                  {restaurant.todaysDeal && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800">
                        🎉 {restaurant.todaysDeal.title} - {restaurant.todaysDeal.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
      </div>
      
      {/* Menu Modal */}
      <MenuModal
        isOpen={menuModal.isOpen}
        onClose={closeMenuModal}
        restaurantId={menuModal.restaurantId}
        restaurantName={menuModal.restaurantName}
      />
    </div>
  );
};

export default RestaurantsPage;
