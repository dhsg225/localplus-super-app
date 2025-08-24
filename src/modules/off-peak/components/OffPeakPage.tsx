import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, MapPin, Star, ArrowLeft, Filter } from 'lucide-react';
import { OffPeakDeal, OffPeakTimeSlot, OffPeakFilters } from '../types';
import OffPeakFiltersModal from './OffPeakFiltersModal';
import { mockOffPeakDeals } from '../data/mockData';
import { bookingService } from '../../../../shared/services/bookingService';
import { useAuth } from '../../auth/context/AuthContext';
import { CreateBookingData } from '../../../../shared/types';


interface BookingState {
  deal: OffPeakDeal;
  timeSlot: OffPeakTimeSlot;
}

const OffPeakPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'next2h' | 'next6h' | 'today' | 'all'>('all');
  const [filters, setFilters] = useState<OffPeakFilters>({
    cuisine: [],
    location: [],
    dealType: [],
    priceRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' },
    pax: 2
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [restaurantFilter, setRestaurantFilter] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  
  // Get current time in Thailand timezone (GMT+7)
  const currentTime = new Date();
  const thailandTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
  const currentHour = thailandTime.getHours();
  const currentMinutes = thailandTime.getMinutes();

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



  useEffect(() => {
    // Extract restaurant filter from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const restaurantParam = searchParams.get('restaurant');
    if (restaurantParam) {
      setRestaurantFilter(restaurantParam);
    }
  }, [location.search]);

  const applyFilters = (newFilters: OffPeakFilters) => {
    setFilters(newFilters);
    setShowFiltersModal(false);
  };

  const handleBookNow = (deal: OffPeakDeal, timeSlot: OffPeakTimeSlot) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingState({ deal, timeSlot });
  };

  const handleConfirmBooking = async () => {
    if (!bookingState || !user) return;

    setIsBooking(true);
    try {
      const { deal, timeSlot } = bookingState;
      const bookingData: CreateBookingData = {
        business_id: deal.restaurantId,
        customer_name: `${user.firstName} ${user.lastName}`,
        customer_email: user.email,
        customer_phone: user.phone || 'N/A',
        party_size: filters.pax,
        booking_date: new Date().toISOString().split('T')[0], // Assuming today's date
        booking_time: timeSlot.startTime,
        special_requests: `Off-peak deal: ${deal.discountPercentage}% off.`,
        status: 'confirmed'
      };

      await bookingService.createBooking(bookingData);
      
      // Reset state and show confirmation message
      setBookingState(null);
      alert('Booking confirmed!');

    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to book. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Filter deals based on time slot and other filters
  const filteredDeals = mockOffPeakDeals.filter(deal => {
    // Restaurant-specific filtering (when coming from restaurant page)
    if (restaurantFilter) {
      const restaurantMatch = deal.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase());
      if (!restaurantMatch) return false;
    }
    
    // Time-based filtering
    let timeMatch = true;
    if (selectedTimeSlot === 'next2h') {
      timeMatch = isAvailableInNextHours(deal.dealType, 2);
    } else if (selectedTimeSlot === 'next6h') {
      timeMatch = isAvailableInNextHours(deal.dealType, 6);
    } else if (selectedTimeSlot === 'today') {
      timeMatch = isAvailableToday(deal.dealType);
    }
    
    const cuisineMatch = filters.cuisine.length === 0 || filters.cuisine.includes(deal.cuisine);
    const locationMatch = filters.location.length === 0 || filters.location.includes(deal.location);
    const dealTypeMatch = filters.dealType.length === 0 || filters.dealType.includes(deal.dealType);
    
    // Filter by discount percentage instead of price
    const discountMatch = deal.discountPercentage >= filters.priceRange.min && 
                         deal.discountPercentage <= filters.priceRange.max;

    return timeMatch && cuisineMatch && locationMatch && dealTypeMatch && discountMatch;
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
                <p className="text-sm text-gray-600">
                  {restaurantFilter ? `Deals for ${restaurantFilter}` : 'Save up to 50% during off-peak hours'}
                </p>
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

        {/* Time Slot Filters */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-1 mb-4">
            <button
              onClick={() => setSelectedTimeSlot('next2h')}
              className={`px-2 py-2 rounded-full text-xs font-medium ${
                selectedTimeSlot === 'next2h'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 Next 2H
            </button>
            <button
              onClick={() => setSelectedTimeSlot('next6h')}
              className={`px-2 py-2 rounded-full text-xs font-medium ${
                selectedTimeSlot === 'next6h'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏰ Next 6H
            </button>
            <button
              onClick={() => setSelectedTimeSlot('today')}
              className={`px-2 py-2 rounded-full text-xs font-medium ${
                selectedTimeSlot === 'today'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 All Day
            </button>
            <button
              onClick={() => setSelectedTimeSlot('all')}
              className={`px-2 py-2 rounded-full text-xs font-medium ${
                selectedTimeSlot === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
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
                  Up to {sortedDeals.length > 0 ? Math.max(...sortedDeals.map(d => d.discountPercentage)) : 0}% off today
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {sortedDeals.length > 0 ? Math.round(sortedDeals.reduce((acc, deal) => acc + deal.discountPercentage, 0) / sortedDeals.length) : 0}%
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
        ) : restaurantFilter ? (
          /* Compact Grid View for Single Restaurant */
          <div className="grid grid-cols-1 gap-3">
            {sortedDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
                    {deal.isPopular && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                        🔥 Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {deal.timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => handleBookNow(deal, slot)}
                      className={`p-3 rounded-lg border text-center text-sm transition-colors ${
                        slot.isAvailable 
                          ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-medium">{slot.startTime}</div>
                      <div className="text-xs">
                        {slot.isAvailable 
                          ? `${slot.remainingSeats} left`
                          : 'Full'
                        }
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Book Button */}
                <button 
                  onClick={() => handleBookNow(deal, deal.timeSlots.find(ts => ts.isAvailable)!)}
                  disabled={!deal.timeSlots.some(ts => ts.isAvailable)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400">
                  Book {deal.discountPercentage}% Off
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Full Card View for All Restaurants */
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
                  <button 
                    onClick={() => handleBookNow(deal, deal.timeSlots.find(ts => ts.isAvailable)!)}
                    disabled={!deal.timeSlots.some(ts => ts.isAvailable)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400">
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

      {bookingState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Booking</h2>
            <p><strong>Restaurant:</strong> {bookingState.deal.restaurantName}</p>
            <p><strong>Deal:</strong> {bookingState.deal.discountPercentage}% off</p>
            <p><strong>Time:</strong> {bookingState.timeSlot.startTime}</p>
            <p><strong>Guests:</strong> {filters.pax}</p>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setBookingState(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancel</button>
              <button onClick={handleConfirmBooking} disabled={isBooking} className="px-4 py-2 rounded bg-red-600 text-white disabled:bg-gray-400">
                {isBooking ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffPeakPage; 