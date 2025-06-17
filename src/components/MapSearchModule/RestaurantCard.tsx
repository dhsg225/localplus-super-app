import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Utensils, Phone, ExternalLink, Calendar, Menu } from 'lucide-react';
import { BusinessResult, BusinessCardAction } from './types';
import ImageCarousel from '../../ui-components/common/ImageCarousel';

interface RestaurantCardProps {
  business: BusinessResult;
  actions: BusinessCardAction[];
  onAction: (action: BusinessCardAction, business: BusinessResult) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  business,
  actions,
  onAction,
  className = ''
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Load images for the restaurant
  useEffect(() => {
    const loadImages = async () => {
      if (!business.photos || business.photos.length === 0) {
        setImages([]);
        return;
      }

      setIsLoadingImages(true);
      try {
        // Use the photos from Google Places
        setImages(business.photos);
      } catch (error) {
        console.error('Error loading restaurant images:', error);
        setImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadImages();
  }, [business.photos]);

  // Generate mock data for missing fields to match existing design
  const mockSignatureDishes = business.cuisine || ['Local Specialty', 'Fresh Daily'];
  const mockFeatures = ['air-conditioning', 'parking'];
  const isOpen = business.openingHours?.isOpen ?? true;

  const renderHeroImage = () => {
    if (isLoadingImages) {
      return (
        <div className="relative w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <div className="text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      );
    }

    if (images.length > 0) {
      return (
        <div className="relative w-full h-64 rounded-t-lg overflow-hidden">
          <ImageCarousel 
            images={images} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
          
          {/* Status overlay */}
          <div className="absolute top-3 left-3 z-20">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Heart/Favorite button */}
          <button className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 z-20">
            <Star size={16} className="text-gray-600" />
          </button>

          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            📸 {images.length} photo{images.length > 1 ? 's' : ''}
          </div>
        </div>
      );
    }

    // Placeholder when no images available
    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-sm">No photos available</div>
        </div>
      </div>
    );
  };

  const getActionButton = (action: BusinessCardAction) => {
    const buttonClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    
    switch (action) {
      case 'view':
        return (
          <button
            onClick={() => onAction(action, business)}
            className={`${buttonClasses} bg-orange-500 text-white hover:bg-orange-600`}
          >
            <ExternalLink size={16} />
            <span>View Details</span>
          </button>
        );
      case 'call':
        return (
          <button
            onClick={() => onAction(action, business)}
            className={`${buttonClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            <Phone size={16} />
            <span>Call</span>
          </button>
        );
      case 'directions':
        return (
          <button
            onClick={() => onAction(action, business)}
            className={`${buttonClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            <MapPin size={16} />
            <span>Directions</span>
          </button>
        );
      case 'book':
        return (
          <button
            onClick={() => onAction(action, business)}
            className={`${buttonClasses} bg-orange-500 text-white hover:bg-orange-600`}
          >
            <Calendar size={16} />
            <span>Book Table</span>
          </button>
        );
      case 'menu':
        return (
          <button
            onClick={() => onAction(action, business)}
            className={`${buttonClasses} border border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            <Menu size={16} />
            <span>Menu</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Hero Image */}
      {renderHeroImage()}

      {/* Content */}
      <div className="p-4">
        {/* Header: Name, Cuisine, Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 leading-tight">
              {business.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">
                {business.types?.filter(type => 
                  ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type)
                ).join(', ') || 'Restaurant'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">
                {'฿'.repeat(business.priceLevel || 2)}
              </span>
            </div>
          </div>
          
          {business.rating && (
            <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <Star size={14} className="text-amber-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{business.rating.toFixed(1)}</span>
              {business.reviewCount && (
                <span className="text-xs text-gray-500">({business.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Signature Dishes Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {mockSignatureDishes.slice(0, 3).map((dish, index) => (
            <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
              {dish}
            </span>
          ))}
        </div>

        {/* Location & Timing */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span>{business.address?.split(',')[0] || 'Address not available'}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock size={14} className="text-gray-400" />
            <span>{isOpen ? 'Open now' : 'Closed'}</span>
          </div>
        </div>

        {/* Features row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {mockFeatures.map((feature, index) => (
              <div key={index} className="p-1.5 bg-gray-100 rounded-lg">
                {feature === 'air-conditioning' && <Clock size={14} className="text-gray-600" />}
                {feature === 'parking' && <Utensils size={14} className="text-gray-600" />}
              </div>
            ))}
          </div>

          {/* Phone number */}
          {business.phoneNumber && (
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-600">
                {business.phoneNumber}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <div key={action}>
              {getActionButton(action)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 