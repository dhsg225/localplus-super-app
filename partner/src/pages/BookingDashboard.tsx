// [2024-12-19 10:32] - Partner booking dashboard for managing restaurant bookings
import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/components';
import { ToastProvider, useToast } from '../../shared/components/Toast';
import { bookingService } from '../../../shared/services/bookingService';
import type { Booking, Restaurant, BookingStatus } from '../../shared/types';

const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { showToast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null); // bookingId of action in progress

  // Load partner's restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        // Get only restaurants this partner has access to
        const data = await bookingService.getPartnerRestaurants();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0].id);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load restaurants';
        setError(errorMessage);
        console.error('Error loading restaurants:', err);
      }
    };

    loadRestaurants();
  }, []);

  // Load bookings when restaurant selection changes
  useEffect(() => {
    const loadBookings = async () => {
      if (!selectedRestaurant) return;
      
      try {
        setLoading(true);
        const status = selectedStatus === 'all' ? undefined : selectedStatus;
        const data = await bookingService.getBookings(selectedRestaurant, status);
        console.log('[DEBUG] Raw bookings fetched:', data);
        
        // Fix: Normalize selectedDate to YYYY-MM-DD for comparison, with debug logging
        let filteredData = data;
        if (selectedDate) {
          let normalizedDate = selectedDate;
          // If selectedDate is in DD/MM/YYYY format, convert to YYYY-MM-DD
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(selectedDate)) {
            const [dd, mm, yyyy] = selectedDate.split('/');
            normalizedDate = `${yyyy}-${mm}-${dd}`;
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
            normalizedDate = selectedDate;
          } else {
            // Try to parse with Date object as fallback
            const dateObj = new Date(selectedDate);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            normalizedDate = `${yyyy}-${mm}-${dd}`;
          }
          console.log('Selected date:', selectedDate, 'Normalized:', normalizedDate);
          filteredData = data.filter(booking => {
            console.log('Compare booking.booking_date:', booking.booking_date, 'to', normalizedDate);
            return booking.booking_date === normalizedDate;
          });
        }

        setBookings(filteredData);
      } catch (err) {
        console.error('Error loading bookings:', err);
        // Don't show error for RLS issues in development
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('RLS') || errorMessage.includes('policy')) {
          setError('Authentication required: Please run the database setup scripts first (booking-system-schema.sql and shannon-restaurant-setup.sql)');
        } else {
          setError('Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [selectedRestaurant, selectedStatus, selectedDate]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    setActionLoading(bookingId);
    setError('');
    try {
      let updatedBooking;
      let actionMsg = '';
      switch (newStatus) {
        case 'confirmed':
          updatedBooking = await bookingService.confirmBooking(bookingId);
          actionMsg = 'Booking confirmed!';
          break;
        case 'seated':
          updatedBooking = await bookingService.seatBooking(bookingId);
          actionMsg = 'Booking marked as seated.';
          break;
        case 'completed':
          updatedBooking = await bookingService.completeBooking(bookingId);
          actionMsg = 'Booking completed.';
          break;
        case 'no_show':
          updatedBooking = await bookingService.markNoShow(bookingId);
          actionMsg = 'Marked as no-show.';
          break;
        case 'cancelled':
          updatedBooking = await bookingService.cancelBooking(bookingId, 'Cancelled by restaurant', 'restaurant');
          actionMsg = 'Booking cancelled.';
          break;
        default:
          updatedBooking = await bookingService.updateBooking(bookingId, { status: newStatus });
          actionMsg = 'Booking updated.';
      }
      setBookings(prev => prev.map(booking => booking.id === bookingId ? updatedBooking : booking));
      showToast(actionMsg, 'success');
    } catch (err: any) {
      let msg = 'Failed to update booking status';
      if (err?.message?.includes('already confirmed')) msg = 'Booking is already confirmed.';
      else if (err?.message?.includes('RLS')) msg = 'Permission denied. Please check your database policies.';
      else if (err?.message) msg = err.message;
      setError(msg);
      showToast(msg, 'error');
      console.error('Error updating booking:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'seated': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const todayBookings = bookings.filter(booking => 
    booking.booking_date === new Date().toISOString().split('T')[0]
  );

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    return bookingDate > today;
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant bookings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant
                </label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | 'all')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedDate('');
                  }}
                  theme="gray"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({bookings.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confirmation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer_email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.booking_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.confirmation_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              theme="blue"
                              size="sm"
                              isLoading={actionLoading === booking.id}
                              disabled={actionLoading === booking.id}
                            >
                              Confirm
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              theme="red"
                              size="sm"
                              isLoading={actionLoading === booking.id}
                              disabled={actionLoading === booking.id}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(booking.id, 'seated')}
                              theme="blue"
                              size="sm"
                              isLoading={actionLoading === booking.id}
                              disabled={actionLoading === booking.id}
                            >
                              Seat
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(booking.id, 'no_show')}
                              theme="red"
                              size="sm"
                              isLoading={actionLoading === booking.id}
                              disabled={actionLoading === booking.id}
                            >
                              No Show
                            </Button>
                          </>
                        )}
                        {booking.status === 'seated' && (
                          <Button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            theme="blue"
                            size="sm"
                            isLoading={actionLoading === booking.id}
                            disabled={actionLoading === booking.id}
                          >
                            Complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
};

export default BookingDashboard; 