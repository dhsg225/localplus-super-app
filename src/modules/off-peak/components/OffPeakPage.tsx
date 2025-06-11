import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, Users, Filter, Calendar } from 'lucide-react';
import { OffPeakDeal, OffPeakFilters } from '../types';
import OffPeakDealCard from './OffPeakDealCard';
import OffPeakFiltersModal from './OffPeakFiltersModal';
import { mockOffPeakDeals } from '../data/mockData';

const OffPeakPage: React.FC = () => {
  const [deals, setDeals] = useState<OffPeakDeal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<OffPeakDeal[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPax, setSelectedPax] = useState(2);
  const [activeTab, setActiveTab] = useState<'all' | 'early-bird' | 'afternoon' | 'late-night'>('all');

  useEffect(() => {
    // Load mock data
    setDeals(mockOffPeakDeals);
    setFilteredDeals(mockOffPeakDeals);
  }, []);

  useEffect(() => {
    // Filter deals based on active tab and other criteria
    let filtered = deals;

    if (activeTab !== 'all') {
      filtered = filtered.filter(deal => deal.dealType === activeTab);
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
  }, [deals, activeTab, selectedDate, selectedPax]);

  const getDealTypeLabel = (type: string) => {
    switch (type) {
      case 'early-bird': return 'Early Bird';
      case 'afternoon': return 'Afternoon';
      case 'late-night': return 'Late Night';
      default: return 'All Deals';
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
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Off Peak Dining</h1>
              <p className="text-gray-600 text-sm mt-1">Save up to 50% during off-peak hours</p>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {/* Date and Pax Selection */}
          <div className="flex space-x-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm font-medium flex-1 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="w-24">
              <label className="block text-xs text-gray-500 mb-1">Guests</label>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Users size={16} className="text-gray-500" />
                <select
                  value={selectedPax}
                  onChange={(e) => setSelectedPax(Number(e.target.value))}
                  className="bg-transparent text-sm font-medium outline-none w-full"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Deal Type Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'early-bird', 'afternoon', 'late-night'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  activeTab === type
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="text-center">
                  <div>{getDealTypeLabel(type)}</div>
                  {type !== 'all' && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {getDealTypeTime(type)}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-white border-b">
        <p className="text-sm text-gray-600">
          {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} available
          {activeTab !== 'all' && ` for ${getDealTypeLabel(activeTab).toLowerCase()}`}
        </p>
      </div>

      {/* Deals List */}
      <div className="px-4 py-4 space-y-4">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <OffPeakDealCard
              key={deal.id}
              deal={deal}
              selectedDate={selectedDate}
              selectedPax={selectedPax}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your date, number of guests, or filters to see more options.
            </p>
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <OffPeakFiltersModal
          onClose={() => setShowFilters(false)}
          onApplyFilters={(filters) => {
            // Apply filters logic here
            setShowFilters(false);
          }}
        />
      )}
    </div>
  );
};

export default OffPeakPage; 