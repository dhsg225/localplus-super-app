import React, { useState } from 'react';
import { MapPin, Star, ChevronRight } from 'lucide-react';
var OffPeakDealCard = function (_a) {
    var deal = _a.deal, selectedDate = _a.selectedDate, selectedPax = _a.selectedPax, onBookNow = _a.onBookNow;
    var _b = useState(false), showTimeSlots = _b[0], setShowTimeSlots = _b[1];
    var formatPrice = function (price) {
        return "\u0E3F".concat(price.toLocaleString());
    };
    var getDealTypeColor = function (type) {
        switch (type) {
            case 'early-bird': return 'bg-orange-100 text-orange-700';
            case 'afternoon': return 'bg-blue-100 text-blue-700';
            case 'late-night': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    var getDealTypeLabel = function (type) {
        switch (type) {
            case 'early-bird': return 'Early Bird';
            case 'afternoon': return 'Afternoon';
            case 'late-night': return 'Late Night';
            default: return type;
        }
    };
    var availableTimeSlots = deal.timeSlots.filter(function (slot) { return slot.isAvailable; });
    return (<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Restaurant Image and Deal Badge */}
      <div className="relative">
        <img src={deal.restaurantImage} alt={deal.restaurantName} className="w-full h-40 object-cover"/>
        
        {/* Deal Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(getDealTypeColor(deal.dealType))}>
            {getDealTypeLabel(deal.dealType)}
          </span>
          {deal.isPopular && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Popular
            </span>)}
          {deal.isLimitedTime && (<span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              Limited Time
            </span>)}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{deal.discountPercentage}%
          </span>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{deal.restaurantName}</h3>
            <p className="text-gray-600 text-sm">{deal.cuisine}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin size={12}/>
                <span>{deal.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current"/>
                <span>{deal.rating}</span>
                <span>({deal.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(deal.discountedPrice)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(deal.originalPrice)}
            </span>
            <span className="text-xs text-gray-500">per person</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Save {formatPrice(deal.originalPrice - deal.discountedPrice)}</div>
          </div>
        </div>

        {/* Available Time Slots Preview */}
        {availableTimeSlots.length > 0 && (<div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Available Times</span>
              <button onClick={function () { return setShowTimeSlots(!showTimeSlots); }} className="text-xs text-red-600 flex items-center space-x-1">
                <span>{showTimeSlots ? 'Hide' : 'View All'}</span>
                <ChevronRight size={12} className={"transform transition-transform ".concat(showTimeSlots ? 'rotate-90' : '')}/>
              </button>
            </div>
            
            <div className={"grid gap-2 transition-all duration-200 ".concat(showTimeSlots ? 'grid-cols-2' : 'grid-cols-3')}>
              {(showTimeSlots ? availableTimeSlots : availableTimeSlots.slice(0, 3)).map(function (slot) { return (<div key={slot.id} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs font-medium text-gray-900">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {slot.remainingSeats} seats left
                  </div>
                </div>); })}
            </div>
          </div>)}

        {/* Book Now Button */}
        <button onClick={function () { return onBookNow === null || onBookNow === void 0 ? void 0 : onBookNow(deal); }} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
          Book Now for {selectedPax} guest{selectedPax !== 1 ? 's' : ''}
        </button>

        {/* Terms Link */}
        <div className="mt-3 text-center">
          <button className="text-xs text-gray-500 underline">
            View terms & conditions
          </button>
        </div>
      </div>
    </div>);
};
export default OffPeakDealCard;
