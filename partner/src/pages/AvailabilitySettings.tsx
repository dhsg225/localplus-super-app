// [2024-12-19 10:33] - Availability settings page for managing restaurant hours and time slots
import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/components';
import { bookingService } from '../../../shared/services/bookingService';
import type { OperatingHours, TimeSlot, Restaurant, RestaurantSettings } from '../../shared/types';

const AvailabilitySettings: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await bookingService.getPartnerRestaurants();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0].id);
        } else {
          setError('No restaurants found for this partner account.');
        }
      } catch (err) {
        setError('Failed to load restaurants');
        console.error('Error loading restaurants:', err);
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!selectedRestaurant) return;

      setLoading(true);
      try {
        const [hoursData, slotsData, settingsData] = await Promise.all([
          bookingService.getOperatingHours(selectedRestaurant),
          bookingService.getTimeSlots(selectedRestaurant),
          bookingService.getRestaurantSettings(selectedRestaurant)
        ]);

        setOperatingHours(hoursData);
        setTimeSlots(slotsData);
        setSettings(settingsData);
      } catch (err) {
        setError('Failed to load restaurant data');
        console.error('Error loading restaurant data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantData();
  }, [selectedRestaurant]);

  const handleOperatingHoursChange = (dayOfWeek: number, field: string, value: string | boolean) => {
    setOperatingHours(prev => {
      const existing = prev.find(h => h.day_of_week === dayOfWeek);
      if (existing) {
        return prev.map(h => 
          h.day_of_week === dayOfWeek 
            ? { ...h, [field]: value }
            : h
        );
      } else {
        return [...prev, {
          id: `temp-${dayOfWeek}`,
          business_id: selectedRestaurant,
          day_of_week: dayOfWeek,
          is_open: field === 'is_open' ? value as boolean : true,
          open_time: field === 'open_time' ? value as string : '09:00',
          close_time: field === 'close_time' ? value as string : '22:00',
          created_at: new Date().toISOString()
        }];
      }
    });
  };

  const handleTimeSlotChange = (index: number, field: string, value: string | number | boolean) => {
    setTimeSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: `temp-${Date.now()}`,
      business_id: selectedRestaurant,
      slot_time: '12:00',
      capacity: 50,
      duration_minutes: 120,
      is_active: true,
      created_at: new Date().toISOString()
    };
    setTimeSlots(prev => [...prev, newSlot]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSettingsChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update operating hours
      const hoursToSave = operatingHours.map(({ id, business_id, created_at, ...rest }) => rest);
      await bookingService.updateOperatingHours(selectedRestaurant, hoursToSave);

      // Update time slots
      const slotsToSave = timeSlots.map(({ id, business_id, created_at, ...rest }) => rest);
      await bookingService.updateTimeSlots(selectedRestaurant, slotsToSave);

      // Update settings
      if (settings) {
        const { id, business_id, created_at, updated_at, ...settingsToSave } = settings;
        await bookingService.updateRestaurantSettings(selectedRestaurant, settingsToSave);
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const getOperatingHoursForDay = (dayOfWeek: number) => {
    return operatingHours.find(h => h.day_of_week === dayOfWeek) || {
      day_of_week: dayOfWeek,
      is_open: true,
      open_time: '09:00',
      close_time: '22:00'
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Settings</h1>
        <p className="text-gray-600">Manage your restaurant's operating hours and booking slots</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Restaurant Selection */}
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

      {/* General Settings */}
      {settings && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Party Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.max_party_size}
                  onChange={(e) => handleSettingsChange('max_party_size', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advance Booking Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.advance_booking_days}
                  onChange={(e) => handleSettingsChange('advance_booking_days', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Buffer (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={settings.booking_buffer_minutes}
                  onChange={(e) => handleSettingsChange('booking_buffer_minutes', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_confirm"
                  checked={settings.auto_confirm}
                  onChange={(e) => handleSettingsChange('auto_confirm', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auto_confirm" className="ml-2 block text-sm text-gray-900">
                  Auto-confirm bookings
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
          <div className="space-y-4">
            {daysOfWeek.map(day => {
              const hours = getOperatingHoursForDay(day.value);
              return (
                <div key={day.value} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="text-sm font-medium text-gray-700">
                      {day.label}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours.is_open}
                      onChange={(e) => handleOperatingHoursChange(day.value, 'is_open', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-900">Open</label>
                  </div>

                  {hours.is_open && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Open Time</label>
                        <input
                          type="time"
                          value={hours.open_time}
                          onChange={(e) => handleOperatingHoursChange(day.value, 'open_time', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Close Time</label>
                        <input
                          type="time"
                          value={hours.close_time}
                          onChange={(e) => handleOperatingHoursChange(day.value, 'close_time', e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Time Slots</h2>
            <Button onClick={addTimeSlot} theme="blue" size="sm">
              Add Time Slot
            </Button>
          </div>
          {/* Heading row for slot fields */}
          <div className="flex items-center gap-2 px-2 pb-1 text-xs text-gray-500 font-semibold">
            <span className="w-20">Time</span>
            <span className="w-16">Capacity</span>
            <span className="w-16">Duration</span>
            <span className="w-16">Active</span>
            <span className="flex-1" />
            <span className="w-16 text-right">Remove</span>
          </div>
          
          <div className="space-y-2">
            {timeSlots.map((slot, index) => (
              <div key={slot.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                <input
                  type="time"
                  value={slot.slot_time}
                  onChange={(e) => handleTimeSlotChange(index, 'slot_time', e.target.value)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Time"
                />
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={slot.capacity}
                  onChange={(e) => handleTimeSlotChange(index, 'capacity', parseInt(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Capacity"
                  placeholder="Cap."
                />
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="15"
                  value={slot.duration_minutes}
                  onChange={(e) => handleTimeSlotChange(index, 'duration_minutes', parseInt(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Duration"
                  placeholder="Min."
                />
                <label className="flex items-center text-xs gap-1">
                  <input
                    type="checkbox"
                    checked={slot.is_active}
                    onChange={(e) => handleTimeSlotChange(index, 'is_active', e.target.checked)}
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label="Active"
                  />
                  Active
                </label>
                <div className="flex-1" />
                <button
                  onClick={() => removeTimeSlot(index)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium ml-auto"
                  tabIndex={-1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={saving}
          disabled={saving}
          theme="blue"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings; 