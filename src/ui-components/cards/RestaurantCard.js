import React from 'react';
import Button from '@/ui-components/common/Button';
import ImageCarousel from '@/ui-components/common/ImageCarousel';
var RestaurantCard = function (_a) {
    var restaurant = _a.restaurant, onBookClick = _a.onBookClick, onMenuClick = _a.onMenuClick, onOffPeakClick = _a.onOffPeakClick;
    return (<div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Restaurant Images Carousel */}
      <div className="relative h-48 bg-gray-200">
        <ImageCarousel images={restaurant.photos || [restaurant.imageUrl].filter(Boolean)} alt={restaurant.name} className="h-full" showDots={true} showArrows={true}/>
        
        {/* Today's Deal Badge */}
        {restaurant.todaysDeal && (<div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Deal
          </div>)}
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
          {restaurant.hasReservation && (<Button variant="outline" size="sm" onClick={function () { return onBookClick === null || onBookClick === void 0 ? void 0 : onBookClick(restaurant.id); }} className="text-xs">
              Book
            </Button>)}
          
          <Button variant="outline" size="sm" onClick={function () { return onMenuClick === null || onMenuClick === void 0 ? void 0 : onMenuClick(restaurant.id); }} className="text-xs">
            Menu
          </Button>
          
          <Button variant="outline" size="sm" onClick={function () { return onOffPeakClick === null || onOffPeakClick === void 0 ? void 0 : onOffPeakClick(restaurant.id); }} className="text-xs">
            Off Peak
          </Button>
        </div>
      </div>
    </div>);
};
export default RestaurantCard;
