// [2024-12-19 10:29] - Shared booking form component
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { bookingService } from '@shared/services/bookingService';
import type { CreateBookingData, TimeSlot, RestaurantSettings } from '../types';

interface BookingFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: (booking: any) => void;
  onError?: (error: string) => void;
  theme?: 'blue' | 'red' | 'gray';
  className?: string;
}

interface AvailabilityState {
  available: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  businessId,
  businessName,
  onSuccess,
  onError,
  theme = 'blue',
  className = ''
}) => {
  const [formData, setFormData] = useState<CreateBookingData>({
    business_id: businessId,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    party_size: 2,
    booking_date: '',
    booking_time: '',
    special_requests: ''
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load restaurant settings and time slots
  useEffect(() => {
    const loadRestaurantData = async () => {
      try {
        const [settingsData, slotsData] = await Promise.all([
          bookingService.getRestaurantSettings(businessId),
          bookingService.getTimeSlots(businessId)
        ]);
        
        setSettings(settingsData);
        setTimeSlots(slotsData);
      } catch (error) {
        console.error('Error loading restaurant data:', error);
      }
    };

    loadRestaurantData();
  }, [businessId]);

  // Check availability when date/time/party size changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.booking_date && formData.booking_time && formData.party_size) {
        try {
          const isAvailable = await bookingService.checkAvailability(
            businessId,
            formData.booking_date,
            formData.booking_time,
            formData.party_size
          );
          setAvailability({ available: isAvailable });
        } catch (error) {
          console.error('Error checking availability:', error);
        }
      }
    };

    checkAvailability();
  }, [businessId, formData.booking_date, formData.booking_time, formData.party_size]);

  const handleInputChange = (field: keyof CreateBookingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    }

    if (!formData.booking_date) {
      newErrors.booking_date = 'Booking date is required';
    } else {
      const bookingDate = new Date(formData.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        newErrors.booking_date = 'Cannot book for past dates';
      }
    }

    if (!formData.booking_time) {
      newErrors.booking_time = 'Booking time is required';
    }

    if (formData.party_size < 1) {
      newErrors.party_size = 'Party size must be at least 1';
    } else if (settings?.max_party_size && formData.party_size > settings.max_party_size) {
      newErrors.party_size = `Maximum party size is ${settings.max_party_size}`;
    }

    if (availability && !availability.available) {
      newErrors.booking_time = 'Selected time slot is not available';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const booking = await bookingService.createBooking(formData);
      onSuccess?.(booking);
      
      // Reset form
      setFormData({
        business_id: businessId,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        party_size: 2,
        booking_date: '',
        booking_time: '',
        special_requests: ''
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate date options (next 30 days)
  const dateOptions = [];
  const today = new Date();
  for (let i = 0; i < (settings?.advance_booking_days || 30); i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dateOptions.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });
  }

  // Generate time slot options
  const timeOptions = timeSlots.map((slot: TimeSlot) => ({
    value: slot.slot_time,
    label: new Date(`2000-01-01T${slot.slot_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }));

  // Generate party size options
  const partySizeOptions = [];
  const maxSize = settings?.max_party_size || 12;
  for (let i = 1; i <= maxSize; i++) {
    partySizeOptions.push({
      value: i.toString(),
      label: i === 1 ? '1 person' : `${i} people`
    });
  }

  return (
    <div className={`booking-form ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book a Table at {businessName}
        </h2>
        {settings?.special_instructions && (
          <p className="text-gray-600 text-sm">
            {settings.special_instructions}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            type="text"
            value={formData.customer_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customer_name', e.target.value)}
            error={errors.customer_name}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            value={formData.customer_email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customer_email', e.target.value)}
            error={errors.customer_email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.customer_phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customer_phone', e.target.value)}
            error={errors.customer_phone}
            required
          />

          <FormSelect
            label="Party Size"
            value={formData.party_size.toString()}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('party_size', parseInt(e.target.value))}
            options={partySizeOptions}
            error={errors.party_size}
            required
          />

          <FormSelect
            label="Date"
            value={formData.booking_date}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('booking_date', e.target.value)}
            options={dateOptions}
            error={errors.booking_date}
            required
          />
        </div>

        <FormSelect
          label="Time"
          value={formData.booking_time}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('booking_time', e.target.value)}
          options={timeOptions}
          error={errors.booking_time}
          required
        />

        {availability && !availability.available && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              The selected time slot is not available. Please choose a different time.
            </p>
          </div>
        )}

        <FormInput
          label="Special Requests (Optional)"
          type="textarea"
          value={formData.special_requests || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('special_requests', e.target.value)}
          placeholder="Any dietary restrictions, seating preferences, or special occasions..."
        />

        {settings?.cancellation_policy && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-600 text-sm">
              <strong>Cancellation Policy:</strong> {settings.cancellation_policy}
            </p>
          </div>
        )}

        <Button
          type="submit"
          theme={theme}
          isLoading={loading}
          disabled={loading || (availability && !availability.available)}
          className="w-full"
        >
          {loading ? 'Creating Booking...' : 'Book Table'}
        </Button>
      </form>
    </div>
  );
}; 