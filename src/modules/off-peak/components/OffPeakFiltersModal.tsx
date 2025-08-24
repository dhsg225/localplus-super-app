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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
var OffPeakFiltersModal = function (_a) {
    var onClose = _a.onClose, onApplyFilters = _a.onApplyFilters;
    var _b = useState({
        cuisine: [],
        location: [],
        dealType: [],
        priceRange: { min: 0, max: 80 },
        dateRange: { start: '', end: '' },
        pax: 2
    }), filters = _b[0], setFilters = _b[1];
    var cuisineOptions = [
        'Thai', 'Japanese', 'Italian', 'Chinese', 'Korean', 'International', 'French', 'Mexican'
    ];
    var locationOptions = [
        'Pattaya', 'Hua Hin', 'Krabi', 'Samui', 'Bangkok', 'Phuket'
    ];
    var dealTypeOptions = [
        { value: 'early-bird', label: 'Early Bird' },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'late-night', label: 'Late Night' }
    ];
    var handleCheckboxChange = function (category, value) {
        setFilters(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[category] = prev[category].includes(value)
                ? prev[category].filter(function (item) { return item !== value; })
                : __spreadArray(__spreadArray([], prev[category], true), [value], false), _a)));
        });
    };
    var resetFilters = function () {
        setFilters({
            cuisine: [],
            location: [],
            dealType: [],
            priceRange: { min: 0, max: 80 },
            dateRange: { start: '', end: '' },
            pax: 2
        });
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 py-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}/>

        <div className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-sm mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600"/>
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24}/>
            </button>
          </div>

          {/* Content */}
          <div className="px-3 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Cuisine */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Cuisine</h4>
              <div className="grid grid-cols-2 gap-1">
                {cuisineOptions.map(function (cuisine) { return (<label key={cuisine} className="flex items-center space-x-1">
                    <input type="checkbox" checked={filters.cuisine.includes(cuisine)} onChange={function () { return handleCheckboxChange('cuisine', cuisine); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"/>
                    <span className="text-xs text-gray-700">{cuisine}</span>
                  </label>); })}
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
              <div className="grid grid-cols-2 gap-1">
                {locationOptions.map(function (location) { return (<label key={location} className="flex items-center space-x-1">
                    <input type="checkbox" checked={filters.location.includes(location)} onChange={function () { return handleCheckboxChange('location', location); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"/>
                    <span className="text-xs text-gray-700">{location}</span>
                  </label>); })}
              </div>
            </div>

            {/* Deal Type */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Deal Type</h4>
              <div className="space-y-1">
                {dealTypeOptions.map(function (option) { return (<label key={option.value} className="flex items-center space-x-1">
                    <input type="checkbox" checked={filters.dealType.includes(option.value)} onChange={function () { return handleCheckboxChange('dealType', option.value); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"/>
                    <span className="text-xs text-gray-700">{option.label}</span>
                  </label>); })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Discount Range: {filters.priceRange.min}% - {filters.priceRange.max}%
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0% No Discount</span>
                  <span>25% Good</span>
                  <span>50% Great</span>
                  <span>75%+ Amazing</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Min Discount: {filters.priceRange.min}%
                    </label>
                    <input type="range" min="0" max="80" step="5" value={filters.priceRange.min} onChange={function (e) { return setFilters(function (prev) { return (__assign(__assign({}, prev), { priceRange: __assign(__assign({}, prev.priceRange), { min: Number(e.target.value) }) })); }); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Max Discount: {filters.priceRange.max}%
                    </label>
                    <input type="range" min="0" max="80" step="5" value={filters.priceRange.max} onChange={function (e) { return setFilters(function (prev) { return (__assign(__assign({}, prev), { priceRange: __assign(__assign({}, prev.priceRange), { max: Number(e.target.value) }) })); }); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 bg-gray-50 flex items-center justify-between">
            <button onClick={resetFilters} className="text-sm text-gray-600 hover:text-gray-800">
              Reset All
            </button>
            <div className="flex space-x-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={function () { return onApplyFilters(filters); }} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default OffPeakFiltersModal;
