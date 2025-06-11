import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, MapPin, Star, Users, Filter, Calendar } from 'lucide-react';
import { OffPeakDeal, OffPeakFilters } from '../types';
import OffPeakDealCard from './OffPeakDealCard';
import OffPeakFiltersModal from './OffPeakFiltersModal';
import { mockOffPeakDeals } from '../data/mockData';

const OffPeakPage: React.FC = () => {
  const location = useLocation();
  const [deals, setDeals] = useState<OffPeakDeal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<OffPeakDeal[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPax, setSelectedPax] = useState(2);
  const [activeTab, setActiveTab] = useState<'all' | 'early-bird' | 'afternoon' | 'late-night'>('all');
  const [restaurantFilter, setRestaurantFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<OffPeakFilters>({
    cuisine: [],
    location: [],
    dealType: [],
    priceRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' },
    pax: 2
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    // Load mock data
    setDeals(mockOffPeakDeals);
    setFilteredDeals(mockOffPeakDeals);

    // Extract restaurant filter from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const restaurantParam = searchParams.get('restaurant');
    if (restaurantParam) {
      setRestaurantFilter(restaurantParam);
    }
  }, [location.search]);

  useEffect(() => {
    // Filter deals based on active tab and other criteria
    let filtered = deals;

    if (activeTab !== 'all') {
      filtered = filtered.filter(deal => deal.dealType === activeTab);
    }

    // Filter by restaurant name if specified
    if (restaurantFilter) {
      filtered = filtered.filter(deal => 
        deal.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase())
      );
    }

    // Filter by selected date availability
    filtered = filtered.filter(deal => 
      deal.availableDates.includes(selectedDate)
    );

    // Filter by pax options
    filtered = filtered.filter(deal => 
      deal.paxOptions.includes(selectedPax)
    );

    setFilteredDeals(filtered);
  }, [deals, activeTab, selectedDate, selectedPax, restaurantFilter]);

  const applyFilters = (newFilters: OffPeakFilters) => {
    setFilters(newFilters);
    setShowFiltersModal(false);
  };

  // Filter deals based on percentage range instead of price
  const filteredDeals = mockOffPeakDeals.filter(deal => {
    const cuisineMatch = filters.cuisine.length === 0 || filters.cuisine.includes(deal.cuisine);
    const locationMatch = filters.location.length === 0 || filters.location.includes(deal.location);
    const dealTypeMatch = filters.dealType.length === 0 || filters.dealType.includes(deal.dealType);
    
    // Filter by discount percentage instead of price
    const discountMatch = deal.discountPercentage >= filters.priceRange.min && 
                         deal.discountPercentage <= filters.priceRange.max;

    return cuisineMatch && locationMatch && dealTypeMatch && discountMatch;
  });

  // Sort deals by discount percentage (highest first) and popularity
  const sortedDeals = filteredDeals.sort((a, b) => {
    // Prioritize higher discounts
    if (a.discountPercentage !== b.discountPercentage) {
      return b.discountPercentage - a.discountPercentage;
    }
    // Then by popularity
    if (a.isPopular && !b.isPopular) return -1;
    if (b.isPopular && !a.isPopular) return 1;
    // Then by rating
    return b.rating - a.rating;
  });

  const getDealTypeIcon = (dealType: string) => {
    switch (dealType) {
      case 'early-bird': return '🌅';
      case 'afternoon': return '☀️';
      case 'late-night': return '🌙';
      default: return '⭐';
    }
  };

  const getDealTypeLabel = (dealType: string) => {
    switch (dealType) {
      case 'early-bird': return 'Early Bird';
      case 'afternoon': return 'Afternoon';
      case 'late-night': return 'Late Night';
      default: return 'Special';
    }
  };

  const getDealTypeTime = (type: string) => {
    switch (type) {
      case 'early-bird': return '11:30 - 14:30';
      case 'afternoon': return '14:30 - 17:30';
      case 'late-night': return '21:00 - 23:30';
      default: return '';
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
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Off Peak Dining</h1>
                <p className="text-sm text-gray-600">Save up to 50% during off-peak hours</p>
              </div>
            </div>
            <button
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {sortedDeals.length} deals available
                </p>
                <p className="text-xs text-gray-600">
                  Up to {Math.max(...sortedDeals.map(d => d.discountPercentage))}% off today
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(sortedDeals.reduce((acc, deal) => acc + deal.discountPercentage, 0) / sortedDeals.length)}%
                </div>
                <div className="text-xs text-gray-500">Avg. Discount</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="p-4">
        {sortedDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                      {deal.isPopular && (
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full mb-1 block">
                          🔥 Popular
                        </span>
                      )}
                      {deal.isLimitedTime && (
                        <span className="bg-red-200 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                          ⏰ Limited
                        </span>
                      )}
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
                          <MapPin size={14} />
                          <span>{deal.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14} />
                          <span>{deal.rating} ({deal.reviewCount})</span>
                        </div>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full">
                          {deal.cuisine}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <img 
                        src={deal.restaurantImage} 
                        alt={deal.restaurantName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>

                  {/* Time Slots */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Available Times</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {deal.timeSlots.slice(0, 2).map((slot) => (
                        <div key={slot.id} className={`p-2 rounded border text-center text-sm ${
                          slot.isAvailable 
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                        }`}>
                          <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                          <div className="text-xs">
                            {slot.isAvailable 
                              ? `${slot.remainingSeats} seats left`
                              : 'Fully booked'
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Book {deal.discountPercentage}% Off Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFiltersModal && (
        <OffPeakFiltersModal
          onClose={() => setShowFiltersModal(false)}
          onApplyFilters={applyFilters}
        />
      )}
    </div>
  );
};

export default OffPeakPage; 