import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../shared/services/bookingService';
import type { Restaurant } from '../../shared/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DEMO_REVENUE_PER_BOOKING = 20; // USD per completed booking (for demo)

const Analytics: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [bookingsOverTime, setBookingsOverTime] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [revenueOverTime, setRevenueOverTime] = useState<any[]>([]);
  const [revenueChartLoading, setRevenueChartLoading] = useState(false);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await bookingService.getPartnerRestaurants();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0].id);
        }
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Error loading restaurants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedRestaurant) return;
      setStatsLoading(true);
      try {
        // Default: last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
        const data = await bookingService.getBookingStats(selectedRestaurant, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
        setStats(data);
      } catch (err) {
        setError('Failed to load analytics stats');
        setStats(null);
        console.error('Error loading analytics stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [selectedRestaurant]);

  useEffect(() => {
    const fetchBookingsOverTime = async () => {
      if (!selectedRestaurant) return;
      setChartLoading(true);
      try {
        // Default: last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
        // Fetch all bookings in range
        const bookings = await bookingService.getBookings(selectedRestaurant);
        // Build daily counts
        const days: string[] = [];
        for (let i = 0; i < 30; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          days.push(d.toISOString().split('T')[0]);
        }
        const counts = days.map(date => ({
          date,
          count: bookings.filter(b => b.booking_date === date).length
        }));
        setBookingsOverTime(counts);
      } catch (err) {
        setBookingsOverTime([]);
        console.error('Error loading bookings over time:', err);
      } finally {
        setChartLoading(false);
      }
    };
    fetchBookingsOverTime();
  }, [selectedRestaurant]);

  useEffect(() => {
    const fetchRevenueOverTime = async () => {
      if (!selectedRestaurant) return;
      setRevenueChartLoading(true);
      try {
        // Default: last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);
        // Fetch all bookings in range
        const bookings = await bookingService.getBookings(selectedRestaurant);
        // Build daily revenue (only completed bookings)
        const days: string[] = [];
        for (let i = 0; i < 30; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          days.push(d.toISOString().split('T')[0]);
        }
        const revenue = days.map(date => {
          const completed = bookings.filter(b => b.booking_date === date && b.status === 'completed').length;
          return {
            date,
            revenue: completed * DEMO_REVENUE_PER_BOOKING
          };
        });
        setRevenueOverTime(revenue);
      } catch (err) {
        setRevenueOverTime([]);
        console.error('Error loading revenue over time:', err);
      } finally {
        setRevenueChartLoading(false);
      }
    };
    fetchRevenueOverTime();
  }, [selectedRestaurant]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading analytics...</p>
      </div>
    );
  }

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">View your restaurant's booking and revenue trends</p>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Restaurant</h2>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">{statsLoading ? '...' : stats?.totalBookings ?? '-'}</span>
          <span className="text-gray-600 mt-2">Total Bookings (30d)</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">{statsLoading ? '...' : stats?.confirmedBookings ?? '-'}</span>
          <span className="text-gray-600 mt-2">Confirmed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-red-600">{statsLoading ? '...' : stats?.cancelledBookings ?? '-'}</span>
          <span className="text-gray-600 mt-2">Cancelled</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-800">{statsLoading ? '...' : stats?.completedBookings ?? '-'}</span>
          <span className="text-gray-600 mt-2">Completed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-yellow-600">{statsLoading ? '...' : stats?.noShowBookings ?? '-'}</span>
          <span className="text-gray-600 mt-2">No Shows</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">{statsLoading ? '...' : stats?.totalGuests ?? '-'}</span>
          <span className="text-gray-600 mt-2">Total Guests</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-800">{statsLoading ? '...' : stats?.averagePartySize?.toFixed(2) ?? '-'}</span>
          <span className="text-gray-600 mt-2">Avg. Party Size</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Bookings Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            {chartLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span>Loading chart...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d: any) => d.slice(5)} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip formatter={(value: any) => [value, 'Bookings']} labelFormatter={(d: any) => `Date: ${d}`} />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            {revenueChartLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <span>Loading chart...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d: any) => d.slice(5)} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} tickFormatter={(v: any) => `$${v}`} />
                  <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} labelFormatter={(d: any) => `Date: ${d}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* More analytics sections can be added here */}
    </div>
  );
};

export default Analytics; 