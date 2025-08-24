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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, QrCode, Bot, Filter, MapPin, Star, Clock, Utensils, Coffee, Pizza, Fish, Map } from 'lucide-react';
import MenuModal from './MenuModal';
import { restaurantService } from '../../../services/restaurantService';
import { dynamicSelectorService } from '../../../shared/constants/dynamicSelectors';
import AdContainer from "../../advertising/components/AdContainer";
import ImageCarousel from '../../../ui-components/common/ImageCarousel';
import MapSearchModule from '../../../components/MapSearchModule';
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004';
// [2024-12-19 11:05 UTC] - Removed mock data, now using production restaurants from database
// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
// [2024-05-22] REFACTORED to use photo_gallery from the database, removing live API calls.
var RestaurantImage = function (_a) {
    // [2025-01-03 16:20] - Fixed photo URL handling to use direct Supabase Storage URLs
    // photo_gallery now contains direct URLs, not photo_reference objects
    var restaurant = _a.restaurant;
    var images = (restaurant.photo_gallery || []).filter(function (photo) {
        return typeof photo === 'string' && photo.length > 0;
    });
    // [2025-01-05 10:05] - Debug logging for broken images
    console.log("\uD83D\uDDBC\uFE0F RestaurantImage Debug for ".concat(restaurant.name, ":"));
    console.log("\uD83D\uDDBC\uFE0F Raw photo_gallery:", restaurant.photo_gallery);
    console.log("\uD83D\uDDBC\uFE0F Filtered images:", images);
    console.log("\uD83D\uDDBC\uFE0F Images count:", images.length);
    if (images.length > 0) {
        console.log("\uD83D\uDDBC\uFE0F First image URL:", images[0]);
        console.log("\uD83D\uDDBC\uFE0F Passing to ImageCarousel:", images);
    }
    // Show image gallery if available
    if (images.length > 0) {
        return (<div className="relative w-full h-64 rounded-t-lg overflow-hidden">
        <ImageCarousel images={images} alt={restaurant.name} className="w-full h-full"/>
        
        {/* Photo count badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-medium">
          {images.length} photos
        </div>
      </div>);
    }
    // Fallback placeholder when no photos available
    return (<div className="relative w-full h-64 rounded-t-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p className="text-sm">No photos available</p>
      </div>
    </div>);
};
var RestaurantsPage = function () {
    var navigate = useNavigate();
    var _a = useState('menu'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = useState('Hua Hin'), currentLocation = _b[0], setCurrentLocation = _b[1];
    var _c = useState([]), productionRestaurants = _c[0], setProductionRestaurants = _c[1];
    var _d = useState(true), isLoadingRestaurants = _d[0], setIsLoadingRestaurants = _d[1];
    var _e = useState(null), dynamicSelectors = _e[0], setDynamicSelectors = _e[1];
    var _f = useState(true), isLoadingSelectors = _f[0], setIsLoadingSelectors = _f[1];
    var _g = useState({
        isOpen: false,
        restaurantId: '',
        restaurantName: ''
    }), menuModal = _g[0], setMenuModal = _g[1];
    var _h = useState(""), searchQuery = _h[0], setSearchQuery = _h[1];
    var _j = useState("all"), selectedFilter = _j[0], setSelectedFilter = _j[1];
    var _k = useState('list'), viewMode = _k[0], setViewMode = _k[1]; // [2025-01-07 02:40 UTC] - Added map/list toggle
    // Location detection and restaurant loading
    useEffect(function () {
        var detectLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
            var storedLocation, response, data, detectedCity, detectedRegion, location_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        storedLocation = localStorage.getItem('user-selected-location');
                        if (storedLocation) {
                            setCurrentLocation(storedLocation);
                            return [2 /*return*/, storedLocation];
                        }
                        return [4 /*yield*/, fetch('https://ipapi.co/json/')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        detectedCity = (data.city || '').toLowerCase();
                        detectedRegion = (data.region || '').toLowerCase();
                        location_1 = 'Hua Hin';
                        // Check for supported areas
                        if (detectedCity.includes('hua hin') || detectedRegion.includes('prachuap')) {
                            location_1 = 'Hua Hin';
                        }
                        else if (detectedCity.includes('pattaya') || detectedRegion.includes('chonburi')) {
                            location_1 = 'Pattaya';
                        }
                        else if (detectedCity.includes('phuket')) {
                            location_1 = 'Phuket';
                        }
                        else if (detectedCity.includes('chiang mai')) {
                            location_1 = 'Chiang Mai';
                        }
                        else if (detectedCity.includes('hua hin') || detectedRegion.includes('prachuap khiri khan')) {
                            location_1 = 'Hua Hin';
                        }
                        else {
                            location_1 = 'Hua Hin'; // Changed default from Bangkok to Hua Hin
                        }
                        setCurrentLocation(location_1);
                        return [2 /*return*/, location_1];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Location detection failed:', error_1);
                        setCurrentLocation('Hua Hin');
                        return [2 /*return*/, 'Hua Hin'];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
            var location_2, _a, restaurants, selectors, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🚨 STARTING loadRestaurants function');
                        setIsLoadingRestaurants(true);
                        setIsLoadingSelectors(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, detectLocation()];
                    case 2:
                        location_2 = _b.sent();
                        console.log('🏪 Loading restaurants for location:', location_2);
                        // Load restaurants and dynamic selectors in parallel
                        console.log('🚨 BEFORE Promise.all');
                        return [4 /*yield*/, Promise.all([
                                restaurantService.getRestaurantsByLocation(location_2),
                                dynamicSelectorService.generateLocationSelectors(location_2)
                            ])];
                    case 3:
                        _a = _b.sent(), restaurants = _a[0], selectors = _a[1];
                        console.log('🚨 AFTER Promise.all');
                        console.log('🏪 Loaded restaurants:', restaurants.length, 'restaurants');
                        console.log('🎯 Loaded dynamic selectors:', selectors);
                        setProductionRestaurants(restaurants);
                        setDynamicSelectors(selectors);
                        return [3 /*break*/, 6];
                    case 4:
                        error_2 = _b.sent();
                        console.error('🏪 Failed to load restaurants:', error_2);
                        console.log('🚨 ERROR in loadRestaurants:', error_2);
                        setProductionRestaurants([]);
                        setDynamicSelectors(null);
                        return [3 /*break*/, 6];
                    case 5:
                        console.log('🚨 SETTING LOADING STATES TO FALSE');
                        setIsLoadingRestaurants(false);
                        setIsLoadingSelectors(false);
                        console.log('🚨 LOADING STATES SET TO FALSE');
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurants();
    }, []);
    var cuisineTypes = [
        { id: "all", name: "All", icon: Utensils },
        { id: "thai", name: "Thai", icon: Coffee },
        { id: "italian", name: "Italian", icon: Pizza },
        { id: "seafood", name: "Seafood", icon: Fish },
    ];
    var filteredRestaurants = productionRestaurants.filter(function (restaurant) {
        var _a, _b, _c, _d, _e;
        var matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((_a = restaurant.cuisine) === null || _a === void 0 ? void 0 : _a.some(function (c) { return c.toLowerCase().includes(searchQuery.toLowerCase()); }));
        // Enhanced filtering using dynamic selectors
        var matchesFilter = selectedFilter === "all" ||
            ((_b = restaurant.cuisine) === null || _b === void 0 ? void 0 : _b.some(function (c) { return c.toLowerCase() === selectedFilter; })) ||
            ((_c = restaurant.cuisine) === null || _c === void 0 ? void 0 : _c.some(function (c) { return c.includes(selectedFilter); })) ||
            // Check if selector ID matches any cuisine types
            (dynamicSelectors && ((_e = (_d = __spreadArray(__spreadArray([], dynamicSelectors.mostPopular, true), dynamicSelectors.popularChoices, true).find(function (s) { return s.id === selectedFilter; })) === null || _d === void 0 ? void 0 : _d.localPlusCuisines) === null || _e === void 0 ? void 0 : _e.some(function (lc) { var _a; return (_a = restaurant.cuisine) === null || _a === void 0 ? void 0 : _a.includes(lc); })));
        return matchesSearch && matchesFilter;
    });
    var handleBookClick = function (restaurantId) {
        console.log('Book restaurant:', restaurantId);
        // TODO: Navigate to booking page
    };
    var handleMenuClick = function (restaurantId) {
        var restaurant = productionRestaurants.find(function (r) { return r.id === restaurantId; });
        if (restaurant) {
            setMenuModal({
                isOpen: true,
                restaurantId: restaurantId,
                restaurantName: restaurant.name
            });
        }
    };
    var handleOffPeakClick = function (restaurantId) {
        var restaurant = productionRestaurants.find(function (r) { return r.id === restaurantId; });
        if (restaurant) {
            // Navigate to off-peak page with restaurant filter
            navigate("/off-peak?restaurant=".concat(encodeURIComponent(restaurant.name)));
        }
    };
    var closeMenuModal = function () {
        setMenuModal({
            isOpen: false,
            restaurantId: '',
            restaurantName: ''
        });
    };
    var handleExploreClick = function (type) {
        switch (type) {
            case 'explore-cuisines':
                // Navigate to dedicated cuisine explorer page
                navigate('/explore-cuisines');
                break;
            case 'discount-book':
                // Navigate to discount/deals page
                navigate('/off-peak');
                break;
            case 'todays-deals':
                // Navigate to dedicated today's deals page
                navigate('/todays-deals');
                break;
            case 'ai-assistant':
                // Navigate to AI assistant
                navigate('/ai-assistant');
                break;
            default:
                console.log('Explore:', type);
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={function () { return navigate(-1); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Restaurants</h1>
              <p className="text-sm text-gray-600">Discover amazing local dining in {currentLocation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* [2025-01-07 02:40 UTC] - View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={function () { return setViewMode('list'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(viewMode === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900')}>
              <Utensils size={16} className="inline mr-2"/>
              List View
            </button>
            <button onClick={function () { return setViewMode('map'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(viewMode === 'map'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900')}>
              <Map size={16} className="inline mr-2"/>
              Map View
            </button>
          </div>
        </div>

        {/* [2025-01-07 02:40 UTC] - Conditional rendering: Map or List */}
        {viewMode === 'map' ? (<div className="bg-white rounded-lg shadow-sm">
            <MapSearchModule context="consumer" resultCardType="restaurant" actions={['view', 'call', 'directions', 'book', 'menu']} onView={function (business) { return navigate("/restaurants/".concat(business.id)); }} onCall={function (business) { return window.open("tel:".concat(business.phone), '_self'); }} onDirections={function (business) {
                var address = encodeURIComponent(business.address || business.name);
                window.open("https://maps.google.com?daddr=".concat(address), '_blank');
            }} onBook={function (business) { return navigate("/restaurants/".concat(business.id, "/book")); }} onMenu={function (business) { return handleMenuClick(business.id); }} className="h-[600px]"/>
          </div>) : (<>
            {/* Original List View Content */}
        {/* Restaurant Service Tiles */}
        <section className="grid grid-cols-3 gap-3">
          <button onClick={function () { return handleExploreClick('todays-deals'); }} className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 hover:shadow-md transition-all">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star size={16} className="text-white"/>
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">Today's Deals</h3>
              <p className="text-xs text-gray-600 mt-0.5">Special offers</p>
            </div>
          </button>
          
          <button onClick={function () { return navigate('/passport'); }} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-xl border-2 border-yellow-300 hover:shadow-md transition-all">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <QrCode size={16} className="text-white"/>
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">Savings Passport</h3>
              <p className="text-xs text-gray-600 mt-0.5">Instant savings</p>
            </div>
          </button>
          
          <button onClick={function () { return handleExploreClick('ai-assistant'); }} className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-xl border border-purple-200 hover:shadow-md transition-all relative">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bot size={16} className="text-white"/>
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">AI Concierge</h3>
              <p className="text-xs text-gray-600 mt-0.5">Coming soon</p>
            </div>
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
              SOON
            </div>
          </button>
        </section>

        {/* [2024-05-10 17:30 UTC] - Top Advertising Section */}
        <section>
          <AdContainer placement="restaurants-top" maxAds={1} categoryFilter={['dining', 'internal-promotion']} size="large"/>
        </section>

        {/* Search and Filter */}
        <section className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search restaurants or cuisine..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
          </div>

          {/* Dynamic Smart Selectors */}
          {isLoadingSelectors ? (<div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[1, 2, 3].map(function (i) { return (<div key={i} className="h-8 bg-gray-100 rounded-full w-24 animate-pulse"></div>); })}
              </div>
            </div>) : dynamicSelectors ? (<div className="space-y-3">
              {/* Most Popular in Location */}
              {dynamicSelectors.mostPopular.length > 0 && (<div>
                  <h3 className="text-xs font-medium text-green-700 mb-2">
                    🏆 Most Popular in {currentLocation}
                  </h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.mostPopular.map(function (selector) { return (<button key={selector.id} onClick={function () { return setSelectedFilter(selector.id); }} className={"flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap border transition-colors ".concat(selectedFilter === selector.id
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100')}>
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (<span className="text-xs bg-green-200 text-green-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>)}
                      </button>); })}
                  </div>
                </div>)}

              {/* Popular Choices */}
              {dynamicSelectors.popularChoices.length > 0 && (<div>
                  <h3 className="text-xs font-medium text-blue-700 mb-2">🥈 Popular Choices</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.popularChoices.map(function (selector) { return (<button key={selector.id} onClick={function () { return setSelectedFilter(selector.id); }} className={"flex items-center space-x-2 px-3 py-2 rounded-full whitespace-nowrap border transition-colors ".concat(selectedFilter === selector.id
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100')}>
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (<span className="text-xs bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>)}
                      </button>); })}
                  </div>
                </div>)}

              {/* Quick Filters */}
              {dynamicSelectors.quickFilters.length > 0 && (<div>
                  <h3 className="text-xs font-medium text-gray-700 mb-2">⚡ Quick Filters</h3>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {dynamicSelectors.quickFilters.map(function (selector) { return (<button key={selector.id} onClick={function () { return console.log('Quick filter:', selector.id); }} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-800 rounded-full whitespace-nowrap border border-gray-200 hover:bg-gray-100 transition-colors">
                        <span>{selector.icon}</span>
                        <span className="text-sm">{selector.label}</span>
                        {selector.count && selector.count > 0 && (<span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                            {selector.count}
                          </span>)}
                      </button>); })}
                  </div>
                </div>)}
              
              {/* Data source indicator */}
              <div className="text-xs text-gray-500 mt-2">
                🎯 Smart suggestions based on real data • Updated {dynamicSelectors.lastUpdated.toLocaleTimeString()}
              </div>
            </div>) : (<div className="text-center py-4 text-gray-500">
              <p>Unable to load cuisine options</p>
            </div>)}
        </section>

        {/* External Ads Section */}
        <section>
          <AdContainer placement="restaurants-top" maxAds={2} showOnlyExternal={true} displayType="banner" categoryFilter={['dining', 'technology']} className="space-y-3"/>
        </section>

        {/* Restaurant List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLoadingRestaurants ? 'Loading restaurants...' : "".concat(filteredRestaurants.length, " restaurants found")}
            </h2>
            <button className="flex items-center space-x-1 text-red-500 text-sm font-medium">
              <Filter size={16}/>
              <span>Filter</span>
            </button>
          </div>

          {isLoadingRestaurants ? (<div className="space-y-4">
              {console.log('🚨 SHOWING LOADING STATE - isLoadingRestaurants:', isLoadingRestaurants)}
              {[1, 2, 3].map(function (i) { return (<div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="flex space-x-2 mb-3">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>); })}
            </div>) : (<div className="space-y-4">
              {console.log('🚨 SHOWING RESTAURANT LIST - filteredRestaurants.length:', filteredRestaurants.length, 'isLoadingRestaurants:', isLoadingRestaurants)}
              {/* Som Tam Paradise Style Cards - Production Data */}
              {filteredRestaurants.map(function (restaurant) {
                    var _a, _b, _c;
                    return (<div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                  {/* Hero Image */}
                  {(function () {
                            // [2025-01-05 10:10] - Debug: Check if component is called
                            console.log("\uD83D\uDD25 RESTAURANT CARD RENDERING: ".concat(restaurant.name));
                            console.log("\uD83D\uDD25 Has photo_gallery:", !!restaurant.photo_gallery);
                            console.log("\uD83D\uDD25 Photo_gallery:", restaurant.photo_gallery);
                            return null;
                        })()}
                  <RestaurantImage restaurant={restaurant}/>

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
                            {((_a = restaurant.cuisine) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Restaurant'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">
                            {'฿'.repeat(restaurant.priceRange || 2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                        <Star size={14} className="text-amber-500 fill-current"/>
                        <span className="text-sm font-semibold text-gray-900">4.{Math.floor(Math.random() * 9) + 1}</span>
                        <span className="text-xs text-gray-500">({Math.floor(Math.random() * 1000) + 100})</span>
                      </div>
                    </div>

                    {/* Signature Dishes Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {((_b = restaurant.signatureDishes) === null || _b === void 0 ? void 0 : _b.slice(0, 3).map(function (dish, index) { return (<span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                          {dish}
                        </span>); })) || (<>
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                            Local Specialty
                          </span>
                          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200">
                            Fresh Daily
                          </span>
                        </>)}
                    </div>

                    {/* Location & Timing */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400"/>
                        <span>{restaurant.address.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400"/>
                        <span>{restaurant.openingHours || '11:00 AM - 10:00 PM'}</span>
                      </div>
                    </div>

                    {/* Features row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {((_c = restaurant.features) === null || _c === void 0 ? void 0 : _c.slice(0, 3).map(function (feature, index) { return (<div key={index} className="p-1.5 bg-gray-100 rounded-lg">
                            {feature === 'beachfront-view' && <MapPin size={14} className="text-gray-600"/>}
                            {feature === 'air-conditioning' && <Clock size={14} className="text-gray-600"/>}
                            {feature === 'parking' && <Utensils size={14} className="text-gray-600"/>}
                            {!['beachfront-view', 'air-conditioning', 'parking'].includes(feature) && <Utensils size={14} className="text-gray-600"/>}
                          </div>); })) || (<>
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Utensils size={14} className="text-gray-600"/>
                            </div>
                            <div className="p-1.5 bg-gray-100 rounded-lg">
                              <Clock size={14} className="text-gray-600"/>
                            </div>
                          </>)}
                      </div>

                      {/* Loyalty Program Indicator */}
                      {restaurant.loyaltyProgram ? (<div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                          <Star size={12} className="text-purple-600"/>
                          <span className="text-xs font-medium text-purple-700">
                            {restaurant.loyaltyProgram.pointsMultiplier}x Points
                          </span>
                        </div>) : (<div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                          <span className="text-xs font-medium text-gray-600">
                            Call: {restaurant.phone}
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
                </div>);
                })}
            </div>)}
        </section>

        {/* [2024-05-10 17:30 UTC] - Bottom Advertising Section */}
        <section>
          <AdContainer placement="restaurants-bottom" maxAds={1} categoryFilter={['technology', 'services']} size="medium"/>
        </section>
          </>)}
      </div>
      
      {/* Menu Modal */}
      <MenuModal isOpen={menuModal.isOpen} onClose={closeMenuModal} restaurantId={menuModal.restaurantId} restaurantName={menuModal.restaurantName}/>
    </div>);
};
export default RestaurantsPage;
