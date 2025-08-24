// [2025-01-07 11:45 UTC] - Context-Aware Business Card Component
// Unified business card that adapts to consumer and admin contexts
import React from 'react';
import { MapPin, Star, Phone, Globe } from 'lucide-react';
import { ACTION_CONFIGS } from './config';
var BusinessCard = function (_a) {
    var _b, _c, _d;
    var business = _a.business, context = _a.context, actions = _a.actions, _e = _a.layout, layout = _e === void 0 ? 'grid' : _e, onAction = _a.onAction, _f = _a.className, className = _f === void 0 ? '' : _f;
    // Get primary image
    var primaryImage = (_b = business.photos) === null || _b === void 0 ? void 0 : _b[0];
    // Format price level display
    var getPriceDisplay = function (level) {
        if (!level)
            return '';
        return '฿'.repeat(level);
    };
    // Format rating display
    var getRatingDisplay = function () {
        if (!business.rating)
            return null;
        return (<div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
        <Star size={12} className="text-amber-500 fill-current"/>
        <span className="text-sm font-medium text-gray-900">{business.rating}</span>
        {business.reviewCount && (<span className="text-xs text-gray-500">({business.reviewCount})</span>)}
      </div>);
    };
    // Render action buttons
    var renderActions = function () {
        return (<div className="flex flex-wrap gap-2 mt-3">
        {actions.map(function (action) {
                var config = ACTION_CONFIGS[action];
                var Icon = config.icon;
                return (<button key={action} onClick={function () { return onAction(action, business); }} className={"\n                flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors\n                ".concat(config.variant === 'primary' ? 'bg-orange-500 text-white hover:bg-orange-600' : '', "\n                ").concat(config.variant === 'outline' ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : '', "\n                ").concat(config.variant === 'success' ? 'bg-green-500 text-white hover:bg-green-600' : '', "\n                ").concat(config.variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : '', "\n              ")}>
              <Icon size={14}/>
              <span>{config.label}</span>
            </button>);
            })}
      </div>);
    };
    // Grid layout (consumer-friendly)
    if (layout === 'grid') {
        return (<div className={"bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ".concat(className)}>
        {/* Hero Image */}
        <div className="relative h-48 bg-gray-200">
          {primaryImage ? (<img src={primaryImage} alt={business.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-2">🏪</div>
                <div className="text-sm">No photo available</div>
              </div>
            </div>)}
          
          {/* Status badges */}
          <div className="absolute top-3 left-3">
            {((_c = business.openingHours) === null || _c === void 0 ? void 0 : _c.isOpen) !== undefined && (<span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(business.openingHours.isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800')}>
                {business.openingHours.isOpen ? 'Open' : 'Closed'}
              </span>)}
          </div>

          {/* Admin-specific status */}
          {context === 'admin' && business.approvalStatus && (<div className="absolute top-3 right-3">
              <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(business.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    business.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800')}>
                {business.approvalStatus}
              </span>
            </div>)}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight truncate">
                {business.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {business.cuisine && business.cuisine.length > 0 && (<span className="text-sm text-gray-600">
                    {business.cuisine.join(', ')}
                  </span>)}
                {business.priceLevel && (<>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">
                      {getPriceDisplay(business.priceLevel)}
                    </span>
                  </>)}
              </div>
            </div>
            {getRatingDisplay()}
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
            <MapPin size={14} className="text-gray-400"/>
            <span className="truncate">{business.address}</span>
          </div>

          {/* Contact info for consumer context */}
          {context === 'consumer' && (business.phoneNumber || business.website) && (<div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              {business.phoneNumber && (<div className="flex items-center space-x-1">
                  <Phone size={14} className="text-gray-400"/>
                  <span>{business.phoneNumber}</span>
                </div>)}
              {business.website && (<div className="flex items-center space-x-1">
                  <Globe size={14} className="text-gray-400"/>
                  <span className="text-blue-600 hover:underline cursor-pointer">Website</span>
                </div>)}
            </div>)}

          {/* Admin-specific info */}
          {context === 'admin' && (<div className="text-xs text-gray-500 mb-3 space-y-1">
              {business.source && (<div>Source: {business.source.replace(/_/g, ' ')}</div>)}
              {business.addedDate && (<div>Added: {business.addedDate.toLocaleDateString()}</div>)}
              {business.placeId && (<div className="font-mono truncate">ID: {business.placeId}</div>)}
            </div>)}

          {/* Action buttons */}
          {renderActions()}
        </div>
      </div>);
    }
    // List layout (admin-friendly)
    return (<div className={"bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow ".concat(className)}>
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {primaryImage ? (<img src={primaryImage} alt={business.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                  {business.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {business.cuisine && business.cuisine.length > 0 && (<span className="text-sm text-gray-600">
                      {business.cuisine.slice(0, 2).join(', ')}
                    </span>)}
                  {business.priceLevel && (<>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">
                        {getPriceDisplay(business.priceLevel)}
                      </span>
                    </>)}
                </div>
              </div>
              {getRatingDisplay()}
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
              <MapPin size={14} className="text-gray-400"/>
              <span className="truncate">{business.address}</span>
            </div>

            {/* Status and info row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                {((_d = business.openingHours) === null || _d === void 0 ? void 0 : _d.isOpen) !== undefined && (<div className="flex items-center space-x-1">
                    <div className={"w-2 h-2 rounded-full ".concat(business.openingHours.isOpen ? 'bg-green-500' : 'bg-red-500')}/>
                    <span>{business.openingHours.isOpen ? 'Open' : 'Closed'}</span>
                  </div>)}
                
                {context === 'admin' && business.approvalStatus && (<span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(business.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                business.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800')}>
                    {business.approvalStatus}
                  </span>)}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {actions.slice(0, 3).map(function (action) {
            var config = ACTION_CONFIGS[action];
            var Icon = config.icon;
            return (<button key={action} onClick={function () { return onAction(action, business); }} className={"\n                        flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors\n                        ".concat(config.variant === 'primary' ? 'bg-orange-500 text-white hover:bg-orange-600' : '', "\n                        ").concat(config.variant === 'outline' ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : '', "\n                        ").concat(config.variant === 'success' ? 'bg-green-500 text-white hover:bg-green-600' : '', "\n                        ").concat(config.variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : '', "\n                      ")}>
                      <Icon size={12}/>
                      <span className="hidden sm:inline">{config.label}</span>
                    </button>);
        })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default BusinessCard;
