import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { OffPeakFilters } from '../types';

interface OffPeakFiltersModalProps {
  onClose: () => void;
  onApplyFilters: (filters: OffPeakFilters) => void;
}

const OffPeakFiltersModal: React.FC<OffPeakFiltersModalProps> = ({
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<OffPeakFilters>({
    cuisine: [],
    location: [],
    dealType: [],
    priceRange: { min: 0, max: 80 },
    dateRange: { start: '', end: '' },
    pax: 2
  });

  const cuisineOptions = [
    'Thai', 'Japanese', 'Italian', 'Chinese', 'Korean', 'International', 'French', 'Mexican'
  ];

  const locationOptions = [
    'Pattaya', 'Hua Hin', 'Krabi', 'Samui', 'Bangkok', 'Phuket'
  ];

  const dealTypeOptions = [
    { value: 'early-bird', label: 'Early Bird' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'late-night', label: 'Late Night' }
  ];

  const handleCheckboxChange = (category: keyof Pick<OffPeakFilters, 'cuisine' | 'location' | 'dealType'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      cuisine: [],
      location: [],
      dealType: [],
      priceRange: { min: 0, max: 80 },
      dateRange: { start: '', end: '' },
      pax: 2
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 py-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-sm mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-3 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Cuisine */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Cuisine</h4>
              <div className="grid grid-cols-2 gap-1">
                {cuisineOptions.map(cuisine => (
                  <label key={cuisine} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={filters.cuisine.includes(cuisine)}
                      onChange={() => handleCheckboxChange('cuisine', cuisine)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
              <div className="grid grid-cols-2 gap-1">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => handleCheckboxChange('location', location)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deal Type */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Deal Type</h4>
              <div className="space-y-1">
                {dealTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={filters.dealType.includes(option.value)}
                      onChange={() => handleCheckboxChange('dealType', option.value)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">{option.label}</span>
                  </label>
                ))}
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
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                      }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Max Discount: {filters.priceRange.max}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                      }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 bg-gray-50 flex items-center justify-between">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset All
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onApplyFilters(filters)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffPeakFiltersModal; 