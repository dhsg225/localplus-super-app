import { supabase } from './supabase'

export interface Booking {
  id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';
  confirmation_code?: string;
  cancellation_reason?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  async getBookings(businessId: string, status?: Booking['status']): Promise<Booking[]> {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('booking_date', { ascending: false }).order('booking_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async confirmBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return booking;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  async seatBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: 'seated', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return booking;
    } catch (error) {
      console.error('Error seating booking:', error);
      throw error;
    }
  },

  async completeBooking(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return booking;
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId: string, businessId: string, reason: string = 'Customer requested'): Promise<Booking> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancellation_reason: reason, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return booking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  async markNoShow(bookingId: string, businessId: string): Promise<Booking> {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: 'no-show', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;
      return booking;
    } catch (error) {
      console.error('Error marking no-show:', error);
      throw error;
    }
  },

  async getPartnerRestaurants(): Promise<any[]> {
    try {
      // Mock partner restaurants
      console.log('[MOCK] Fetching partner restaurants');
      return [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Shannon\'s Coastal Kitchen' }];
    } catch (error) {
      console.error('Error fetching partner restaurants:', error);
      throw error;
    }
  }
}
