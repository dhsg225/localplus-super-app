// [2025-01-07 11:50 UTC] - Unified Map Search Module
// Main component that provides map-based business discovery for both consumer and admin contexts
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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, MapPin, RotateCcw, Loader } from 'lucide-react';
import { CONSUMER_CONFIG, ADMIN_CONFIG, DEFAULT_RADIUS, MAX_RESULTS, MAP_CONFIG } from './config';
import BusinessCard from './BusinessCard';
import RestaurantCard from './RestaurantCard';
import { googlePlacesService } from '../../services/googlePlaces';
import { googlePlacesImageService } from '../../services/googlePlacesImageService';
var MapSearchModule = function (_a) {
    var context = _a.context, _b = _a.filtersEnabled, filtersEnabled = _b === void 0 ? true : _b, _c = _a.radiusSlider, radiusSlider = _c === void 0 ? true : _c, _d = _a.resultCardType, resultCardType = _d === void 0 ? 'restaurant' : _d, actions = _a.actions, initialLocation = _a.initialLocation, defaultRadius = _a.defaultRadius, maxResults = _a.maxResults, _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.showMap, showMap = _f === void 0 ? true : _f, mapHeight = _a.mapHeight, cardLayout = _a.cardLayout, onLocationChange = _a.onLocationChange, onFiltersChange = _a.onFiltersChange, onBusinessSelect = _a.onBusinessSelect, onBusinessAction = _a.onBusinessAction, onApprove = _a.onApprove, onReject = _a.onReject, onCreateLead = _a.onCreateLead;
    // Get context-specific configuration
    var config = context === 'consumer' ? CONSUMER_CONFIG : ADMIN_CONFIG;
    var effectiveActions = actions || config.actions;
    var effectiveCardLayout = cardLayout || config.cardLayout;
    var effectiveShowMap = showMap !== undefined ? showMap : config.showMap;
    var effectiveMapHeight = mapHeight || config.mapHeight;
    // Component state
    var _g = useState({
        location: initialLocation || null,
        filters: {
            radius: defaultRadius || DEFAULT_RADIUS[context],
            businessType: resultCardType
        },
        results: [],
        selectedBusiness: null,
        isLoading: false,
        error: null,
        mapInstance: null,
        markers: []
    }), state = _g[0], setState = _g[1];
    // Map container ref
    var mapRef = useRef(null);
    var _h = useState(''), searchQuery = _h[0], setSearchQuery = _h[1];
    var _j = useState(false), showFilters = _j[0], setShowFilters = _j[1];
    // Initialize map
    var initializeMap = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var map_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!effectiveShowMap || !mapRef.current || !state.location)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Wait for Google Maps to load
                    return [4 /*yield*/, new Promise(function (resolve) {
                            if (window.google && window.google.maps) {
                                resolve();
                            }
                            else {
                                var checkGoogle_1 = function () {
                                    if (window.google && window.google.maps) {
                                        resolve();
                                    }
                                    else {
                                        setTimeout(checkGoogle_1, 100);
                                    }
                                };
                                checkGoogle_1();
                            }
                        })];
                case 2:
                    // Wait for Google Maps to load
                    _a.sent();
                    map_1 = new window.google.maps.Map(mapRef.current, __assign({ center: { lat: state.location.lat, lng: state.location.lng }, zoom: MAP_CONFIG.defaultZoom, styles: MAP_CONFIG.styles }, MAP_CONFIG.controls));
                    // Add click listener for pin dropping
                    map_1.addListener('click', function (event) {
                        var newLocation = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        setState(function (prev) { return (__assign(__assign({}, prev), { location: newLocation })); });
                        onLocationChange === null || onLocationChange === void 0 ? void 0 : onLocationChange(newLocation);
                        performSearch(newLocation, state.filters);
                    });
                    setState(function (prev) { return (__assign(__assign({}, prev), { mapInstance: map_1 })); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to initialize map:', error_1);
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: 'Failed to load map' })); });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [effectiveShowMap, state.location, onLocationChange]);
    // Convert Google Places result to BusinessResult
    var convertToBusinessResult = function (place) { return __awaiter(void 0, void 0, void 0, function () {
        var photos, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    photos = [];
                    if (!place.place_id) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, googlePlacesImageService.getRestaurantGallery(place.place_id, 3)];
                case 2:
                    photos = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.warn('Failed to load photos for place:', place.place_id);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, {
                        id: place.place_id || Math.random().toString(36),
                        placeId: place.place_id,
                        name: place.name,
                        address: place.formatted_address || place.vicinity,
                        location: {
                            lat: typeof place.geometry.location.lat === 'function'
                                ? place.geometry.location.lat()
                                : place.geometry.location.lat,
                            lng: typeof place.geometry.location.lng === 'function'
                                ? place.geometry.location.lng()
                                : place.geometry.location.lng
                        },
                        rating: place.rating,
                        reviewCount: place.user_ratings_total,
                        priceLevel: place.price_level,
                        photos: photos,
                        phoneNumber: place.formatted_phone_number,
                        website: place.website,
                        cuisine: (_a = place.types) === null || _a === void 0 ? void 0 : _a.filter(function (type) {
                            return ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type);
                        }),
                        types: place.types,
                        openingHours: place.opening_hours ? {
                            isOpen: place.opening_hours.open_now,
                            hours: place.opening_hours.weekday_text
                        } : undefined,
                        businessStatus: place.business_status,
                        // Admin fields (would be populated from database in real implementation)
                        approvalStatus: context === 'admin' ? 'pending' : undefined,
                        source: 'google_places',
                        addedDate: new Date()
                    }];
            }
        });
    }); };
    // Perform search
    var performSearch = function (location, filters) { return __awaiter(void 0, void 0, void 0, function () {
        var radius, businessType, results, businessResults, filteredResults_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!location)
                        return [2 /*return*/];
                    setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true, error: null })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    radius = filters.radius || DEFAULT_RADIUS[context];
                    businessType = filters.businessType || resultCardType;
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText(businessType, location.lat, location.lng, radius)];
                case 2:
                    results = _a.sent();
                    return [4 /*yield*/, Promise.all(results.slice(0, maxResults || MAX_RESULTS[context])
                            .map(function (place) { return convertToBusinessResult(place); }))];
                case 3:
                    businessResults = _a.sent();
                    filteredResults_1 = businessResults;
                    if (filters.rating) {
                        filteredResults_1 = filteredResults_1.filter(function (b) {
                            return b.rating && b.rating >= filters.rating;
                        });
                    }
                    if (filters.priceLevel && filters.priceLevel.length > 0) {
                        filteredResults_1 = filteredResults_1.filter(function (b) {
                            return b.priceLevel && filters.priceLevel.includes(b.priceLevel);
                        });
                    }
                    if (filters.openNow) {
                        filteredResults_1 = filteredResults_1.filter(function (b) { var _a; return ((_a = b.openingHours) === null || _a === void 0 ? void 0 : _a.isOpen) === true; });
                    }
                    if (context === 'admin' && filters.status) {
                        filteredResults_1 = filteredResults_1.filter(function (b) {
                            return b.approvalStatus === filters.status;
                        });
                    }
                    setState(function (prev) { return (__assign(__assign({}, prev), { results: filteredResults_1, isLoading: false })); });
                    // Update map markers
                    updateMapMarkers(filteredResults_1);
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Search failed:', error_3);
                    setState(function (prev) { return (__assign(__assign({}, prev), { error: 'Search failed. Please try again.', isLoading: false })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update map markers
    var updateMapMarkers = function (results) {
        if (!state.mapInstance)
            return;
        // Clear existing markers
        state.markers.forEach(function (marker) { return marker.setMap(null); });
        // Create new markers
        var newMarkers = results.map(function (business, index) {
            var marker = new window.google.maps.Marker({
                position: business.location,
                map: state.mapInstance,
                title: business.name,
                icon: {
                    url: context === 'consumer'
                        ? 'data:image/svg+xml,' + encodeURIComponent("\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"#f97316\">\n                  <path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z\"/>\n                  <circle cx=\"12\" cy=\"9\" r=\"2.5\" fill=\"white\"/>\n                </svg>\n              ")
                        : 'data:image/svg+xml,' + encodeURIComponent("\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"#3b82f6\">\n                  <path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z\"/>\n                  <circle cx=\"12\" cy=\"9\" r=\"2.5\" fill=\"white\"/>\n                </svg>\n              "),
                    scaledSize: new window.google.maps.Size(32, 32)
                }
            });
            marker.addListener('click', function () {
                setState(function (prev) { return (__assign(__assign({}, prev), { selectedBusiness: business })); });
                onBusinessSelect === null || onBusinessSelect === void 0 ? void 0 : onBusinessSelect(business);
            });
            return marker;
        });
        setState(function (prev) { return (__assign(__assign({}, prev), { markers: newMarkers })); });
    };
    // Handle business action
    var handleBusinessAction = function (action, business) {
        // Context-specific actions
        switch (action) {
            case 'approve':
                onApprove === null || onApprove === void 0 ? void 0 : onApprove(business);
                break;
            case 'reject':
                onReject === null || onReject === void 0 ? void 0 : onReject(business);
                break;
            case 'lead':
                onCreateLead === null || onCreateLead === void 0 ? void 0 : onCreateLead(business);
                break;
            case 'call':
                if (business.phoneNumber) {
                    window.location.href = "tel:".concat(business.phoneNumber);
                }
                break;
            case 'directions':
                var url = "https://www.google.com/maps/dir/?api=1&destination=".concat(business.location.lat, ",").concat(business.location.lng);
                window.open(url, '_blank');
                break;
            default:
                onBusinessAction === null || onBusinessAction === void 0 ? void 0 : onBusinessAction(action, business);
        }
    };
    // Handle filter changes
    var handleFilterChange = function (key, value) {
        var _a;
        var newFilters = __assign(__assign({}, state.filters), (_a = {}, _a[key] = value, _a));
        setState(function (prev) { return (__assign(__assign({}, prev), { filters: newFilters })); });
        onFiltersChange === null || onFiltersChange === void 0 ? void 0 : onFiltersChange(newFilters);
        if (state.location) {
            performSearch(state.location, newFilters);
        }
    };
    // Get current location
    var getCurrentLocation = function () {
        if (navigator.geolocation) {
            setState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setState(function (prev) { return (__assign(__assign({}, prev), { location: location, isLoading: false })); });
                onLocationChange === null || onLocationChange === void 0 ? void 0 : onLocationChange(location);
                performSearch(location, state.filters);
            }, function (error) {
                console.error('Geolocation error:', error);
                setState(function (prev) { return (__assign(__assign({}, prev), { error: 'Unable to get your location', isLoading: false })); });
            });
        }
    };
    // Initialize map when location is available
    useEffect(function () {
        if (state.location && effectiveShowMap) {
            initializeMap();
        }
    }, [state.location, initializeMap, effectiveShowMap]);
    // Perform initial search
    useEffect(function () {
        if (state.location) {
            performSearch(state.location, state.filters);
        }
    }, [state.location]);
    return (<div className={"map-search-module ".concat(className)}>
      {/* Header Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {context === 'consumer' ? 'Discover Places' : 'Business Discovery'}
            </h2>
            <p className="text-gray-600 mt-1">
              {context === 'consumer'
            ? 'Find amazing local businesses near you'
            : 'Discover and manage business listings'}
            </p>
          </div>
          
          <button onClick={getCurrentLocation} disabled={state.isLoading} className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {state.isLoading ? (<Loader size={16} className="animate-spin"/>) : (<MapPin size={16}/>)}
            <span>Use My Location</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input type="text" placeholder="Search for businesses..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"/>
            </div>
          </div>
          
          {filtersEnabled && (<button onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16}/>
              <span>Filters</span>
            </button>)}
        </div>

        {/* Location Info */}
        {state.location && state.location.lat && state.location.lng && (<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-600"/>
                <span className="text-sm font-medium text-blue-900">Search Location:</span>
                <span className="text-xs text-blue-700">
                  {state.location.lat.toFixed(4)}, {state.location.lng.toFixed(4)}
                </span>
              </div>
              {radiusSlider && (<div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-700">Radius:</span>
                  <input type="range" min="500" max={context === 'consumer' ? "10000" : "20000"} step="500" value={state.filters.radius || DEFAULT_RADIUS[context]} onChange={function (e) { return handleFilterChange('radius', parseInt(e.target.value)); }} className="w-20"/>
                  <span className="text-xs text-blue-700">
                    {((state.filters.radius || DEFAULT_RADIUS[context]) / 1000).toFixed(1)}km
                  </span>
                </div>)}
            </div>
          </div>)}
      </div>

      {/* Map */}
      {effectiveShowMap && (<div className="mb-6">
          <div ref={mapRef} style={{ height: effectiveMapHeight }} className="w-full rounded-lg border border-gray-300"/>
        </div>)}

      {/* Error Display */}
      {state.error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{state.error}</p>
        </div>)}

      {/* Loading State */}
      {state.isLoading && (<div className="text-center py-8">
          <Loader size={32} className="mx-auto mb-4 text-orange-500 animate-spin"/>
          <p className="text-gray-600">Searching for businesses...</p>
        </div>)}

      {/* Results */}
      {!state.isLoading && state.results.length > 0 && (<div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Found {state.results.length} result{state.results.length !== 1 ? 's' : ''}
            </h3>
            <button onClick={function () { return performSearch(state.location, state.filters); }} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <RotateCcw size={14}/>
              <span>Refresh</span>
            </button>
          </div>

          <div className={effectiveCardLayout === 'grid' && resultCardType !== 'restaurant'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'}>
            {state.results.map(function (business) {
                var _a, _b, _c;
                // Use RestaurantCard for restaurant businesses, otherwise use generic BusinessCard
                var isRestaurant = resultCardType === 'restaurant' ||
                    ((_a = business.types) === null || _a === void 0 ? void 0 : _a.some(function (type) { return ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type); }));
                if (isRestaurant) {
                    return (<RestaurantCard key={business.id} business={business} actions={effectiveActions} onAction={handleBusinessAction} className={((_b = state.selectedBusiness) === null || _b === void 0 ? void 0 : _b.id) === business.id ? 'ring-2 ring-orange-500' : ''}/>);
                }
                return (<BusinessCard key={business.id} business={business} context={context} actions={effectiveActions} layout={effectiveCardLayout} onAction={handleBusinessAction} className={((_c = state.selectedBusiness) === null || _c === void 0 ? void 0 : _c.id) === business.id ? 'ring-2 ring-orange-500' : ''}/>);
            })}
          </div>
        </div>)}

      {/* No Results */}
      {!state.isLoading && state.results.length === 0 && state.location && (<div className="text-center py-8">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300"/>
          <p className="text-gray-600 mb-2">No businesses found in this area</p>
          <p className="text-sm text-gray-500">Try adjusting your search radius or location</p>
        </div>)}
    </div>);
};
export default MapSearchModule;
