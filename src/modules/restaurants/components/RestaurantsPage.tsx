import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, QrCode, ChefHat, Calendar, Bot } from 'lucide-react';
import RestaurantCard from '@/ui-components/cards/RestaurantCard';
import ExploreCard from '@/ui-components/common/ExploreCard';
import Button from '@/ui-components/common/Button';
import MenuModal from './MenuModal';
import { Restaurant } from '../types';

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
    console.log('Explore:', type);
    // TODO: Navigate to respective feature
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button className="p-2">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Restaurants</h1>
        <button className="p-2">
          <Search size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-3">
          <Button
            variant={activeTab === 'menu' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setActiveTab('menu')}
            className="flex-1"
          >
            Menu
          </Button>
          <Button
            variant={activeTab === 'book' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setActiveTab('book')}
            className="flex-1"
          >
            Book a Table
          </Button>
          <Button
            variant={activeTab === 'offpeak' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setActiveTab('offpeak')}
            className="flex-1"
          >
            Off Peak Dining
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Explore Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore</h2>
          <div className="grid grid-cols-2 gap-4">
            <ExploreCard
              title="Explore Cuisines"
              icon={<ChefHat size={24} className="text-gray-600" />}
              onClick={() => handleExploreClick('explore-cuisines')}
            />
            <ExploreCard
              title="Discount Book"
              icon={<QrCode size={24} className="text-gray-600" />}
              onClick={() => handleExploreClick('discount-book')}
            />
            <ExploreCard
              title="Today's Deals"
              icon={<Calendar size={24} className="text-gray-600" />}
              onClick={() => handleExploreClick('todays-deals')}
            />
            <ExploreCard
              title="AI Assistant"
              icon={<Bot size={24} className="text-gray-600" />}
              onClick={() => handleExploreClick('ai-assistant')}
            />
          </div>
        </div>

        {/* Featured Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
          <div className="grid grid-cols-1 gap-6">
            {mockRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onBookClick={handleBookClick}
                onMenuClick={handleMenuClick}
                onOffPeakClick={handleOffPeakClick}
              />
            ))}
          </div>
        </div>
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
