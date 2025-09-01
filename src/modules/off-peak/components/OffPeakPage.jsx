import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MapPin, Star, ArrowLeft, Filter } from 'lucide-react';
import OffPeakFiltersModal from './OffPeakFiltersModal';
import { mockOffPeakDeals } from '../data/mockData';
var OffPeakPage = function () {
    var navigate = useNavigate();
    var location = useLocation();
    var _a = useState('all'), selectedTimeSlot = _a[0], setSelectedTimeSlot = _a[1];
    var _b = useState({
        cuisine: [],
        location: [],
        dealType: [],
        priceRange: { min: 0, max: 100 },
        dateRange: { start: '', end: '' },
        pax: 2
    }), filters = _b[0], setFilters = _b[1];
    var _c = useState(false), showFiltersModal = _c[0], setShowFiltersModal = _c[1];
    var _d = useState(null), restaurantFilter = _d[0], setRestaurantFilter = _d[1];
    // Get current time in Thailand timezone (GMT+7)
    var currentTime = new Date();
    var thailandTime = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    var currentHour = thailandTime.getHours();
    var currentMinutes = thailandTime.getMinutes();
    // Helper function to check if deal is available in next X hours
    var isAvailableInNextHours = function (dealType, hours) {
        var dealTimeRanges = {
            'early-bird': { start: 11, end: 14 },
            'afternoon': { start: 14, end: 17 },
            'late-night': { start: 21, end: 24 }
        };
        var range = dealTimeRanges[dealType];
        if (!range)
            return false;
        var currentDecimal = currentHour + currentMinutes / 60;
        var nextXHours = currentDecimal + hours;
        // Check if next X hours overlaps with deal time
        return (currentDecimal <= range.end && nextXHours >= range.start);
    };
    // Helper function to check if deal is available today
    var isAvailableToday = function (dealType) {
        var dealTimeRanges = {
            'early-bird': { start: 11, end: 14 },
            'afternoon': { start: 14, end: 17 },
            'late-night': { start: 21, end: 24 }
        };
        var range = dealTimeRanges[dealType];
        if (!range)
            return false;
        var currentDecimal = currentHour + currentMinutes / 60;
        return currentDecimal <= range.end;
    };
    useEffect(function () {
        // Extract restaurant filter from URL parameters
        var searchParams = new URLSearchParams(location.search);
        var restaurantParam = searchParams.get('restaurant');
        if (restaurantParam) {
            setRestaurantFilter(restaurantParam);
        }
    }, [location.search]);
    var applyFilters = function (newFilters) {
        setFilters(newFilters);
        setShowFiltersModal(false);
    };
    // Filter deals based on time slot and other filters
    var filteredDeals = mockOffPeakDeals.filter(function (deal) {
        // Restaurant-specific filtering (when coming from restaurant page)
        if (restaurantFilter) {
            var restaurantMatch = deal.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase());
            if (!restaurantMatch)
                return false;
        }
        // Time-based filtering
        var timeMatch = true;
        if (selectedTimeSlot === 'next2h') {
            timeMatch = isAvailableInNextHours(deal.dealType, 2);
        }
        else if (selectedTimeSlot === 'next6h') {
            timeMatch = isAvailableInNextHours(deal.dealType, 6);
        }
        else if (selectedTimeSlot === 'today') {
            timeMatch = isAvailableToday(deal.dealType);
        }
        var cuisineMatch = filters.cuisine.length === 0 || filters.cuisine.includes(deal.cuisine);
        var locationMatch = filters.location.length === 0 || filters.location.includes(deal.location);
        var dealTypeMatch = filters.dealType.length === 0 || filters.dealType.includes(deal.dealType);
        // Filter by discount percentage instead of price
        var discountMatch = deal.discountPercentage >= filters.priceRange.min &&
            deal.discountPercentage <= filters.priceRange.max;
        return timeMatch && cuisineMatch && locationMatch && dealTypeMatch && discountMatch;
    });
    // Sort deals by discount percentage (highest first) and popularity
    var sortedDeals = filteredDeals.sort(function (a, b) {
        // Prioritize higher discounts
        if (a.discountPercentage !== b.discountPercentage) {
            return b.discountPercentage - a.discountPercentage;
        }
        // Then by popularity
        if (a.isPopular && !b.isPopular)
            return -1;
        if (b.isPopular && !a.isPopular)
            return 1;
        // Then by rating
        return b.rating - a.rating;
    });
    var getDealTypeIcon = function (dealType) {
        switch (dealType) {
            case 'early-bird': return '🌅';
            case 'afternoon': return '☀️';
            case 'late-night': return '🌙';
            default: return '⭐';
        }
    };
    var getDealTypeLabel = function (dealType) {
        switch (dealType) {
            case 'early-bird': return 'Early Bird';
            case 'afternoon': return 'Afternoon';
            case 'late-night': return 'Late Night';
            default: return 'Special';
        }
    };
    var getDealTypeTime = function (type) {
        switch (type) {
            case 'early-bird': return '11:30 - 14:30';
            case 'afternoon': return '14:30 - 17:30';
            case 'late-night': return '21:00 - 23:30';
            default: return '';
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Off Peak Dining</h1>
                <p className="text-sm text-gray-600">
                  {restaurantFilter ? "Deals for ".concat(restaurantFilter) : 'Save up to 50% during off-peak hours'}
                </p>
              </div>
            </div>
            <button onClick={function () { return setShowFiltersModal(true); }} className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Filter size={16}/>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Time Slot Filters */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-1 mb-4">
            <button onClick={function () { return setSelectedTimeSlot('next2h'); }} className={"px-2 py-2 rounded-full text-xs font-medium ".concat(selectedTimeSlot === 'next2h'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              🔥 Next 2H
            </button>
            <button onClick={function () { return setSelectedTimeSlot('next6h'); }} className={"px-2 py-2 rounded-full text-xs font-medium ".concat(selectedTimeSlot === 'next6h'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              ⏰ Next 6H
            </button>
            <button onClick={function () { return setSelectedTimeSlot('today'); }} className={"px-2 py-2 rounded-full text-xs font-medium ".concat(selectedTimeSlot === 'today'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              📅 All Day
            </button>
            <button onClick={function () { return setSelectedTimeSlot('all'); }} className={"px-2 py-2 rounded-full text-xs font-medium ".concat(selectedTimeSlot === 'all'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              🌟 All Deals
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {sortedDeals.length} deals available
                </p>
                <p className="text-xs text-gray-600">
                  Up to {sortedDeals.length > 0 ? Math.max.apply(Math, sortedDeals.map(function (d) { return d.discountPercentage; })) : 0}% off today
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {sortedDeals.length > 0 ? Math.round(sortedDeals.reduce(function (acc, deal) { return acc + deal.discountPercentage; }, 0) / sortedDeals.length) : 0}%
                </div>
                <div className="text-xs text-gray-500">Avg. Discount</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="p-4">
        {sortedDeals.length === 0 ? (<div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock size={48} className="mx-auto"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>) : restaurantFilter ? (
        /* Compact Grid View for Single Restaurant */
        <div className="grid grid-cols-1 gap-3">
            {sortedDeals.map(function (deal) { return (<div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-red-600">
                      {deal.discountPercentage}%
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getDealTypeIcon(deal.dealType)} {getDealTypeLabel(deal.dealType)}
                      </div>
                      <div className="text-xs text-gray-600">{deal.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {deal.isPopular && (<span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                        🔥 Popular
                      </span>)}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {deal.timeSlots.map(function (slot) { return (<button key={slot.id} disabled={!slot.isAvailable} className={"p-3 rounded-lg border text-center text-sm transition-colors ".concat(slot.isAvailable
                        ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed')}>
                      <div className="font-medium">{slot.startTime}</div>
                      <div className="text-xs">
                        {slot.isAvailable
                        ? "".concat(slot.remainingSeats, " left")
                        : 'Full'}
                      </div>
                    </button>); })}
                </div>

                {/* Quick Book Button */}
                <button className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Book {deal.discountPercentage}% Off
                </button>
              </div>); })}
          </div>) : (
        /* Full Card View for All Restaurants */
        <div className="space-y-4">
            {sortedDeals.map(function (deal) { return (<div key={deal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Deal Header with Prominent Percentage */}
                <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold">
                        {deal.discountPercentage}%
                      </div>
                      <div>
                        <div className="text-sm opacity-90">OFF</div>
                        <div className="text-xs opacity-75">
                          {getDealTypeIcon(deal.dealType)} {getDealTypeLabel(deal.dealType)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {deal.isPopular && (<span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full mb-1 block">
                          🔥 Popular
                        </span>)}
                      {deal.isLimitedTime && (<span className="bg-red-200 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                          ⏰ Limited
                        </span>)}
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{deal.restaurantName}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin size={14}/>
                          <span>{deal.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14}/>
                          <span>{deal.rating} ({deal.reviewCount})</span>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full">
                          {deal.cuisine}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <img src={deal.restaurantImage} alt={deal.restaurantName} className="w-16 h-16 rounded-lg object-cover"/>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>

                  {/* Time Slots */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Available Times</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {deal.timeSlots.slice(0, 2).map(function (slot) { return (<div key={slot.id} className={"p-2 rounded border text-center text-sm ".concat(slot.isAvailable
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500')}>
                          <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                          <div className="text-xs">
                            {slot.isAvailable
                        ? "".concat(slot.remainingSeats, " seats left")
                        : 'Fully booked'}
                          </div>
                        </div>); })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Book {deal.discountPercentage}% Off Deal
                  </button>
                </div>
              </div>); })}
          </div>)}
      </div>

      {/* Filters Modal */}
      {showFiltersModal && (<OffPeakFiltersModal onClose={function () { return setShowFiltersModal(false); }} onApplyFilters={applyFilters}/>)}
    </div>);
};
export default OffPeakPage;
