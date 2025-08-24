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
import { Link } from 'react-router-dom';
import { Search, Calendar, Wrench, MessageCircle, Clock, Settings, MapPin, ChevronDown, Award, Star } from 'lucide-react';
import RotatingHeadlines from '../../modules/news/components/RotatingHeadlines';
var HomePage = function () {
    var _a = useState({
        city: 'Bangkok',
        country: 'Thailand',
        isDetected: false
    }), currentLocation = _a[0], setCurrentLocation = _a[1];
    var _b = useState(false), showLocationPicker = _b[0], setShowLocationPicker = _b[1];
    var availableLocations = [
        'Bangkok',
        'Pattaya',
        'Hua Hin',
        'Krabi',
        'Samui',
        'Phuket',
        'Chiang Mai',
        'Phuket Town'
    ];
    // Detect location on component mount
    useEffect(function () {
        detectLocation();
    }, []);
    var detectLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // Try to get user's geolocation
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, latitude, longitude, detectedLocation, newLocation;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = position.coords, latitude = _a.latitude, longitude = _a.longitude;
                                    return [4 /*yield*/, simulateLocationDetection(latitude, longitude)];
                                case 1:
                                    detectedLocation = _b.sent();
                                    newLocation = __assign(__assign({}, detectedLocation), { isDetected: true });
                                    setCurrentLocation(newLocation);
                                    // Save to localStorage for other modules
                                    try {
                                        localStorage.setItem('localplus-current-location', JSON.stringify(newLocation));
                                    }
                                    catch (error) {
                                        console.log('Failed to save detected location to localStorage:', error);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, function (error) {
                        console.log('Geolocation error:', error);
                        // Fallback to IP-based detection or default
                        fallbackLocationDetection();
                    });
                }
                else {
                    fallbackLocationDetection();
                }
            }
            catch (error) {
                console.log('Location detection failed:', error);
                fallbackLocationDetection();
            }
            return [2 /*return*/];
        });
    }); };
    var simulateLocationDetection = function (lat, lng) { return __awaiter(void 0, void 0, void 0, function () {
        var locations, _i, locations_1, location_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Simulate API call delay
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    // Simulate API call delay
                    _a.sent();
                    locations = [
                        { name: 'Bangkok', lat: 13.7563, lng: 100.5018, radius: 0.5 },
                        { name: 'Pattaya', lat: 12.9329, lng: 100.8825, radius: 0.3 },
                        { name: 'Hua Hin', lat: 12.5684, lng: 99.9578, radius: 0.3 },
                        { name: 'Phuket', lat: 7.8804, lng: 98.3923, radius: 0.3 },
                        { name: 'Chiang Mai', lat: 18.7883, lng: 98.9853, radius: 0.3 },
                        { name: 'Krabi', lat: 8.0863, lng: 98.9063, radius: 0.3 },
                        { name: 'Samui', lat: 9.5380, lng: 100.0614, radius: 0.2 }
                    ];
                    // Find closest matching location
                    for (_i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                        location_1 = locations_1[_i];
                        if (Math.abs(lat - location_1.lat) < location_1.radius && Math.abs(lng - location_1.lng) < location_1.radius) {
                            return [2 /*return*/, { city: location_1.name, country: 'Thailand', isDetected: true }];
                        }
                    }
                    // Default to Bangkok if no close match
                    return [2 /*return*/, { city: 'Bangkok', country: 'Thailand', isDetected: true }];
            }
        });
    }); };
    var fallbackLocationDetection = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, detectedCity_1, detectedRegion_1, mappedCity, huaHinKeywords, newLocation, error_1, fallbackLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // [2024-12-19 19:35 UTC] - Implement IP-based city detection instead of defaulting to Bangkok
                    console.log('Attempting IP-based location detection...');
                    return [4 /*yield*/, fetch('https://ipinfo.io/json')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log('IP detection result:', data);
                    detectedCity_1 = (data.city || '').toLowerCase();
                    detectedRegion_1 = (data.region || '').toLowerCase();
                    mappedCity = 'Bangkok';
                    huaHinKeywords = ['hua hin', 'hin lek fai', 'nong khon', 'prachuap', 'khiri khan'];
                    if (huaHinKeywords.some(function (keyword) {
                        return detectedCity_1.includes(keyword) || detectedRegion_1.includes(keyword);
                    })) {
                        mappedCity = 'Hua Hin';
                    }
                    // Check for Pattaya area (Chonburi province)
                    else if (['pattaya', 'chonburi', 'banglamung', 'si racha'].some(function (keyword) {
                        return detectedCity_1.includes(keyword) || detectedRegion_1.includes(keyword);
                    })) {
                        mappedCity = 'Pattaya';
                    }
                    // Check for other supported cities
                    else if (detectedCity_1.includes('phuket')) {
                        mappedCity = 'Phuket';
                    }
                    else if (detectedCity_1.includes('chiang mai')) {
                        mappedCity = 'Chiang Mai';
                    }
                    else if (detectedCity_1.includes('krabi')) {
                        mappedCity = 'Krabi';
                    }
                    else if (detectedCity_1.includes('samui') || detectedCity_1.includes('koh samui')) {
                        mappedCity = 'Samui';
                    }
                    // For Bangkok and surrounding areas
                    else if (['bangkok', 'samut sakhon', 'samut prakan', 'nonthaburi', 'pathum thani', 'ban phaeo'].some(function (keyword) {
                        return detectedCity_1.includes(keyword) || detectedRegion_1.includes(keyword);
                    })) {
                        mappedCity = 'Bangkok';
                    }
                    newLocation = {
                        city: mappedCity,
                        country: 'Thailand',
                        isDetected: true // Successfully detected via IP
                    };
                    console.log("IP-based detection: ".concat(data.city, ", ").concat(data.region, " -> ").concat(mappedCity));
                    setCurrentLocation(newLocation);
                    // Save to localStorage for other modules
                    try {
                        localStorage.setItem('localplus-current-location', JSON.stringify(newLocation));
                    }
                    catch (error) {
                        console.log('Failed to save detected location to localStorage:', error);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log('IP-based location detection failed:', error_1);
                    fallbackLocation = {
                        city: 'Bangkok',
                        country: 'Thailand',
                        isDetected: false
                    };
                    setCurrentLocation(fallbackLocation);
                    try {
                        localStorage.setItem('localplus-current-location', JSON.stringify(fallbackLocation));
                    }
                    catch (error) {
                        console.log('Failed to save fallback location to localStorage:', error);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleLocationChange = function (newCity) {
        var newLocation = {
            city: newCity,
            country: 'Thailand',
            isDetected: false // User manually selected
        };
        setCurrentLocation(newLocation);
        // Save to localStorage for other modules to access
        try {
            localStorage.setItem('localplus-current-location', JSON.stringify(newLocation));
        }
        catch (error) {
            console.log('Failed to save location to localStorage:', error);
        }
        setShowLocationPicker(false);
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header with Location */}
      <div className="bg-white px-4 py-6 text-center relative">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to LocalPlus</h1>
        <p className="text-gray-600 mb-3">Your lifestyle companion for Thailand</p>
        
        {/* Location Selector */}
        <div className="relative inline-block">
          <button onClick={function () { return setShowLocationPicker(!showLocationPicker); }} className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
            <MapPin size={16}/>
            <span className="font-medium">{currentLocation.city}</span>
            <ChevronDown size={16}/>
          </button>
          
          {showLocationPicker && (<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 px-2 py-1">Select your location:</p>
                {availableLocations.map(function (city) { return (<button key={city} onClick={function () { return handleLocationChange(city); }} className={"w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ".concat(currentLocation.city === city ? 'bg-red-50 text-red-600' : 'text-gray-700')}>
                    {city}
                  </button>); })}
              </div>
            </div>)}
        </div>
        
        {currentLocation.isDetected && (<p className="text-xs text-gray-500 mt-1">📍 Auto-detected: {currentLocation.city}{currentLocation.suburb ? ", ".concat(currentLocation.suburb) : ''}</p>)}
      </div>

      {/* [2024-12-19 19:50 UTC] - Updated to match screenshot 2 styling exactly */}
      <div className="px-4 mb-6 space-y-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-white"/>
              <div>
                <h3 className="font-bold text-lg">Off Peak Dining</h3>
                <p className="text-purple-100">Save up to 50% during off-peak hours</p>
              </div>
            </div>
            <button className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
              UP TO 50% OFF
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award size={20} className="text-white"/>
              <div>
                <h3 className="font-bold text-lg">Savings Passport</h3>
                <p className="text-orange-100">Instant savings at 500+ businesses</p>
              </div>
            </div>
            <button className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
              ฿199/MONTH
            </button>
          </div>
        </div>
      </div>

      {/* Rotating Headlines */}
      <div className="mb-6">
        <RotatingHeadlines currentCity={currentLocation.city.toLowerCase().replace(' ', '-')} transitionStyle="crossdissolve" intervalMs={6000} maxHeadlines={4}/>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Clean 5-category layout: Restaurants, Events, Services, AI Assistant, Savings Passport */}
          <Link to="/restaurants" className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-red-100 min-h-[120px] flex flex-col">
            <Search size={28} className="text-red-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Restaurants</h3>
            <p className="text-xs text-gray-500 flex-1">Find great places to eat</p>
          </Link>

          <Link to="/events" className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-blue-100 min-h-[120px] flex flex-col">
            <Calendar size={28} className="text-blue-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Events</h3>
            <p className="text-xs text-gray-500 flex-1">Discover local events</p>
          </Link>

          <Link to="/services" className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-100 min-h-[120px] flex flex-col">
            <Wrench size={28} className="text-green-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Services</h3>
            <p className="text-xs text-gray-500 flex-1">Local service providers</p>
          </Link>

          <Link to="/ai-assistant" className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-purple-100 min-h-[120px] flex flex-col">
            <MessageCircle size={28} className="text-purple-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">AI Assistant</h3>
            <p className="text-xs text-gray-500 flex-1">Ask about anything local</p>
          </Link>

          <Link to="/passport" className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-yellow-300 min-h-[120px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Award size={28} className="text-yellow-600"/>
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Savings Passport</h3>
            <p className="text-xs text-gray-500 flex-1">Instant savings at 500+ businesses</p>
          </Link>



          <Link to="/todays-deals" className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-teal-100 min-h-[120px] flex flex-col">
            <Clock size={28} className="text-teal-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Today's Deals</h3>
            <p className="text-xs text-gray-500 flex-1">Limited time offers</p>
          </Link>

          <Link to="/news" className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-indigo-100 min-h-[120px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">📰</div>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                NEW
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Local News</h3>
            <p className="text-xs text-gray-500 flex-1">Stay updated with local happenings</p>
          </Link>

          <Link to="/loyalty-cards" className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-yellow-100 min-h-[120px] flex flex-col">
            <Star size={28} className="text-yellow-500 mb-2"/>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">My Loyalty Cards</h3>
            <p className="text-xs text-gray-500 flex-1">Track your rewards & progress</p>
          </Link>
        </div>
      </div>

      {/* Business Section */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          For Business Owners
        </h2>
        <div className="space-y-4">
          {/* Business Onboarding */}
          <Link to="/business-onboarding" className="block bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">List Your Business</h3>
                <p className="text-red-100 text-sm">Join thousands of businesses and reach new customers</p>
              </div>
              <div className="text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* Business Management */}
          <Link to="/business" className="block bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center">
                  <Settings size={20} className="mr-2"/>
                  Manage Business
                </h3>
                <p className="text-green-100 text-sm">Update profile, menu, deals, and view analytics</p>
              </div>
              <div className="text-white bg-orange-500 px-2 py-1 rounded-full text-xs font-bold">
                MANAGE
              </div>
            </div>
          </Link>
        </div>
        
        {/* Discreet Build Number */}
        <div className="mt-4 text-center">
          <button onClick={function () { return window.location.href = '/admin'; }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                          v0.31.0
          </button>
        </div>
      </div>
    </div>);
};
export default HomePage;
