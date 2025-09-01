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
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Globe, Plus, CheckCircle } from 'lucide-react';
import { googlePlacesService } from '../../../services/googlePlaces';
import { businessAPI } from '../../../lib/supabase';
var BusinessDiscovery = function (_a) {
    var _b;
    var userLocation = _a.userLocation, onBusinessAdded = _a.onBusinessAdded, onLocationUpdate = _a.onLocationUpdate;
    var _c = useState(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = useState(''), selectedCategory = _d[0], setSelectedCategory = _d[1];
    var _e = useState(''), selectedLdpArea = _e[0], setSelectedLdpArea = _e[1];
    var _f = useState([]), discoveredBusinesses = _f[0], setDiscoveredBusinesses = _f[1];
    var _g = useState(null), selectedBusiness = _g[0], setSelectedBusiness = _g[1];
    var _h = useState(null), businessDetails = _h[0], setBusinessDetails = _h[1];
    var _j = useState(false), loading = _j[0], setLoading = _j[1];
    var _k = useState(false), detailsLoading = _k[0], setDetailsLoading = _k[1];
    var _l = useState(false), importing = _l[0], setImporting = _l[1];
    var _m = useState(new Set()), importedBusinessIds = _m[0], setImportedBusinessIds = _m[1];
    var _o = useState(3000), radius = _o[0], setRadius = _o[1]; // Default 3km
    var _p = useState({ found: 0, added: 0 }), importStats = _p[0], setImportStats = _p[1];
    var categories = [
        { id: '', label: 'All Categories' },
        { id: 'Restaurants', label: 'Restaurants' },
        { id: 'Wellness', label: 'Wellness & Spa' },
        { id: 'Shopping', label: 'Shopping' },
        { id: 'Services', label: 'Services' },
        { id: 'Entertainment', label: 'Entertainment' },
        { id: 'Travel', label: 'Travel & Hotels' }
    ];
    // [2024-12-19 15:30 UTC] - Added LDP area filtering for geographic zone control
    var ldpAreas = [
        { id: '', label: 'All Areas' },
        { id: 'bangkok', label: 'Bangkok LDP', lat: 13.8179, lng: 100.0416 },
        { id: 'hua-hin', label: 'Hua Hin LDP', lat: 12.5684, lng: 99.9578 },
        { id: 'pattaya', label: 'Pattaya LDP', lat: 12.9236, lng: 100.8825 },
        { id: 'phuket', label: 'Phuket LDP', lat: 7.8804, lng: 98.3923 },
        { id: 'chiang-mai', label: 'Chiang Mai LDP', lat: 18.7883, lng: 98.9853 }
    ];
    var radiusOptions = [
        { value: 1000, label: '1km' },
        { value: 3000, label: '3km' },
        { value: 5000, label: '5km' },
        { value: 10000, label: '10km' },
        { value: 20000, label: '20km' }
    ];
    useEffect(function () {
        if (userLocation) {
            discoverNearbyBusinesses();
        }
    }, [userLocation, selectedCategory, selectedLdpArea, radius]);
    // [2024-12-19 15:30 UTC] - Updated location when LDP area changes
    useEffect(function () {
        if (selectedLdpArea) {
            var area = ldpAreas.find(function (a) { return a.id === selectedLdpArea; });
            if (area && area.lat && area.lng) {
                onLocationUpdate === null || onLocationUpdate === void 0 ? void 0 : onLocationUpdate({ lat: area.lat, lng: area.lng });
            }
        }
    }, [selectedLdpArea, onLocationUpdate]);
    var discoverNearbyBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var searchType, businesses, filteredBusinesses, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userLocation)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    searchType = selectedCategory;
                    if (selectedCategory === 'Restaurants') {
                        searchType = 'restaurant food dining';
                    }
                    return [4 /*yield*/, googlePlacesService.discoverBusinessesNearby(userLocation.lat, userLocation.lng, radius, searchType)];
                case 2:
                    businesses = _a.sent();
                    filteredBusinesses = businesses;
                    if (selectedCategory === 'Restaurants') {
                        filteredBusinesses = businesses.filter(function (business) {
                            return business.types.some(function (type) {
                                return ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type);
                            });
                        });
                    }
                    setDiscoveredBusinesses(filteredBusinesses);
                    setImportStats({ found: filteredBusinesses.length, added: 0 });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error discovering businesses:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var searchBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var enhancedQuery, businesses, filteredBusinesses, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!userLocation || !searchQuery.trim())
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    enhancedQuery = searchQuery;
                    if (selectedCategory === 'Restaurants') {
                        enhancedQuery = "".concat(searchQuery, " restaurant food dining");
                    }
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText(enhancedQuery, userLocation.lat, userLocation.lng, radius)];
                case 2:
                    businesses = _a.sent();
                    filteredBusinesses = businesses;
                    if (selectedCategory === 'Restaurants') {
                        filteredBusinesses = businesses.filter(function (business) {
                            return business.types.some(function (type) {
                                return ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type);
                            });
                        });
                    }
                    setDiscoveredBusinesses(filteredBusinesses);
                    setImportStats({ found: filteredBusinesses.length, added: 0 });
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error searching businesses:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessClick = function (business) { return __awaiter(void 0, void 0, void 0, function () {
        var details, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedBusiness(business);
                    setBusinessDetails(null);
                    setDetailsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(business.place_id)];
                case 2:
                    details = _a.sent();
                    setBusinessDetails(details);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error fetching business details:', error_3);
                    return [3 /*break*/, 5];
                case 4:
                    setDetailsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var importBusiness = function (business) { return __awaiter(void 0, void 0, void 0, function () {
        var details, businessData, newBusiness, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setImporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(business.place_id)];
                case 2:
                    details = _a.sent();
                    businessData = googlePlacesService.googlePlaceToBusiness(business, details || undefined);
                    return [4 /*yield*/, businessAPI.addBusiness(businessData)];
                case 3:
                    newBusiness = _a.sent();
                    if (!newBusiness) return [3 /*break*/, 5];
                    setImportedBusinessIds(function (prev) { return new Set(prev).add(business.place_id); });
                    onBusinessAdded === null || onBusinessAdded === void 0 ? void 0 : onBusinessAdded(newBusiness);
                    // [2024-12-19 15:30 UTC] - Update import stats when business is successfully added
                    setImportStats(function (prev) { return (__assign(__assign({}, prev), { added: prev.added + 1 })); });
                    // Also create a default discount offer
                    return [4 /*yield*/, businessAPI.addDiscountOffer({
                            business_id: newBusiness.id,
                            title: 'Welcome Discount',
                            description: '10% off for new customers',
                            discount_percentage: 10,
                            valid_from: new Date().toISOString().split('T')[0],
                            max_redemptions_per_user: 1,
                            is_active: true
                        })];
                case 4:
                    // Also create a default discount offer
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_4 = _a.sent();
                    console.error('Error importing business:', error_4);
                    return [3 /*break*/, 8];
                case 7:
                    setImporting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 15:30 UTC] - Reset counters function
    var resetCounters = function () {
        setImportStats({ found: 0, added: 0 });
        setImportedBusinessIds(new Set());
    };
    var getRatingStars = function (rating) {
        return Array.from({ length: 5 }, function (_, i) { return (<Star key={i} size={12} className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}/>); });
    };
    var getPriceRange = function (priceLevel) {
        if (!priceLevel)
            return 'Price not available';
        return '฿'.repeat(priceLevel) + '฿'.repeat(4 - priceLevel).replace(/฿/g, '○');
    };
    return (<div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Discover Real Businesses</h3>
          
          {/* [2024-12-19 15:30 UTC] - Import Stats Display */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              ✅ {selectedCategory || 'Businesses'}: Found {importStats.found}, added {importStats.added}
            </span>
            <button onClick={resetCounters} className="text-blue-600 hover:text-blue-800 underline">
              Reset
            </button>
          </div>
        </div>
        
        {/* [2024-12-19 15:30 UTC] - LDP Area Selection */}
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-purple-600"/>
              <span className="text-sm font-medium text-purple-900">LDP Area:</span>
            </div>
            <select value={selectedLdpArea} onChange={function (e) { return setSelectedLdpArea(e.target.value); }} className="text-sm px-3 py-1 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              {ldpAreas.map(function (area) { return (<option key={area.id} value={area.id}>{area.label}</option>); })}
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-blue-600"/>
              <span className="text-sm font-medium text-blue-900">Search Location:</span>
              {userLocation && (<span className="text-xs text-blue-700">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>)}
            </div>
            <button onClick={function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    onLocationUpdate === null || onLocationUpdate === void 0 ? void 0 : onLocationUpdate(newLocation);
                }, function (error) { return console.error('Geolocation error:', error); });
            }
        }} className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Use My Location
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder={selectedCategory === 'Restaurants' ? "Search for restaurants, cafes, dining..." : "Search for restaurants, spas, shops..."} value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} onKeyPress={function (e) { return e.key === 'Enter' && searchBusinesses(); }} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
          </div>
          <button onClick={searchBusinesses} disabled={loading || !searchQuery.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={function (e) { return setSelectedCategory(e.target.value); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              {categories.map(function (cat) { return (<option key={cat.id} value={cat.id}>{cat.label}</option>); })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius</label>
            <select value={radius} onChange={function (e) { return setRadius(Number(e.target.value)); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              {radiusOptions.map(function (option) { return (<option key={option.value} value={option.value}>{option.label}</option>); })}
            </select>
          </div>
        </div>

        {userLocation && (<div className="mt-3 text-xs text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1"/>
            Searching near: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            {selectedLdpArea && (<span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                {(_b = ldpAreas.find(function (a) { return a.id === selectedLdpArea; })) === null || _b === void 0 ? void 0 : _b.label}
              </span>)}
          </div>)}
      </div>

      {/* Discovered Businesses */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            Discovered Businesses ({discoveredBusinesses.length})
          </h4>
        </div>

        {loading ? (<div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Discovering businesses...</p>
          </div>) : discoveredBusinesses.length === 0 ? (<div className="p-8 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-2 text-gray-300"/>
            <p>No businesses found. Try adjusting your search or radius.</p>
          </div>) : (<div className="divide-y divide-gray-200">
            {discoveredBusinesses.map(function (business) { return (<div key={business.place_id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={function () { return handleBusinessClick(business); }}>
                    <h5 className="font-medium text-gray-900">{business.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{business.vicinity}</p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      {business.rating && (<div className="flex items-center space-x-1">
                          <div className="flex">{getRatingStars(business.rating)}</div>
                          <span className="text-xs text-gray-600">{business.rating}</span>
                        </div>)}
                      
                      {business.price_level && (<span className="text-xs text-gray-600">
                          {getPriceRange(business.price_level)}
                        </span>)}
                      
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {business.types.find(function (type) { return ['restaurant', 'spa', 'store', 'establishment'].includes(type); }) || 'Business'}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    {importedBusinessIds.has(business.place_id) ? (<div className="flex items-center text-green-600 text-sm">
                        <CheckCircle size={16} className="mr-1"/>
                        Imported
                      </div>) : (<button onClick={function () { return importBusiness(business); }} disabled={importing} className="flex items-center bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                        <Plus size={14} className="mr-1"/>
                        Import
                      </button>)}
                  </div>
                </div>
              </div>); })}
          </div>)}
      </div>

      {/* Business Details Modal */}
      {selectedBusiness && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedBusiness.name}</h3>
                <button onClick={function () { return setSelectedBusiness(null); }} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              {detailsLoading ? (<div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading details...</p>
                </div>) : businessDetails ? (<div className="space-y-4">
                  <div>
                    <p className="text-gray-600">{businessDetails.formatted_address}</p>
                    {businessDetails.formatted_phone_number && (<div className="flex items-center mt-2 text-sm text-gray-600">
                        <Phone size={14} className="mr-2"/>
                        {businessDetails.formatted_phone_number}
                      </div>)}
                    {businessDetails.website && (<div className="flex items-center mt-1 text-sm text-gray-600">
                        <Globe size={14} className="mr-2"/>
                        <a href={businessDetails.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                          {businessDetails.website}
                        </a>
                      </div>)}
                  </div>

                  {businessDetails.rating && (<div className="flex items-center space-x-2">
                      <div className="flex">{getRatingStars(businessDetails.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {businessDetails.rating} ({businessDetails.user_ratings_total} reviews)
                      </span>
                    </div>)}

                  {businessDetails.opening_hours && (<div>
                      <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {businessDetails.opening_hours.weekday_text.map(function (day, index) { return (<div key={index}>{day}</div>); })}
                      </div>
                    </div>)}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button onClick={function () { return setSelectedBusiness(null); }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Close
                    </button>
                    {!importedBusinessIds.has(selectedBusiness.place_id) && (<button onClick={function () {
                        importBusiness(selectedBusiness);
                        setSelectedBusiness(null);
                    }} disabled={importing} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {importing ? 'Importing...' : 'Import Business'}
                      </button>)}
                  </div>
                </div>) : (<p className="text-gray-600">Unable to load business details.</p>)}
            </div>
          </div>
        </div>)}
    </div>);
};
export default BusinessDiscovery;
