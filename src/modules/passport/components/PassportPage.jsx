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
import { ArrowLeft, Trophy, Star, Clock, Bookmark, TrendingUp, Award, Gift, Calendar, Crown, MapPin, QrCode, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPassportUser, mockPassportStats, mockDistrictChallenges, mockCuisineCallenges, mockPassportActivities, mockSavedDeals } from '../data/mockPassportData';
// Mock businesses data with locations in Hua Hin
var mockBusinesses = [
    {
        id: 1,
        name: "Seaside Bistro",
        category: "Restaurants",
        discount: 20,
        distance: 0.8,
        location: "Hua Hin Beach",
        lat: 12.5684,
        lng: 99.9578,
        isRedeemed: false,
        redemptionCode: "HH2024-001"
    },
    {
        id: 2,
        name: "Blue Wave Spa",
        category: "Spa & Wellness",
        discount: 25,
        distance: 1.2,
        location: "Town Center",
        lat: 12.5704,
        lng: 99.9598,
        isRedeemed: false,
        redemptionCode: "HH2024-002"
    },
    {
        id: 3,
        name: "Local Craft Market",
        category: "Shopping",
        discount: 15,
        distance: 0.5,
        location: "Night Market",
        lat: 12.5694,
        lng: 99.9588,
        isRedeemed: true,
        redemptionCode: "HH2024-003"
    },
    {
        id: 4,
        name: "Sunset Sailing",
        category: "Activities",
        discount: 30,
        distance: 2.1,
        location: "Hua Hin Pier",
        lat: 12.5674,
        lng: 99.9568,
        isRedeemed: false,
        redemptionCode: "HH2024-004"
    },
    {
        id: 5,
        name: "Golden Palace Thai",
        category: "Restaurants",
        discount: 18,
        distance: 1.8,
        location: "Royal Golf Area",
        lat: 12.5654,
        lng: 99.9548,
        isRedeemed: false,
        redemptionCode: "HH2024-005"
    },
    {
        id: 6,
        name: "Wellness Retreat",
        category: "Spa & Wellness",
        discount: 22,
        distance: 2.8,
        location: "Khao Takiab",
        lat: 12.5634,
        lng: 99.9528,
        isRedeemed: false,
        redemptionCode: "HH2024-006"
    }
];
var PassportPage = function () {
    var navigate = useNavigate();
    var _a = useState('overview'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = useState(null), userLocation = _b[0], setUserLocation = _b[1];
    var _c = useState(mockBusinesses), nearbyBusinesses = _c[0], setNearbyBusinesses = _c[1];
    var _d = useState(3), selectedDistance = _d[0], setSelectedDistance = _d[1]; // Default 3km
    var _e = useState(true), isLoadingLocation = _e[0], setIsLoadingLocation = _e[1];
    var user = mockPassportUser;
    var stats = mockPassportStats;
    // Detect user location
    useEffect(function () {
        detectLocation();
    }, []);
    // Calculate distance between two coordinates using Haversine formula
    var calculateDistance = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Earth's radius in kilometers
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = R * c;
        return Math.round(distance * 10) / 10; // Round to 1 decimal place
    };
    var detectLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoadingLocation(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    if (!navigator.geolocation) return [3 /*break*/, 2];
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var _a = position.coords, latitude = _a.latitude, longitude = _a.longitude;
                        var detectedLocation = {
                            lat: latitude,
                            lng: longitude,
                            city: 'Hua Hin' // For demo, assume we're in Hua Hin
                        };
                        setUserLocation(detectedLocation);
                        // Calculate real distances to businesses
                        var businessesWithRealDistances = mockBusinesses.map(function (business) { return (__assign(__assign({}, business), { distance: calculateDistance(latitude, longitude, business.lat, business.lng) })); });
                        setNearbyBusinesses(businessesWithRealDistances);
                        setIsLoadingLocation(false);
                    }, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var response, data, fallbackLocation_1, businessesWithDistances, error_3;
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
                                    fallbackLocation_1 = {
                                        lat: data.latitude || 12.5684,
                                        lng: data.longitude || 99.9578,
                                        city: data.city || 'Hua Hin'
                                    };
                                    setUserLocation(fallbackLocation_1);
                                    businessesWithDistances = mockBusinesses.map(function (business) { return (__assign(__assign({}, business), { distance: calculateDistance(fallbackLocation_1.lat, fallbackLocation_1.lng, business.lat, business.lng) })); });
                                    setNearbyBusinesses(businessesWithDistances);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _a.sent();
                                    console.log('IP geolocation failed:', error_3);
                                    // Final fallback to Hua Hin center
                                    setUserLocation({
                                        lat: 12.5684,
                                        lng: 99.9578,
                                        city: 'Hua Hin'
                                    });
                                    return [3 /*break*/, 4];
                                case 4:
                                    setIsLoadingLocation(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch('https://ipapi.co/json/')];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    setUserLocation({
                        lat: data.latitude || 12.5684,
                        lng: data.longitude || 99.9578,
                        city: data.city || 'Hua Hin'
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    // Final fallback
                    setUserLocation({
                        lat: 12.5684,
                        lng: 99.9578,
                        city: 'Hua Hin'
                    });
                    return [3 /*break*/, 6];
                case 6:
                    setIsLoadingLocation(false);
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _a.sent();
                    console.log('Location detection failed:', error_2);
                    setUserLocation({
                        lat: 12.5684,
                        lng: 99.9578,
                        city: 'Hua Hin'
                    });
                    setIsLoadingLocation(false);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    // Filter businesses within selected distance
    var getBusinessesNearby = function () {
        return nearbyBusinesses
            .filter(function (business) { return business.distance <= selectedDistance; })
            .sort(function (a, b) { return a.distance - b.distance; });
    };
    var handleQRScan = function (businessId, redemptionCode) {
        var _a;
        // In real app, this would call API to redeem
        setNearbyBusinesses(function (prev) {
            return prev.map(function (business) {
                return business.id === businessId
                    ? __assign(__assign({}, business), { isRedeemed: true }) : business;
            });
        });
        alert("Discount redeemed at ".concat((_a = nearbyBusinesses.find(function (b) { return b.id === businessId; })) === null || _a === void 0 ? void 0 : _a.name, "! Enjoy your savings."));
    };
    var getLevelProgress = function () {
        var levelStamps = {
            bronze: 50,
            silver: 100,
            gold: 200,
            platinum: 500
        };
        var currentLevelStamps = levelStamps[user.level];
        var nextLevel = user.level === 'bronze' ? 'silver' :
            user.level === 'silver' ? 'gold' :
                user.level === 'gold' ? 'platinum' : 'platinum';
        var nextLevelStamps = levelStamps[nextLevel] || 500;
        return {
            current: user.stamps,
            target: nextLevelStamps,
            progress: (user.stamps / nextLevelStamps) * 100,
            nextLevel: nextLevel
        };
    };
    var levelProgress = getLevelProgress();
    var formatDaysAgo = function (date) {
        var days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0)
            return 'Today';
        if (days === 1)
            return '1 day ago';
        return "".concat(days, " days ago");
    };
    var getRarityColor = function (rarity) {
        switch (rarity) {
            case 'common': return 'text-gray-600 bg-gray-100';
            case 'rare': return 'text-blue-600 bg-blue-100';
            case 'epic': return 'text-purple-600 bg-purple-100';
            case 'legendary': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    var renderOverview = function () { return (<div className="space-y-6">
      {/* Subscription Status & Benefits */}
      {user.subscriptionTier === 'premium' ? (<div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Crown size={16}/>
                <span className="text-sm opacity-90">{user.level.toUpperCase()} MEMBER</span>
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full">
                  PREMIUM ACTIVE
                </span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                Unlimited discounts • Expires Dec 2024
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{user.stamps}</div>
              <div className="text-sm opacity-75">stamps</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {levelProgress.nextLevel}</span>
              <span>{levelProgress.current}/{levelProgress.target}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: "".concat(Math.min(levelProgress.progress, 100), "%") }}/>
            </div>
          </div>
        </div>) : (
        /* Subscription Upgrade Prompt */
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-6">
          <div className="text-center">
            <Crown size={32} className="mx-auto mb-3 text-yellow-400"/>
            <h2 className="text-xl font-bold mb-2">Unlock LocalPlus Savings Passport</h2>
            <p className="text-sm opacity-90 mb-4">
              Get instant discounts at 500+ businesses in Hua Hin
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="text-lg font-bold">฿199</div>
                <div className="text-xs opacity-75">per month</div>
              </div>
              <div className="bg-yellow-400 bg-opacity-20 rounded-lg p-3 border border-yellow-400">
                <div className="text-lg font-bold">฿1,990</div>
                <div className="text-xs opacity-75">per year</div>
                <div className="text-xs text-yellow-400 font-medium">Save ฿398</div>
              </div>
            </div>
            
            <button onClick={function () { return navigate('/passport/upgrade'); }} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>)}

      {/* Today's Instant Discounts Near Me - Premium Members Only */}
      {user.subscriptionTier === 'premium' && (<div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Today's Instant Discounts Near Me</h3>
              <MapPin size={16} className="text-gray-500"/>
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {isLoadingLocation ? 'LOCATING...' : "".concat(getBusinessesNearby().length, " WITHIN ").concat(selectedDistance, "KM")}
            </span>
          </div>

          {/* Distance Selector */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Distance from me:</span>
            </div>
            <div className="flex space-x-2">
              {distanceOptions.map(function (option) { return (<button key={option.value} onClick={function () { return setSelectedDistance(option.value); }} className={"px-3 py-1 rounded-full text-xs font-medium transition-colors ".concat(selectedDistance === option.value
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {option.label}
                </button>); })}
            </div>
          </div>

          {/* Location Status */}
          {isLoadingLocation && (<div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="ml-2 text-sm text-gray-600">Detecting your location...</span>
            </div>)}

          {!isLoadingLocation && userLocation && (<div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center text-xs text-blue-800">
                <MapPin size={14} className="mr-1"/>
                <span>Location: {userLocation.city} ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</span>
              </div>
            </div>)}
          
          <div className="space-y-3">
            {getBusinessesNearby().length === 0 ? (<div className="text-center py-8 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 text-gray-300"/>
                <p className="text-sm">No businesses found within {selectedDistance}km</p>
                <p className="text-xs mt-1">Try increasing the distance range</p>
              </div>) : (getBusinessesNearby().slice(0, 6).map(function (business) { return (<div key={business.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{business.name}</h4>
                        <span className="text-lg font-bold text-red-600">{business.discount}% OFF</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {business.category} • {business.location} • {business.distance}km away
                        </div>
                        {business.isRedeemed ? (<div className="flex items-center text-green-600 text-xs">
                            <CheckCircle size={14} className="mr-1"/>
                            Redeemed 2024
                          </div>) : (<button onClick={function () { return handleQRScan(business.id, business.redemptionCode); }} className="flex items-center bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                            <QrCode size={14} className="mr-1"/>
                            Redeem
                          </button>)}
                      </div>
                    </div>
                  </div>
                </div>); }))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-800">
              <strong>How it works:</strong> Each business offers one discount per calendar year. 
              Simply scan the QR code at checkout to redeem your savings. Location detected using GPS.
            </div>
          </div>
          
          <button className="w-full mt-4 text-center text-red-600 text-sm font-medium">
            Browse All Discounts →
          </button>
        </div>)}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBadges}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-gray-900">฿{stats.totalSavings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Bookings Made</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2"/>
            <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600">Week Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {user.badges.slice(-6).map(function (badge) { return (<div key={badge.id} className="text-center">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="text-xs font-medium text-gray-900">{badge.name}</div>
              <div className={"text-xs px-2 py-1 rounded-full ".concat(getRarityColor(badge.rarity))}>
                {badge.rarity}
              </div>
            </div>); })}
        </div>
        <button onClick={function () { return setActiveTab('badges'); }} className="w-full mt-4 text-center text-red-600 text-sm font-medium">
          View All Badges →
        </button>
      </div>
    </div>); };
    var renderBadges = function () { return (<div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {user.badges.map(function (badge) { return (<div key={badge.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h4 className="font-semibold text-gray-900">{badge.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
              <div className={"inline-block text-xs px-2 py-1 rounded-full mt-2 ".concat(getRarityColor(badge.rarity))}>
                {badge.rarity}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Earned {formatDaysAgo(badge.unlockedAt)}
              </div>
            </div>
          </div>); })}
      </div>
    </div>); };
    var renderChallenges = function () { return (<div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">District Challenges</h3>
      {mockDistrictChallenges.map(function (challenge) { return (<div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
            {challenge.isCompleted && (<div className="text-green-600">
                <Trophy size={20}/>
              </div>)}
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{challenge.visitedRestaurants.length}/{challenge.totalRestaurants}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={"h-2 rounded-full ".concat(challenge.isCompleted ? 'bg-green-500' : 'bg-red-500')} style={{ width: "".concat(challenge.progress, "%") }}/>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <Gift size={14} className="inline mr-1"/>
            {challenge.reward.description}
          </div>
        </div>); })}
      
      <h3 className="text-lg font-semibold text-gray-900 mt-6">Cuisine Challenges</h3>
      {mockCuisineCallenges.map(function (challenge) { return (<div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
            {challenge.isCompleted && (<div className="text-green-600">
                <Trophy size={20}/>
              </div>)}
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{challenge.currentCount}/{challenge.targetCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={"h-2 rounded-full ".concat(challenge.isCompleted ? 'bg-green-500' : 'bg-blue-500')} style={{ width: "".concat((challenge.currentCount / challenge.targetCount) * 100, "%") }}/>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <Gift size={14} className="inline mr-1"/>
            {challenge.reward.description}
          </div>
        </div>); })}
    </div>); };
    var renderSavedDeals = function () { return (<div className="space-y-4">
      {mockSavedDeals.map(function (savedDeal) { return (<div key={savedDeal.id} className={"bg-white rounded-lg border border-gray-200 p-4 ".concat(savedDeal.isUsed ? 'opacity-60' : '')}>
          <div className="flex items-start space-x-3">
            <img src={savedDeal.restaurantImage} alt={savedDeal.restaurantName} className="w-16 h-16 rounded-lg object-cover"/>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{savedDeal.restaurantName}</h4>
                <div className="text-2xl font-bold text-red-600">{savedDeal.discountPercentage}%</div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{savedDeal.description}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">
                  Saved {formatDaysAgo(savedDeal.savedAt)}
                </div>
                
                {savedDeal.isUsed ? (<span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-full">
                    Used {formatDaysAgo(savedDeal.usedAt)}
                  </span>) : (<div className="flex items-center space-x-2">
                    <Clock size={12} className="text-orange-500"/>
                    <span className="text-xs text-orange-600">
                      Expires {new Date(savedDeal.expiresAt).toLocaleDateString()}
                    </span>
                  </div>)}
              </div>
              
              {!savedDeal.isUsed && (<button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">
                  Use Deal
                </button>)}
            </div>
          </div>
        </div>); })}
    </div>); };
    var renderActivity = function () { return (<div className="space-y-4">
      {mockPassportActivities.map(function (activity) { return (<div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {activity.type === 'badge_earned' && <Award className="h-5 w-5 text-yellow-500"/>}
              {activity.type === 'booking_completed' && <Calendar className="h-5 w-5 text-green-500"/>}
              {activity.type === 'review_written' && <Star className="h-5 w-5 text-blue-500"/>}
              {activity.type === 'deal_redeemed' && <Gift className="h-5 w-5 text-purple-500"/>}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
              {activity.restaurantName && (<p className="text-sm text-gray-600">at {activity.restaurantName}</p>)}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-green-600">+{activity.stampsEarned} stamps</span>
                <span className="text-xs text-blue-600">+{activity.pointsEarned} points</span>
                <span className="text-xs text-gray-500">{formatDaysAgo(activity.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>); })}
    </div>); };
    var distanceOptions = [
        { value: 1, label: '1km' },
        { value: 3, label: '3km' },
        { value: 5, label: '5km' },
        { value: 10, label: '10km' }
    ];
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={function () { return navigate('/'); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">LocalPlus Passport</h1>
              <p className="text-sm text-gray-600">Your dining journey across Bangkok</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {[
            { id: 'overview', name: 'Overview', icon: Trophy },
            { id: 'badges', name: 'Badges', icon: Award },
            { id: 'challenges', name: 'Challenges', icon: TrendingUp },
            { id: 'saved', name: 'Saved', icon: Bookmark },
            { id: 'activity', name: 'Activity', icon: Clock }
        ].map(function (tab) {
            var Icon = tab.icon;
            return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ".concat(activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700')}>
                  <Icon size={16}/>
                  <span>{tab.name}</span>
                </button>);
        })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'saved' && renderSavedDeals()}
        {activeTab === 'activity' && renderActivity()}
      </div>

      {/* Upgrade Prompt */}
      {user.subscriptionTier === 'free' && (<div className="fixed bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Upgrade to Premium</h4>
                <p className="text-sm opacity-90">Unlock exclusive deals & unlimited saves</p>
              </div>
              <button onClick={function () { return navigate('/passport/upgrade'); }} className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default PassportPage;
