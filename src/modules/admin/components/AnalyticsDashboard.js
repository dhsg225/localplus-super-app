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
import { Users, Building2, DollarSign, MapPin, Award } from 'lucide-react';
var AnalyticsDashboard = function () {
    var _a = useState('30d'), timeRange = _a[0], setTimeRange = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState({
        totalBusinesses: 0,
        activeBusinesses: 0,
        totalUsers: 0,
        premiumUsers: 0,
        totalRedemptions: 0,
        totalSavings: 0,
        monthlyRevenue: 0,
        growthRate: 0
    }), metrics = _c[0], setMetrics = _c[1];
    var _d = useState([]), topBusinesses = _d[0], setTopBusinesses = _d[1];
    var _e = useState([]), locationStats = _e[0], setLocationStats = _e[1];
    useEffect(function () {
        loadAnalytics();
    }, [timeRange]);
    var loadAnalytics = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setLoading(true);
            // Simulate API call - in production, this would fetch real analytics data
            setTimeout(function () {
                setMetrics({
                    totalBusinesses: 47,
                    activeBusinesses: 42,
                    totalUsers: 1284,
                    premiumUsers: 347,
                    totalRedemptions: 2567,
                    totalSavings: 89340,
                    monthlyRevenue: 52480,
                    growthRate: 23.4
                });
                setTopBusinesses([
                    {
                        id: '1',
                        name: 'Seaside Bistro',
                        category: 'Restaurants',
                        redemptions: 234,
                        revenue: 8450,
                        rating: 4.7,
                        growth: 15.2
                    },
                    {
                        id: '2',
                        name: 'Blue Wave Spa',
                        category: 'Wellness',
                        redemptions: 189,
                        revenue: 7230,
                        rating: 4.8,
                        growth: 22.1
                    },
                    {
                        id: '3',
                        name: 'Golden Palace Thai',
                        category: 'Restaurants',
                        redemptions: 156,
                        revenue: 5670,
                        rating: 4.6,
                        growth: 8.9
                    },
                    {
                        id: '4',
                        name: 'Local Craft Market',
                        category: 'Shopping',
                        redemptions: 142,
                        revenue: 4890,
                        rating: 4.3,
                        growth: 31.5
                    },
                    {
                        id: '5',
                        name: 'Sunset Sailing',
                        category: 'Entertainment',
                        redemptions: 98,
                        revenue: 3940,
                        rating: 4.9,
                        growth: 18.7
                    }
                ]);
                setLocationStats([
                    { city: 'Hua Hin', businesses: 32, users: 856, redemptions: 1890 },
                    { city: 'Bangkok', businesses: 8, users: 234, redemptions: 445 },
                    { city: 'Pattaya', businesses: 4, users: 142, redemptions: 189 },
                    { city: 'Chiang Mai', businesses: 3, users: 52, redemptions: 43 }
                ]);
                setLoading(false);
            }, 1500);
            return [2 /*return*/];
        });
    }); };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0
        }).format(amount);
    };
    var getTimeRangeLabel = function (range) {
        switch (range) {
            case '7d': return 'Last 7 days';
            case '30d': return 'Last 30 days';
            case '90d': return 'Last 90 days';
            case '1y': return 'Last year';
            default: return 'Last 30 days';
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
          <p className="text-gray-600 mt-1">Track platform performance and business metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select value={timeRange} onChange={function (e) { return setTimeRange(e.target.value); }} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {loading ? (<div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>) : (<>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalBusinesses}</p>
                  <p className="text-xs text-gray-500">{metrics.activeBusinesses} active</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500"/>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{metrics.premiumUsers} premium</p>
                </div>
                <Users className="h-8 w-8 text-green-500"/>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalRedemptions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{getTimeRangeLabel(timeRange)}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500"/>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.monthlyRevenue)}</p>
                  <p className="text-xs text-green-600">+{metrics.growthRate}% growth</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500"/>
              </div>
            </div>
          </div>

          {/* Top Performing Businesses */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Businesses</h3>
              <p className="text-gray-600 text-sm">Based on redemptions and revenue</p>
            </div>
            <div className="divide-y divide-gray-200">
              {topBusinesses.map(function (business, index) { return (<div key={business.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{business.name}</h4>
                      <p className="text-sm text-gray-600">{business.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{business.redemptions}</p>
                      <p className="text-xs text-gray-500">Redemptions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(business.revenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{business.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className={"text-sm font-medium ".concat(business.growth > 0 ? 'text-green-600' : 'text-red-600')}>
                        +{business.growth}%
                      </p>
                      <p className="text-xs text-gray-500">Growth</p>
                    </div>
                  </div>
                </div>); })}
            </div>
          </div>

          {/* Location Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Performance by Location</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {locationStats.map(function (location) { return (<div key={location.city} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin size={16} className="text-gray-400"/>
                        <span className="font-medium text-gray-900">{location.city}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <span className="font-medium text-gray-900">{location.businesses}</span>
                          <p className="text-xs text-gray-500">Businesses</p>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-gray-900">{location.users}</span>
                          <p className="text-xs text-gray-500">Users</p>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-gray-900">{location.redemptions}</span>
                          <p className="text-xs text-gray-500">Redemptions</p>
                        </div>
                      </div>
                    </div>
                  </div>); })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Insights</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User Subscriptions</span>
                  <span className="font-medium">{formatCurrency(metrics.premiumUsers * 199)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Business Partnerships</span>
                  <span className="font-medium">{formatCurrency(metrics.monthlyRevenue - (metrics.premiumUsers * 199))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Savings Given</span>
                  <span className="font-medium text-green-600">{formatCurrency(metrics.totalSavings)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Net Revenue</span>
                    <span className="font-bold text-gray-900">{formatCurrency(metrics.monthlyRevenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{(metrics.totalRedemptions / metrics.totalUsers).toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg redemptions per user</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{(metrics.totalSavings / metrics.totalRedemptions).toFixed(0)}</p>
                <p className="text-sm text-gray-600">Avg savings per redemption</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{((metrics.premiumUsers / metrics.totalUsers) * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Premium conversion rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{((metrics.activeBusinesses / metrics.totalBusinesses) * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Business activation rate</p>
              </div>
            </div>
          </div>
        </>)}
    </div>);
};
export default AnalyticsDashboard;
