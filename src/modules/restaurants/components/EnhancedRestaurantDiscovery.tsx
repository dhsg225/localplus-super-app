var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// [2025-01-06 14:40 UTC] - Enhanced Restaurant Discovery with tier-based filtering and Som Tam Paradise card style
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Star, Clock, Utensils, Search, Heart, Music, AirVent, Car } from 'lucide-react';
import { CUISINE_TIERS } from '../../../shared/constants/restaurants';
import { restaurantService } from '../../../services/restaurantService';
// [2024-12-19 23:45 UTC] - Removed mock data, now using production restaurants from database
var mockRestaurants = [];
var EnhancedRestaurantDiscovery = function () {
    var navigate = useNavigate();
    var _a = useState(false), showFilters = _a[0], setShowFilters = _a[1];
    var _b = useState([]), restaurants = _b[0], setRestaurants = _b[1];
    var _c = useState(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState({
        cuisines: [],
        searchQuery: '',
        openOnly: false
    }), filters = _d[0], setFilters = _d[1];
    // Load production restaurants on component mount
    useEffect(function () {
        loadProductionRestaurants();
    }, []);
    var loadProductionRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
        var productionRestaurants, transformedRestaurants, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    console.log('🏪 Loading restaurants for enhanced discovery...');
                    return [4 /*yield*/, restaurantService.getRestaurantsByLocation('Hua Hin')];
                case 1:
                    productionRestaurants = _a.sent();
                    console.log('🏪 Loaded restaurants for enhanced discovery:', productionRestaurants.length);
                    transformedRestaurants = productionRestaurants.map(function (restaurant) { return ({
                        id: restaurant.id,
                        name: restaurant.name,
                        cuisine: restaurant.cuisine || [],
                        diningStyle: ['casual'],
                        location: restaurant.address || 'Location not specified',
                        priceRange: (restaurant.priceRange || 2),
                        rating: restaurant.rating || 4.0,
                        reviewCount: restaurant.reviewCount || 0,
                        heroImage: restaurant.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                        signatureDishes: restaurant.signatureDishes || [],
                        isOpen: restaurant.status === 'active',
                        features: restaurant.features || [],
                        dietaryOptions: [],
                        openingHours: restaurant.openingHours || '9:00 AM - 10:00 PM',
                        currentPromotions: restaurant.currentPromotions || []
                    }); });
                    setRestaurants(transformedRestaurants);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('🏪 Failed to load restaurants for enhanced discovery:', error_1);
                    setRestaurants([]);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var allCuisines = __spreadArray(__spreadArray(__spreadArray([], CUISINE_TIERS.tier1, true), CUISINE_TIERS.tier2, true), CUISINE_TIERS.tier3, true);
    var filteredRestaurants = useMemo(function () {
        return restaurants.filter(function (restaurant) {
            if (filters.searchQuery) {
                var query_1 = filters.searchQuery.toLowerCase();
                var searchMatch = restaurant.name.toLowerCase().includes(query_1) ||
                    restaurant.signatureDishes.some(function (dish) { return dish.toLowerCase().includes(query_1); });
                if (!searchMatch)
                    return false;
            }
            if (filters.cuisines.length > 0) {
                var cuisineMatch = filters.cuisines.some(function (cuisine) {
                    return restaurant.cuisine.includes(cuisine);
                });
                if (!cuisineMatch)
                    return false;
            }
            if (filters.openOnly && !restaurant.isOpen) {
                return false;
            }
            return true;
        });
    }, [restaurants, filters]);
    var toggleCuisine = function (cuisine) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { cuisines: prev.cuisines.includes(cuisine)
                ? prev.cuisines.filter(function (c) { return c !== cuisine; })
                : __spreadArray(__spreadArray([], prev.cuisines, true), [cuisine], false) })); });
    };
    var getPriceDisplay = function (priceRange) {
        return '฿'.repeat(priceRange);
    };
    var getCuisineLabel = function (value) {
        var cuisine = allCuisines.find(function (c) { return c.value === value; });
        return (cuisine === null || cuisine === void 0 ? void 0 : cuisine.label) || value;
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Restaurants</h1>
                <p className="text-sm text-gray-600">{filteredRestaurants.length} restaurants found</p>
              </div>
            </div>
            <button onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Filter size={16}/>
              <span>Filter</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search restaurants, cuisines, or dishes..." value={filters.searchQuery} onChange={function (e) { return setFilters(function (prev) { return (__assign(__assign({}, prev), { searchQuery: e.target.value })); }); }} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (<div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              {/* Quick toggles */}
              <div className="flex space-x-3">
                <button onClick={function () { return setFilters(function (prev) { return (__assign(__assign({}, prev), { openOnly: !prev.openOnly })); }); }} className={"px-3 py-2 text-sm rounded-lg border ".concat(filters.openOnly
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300')}>
                  Open Now
                </button>
              </div>

              {/* Tier-based Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cuisine Types</h3>
                <div className="space-y-3">
                  {/* Tier 1 - Essential */}
                  <div>
                    <h4 className="text-xs font-medium text-green-700 mb-1">🏆 Most Popular</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier1.map(function (cuisine) { return (<button key={cuisine.value} onClick={function () { return toggleCuisine(cuisine.value); }} className={"px-2 py-1 text-xs rounded-full border ".concat(filters.cuisines.includes(cuisine.value)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300')}>
                          {cuisine.label}
                        </button>); })}
                    </div>
                  </div>

                  {/* Tier 2 - Important */}
                  <div>
                    <h4 className="text-xs font-medium text-blue-700 mb-1">🥈 Popular</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier2.map(function (cuisine) { return (<button key={cuisine.value} onClick={function () { return toggleCuisine(cuisine.value); }} className={"px-2 py-1 text-xs rounded-full border ".concat(filters.cuisines.includes(cuisine.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300')}>
                          {cuisine.label}
                        </button>); })}
                    </div>
                  </div>

                  {/* Tier 3 - Growing */}
                  <div>
                    <h4 className="text-xs font-medium text-purple-700 mb-1">🥉 Emerging</h4>
                    <div className="flex flex-wrap gap-1">
                      {CUISINE_TIERS.tier3.map(function (cuisine) { return (<button key={cuisine.value} onClick={function () { return toggleCuisine(cuisine.value); }} className={"px-2 py-1 text-xs rounded-full border ".concat(filters.cuisines.includes(cuisine.value)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300')}>
                          {cuisine.label}
                        </button>); })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Som Tam Paradise Style Restaurant Cards */}
      <div className="p-4">
        {filteredRestaurants.length === 0 ? (<div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Utensils size={48} className="mx-auto"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>) : (<div className="space-y-4">
            {filteredRestaurants.map(function (restaurant) { return (<div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Hero Image */}
                <div className="relative h-48">
                  <img src={restaurant.heroImage} alt={restaurant.name} className="w-full h-full object-cover"/>
                  
                  {/* Status overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(restaurant.isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800')}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Promotions badge */}
                  {restaurant.currentPromotions && restaurant.currentPromotions.length > 0 && (<div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        PROMO
                      </span>
                    </div>)}

                  {/* Heart/Favorite button */}
                  <button className="absolute bottom-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100">
                    <Heart size={16} className="text-gray-600"/>
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
                          {restaurant.cuisine.map(function (c) { return getCuisineLabel(c); }).join(', ')}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-600">{getPriceDisplay(restaurant.priceRange)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                      <Star size={14} className="text-amber-500 fill-current"/>
                      <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                  </div>

                  {/* Signature Dishes Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.signatureDishes.slice(0, 3).map(function (dish) { return (<span key={dish} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                        {dish}
                      </span>); })}
                  </div>

                  {/* Location & Timing */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400"/>
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock size={14} className="text-gray-400"/>
                      <span>{restaurant.openingHours}</span>
                    </div>
                  </div>

                  {/* Features row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {restaurant.features.slice(0, 3).map(function (feature, index) { return (<div key={feature} className="p-1.5 bg-gray-100 rounded-lg">
                          {feature === 'live-music' && <Music size={14} className="text-gray-600"/>}
                          {feature === 'air-conditioning' && <AirVent size={14} className="text-gray-600"/>}
                          {feature === 'parking' && <Car size={14} className="text-gray-600"/>}
                          {!['live-music', 'air-conditioning', 'parking'].includes(feature) && <Utensils size={14} className="text-gray-600"/>}
                        </div>); })}
                    </div>

                    {/* Loyalty Program Indicator */}
                    {restaurant.loyaltyProgram && (<div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <Star size={12} className="text-purple-600"/>
                        <span className="text-xs font-medium text-purple-700">
                          {restaurant.loyaltyProgram.pointsMultiplier}x Points
                        </span>
                      </div>)}
                  </div>

                  {/* Current Promotions */}
                  {restaurant.currentPromotions && restaurant.currentPromotions.length > 0 && (<div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800">
                        🎉 {restaurant.currentPromotions[0]}
                      </p>
                    </div>)}
                </div>
              </div>); })}
          </div>)}
      </div>
    </div>);
};
export default EnhancedRestaurantDiscovery;
