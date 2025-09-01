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
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Star, DollarSign, Utensils } from 'lucide-react';
import { restaurantService } from '../../../services/restaurantService';
// Location data structure for different cities
var LOCATION_DATA = {
    'Bangkok': {
        displayName: 'Bangkok',
        areas: [
            'Thonglor', 'Phrom Phong', 'Ekkamai', 'Asok', 'Nana',
            'Silom', 'Sathorn', 'Sukhumvit', 'Phra Nakhon', 'Chinatown'
        ]
    },
    'Hua Hin': {
        displayName: 'Hua Hin',
        areas: [
            'Hua Hin Center', 'Khao Takiab', 'Khao Tao', 'Soi 88', 'Night Market Area',
            'Cicada Market', 'Hin Lek Fai', 'Suan Son Beach', 'Railway Station Area'
        ]
    },
    'Pattaya': {
        displayName: 'Pattaya',
        areas: [
            'Central Pattaya', 'North Pattaya', 'South Pattaya', 'Jomtien', 'Naklua',
            'Walking Street', 'Second Road', 'Third Road', 'Soi Buakhao'
        ]
    },
    'Phuket': {
        displayName: 'Phuket',
        areas: [
            'Patong', 'Kata', 'Karon', 'Kamala', 'Surin', 'Bang Tao',
            'Phuket Town', 'Chalong', 'Rawai', 'Nai Harn'
        ]
    },
    'Chiang Mai': {
        displayName: 'Chiang Mai',
        areas: [
            'Old City', 'Nimman', 'Night Bazaar', 'Chang Puak', 'Santitham',
            'Mae Rim', 'Hang Dong', 'San Kamphaeng'
        ]
    },
    'Phuket Town': {
        displayName: 'Phuket Town',
        areas: ['Old Town', 'Talad Yai', 'Talad Nuea', 'Rassada', 'Koh Kaew']
    },
    'Krabi': {
        displayName: 'Krabi',
        areas: ['Krabi Town', 'Ao Nang', 'Railay', 'Klong Muang', 'Tup Kaek']
    },
    'Samui': {
        displayName: 'Koh Samui',
        areas: ['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon', 'Choeng Mon']
    }
};
// Function to get location from localStorage (set by main app)
var getStoredLocation = function () {
    try {
        var stored = localStorage.getItem('localplus-current-location');
        return stored ? JSON.parse(stored).city : null;
    }
    catch (_a) {
        return null;
    }
};
// Function to handle unknown cities gracefully
var getCityWithFallback = function (cityName) {
    // Check if city is directly supported
    if (cityName in LOCATION_DATA) {
        return {
            city: cityName,
            areas: LOCATION_DATA[cityName].areas,
            isSupported: true
        };
    }
    // For unknown cities, provide generic areas
    var genericAreas = [
        'City Center', 'Downtown', 'Old Town', 'New Town',
        'Beach Area', 'Shopping District', 'Business District',
        'Residential Area', 'Tourist Area', 'Market Area'
    ];
    // Use Bangkok as fallback but with generic areas for unknown cities
    return {
        city: 'Bangkok',
        areas: genericAreas,
        isSupported: false
    };
};
var CuisineExplorer = function () {
    var navigate = useNavigate();
    var _a = useState(true), showFilters = _a[0], setShowFilters = _a[1];
    var _b = useState('Bangkok'), currentCity = _b[0], setCurrentCity = _b[1]; // Default to Bangkok
    var _c = useState(true), isLoadingLocation = _c[0], setIsLoadingLocation = _c[1];
    var _d = useState([]), productionRestaurants = _d[0], setProductionRestaurants = _d[1];
    var _e = useState(true), isLoadingRestaurants = _e[0], setIsLoadingRestaurants = _e[1];
    var _f = useState({
        selectedCuisines: [],
        selectedLocations: [],
        priceRange: { min: 1, max: 4 },
        openOnly: false
    }), filters = _f[0], setFilters = _f[1];
    // Location detection and restaurant loading
    useEffect(function () {
        detectUserLocation();
    }, []);
    // Load restaurants when city changes
    useEffect(function () {
        if (!isLoadingLocation) {
            loadRestaurants();
        }
    }, [currentCity, isLoadingLocation]);
    var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
        var restaurants, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoadingRestaurants(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    console.log('🏪 Loading restaurants for cuisine explorer in:', currentCity);
                    return [4 /*yield*/, restaurantService.getRestaurantsByLocation(currentCity)];
                case 2:
                    restaurants = _a.sent();
                    console.log('🏪 Loaded restaurants for cuisine explorer:', restaurants.length);
                    setProductionRestaurants(restaurants);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('🏪 Failed to load restaurants for cuisine explorer:', error_1);
                    setProductionRestaurants([]);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoadingRestaurants(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var detectUserLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
        var storedLocation, cityWithFallback, detectedCity, cityWithFallback, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoadingLocation(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    storedLocation = getStoredLocation();
                    if (storedLocation) {
                        console.log('Using stored location from main app:', storedLocation);
                        cityWithFallback = getCityWithFallback(storedLocation);
                        setCurrentCity(cityWithFallback.city);
                        setIsLoadingLocation(false);
                        return [2 /*return*/];
                    }
                    if (!navigator.geolocation) return [3 /*break*/, 2];
                    navigator.geolocation.getCurrentPosition(function (position) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, latitude, longitude, detectedCity, cityWithFallback;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = position.coords, latitude = _a.latitude, longitude = _a.longitude;
                                    return [4 /*yield*/, getLocationFromCoordinates(latitude, longitude)];
                                case 1:
                                    detectedCity = _b.sent();
                                    cityWithFallback = getCityWithFallback(detectedCity);
                                    setCurrentCity(cityWithFallback.city);
                                    setIsLoadingLocation(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var detectedCity, cityWithFallback;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getLocationFromIP()];
                                case 1:
                                    detectedCity = _a.sent();
                                    cityWithFallback = getCityWithFallback(detectedCity);
                                    setCurrentCity(cityWithFallback.city);
                                    setIsLoadingLocation(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getLocationFromIP()];
                case 3:
                    detectedCity = _a.sent();
                    cityWithFallback = getCityWithFallback(detectedCity);
                    setCurrentCity(cityWithFallback.city);
                    setIsLoadingLocation(false);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Location detection failed:', error_2);
                    setCurrentCity('Bangkok'); // Ultimate fallback
                    setIsLoadingLocation(false);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Listen for location changes from main app
    useEffect(function () {
        var handleStorageChange = function () {
            var storedLocation = getStoredLocation();
            if (storedLocation) {
                var cityWithFallback = getCityWithFallback(storedLocation);
                setCurrentCity(cityWithFallback.city);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return function () { return window.removeEventListener('storage', handleStorageChange); };
    }, []);
    var getLocationFromCoordinates = function (lat, lng) { return __awaiter(void 0, void 0, void 0, function () {
        var locations, _i, locations_1, location_1;
        return __generator(this, function (_a) {
            locations = [
                { name: 'Bangkok', lat: 13.7563, lng: 100.5018, radius: 0.5 },
                { name: 'Pattaya', lat: 12.9329, lng: 100.8825, radius: 0.3 },
                { name: 'Hua Hin', lat: 12.5684, lng: 99.9578, radius: 0.3 },
                { name: 'Phuket', lat: 7.8804, lng: 98.3923, radius: 0.3 },
                { name: 'Chiang Mai', lat: 18.7883, lng: 98.9853, radius: 0.3 }
            ];
            // Find closest matching location
            for (_i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                location_1 = locations_1[_i];
                if (Math.abs(lat - location_1.lat) < location_1.radius && Math.abs(lng - location_1.lng) < location_1.radius) {
                    return [2 /*return*/, location_1.name];
                }
            }
            return [2 /*return*/, 'Bangkok']; // Default if no close match
        });
    }); };
    var getLocationFromIP = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, detectedCity_1, detectedRegion_1, huaHinKeywords, pattayaKeywords, supportedCities, _i, supportedCities_1, city, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://ipapi.co/json/')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    detectedCity_1 = (data.city || '').toLowerCase();
                    detectedRegion_1 = (data.region || '').toLowerCase();
                    huaHinKeywords = ['hua hin', 'hin lek fai', 'nong khon', 'prachuap'];
                    if (huaHinKeywords.some(function (keyword) {
                        return detectedCity_1.includes(keyword) || detectedRegion_1.includes(keyword);
                    })) {
                        return [2 /*return*/, 'Hua Hin'];
                    }
                    pattayaKeywords = ['pattaya', 'chonburi', 'banglamung'];
                    if (pattayaKeywords.some(function (keyword) {
                        return detectedCity_1.includes(keyword) || detectedRegion_1.includes(keyword);
                    })) {
                        return [2 /*return*/, 'Pattaya'];
                    }
                    supportedCities = ['Phuket', 'Chiang Mai'];
                    for (_i = 0, supportedCities_1 = supportedCities; _i < supportedCities_1.length; _i++) {
                        city = supportedCities_1[_i];
                        if (detectedCity_1.includes(city.toLowerCase())) {
                            return [2 /*return*/, city];
                        }
                    }
                    return [2 /*return*/, 'Bangkok']; // Default fallback
                case 3:
                    error_3 = _a.sent();
                    console.error('IP geolocation failed:', error_3);
                    return [2 /*return*/, 'Bangkok'];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Get areas for current city (with fallback handling)
    var cityData = getCityWithFallback(currentCity);
    var availableAreas = cityData.areas;
    // Convert production restaurants to local format and extract unique cuisines and locations
    var convertedRestaurants = useMemo(function () {
        return productionRestaurants.map(function (restaurant) {
            var _a, _b;
            return ({
                id: restaurant.id,
                name: restaurant.name,
                cuisine: ((_a = restaurant.cuisine) === null || _a === void 0 ? void 0 : _a[0]) || 'Restaurant',
                location: ((_b = restaurant.address) === null || _b === void 0 ? void 0 : _b.split(',')[0]) || currentCity,
                priceRange: restaurant.priceRange || 2,
                rating: restaurant.rating || (4.0 + Math.random() * 0.9),
                reviewCount: restaurant.reviewCount || Math.floor(Math.random() * 1000) + 100,
                image: restaurant.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
                description: restaurant.description,
                specialties: restaurant.signatureDishes || ['Local Specialty'],
                isOpen: restaurant.status === 'active',
                estimatedDeliveryTime: '30-45 min'
            });
        });
    }, [productionRestaurants, currentCity]);
    var availableCuisines = useMemo(function () {
        return Array.from(new Set(convertedRestaurants.map(function (restaurant) { return restaurant.cuisine; }))).sort();
    }, [convertedRestaurants]);
    var availableLocations = useMemo(function () {
        return Array.from(new Set(convertedRestaurants.map(function (restaurant) { return restaurant.location; }))).sort();
    }, [convertedRestaurants]);
    // Filter restaurants based on current filters
    var filteredRestaurants = useMemo(function () {
        return convertedRestaurants.filter(function (restaurant) {
            var cuisineMatch = filters.selectedCuisines.length === 0 ||
                filters.selectedCuisines.includes(restaurant.cuisine);
            var locationMatch = filters.selectedLocations.length === 0 ||
                filters.selectedLocations.includes(restaurant.location);
            var priceMatch = restaurant.priceRange >= filters.priceRange.min &&
                restaurant.priceRange <= filters.priceRange.max;
            var openMatch = !filters.openOnly || restaurant.isOpen;
            return cuisineMatch && locationMatch && priceMatch && openMatch;
        });
    }, [convertedRestaurants, filters]);
    var handleCuisineToggle = function (cuisine) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { selectedCuisines: prev.selectedCuisines.includes(cuisine)
                ? prev.selectedCuisines.filter(function (c) { return c !== cuisine; })
                : __spreadArray(__spreadArray([], prev.selectedCuisines, true), [cuisine], false) })); });
    };
    var handleLocationToggle = function (location) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { selectedLocations: prev.selectedLocations.includes(location)
                ? prev.selectedLocations.filter(function (l) { return l !== location; })
                : __spreadArray(__spreadArray([], prev.selectedLocations, true), [location], false) })); });
    };
    var handlePriceRangeChange = function (type, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { priceRange: __assign(__assign({}, prev.priceRange), (_a = {}, _a[type] = value, _a)) }));
        });
    };
    var clearFilters = function () {
        setFilters({
            selectedCuisines: [],
            selectedLocations: [],
            priceRange: { min: 1, max: 4 },
            openOnly: false
        });
    };
    var handleRestaurantClick = function (restaurant) {
        // Navigate to restaurant detail or menu page
        navigate("/restaurants/".concat(restaurant.id));
    };
    var getPriceDisplay = function (priceRange) {
        return '฿'.repeat(priceRange) + '฿'.repeat(4 - priceRange).replace(/฿/g, '○');
    };
    var getPriceLabel = function (priceRange) {
        switch (priceRange) {
            case 1: return 'Budget';
            case 2: return 'Moderate';
            case 3: return 'Upscale';
            case 4: return 'Fine Dining';
            default: return '';
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/restaurants'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Explore Cuisines</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{filteredRestaurants.length} restaurants found</span>
                  {!isLoadingLocation && (<>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} className="text-gray-400"/>
                        <span>{currentCity}</span>
                      </div>
                    </>)}
                  {isLoadingLocation && (<>
                      <span>•</span>
                      <span className="text-gray-400">Detecting location...</span>
                    </>)}
                </div>
              </div>
            </div>
            <button onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Filter size={16}/>
              <span>{showFilters ? 'Hide Filter' : 'Show Filter'}</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (<div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              {/* Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cuisine Types</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCuisines.map(function (cuisine) { return (<button key={cuisine} onClick={function () { return handleCuisineToggle(cuisine); }} className={"px-3 py-1 text-sm rounded-full border ".concat(filters.selectedCuisines.includes(cuisine)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}>
                      {cuisine}
                    </button>); })}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Locations in {currentCity}</h3>
                <div className="flex flex-wrap gap-2">
                  {availableAreas.map(function (location) { return (<button key={location} onClick={function () { return handleLocationToggle(location); }} className={"px-3 py-1 text-sm rounded-full border ".concat(filters.selectedLocations.includes(location)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}>
                      {location}
                    </button>); })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Price Range: {getPriceDisplay(filters.priceRange.min)} - {getPriceDisplay(filters.priceRange.max)}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>฿ Budget</span>
                    <span>฿฿ Moderate</span>
                    <span>฿฿฿ Upscale</span>
                    <span>฿฿฿฿ Fine Dining</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Min: {getPriceLabel(filters.priceRange.min)} ({getPriceDisplay(filters.priceRange.min)})
                      </label>
                      <input type="range" min="1" max="4" step="1" value={filters.priceRange.min} onChange={function (e) { return handlePriceRangeChange('min', Number(e.target.value)); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Max: {getPriceLabel(filters.priceRange.max)} ({getPriceDisplay(filters.priceRange.max)})
                      </label>
                      <input type="range" min="1" max="4" step="1" value={filters.priceRange.max} onChange={function (e) { return handlePriceRangeChange('max', Number(e.target.value)); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Only Filter */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="openOnly" checked={filters.openOnly} onChange={function (e) { return setFilters(function (prev) { return (__assign(__assign({}, prev), { openOnly: e.target.checked })); }); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                <label htmlFor="openOnly" className="text-sm text-gray-700">
                  Show only open restaurants
                </label>
              </div>

              {/* Clear Filters */}
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700">
                Clear all filters
              </button>
            </div>
          </div>)}
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredRestaurants.length === 0 ? (<div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Utensils size={48} className="mx-auto"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>) : (<div className="grid grid-cols-1 gap-4">
            {filteredRestaurants.map(function (restaurant) { return (<button key={restaurant.id} onClick={function () { return handleRestaurantClick(restaurant); }} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 text-left">
                <div className="p-4">
                  {/* Top Row: Name, Cuisine, Rating */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">{restaurant.cuisine}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex-shrink-0">
                      <Star size={14} className="text-amber-500 fill-current"/>
                      <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                      <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                    </div>
                  </div>

                  {/* Image and Description Row */}
                  <div className="flex space-x-4 mb-3">
                    <img src={restaurant.image} alt={restaurant.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0"/>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {restaurant.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Location, Price, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-gray-400"/>
                        <span>{restaurant.location.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign size={14} className="text-gray-400"/>
                        <span className="font-medium">
                          {restaurant.priceRange === 1 && 'Budget'}
                          {restaurant.priceRange === 2 && 'Moderate'}
                          {restaurant.priceRange === 3 && 'Upscale'}
                          {restaurant.priceRange === 4 && 'Fine Dining'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {restaurant.isOpen ? (<div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">Open</span>
                          <span className="text-sm text-gray-500">• {restaurant.estimatedDeliveryTime}</span>
                        </div>) : (<div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-600 font-medium">Closed</span>
                        </div>)}
                    </div>
                  </div>

                  {/* Specialties Row */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {restaurant.specialties.slice(0, 4).map(function (specialty) { return (<span key={specialty} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                        {specialty}
                      </span>); })}
                    {restaurant.specialties.length > 4 && (<span className="px-2 py-1 text-xs text-gray-500">
                        +{restaurant.specialties.length - 4}
                      </span>)}
                  </div>
                </div>
              </button>); })}
          </div>)}
      </div>
    </div>);
};
export default CuisineExplorer;
