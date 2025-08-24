var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Utensils, Phone, ExternalLink, Calendar, Menu } from 'lucide-react';
import ImageCarousel from '../../ui-components/common/ImageCarousel';
var RestaurantCard = function (_a) {
    var _b, _c, _d, _e;
    var business = _a.business, actions = _a.actions, onAction = _a.onAction, _f = _a.className, className = _f === void 0 ? '' : _f;
    var _g = useState([]), images = _g[0], setImages = _g[1];
    var _h = useState(false), isLoadingImages = _h[0], setIsLoadingImages = _h[1];
    // Load images for the restaurant
    useEffect(function () {
        var loadImages = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!business.photos || business.photos.length === 0) {
                    setImages([]);
                    return [2 /*return*/];
                }
                setIsLoadingImages(true);
                try {
                    // Use the photos from Google Places
                    setImages(business.photos);
                }
                catch (error) {
                    console.error('Error loading restaurant images:', error);
                    setImages([]);
                }
                finally {
                    setIsLoadingImages(false);
                }
                return [2 /*return*/];
            });
        }); };
        loadImages();
    }, [business.photos]);
    // Generate mock data for missing fields to match existing design
    var mockSignatureDishes = business.cuisine || ['Local Specialty', 'Fresh Daily'];
    var mockFeatures = ['air-conditioning', 'parking'];
    var isOpen = (_c = (_b = business.openingHours) === null || _b === void 0 ? void 0 : _b.isOpen) !== null && _c !== void 0 ? _c : true;
    var renderHeroImage = function () {
        if (isLoadingImages) {
            return (<div className="relative w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <div className="text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>);
        }
        if (images.length > 0) {
            return (<div className="relative w-full h-64 rounded-t-lg overflow-hidden">
          <ImageCarousel images={images} alt={business.name} className="w-full h-full object-cover"/>
          
          {/* Status overlay */}
          <div className="absolute top-3 left-3 z-20">
            <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800')}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Heart/Favorite button */}
          <button className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 z-20">
            <Star size={16} className="text-gray-600"/>
          </button>

          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            📸 {images.length} photo{images.length > 1 ? 's' : ''}
          </div>
        </div>);
        }
        // Placeholder when no images available
        return (<div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-sm">No photos available</div>
        </div>
      </div>);
    };
    var getActionButton = function (action) {
        var buttonClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";
        switch (action) {
            case 'view':
                return (<button onClick={function () { return onAction(action, business); }} className={"".concat(buttonClasses, " bg-orange-500 text-white hover:bg-orange-600")}>
            <ExternalLink size={16}/>
            <span>View Details</span>
          </button>);
            case 'call':
                return (<button onClick={function () { return onAction(action, business); }} className={"".concat(buttonClasses, " border border-gray-300 text-gray-700 hover:bg-gray-50")}>
            <Phone size={16}/>
            <span>Call</span>
          </button>);
            case 'directions':
                return (<button onClick={function () { return onAction(action, business); }} className={"".concat(buttonClasses, " border border-gray-300 text-gray-700 hover:bg-gray-50")}>
            <MapPin size={16}/>
            <span>Directions</span>
          </button>);
            case 'book':
                return (<button onClick={function () { return onAction(action, business); }} className={"".concat(buttonClasses, " bg-orange-500 text-white hover:bg-orange-600")}>
            <Calendar size={16}/>
            <span>Book Table</span>
          </button>);
            case 'menu':
                return (<button onClick={function () { return onAction(action, business); }} className={"".concat(buttonClasses, " border border-gray-300 text-gray-700 hover:bg-gray-50")}>
            <Menu size={16}/>
            <span>Menu</span>
          </button>);
            default:
                return null;
        }
    };
    return (<div className={"bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 ".concat(className)}>
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
                {((_d = business.types) === null || _d === void 0 ? void 0 : _d.filter(function (type) {
            return ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type);
        }).join(', ')) || 'Restaurant'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">
                {'฿'.repeat(business.priceLevel || 2)}
              </span>
            </div>
          </div>
          
          {business.rating && (<div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <Star size={14} className="text-amber-500 fill-current"/>
              <span className="text-sm font-semibold text-gray-900">{business.rating.toFixed(1)}</span>
              {business.reviewCount && (<span className="text-xs text-gray-500">({business.reviewCount})</span>)}
            </div>)}
        </div>

        {/* Signature Dishes Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {mockSignatureDishes.slice(0, 3).map(function (dish, index) { return (<span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
              {dish}
            </span>); })}
        </div>

        {/* Location & Timing */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400"/>
            <span>{((_e = business.address) === null || _e === void 0 ? void 0 : _e.split(',')[0]) || 'Address not available'}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock size={14} className="text-gray-400"/>
            <span>{isOpen ? 'Open now' : 'Closed'}</span>
          </div>
        </div>

        {/* Features row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {mockFeatures.map(function (feature, index) { return (<div key={index} className="p-1.5 bg-gray-100 rounded-lg">
                {feature === 'air-conditioning' && <Clock size={14} className="text-gray-600"/>}
                {feature === 'parking' && <Utensils size={14} className="text-gray-600"/>}
              </div>); })}
          </div>

          {/* Phone number */}
          {business.phoneNumber && (<div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-600">
                {business.phoneNumber}
              </span>
            </div>)}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {actions.map(function (action) { return (<div key={action}>
              {getActionButton(action)}
            </div>); })}
        </div>
      </div>
    </div>);
};
export default RestaurantCard;
