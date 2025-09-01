// [2024-12-19 19:40 UTC] - Updated to match homepage banner styling exactly
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { trackAdInteraction } from '../services/adAnalytics';
var AdBanner = function (_a) {
    var ad = _a.ad, placement = _a.placement, _b = _a.dismissible, dismissible = _b === void 0 ? false : _b, onDismiss = _a.onDismiss, _c = _a.className, className = _c === void 0 ? '' : _c;
    useEffect(function () {
        trackAdInteraction(ad.id, 'impression', placement);
    }, [ad.id, placement]);
    var handleClick = function () {
        trackAdInteraction(ad.id, 'click', placement);
        if (ad.ctaAction) {
            ad.ctaAction();
        }
        else if (ad.ctaUrl) {
            window.location.href = ad.ctaUrl;
        }
    };
    var handleDismiss = function (e) {
        e.stopPropagation();
        if (onDismiss) {
            onDismiss();
        }
    };
    // Get gradient background - use ad styling or default gradients
    var getGradientBackground = function () {
        var _a;
        if ((_a = ad.styling) === null || _a === void 0 ? void 0 : _a.gradient) {
            return ad.styling.gradient;
        }
        // Default gradients based on ad type or title
        if (ad.title.toLowerCase().includes('dining') || ad.title.toLowerCase().includes('restaurant')) {
            return 'bg-gradient-to-r from-purple-500 to-blue-500';
        }
        else if (ad.title.toLowerCase().includes('spa') || ad.title.toLowerCase().includes('wellness')) {
            return 'bg-gradient-to-r from-green-500 to-teal-500';
        }
        else if (ad.title.toLowerCase().includes('passport') || ad.title.toLowerCase().includes('savings')) {
            return 'bg-gradient-to-r from-orange-500 to-red-500';
        }
        else if (ad.type === 'external') {
            return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        }
        else {
            return 'bg-gradient-to-r from-purple-500 to-blue-500';
        }
    };
    // Get text color for description based on main color
    var getDescriptionColor = function () {
        var gradient = getGradientBackground();
        if (gradient.includes('purple') || gradient.includes('blue')) {
            return 'text-purple-100';
        }
        else if (gradient.includes('green') || gradient.includes('teal')) {
            return 'text-green-100';
        }
        else if (gradient.includes('orange') || gradient.includes('red')) {
            return 'text-orange-100';
        }
        else {
            return 'text-blue-100';
        }
    };
    // Get button colors
    var getButtonColors = function () {
        var gradient = getGradientBackground();
        if (gradient.includes('purple')) {
            return { bg: 'bg-white', text: 'text-purple-600' };
        }
        else if (gradient.includes('green')) {
            return { bg: 'bg-white', text: 'text-green-600' };
        }
        else if (gradient.includes('orange') || gradient.includes('red')) {
            return { bg: 'bg-white', text: 'text-orange-600' };
        }
        else {
            return { bg: 'bg-white', text: 'text-blue-600' };
        }
    };
    var buttonColors = getButtonColors();
    // Get icon for the ad
    var getIcon = function () {
        if (ad.title.toLowerCase().includes('dining') || ad.title.toLowerCase().includes('restaurant')) {
            return '🍽️';
        }
        else if (ad.title.toLowerCase().includes('spa') || ad.title.toLowerCase().includes('wellness')) {
            return '🧘';
        }
        else if (ad.title.toLowerCase().includes('passport') || ad.title.toLowerCase().includes('savings')) {
            return '🏆';
        }
        else {
            return '⭐';
        }
    };
    return (<div className={"\n        ".concat(getGradientBackground(), " text-white p-4 rounded-lg cursor-pointer\n        transition-all duration-300 hover:shadow-lg relative\n        ").concat(className, "\n      ")} onClick={handleClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-grow min-w-0">
          {/* Icon */}
          <div className="text-2xl flex-shrink-0">
            {getIcon()}
          </div>
          
          {/* Text Content */}
          <div className="flex-grow min-w-0 pr-3">
            <h3 className="font-bold text-lg">
              {ad.title}
            </h3>
            <p className={"".concat(getDescriptionColor())}>
              {ad.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button onClick={function (e) {
            e.stopPropagation();
            handleClick();
        }} className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
            {ad.ctaText}
          </button>

          {/* Dismiss Button */}
          {dismissible && (<button onClick={handleDismiss} className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white">
              <X size={16}/>
            </button>)}
        </div>
      </div>

      {/* External Ad Indicator */}
      {ad.type === 'external' && (<div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          Sponsored
        </div>)}
    </div>);
};
export default AdBanner;
