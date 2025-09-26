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
import { bookingService } from '../services/bookingService';
var Dashboard = function (_a) {
    var onNavigate = _a.onNavigate;
    var _b = useState([]), bookings = _b[0], setBookings = _b[1];
    var _c = useState([]), restaurants = _c[0], setRestaurants = _c[1];
    var _d = useState(true), loading = _d[0], setLoading = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    useEffect(function () {
        var loadDashboardData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var restaurantData, err_1, allRestaurants, fallbackErr_1, isDevelopmentMode, allBookings, bookingErr_1, err_2, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, 13, 14]);
                        restaurantData = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 8]);
                        return [4 /*yield*/, bookingService.getPartnerRestaurants()];
                    case 2:
                        restaurantData = _a.sent();
                        console.log('✅ Partner restaurants loaded:', restaurantData.length);
                        return [3 /*break*/, 8];
                    case 3:
                        err_1 = _a.sent();
                        console.warn('⚠️ Partner authentication failed, falling back to development mode');
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, restaurantService.getRestaurants()];
                    case 5:
                        allRestaurants = _a.sent();
                        restaurantData = allRestaurants.filter(function (r) {
                            return r.name.toLowerCase().includes('shannon');
                        });
                        if (restaurantData.length === 0) {
                            // If no Shannon's restaurant found, just show first restaurant for demo
                            restaurantData = allRestaurants.slice(0, 1);
                        }
                        console.log('🔧 Development fallback restaurants:', restaurantData.length);
                        return [3 /*break*/, 7];
                    case 6:
                        fallbackErr_1 = _a.sent();
                        console.error('❌ Development fallback also failed:', fallbackErr_1);
                        setError('Failed to load restaurant data. Please check your setup.');
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        setRestaurants(restaurantData);
                        isDevelopmentMode = !!localStorage.getItem('partner_dev_user');
                        if (!isDevelopmentMode && restaurantData.length > 0) return [3 /*break*/, 10];
                        setBookings([]);
                        return [3 /*break*/, 13];
                    case 9:
                        if (!(restaurantData.length > 0)) return [3 /*break*/, 13];
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, Promise.all(restaurantData.map(function (restaurant) {
                                return bookingService.getUpcomingBookings(restaurant.id, 7);
                            }))];
                    case 11:
                        allBookings = _a.sent();
                        setBookings(allBookings.flat());
                        return [3 /*break*/, 13];
                    case 12:
                        bookingErr_1 = _a.sent();
                        console.warn('⚠️ Failed to load bookings:', bookingErr_1);
                        // Don't throw error, just show empty bookings
                        setBookings([]);
                        return [3 /*break*/, 13];
                    case 13: 
                        // Always set loading to false when data loading is complete
                        setLoading(false);
                        return [3 /*break*/, 16];
                    case 14:
                        err_2 = _a.sent();
                        errorMessage = err_2 instanceof Error ? err_2.message : 'Failed to load dashboard data';
                        setError(errorMessage);
                        console.error('Error loading dashboard:', err_2);
                        // Set loading to false even on error
                        setLoading(false);
                        return [3 /*break*/, 16];
                    case 15:
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        }); };
        loadDashboardData();
    }, []);
    var todayBookings = bookings.filter(function (booking) {
        return booking.booking_date === new Date().toISOString().split('T')[0];
    });
    var pendingBookings = bookings.filter(function (booking) { return booking.status === 'pending'; });
    var confirmedBookings = bookings.filter(function (booking) { return booking.status === 'confirmed'; });
    var formatTime = function (time) {
        return new Date("2000-01-01T".concat(time)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'seated': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (loading) {
        return (<div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading dashboard...</p>
      </div>);
    }
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Dashboard</h1>
        <p className="text-gray-600">Manage your restaurant bookings and settings</p>
        
      </div>

      {error && (<div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          
        </div>)}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">🏪</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      {restaurants.length > 0 && (<div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Restaurants</h2>
            <div className="space-y-4">
              {restaurants.map(function (restaurant) { return (<div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                    <p className="text-sm text-gray-500">ID: {restaurant.id.slice(0, 8)}...</p>
                  </div>
                  <div className="text-right">
                    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(restaurant.partnership_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800')}>
                      {restaurant.partnership_status}
                    </span>
                  </div>
                </div>); })}
            </div>
          </div>
        </div>)}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded" onClick={function () { return onNavigate && onNavigate('bookings'); }}>
              📋 Manage Bookings
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded" onClick={function () { return onNavigate && onNavigate('availability'); }}>
              🕐 Availability Settings
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded" onClick={function () { return onNavigate && onNavigate('analytics'); }}>
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Today's Bookings */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Today's Bookings</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={function () { return onNavigate && onNavigate('bookings'); }}>
              View All
            </button>
          </div>
        </div>

        {todayBookings.length === 0 ? (<div className="p-8 text-center">
            <p className="text-gray-500">No bookings for today</p>
            
          </div>) : (<div className="divide-y divide-gray-200">
            {todayBookings.slice(0, 5).map(function (booking) { return (<div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'} at {formatTime(booking.booking_time)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customer_phone && "\uD83D\uDCDE ".concat(booking.customer_phone)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(getStatusColor(booking.status))}>
                      {booking.status}
                    </span>
                    {booking.special_requests && (<p className="text-xs text-gray-500 mt-1">
                        Note: {booking.special_requests}
                      </p>)}
                  </div>
                </div>
              </div>); })}
          </div>)}
      </div>
    </div>);
};
export default Dashboard;
