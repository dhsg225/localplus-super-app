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
import { bookingService } from '../../../shared/services/bookingService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
var DEMO_REVENUE_PER_BOOKING = 20; // USD per completed booking (for demo)
var Analytics = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _j = useState([]), restaurants = _j[0], setRestaurants = _j[1];
    var _k = useState(''), selectedRestaurant = _k[0], setSelectedRestaurant = _k[1];
    var _l = useState(true), loading = _l[0], setLoading = _l[1];
    var _m = useState(''), error = _m[0], setError = _m[1];
    var _o = useState(null), stats = _o[0], setStats = _o[1];
    var _p = useState(false), statsLoading = _p[0], setStatsLoading = _p[1];
    var _q = useState([]), bookingsOverTime = _q[0], setBookingsOverTime = _q[1];
    var _r = useState(false), chartLoading = _r[0], setChartLoading = _r[1];
    var _s = useState([]), revenueOverTime = _s[0], setRevenueOverTime = _s[1];
    var _t = useState(false), revenueChartLoading = _t[0], setRevenueChartLoading = _t[1];
    useEffect(function () {
        var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, bookingService.getPartnerRestaurants()];
                    case 1:
                        data = _a.sent();
                        setRestaurants(data);
                        if (data.length > 0) {
                            setSelectedRestaurant(data[0].id);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError('Failed to load restaurants');
                        console.error('Error loading restaurants:', err_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurants();
    }, []);
    useEffect(function () {
        var fetchStats = function () { return __awaiter(void 0, void 0, void 0, function () {
            var endDate, startDate, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        setStatsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        endDate = new Date();
                        startDate = new Date();
                        startDate.setDate(endDate.getDate() - 29);
                        return [4 /*yield*/, bookingService.getBookingStats(selectedRestaurant, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])];
                    case 2:
                        data = _a.sent();
                        setStats(data);
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _a.sent();
                        setError('Failed to load analytics stats');
                        setStats(null);
                        console.error('Error loading analytics stats:', err_2);
                        return [3 /*break*/, 5];
                    case 4:
                        setStatsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchStats();
    }, [selectedRestaurant]);
    useEffect(function () {
        var fetchBookingsOverTime = function () { return __awaiter(void 0, void 0, void 0, function () {
            var endDate, startDate, bookings_1, days, i, d, counts, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        setChartLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        endDate = new Date();
                        startDate = new Date();
                        startDate.setDate(endDate.getDate() - 29);
                        return [4 /*yield*/, bookingService.getBookings(selectedRestaurant)];
                    case 2:
                        bookings_1 = _a.sent();
                        days = [];
                        for (i = 0; i < 30; i++) {
                            d = new Date(startDate);
                            d.setDate(d.getDate() + i);
                            days.push(d.toISOString().split('T')[0]);
                        }
                        counts = days.map(function (date) { return ({
                            date: date,
                            count: bookings_1.filter(function (b) { return b.booking_date === date; }).length
                        }); });
                        setBookingsOverTime(counts);
                        return [3 /*break*/, 5];
                    case 3:
                        err_3 = _a.sent();
                        setBookingsOverTime([]);
                        console.error('Error loading bookings over time:', err_3);
                        return [3 /*break*/, 5];
                    case 4:
                        setChartLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchBookingsOverTime();
    }, [selectedRestaurant]);
    useEffect(function () {
        var fetchRevenueOverTime = function () { return __awaiter(void 0, void 0, void 0, function () {
            var endDate, startDate, bookings_2, days, i, d, revenue, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        setRevenueChartLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        endDate = new Date();
                        startDate = new Date();
                        startDate.setDate(endDate.getDate() - 29);
                        return [4 /*yield*/, bookingService.getBookings(selectedRestaurant)];
                    case 2:
                        bookings_2 = _a.sent();
                        days = [];
                        for (i = 0; i < 30; i++) {
                            d = new Date(startDate);
                            d.setDate(d.getDate() + i);
                            days.push(d.toISOString().split('T')[0]);
                        }
                        revenue = days.map(function (date) {
                            var completed = bookings_2.filter(function (b) { return b.booking_date === date && b.status === 'completed'; }).length;
                            return {
                                date: date,
                                revenue: completed * DEMO_REVENUE_PER_BOOKING
                            };
                        });
                        setRevenueOverTime(revenue);
                        return [3 /*break*/, 5];
                    case 3:
                        err_4 = _a.sent();
                        setRevenueOverTime([]);
                        console.error('Error loading revenue over time:', err_4);
                        return [3 /*break*/, 5];
                    case 4:
                        setRevenueChartLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchRevenueOverTime();
    }, [selectedRestaurant]);
    if (loading) {
        return (<div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading analytics...</p>
      </div>);
    }
    if (error) {
        return (<div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>);
    }
    return (<div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">View your restaurant's booking and revenue trends</p>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Restaurant</h2>
          <select value={selectedRestaurant} onChange={function (e) { return setSelectedRestaurant(e.target.value); }} className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {restaurants.map(function (restaurant) { return (<option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>); })}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">{statsLoading ? '...' : (_a = stats === null || stats === void 0 ? void 0 : stats.totalBookings) !== null && _a !== void 0 ? _a : '-'}</span>
          <span className="text-gray-600 mt-2">Total Bookings (30d)</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">{statsLoading ? '...' : (_b = stats === null || stats === void 0 ? void 0 : stats.confirmedBookings) !== null && _b !== void 0 ? _b : '-'}</span>
          <span className="text-gray-600 mt-2">Confirmed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-red-600">{statsLoading ? '...' : (_c = stats === null || stats === void 0 ? void 0 : stats.cancelledBookings) !== null && _c !== void 0 ? _c : '-'}</span>
          <span className="text-gray-600 mt-2">Cancelled</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-800">{statsLoading ? '...' : (_d = stats === null || stats === void 0 ? void 0 : stats.completedBookings) !== null && _d !== void 0 ? _d : '-'}</span>
          <span className="text-gray-600 mt-2">Completed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-yellow-600">{statsLoading ? '...' : (_e = stats === null || stats === void 0 ? void 0 : stats.noShowBookings) !== null && _e !== void 0 ? _e : '-'}</span>
          <span className="text-gray-600 mt-2">No Shows</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">{statsLoading ? '...' : (_f = stats === null || stats === void 0 ? void 0 : stats.totalGuests) !== null && _f !== void 0 ? _f : '-'}</span>
          <span className="text-gray-600 mt-2">Total Guests</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-800">{statsLoading ? '...' : (_h = (_g = stats === null || stats === void 0 ? void 0 : stats.averagePartySize) === null || _g === void 0 ? void 0 : _g.toFixed(2)) !== null && _h !== void 0 ? _h : '-'}</span>
          <span className="text-gray-600 mt-2">Avg. Party Size</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bookings Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            {chartLoading ? (<div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span>Loading chart...</span>
              </div>) : (<ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date" tickFormatter={function (d) { return d.slice(5); }} fontSize={12}/>
                  <YAxis allowDecimals={false} fontSize={12}/>
                  <Tooltip formatter={function (value) { return [value, 'Bookings']; }} labelFormatter={function (d) { return "Date: ".concat(d); }}/>
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>)}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            {revenueChartLoading ? (<div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <span>Loading chart...</span>
              </div>) : (<ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="date" tickFormatter={function (d) { return d.slice(5); }} fontSize={12}/>
                  <YAxis allowDecimals={false} fontSize={12} tickFormatter={function (v) { return "$".concat(v); }}/>
                  <Tooltip formatter={function (value) { return ["$".concat(value), 'Revenue']; }} labelFormatter={function (d) { return "Date: ".concat(d); }}/>
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>)}
          </div>
        </div>
      </div>

      {/* More analytics sections can be added here */}
    </div>);
};
export default Analytics;
