import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, MapPin, Percent, Clock } from 'lucide-react';
import { mockOffPeakDeals } from '../../off-peak/data/mockData';

interface CuisineFilters {
  selectedCuisines: string[];
  selectedLocations: string[];
  priceRange: { min: number; max: number };
}

const CuisineExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CuisineFilters>({
    selectedCuisines: [],
    selectedLocations: [],
    priceRange: { min: 0, max: 100 }
  });

  // Extract unique cuisines and locations from deals
  const availableCuisines = useMemo(() => 
    [...new Set(mockOffPeakDeals.map(deal => deal.cuisine))].sort()
  , []);

  const availableLocations = useMemo(() => 
    [...new Set(mockOffPeakDeals.map(deal => deal.location))].sort()
  , []);

  // Filter deals based on current filters
  const filteredDeals = useMemo(() => {
    return mockOffPeakDeals.filter(deal => {
      const cuisineMatch = filters.selectedCuisines.length === 0 || 
        filters.selectedCuisines.includes(deal.cuisine);
      
      const locationMatch = filters.selectedLocations.length === 0 || 
        filters.selectedLocations.includes(deal.location);
      
      const priceMatch = deal.discountPercentage >= filters.priceRange.min && 
        deal.discountPercentage <= filters.priceRange.max;
      
      return cuisineMatch && locationMatch && priceMatch;
    });
  }, [filters]);

  // Group deals by cuisine
  const dealsByCuisine = useMemo(() => {
    const grouped: Record<string, typeof mockOffPeakDeals> = {};
    filteredDeals.forEach(deal => {
      if (!grouped[deal.cuisine]) {
        grouped[deal.cuisine] = [];
      }
      grouped[deal.cuisine].push(deal);
    });
    
    // Sort deals within each cuisine by discount percentage
    Object.keys(grouped).forEach(cuisine => {
      grouped[cuisine].sort((a, b) => b.discountPercentage - a.discountPercentage);
    });
    
    return grouped;
  }, [filteredDeals]);

  const handleCuisineToggle = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCuisines: prev.selectedCuisines.includes(cuisine)
        ? prev.selectedCuisines.filter(c => c !== cuisine)
        : [...prev.selectedCuisines, cuisine]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(location)
        ? prev.selectedLocations.filter(l => l !== location)
        : [...prev.selectedLocations, location]
    }));
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value }
    }));
  };

  const clearFilters = () => {
    setFilters({
      selectedCuisines: [],
      selectedLocations: [],
      priceRange: { min: 0, max: 100 }
    });
  };

  const handleDealClick = (deal: any) => {
    navigate(`/off-peak?restaurant=${encodeURIComponent(deal.restaurantName)}`);
  };

  const formatTimeRange = (dealType: string) => {
    switch (dealType) {
      case 'early-bird': return '11:00 - 14:00';
      case 'afternoon': return '14:30 - 17:30';
      case 'late-night': return '21:00 - 00:00';
      default: return 'Various times';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/restaurants')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Explore Cuisines</h1>
                <p className="text-sm text-gray-600">{filteredDeals.length} deals available</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              {/* Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Cuisine Types</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCuisines.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => handleCuisineToggle(cuisine)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        filters.selectedCuisines.includes(cuisine)
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {availableLocations.map(location => (
                    <button
                      key={location}
                      onClick={() => handleLocationToggle(location)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        filters.selectedLocations.includes(location)
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Discount Range: {filters.priceRange.min}% - {filters.priceRange.max}%
                </h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {Object.keys(dealsByCuisine).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>
        ) : (
          Object.entries(dealsByCuisine).map(([cuisine, deals]) => (
            <div key={cuisine} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">{cuisine} Cuisine</h2>
              <div className="grid grid-cols-1 gap-3">
                {deals.map(deal => (
                  <button
                    key={deal.id}
                    onClick={() => handleDealClick(deal)}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{deal.restaurantName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                          {deal.discountPercentage}% OFF
                        </span>
                        {deal.isPopular && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{deal.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{formatTimeRange(deal.dealType)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Percent size={14} />
                        <span>{deal.dealType.charAt(0).toUpperCase() + deal.dealType.slice(1).replace('-', ' ')}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CuisineExplorer; 