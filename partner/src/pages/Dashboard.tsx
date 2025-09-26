import React, { useState, useEffect } from 'react';
import { Button } from '@shared/components';
import { bookingService } from '@shared/services/bookingService';

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // This will be implemented when we have the booking service
      console.log('Loading bookings...');
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={loadBookings} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Today's Bookings
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">No bookings yet</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            This Week
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500">Total bookings</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Revenue
          </h3>
          <p className="text-3xl font-bold text-purple-600">$0</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">
            Bookings and updates will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
