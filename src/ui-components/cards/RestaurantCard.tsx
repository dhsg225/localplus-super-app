import React from 'react';
import { Restaurant } from '../../modules/restaurants/types';
import Button from '../common/Button';
import ImageCarousel from '../common/ImageCarousel';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookClick?: (restaurantId: string) => void;
  onMenuClick?: (restaurantId: string) => void;
  onOffPeakClick?: (restaurantId: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onBookClick,
  onMenuClick,
  onOffPeakClick
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Restaurant Images Carousel */}
      <div className="relative h-48 bg-gray-200">
        <ImageCarousel
          images={(restaurant.photos || [restaurant.imageUrl]).filter((url): url is string => !!url)}
          alt={restaurant.name}
          className="h-full"
          showDots={true}
          showArrows={true}
        />
        
        {/* Today's Deal Badge */}
        {restaurant.todaysDeal && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Deal
          </div>
        )}
      </div>
      
      {/* Restaurant Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {restaurant.name}
        </h3>
        
        {/* Brief Description */}
        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
          {restaurant.description}
        </p>
        
        <p className="text-gray-500 text-xs mb-3">
          {restaurant.cuisine.join(' • ')}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {restaurant.hasReservation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBookClick?.(restaurant.id)}
              className="text-xs"
            >
              Book
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMenuClick?.(restaurant.id)}
            className="text-xs"
          >
            Menu
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOffPeakClick?.(restaurant.id)}
            className="text-xs"
          >
            Off Peak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard; 