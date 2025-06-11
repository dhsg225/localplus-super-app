import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Percent, Star, TrendingUp } from 'lucide-react';
import { mockOffPeakDeals } from '../../off-peak/data/mockData';

const TodaysDeals: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'next2h' | 'next6h' | 'today' | 'all'>('next2h');

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  // Helper function to check if deal is available in next X hours
  const isAvailableInNextHours = (dealType: string, hours: number) => {
    const dealTimeRanges = {
      'early-bird': { start: 11, end: 14 },
      'afternoon': { start: 14, end: 17 },
      'late-night': { start: 21, end: 24 }
    };

    const range = dealTimeRanges[dealType as keyof typeof dealTimeRanges];
    if (!range) return false;

    const currentDecimal = currentHour + currentMinutes / 60;
    const nextXHours = currentDecimal + hours;

    // Check if next X hours overlaps with deal time
    return (currentDecimal <= range.end && nextXHours >= range.start);
  };

  // Helper function to check if deal is available today
  const isAvailableToday = (dealType: string) => {
    const dealTimeRanges = {
      'early-bird': { start: 11, end: 14 },
      'afternoon': { start: 14, end: 17 },
      'late-night': { start: 21, end: 24 }
    };

    const range = dealTimeRanges[dealType as keyof typeof dealTimeRanges];
    if (!range) return false;

    const currentDecimal = currentHour + currentMinutes / 60;
    return currentDecimal <= range.end;
  };

  // Get time until deal starts/ends
  const getTimeStatus = (dealType: string) => {
    const dealTimeRanges = {
      'early-bird': { start: 11, end: 14, label: '11:00 - 14:00' },
      'afternoon': { start: 14, end: 17, label: '14:00 - 17:00' },
      'late-night': { start: 21, end: 24, label: '21:00 - 00:00' }
    };

    const range = dealTimeRanges[dealType as keyof typeof dealTimeRanges];
    if (!range) return { status: 'unknown', message: '', timeLabel: '' };

    const currentDecimal = currentHour + currentMinutes / 60;

    if (currentDecimal < range.start) {
      const hoursUntil = Math.ceil(range.start - currentDecimal);
      return {
        status: 'upcoming',
        message: `Starts in ${hoursUntil}h`,
        timeLabel: range.label
      };
    } else if (currentDecimal <= range.end) {
      const hoursLeft = Math.ceil(range.end - currentDecimal);
      return {
        status: 'active',
        message: `Ends in ${hoursLeft}h`,
        timeLabel: range.label
      };
    } else {
      return {
        status: 'ended',
        message: 'Ended today',
        timeLabel: range.label
      };
    }
  };

  // Filter and sort deals based on selected time slot
  const processedDeals = useMemo(() => {
    let filtered = mockOffPeakDeals;

    if (selectedTimeSlot === 'next2h') {
      filtered = mockOffPeakDeals.filter(deal => isAvailableInNextHours(deal.dealType, 2));
    } else if (selectedTimeSlot === 'next6h') {
      filtered = mockOffPeakDeals.filter(deal => isAvailableInNextHours(deal.dealType, 6));
    } else if (selectedTimeSlot === 'today') {
      filtered = mockOffPeakDeals.filter(deal => isAvailableToday(deal.dealType));
    }

    // Add time status to each deal
    const withTimeStatus = filtered.map(deal => ({
      ...deal,
      timeStatus: getTimeStatus(deal.dealType)
    }));

    // Sort by: 1) Active deals first, 2) Highest discount, 3) Upcoming deals
    return withTimeStatus.sort((a, b) => {
      // Prioritize active deals
      if (a.timeStatus.status === 'active' && b.timeStatus.status !== 'active') return -1;
      if (b.timeStatus.status === 'active' && a.timeStatus.status !== 'active') return 1;

      // Then by discount percentage (highest first)
      if (a.discountPercentage !== b.discountPercentage) {
        return b.discountPercentage - a.discountPercentage;
      }

      // Then by popularity
      if (a.isPopular && !b.isPopular) return -1;
      if (b.isPopular && !a.isPopular) return 1;

      return 0;
    });
  }, [selectedTimeSlot, currentHour, currentMinutes]);

  const handleDealClick = (deal: any) => {
    navigate(`/off-peak?restaurant=${encodeURIComponent(deal.restaurantName)}`);
  };

  const getStatusBadge = (timeStatus: any) => {
    switch (timeStatus.status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Live Now
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
            {timeStatus.message}
          </span>
        );
      case 'ended':
        return (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-full">
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/restaurants')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Today's Deals</h1>
              <p className="text-sm text-gray-600">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Time Slot Filters */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedTimeSlot('next2h')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedTimeSlot === 'next2h'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 Next 2 Hours
            </button>
            <button
              onClick={() => setSelectedTimeSlot('next6h')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedTimeSlot === 'next6h'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏰ Next 6 Hours
            </button>
            <button
              onClick={() => setSelectedTimeSlot('today')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedTimeSlot === 'today'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 All Day
            </button>
            <button
              onClick={() => setSelectedTimeSlot('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedTimeSlot === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌟 All Deals
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {processedDeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-600">
              {selectedTimeSlot === 'next2h' 
                ? 'No deals available in the next 2 hours. Try checking "Next 6 Hours" or "All Day" for more options.'
                : selectedTimeSlot === 'next6h'
                ? 'No deals available in the next 6 hours. Try checking "All Day" for more options.'
                : 'Check back later for new deals!'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Header */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {processedDeals.length} deals found
                  </h2>
                  <p className="text-sm text-gray-600">
                    Sorted by availability and discount percentage
                  </p>
                </div>
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>

            {/* Deals List */}
            <div className="space-y-3">
              {processedDeals.map((deal, index) => (
                <button
                  key={deal.id}
                  onClick={() => handleDealClick(deal)}
                  className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{deal.restaurantName}</h3>
                        {index < 3 && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full">
                            Top Deal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {deal.discountPercentage}%
                      </div>
                      <div className="text-xs text-gray-500">OFF</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{deal.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{deal.timeStatus.timeLabel}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={14} />
                        <span>{deal.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(deal.timeStatus)}
                      {deal.isPopular && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysDeals; 