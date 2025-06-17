// [2025-01-07 12:00 UTC] - Consumer Example Implementation
// Shows how to integrate MapSearchModule in the Restaurants page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapSearchModule from '../index';
import { BusinessResult, BusinessCardAction } from '../types';

const ConsumerMapExample: React.FC = () => {
  const navigate = useNavigate();

  // Handle business actions
  const handleBusinessAction = (action: BusinessCardAction, business: BusinessResult) => {
    switch (action) {
      case 'view':
        // Navigate to restaurant detail page
        navigate(`/restaurants/${business.id}`);
        break;
        
      case 'call':
        if (business.phoneNumber) {
          window.location.href = `tel:${business.phoneNumber}`;
        }
        break;
        
      case 'book':
        // Navigate to booking page or open booking modal
        navigate(`/restaurants/${business.id}/book`);
        break;
        
      case 'menu':
        // Open menu modal or navigate to menu page
        navigate(`/restaurants/${business.id}/menu`);
        break;
        
      case 'directions':
        // Open Google Maps directions
        const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
        window.open(url, '_blank');
        break;
        
      default:
        console.log('Action not handled:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
              <p className="text-gray-600">Discover amazing local dining in Hua Hin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Search Module */}
      <div className="p-4">
        <MapSearchModule
          context="consumer"
          resultCardType="restaurant"
          actions={['view', 'call', 'directions', 'book', 'menu']}
          filtersEnabled={true}
          radiusSlider={true}
          showMap={true}
          cardLayout="grid"
          onBusinessAction={handleBusinessAction}
          onBusinessSelect={(business) => {
            console.log('Selected business:', business.name);
          }}
          onLocationChange={(location) => {
            console.log('Location changed:', location);
          }}
          className="max-w-7xl mx-auto"
        />
      </div>
    </div>
  );
};

export default ConsumerMapExample; 