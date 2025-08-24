import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/components';
import { bookingService } from '../../../shared/services/bookingService';
import { restaurantService } from '../../shared/services/restaurantService';
import type { Booking, Restaurant } from '../../shared/types';

// Add prop for navigation
interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check if we're in development mode
        const devUser = localStorage.getItem('partner_dev_user');
        if (devUser) {
          setIsDevelopmentMode(true);
          console.log('🔧 Development mode active');
        }

        // Try to get partner restaurants
        let restaurantData: Restaurant[] = [];
        
        try {
          restaurantData = await bookingService.getPartnerRestaurants();
          console.log('✅ Partner restaurants loaded:', restaurantData.length);
        } catch (err) {
          console.warn('⚠️ Partner authentication failed, falling back to development mode');
          
          // Development fallback: get Shannon's Restaurant
          try {
            const allRestaurants = await restaurantService.getRestaurants();
            restaurantData = allRestaurants.filter(r => 
              r.name.toLowerCase().includes('shannon')
            );
            
            if (restaurantData.length === 0) {
              // If no Shannon's restaurant found, just show first restaurant for demo
              restaurantData = allRestaurants.slice(0, 1);
            }
            
            console.log('🔧 Development fallback restaurants:', restaurantData.length);
            setIsDevelopmentMode(true);
          } catch (fallbackErr) {
            console.error('❌ Development fallback also failed:', fallbackErr);
            throw new Error('Failed to load restaurant data. Please check your setup.');
          }
        }
        
        setRestaurants(restaurantData);

        // Load bookings for restaurants
        if (restaurantData.length > 0) {
          try {
            const allBookings = await Promise.all(
              restaurantData.map(restaurant => 
                bookingService.getUpcomingBookings(restaurant.id, 7)
              )
            );
            setBookings(allBookings.flat());
          } catch (bookingErr) {
            console.warn('⚠️ Failed to load bookings:', bookingErr);
            // Don't throw error, just show empty bookings
            setBookings([]);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const todayBookings = bookings.filter(booking => 
    booking.booking_date === new Date().toISOString().split('T')[0]
  );

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'seated': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Dashboard</h1>
        <p className="text-gray-600">Manage your restaurant bookings and settings</p>
        {isDevelopmentMode && (
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            🔧 Development Mode
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          {isDevelopmentMode && (
            <p className="text-sm text-gray-600 mt-2">
              Running in development mode. Some features may be limited.
            </p>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">🏪</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
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
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      {restaurants.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Restaurants</h2>
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                    <p className="text-sm text-gray-500">ID: {restaurant.id.slice(0, 8)}...</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      restaurant.partnership_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {restaurant.partnership_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button theme="blue" className="w-full" onClick={() => onNavigate && onNavigate('bookings')}>
              📋 Manage Bookings
            </Button>
            <Button theme="gray" className="w-full" onClick={() => onNavigate && onNavigate('availability')}>
              🕐 Availability Settings
            </Button>
            <Button theme="gray" className="w-full" onClick={() => onNavigate && onNavigate('analytics')}>
              📊 View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Today's Bookings */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Today's Bookings</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => onNavigate && onNavigate('bookings')}>
              View All
            </button>
          </div>
        </div>

        {todayBookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No bookings for today</p>
            {isDevelopmentMode && (
              <p className="text-sm text-gray-400 mt-2">
                In development mode, booking data may be limited
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {todayBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'} at {formatTime(booking.booking_time)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customer_phone && `📞 ${booking.customer_phone}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    {booking.special_requests && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: {booking.special_requests}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 