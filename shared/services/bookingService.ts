import { supabase } from './supabase'
import { notificationService } from './notificationService'
import type { 
  Booking, 
  BookingStatus, 
  CreateBookingData, 
  UpdateBookingData,
  RestaurantSettings,
  OperatingHours,
  TimeSlot,
  BlockedDate,
  MenuCategory,
  MenuItem,
  Partner,
  BookingNotification,
  Restaurant
} from '../types'
import { v4 as uuidv4 } from 'uuid';

// Booking Management
export const bookingService = {
  // Core booking operations
  async createBooking(data: CreateBookingData): Promise<Booking> {
    // Generate confirmation code
    const { data: confirmationResult } = await supabase
      .rpc('generate_booking_confirmation_code')
    
    const bookingData = {
      ...data,
      confirmation_code: confirmationResult,
      status: 'pending' as BookingStatus
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()

    if (error) throw error
    return booking
  },

  async getBookings(businessId?: string, status?: BookingStatus): Promise<Booking[]> {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true })

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    console.log('[DEBUG] getBookings businessId:', businessId, 'status:', status, 'data:', data, 'error:', error);
    if (error) throw error
    return data || []
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getBookingByConfirmationCode(code: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('confirmation_code', code)
      .single()

    if (error) throw error
    return data
  },

  async updateBooking(id: string, data: UpdateBookingData): Promise<Booking> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return booking
  },

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.updateBooking(id, { status: 'confirmed' as BookingStatus })
    
    // Send confirmation notification
    try {
      const preferences = await notificationService.getPreferences(booking.business_id)
      if (preferences?.auto_send_confirmations) {
        await notificationService.sendBookingNotification(booking, 'confirmation', preferences)
      }
    } catch (error) {
      console.error('Failed to send confirmation notification:', error)
    }
    
    return booking
  },

  async seatBooking(id: string): Promise<Booking> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'seated' as BookingStatus,
        seated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return booking
  },

  async completeBooking(id: string): Promise<Booking> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'completed' as BookingStatus,
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return booking
  },

  async markNoShow(id: string): Promise<Booking> {
    const booking = await this.updateBooking(id, { status: 'no_show' as BookingStatus })
    
    // Send no-show notification
    try {
      const preferences = await notificationService.getPreferences(booking.business_id)
      if (preferences) {
        await notificationService.sendBookingNotification(booking, 'no_show', preferences)
      }
    } catch (error) {
      console.error('Failed to send no-show notification:', error)
    }
    
    return booking
  },

  async cancelBooking(id: string, reason: string, cancelledBy: 'customer' | 'restaurant' | 'system'): Promise<Booking> {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled' as BookingStatus,
        cancellation_reason: reason,
        cancelled_by: cancelledBy,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    // Send cancellation notification
    try {
      const preferences = await notificationService.getPreferences(booking.business_id)
      if (preferences) {
        await notificationService.sendBookingNotification(booking, 'cancellation', preferences)
      }
    } catch (error) {
      console.error('Failed to send cancellation notification:', error)
    }
    
    return booking
  },

  // Availability checking
  async checkAvailability(businessId: string, date: string, time: string, partySize: number): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_booking_availability', {
        p_business_id: businessId,
        p_booking_date: date,
        p_booking_time: time,
        p_party_size: partySize
      })

    if (error) throw error
    return data
  },

  async getAvailableTimeSlots(businessId: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('business_id', businessId)
      .order('slot_time')

    if (error) throw error
    return data || []
  },

  // Restaurant settings
  async getRestaurantSettings(businessId: string): Promise<RestaurantSettings | null> {
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('business_id', businessId)
      .single()

    if (error) throw error
    return data
  },

  async updateRestaurantSettings(businessId: string, settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    // Fetch existing row to get id
    const { data: existing } = await supabase
      .from('restaurant_settings')
      .select('id')
      .eq('business_id', businessId)
      .single();

    let id = existing?.id;
    if (!id) {
      id = uuidv4();
    }

    const { data, error } = await supabase
      .from('restaurant_settings')
      .upsert([{ id, business_id: businessId, ...settings }], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Operating hours
  async getOperatingHours(businessId: string): Promise<OperatingHours[]> {
    const { data, error } = await supabase
      .from('operating_hours')
      .select('*')
      .eq('business_id', businessId)
      .order('day_of_week')

    if (error) throw error
    return data || []
  },

  async updateOperatingHours(businessId: string, hours: Omit<OperatingHours, 'id' | 'business_id' | 'created_at'>[]): Promise<OperatingHours[]> {
    // Upsert operating hours for idempotent save
    const hoursWithBusinessId = hours.map(hour => ({
      ...hour,
      business_id: businessId
    }));

    const { data, error } = await supabase
      .from('operating_hours')
      .upsert(hoursWithBusinessId, { onConflict: 'business_id,day_of_week' })
      .select();

    if (error) throw error;
    return data || [];
  },

  // Time slots
  async getTimeSlots(businessId: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('business_id', businessId)
      .order('slot_time')

    if (error) throw error
    return data || []
  },

  async updateTimeSlots(businessId: string, slots: Omit<TimeSlot, 'id' | 'business_id' | 'created_at'>[]): Promise<TimeSlot[]> {
    // Upsert time slots for idempotent save
    const slotsWithBusinessId = slots.map(slot => ({
      ...slot,
      business_id: businessId
    }));

    const { data, error } = await supabase
      .from('time_slots')
      .upsert(slotsWithBusinessId, { onConflict: 'business_id,slot_time' })
      .select();

    if (error) throw error;
    return data || [];
  },

  // Blocked dates
  async getBlockedDates(businessId: string): Promise<BlockedDate[]> {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('business_id', businessId)
      .order('blocked_date')

    if (error) throw error
    return data || []
  },

  async addBlockedDate(businessId: string, date: string, reason: string, isRecurring = false, recurringType?: 'weekly' | 'monthly' | 'yearly'): Promise<BlockedDate> {
    const { data, error } = await supabase
      .from('blocked_dates')
      .insert([{
        business_id: businessId,
        blocked_date: date,
        reason,
        is_recurring: isRecurring,
        recurring_type: recurringType
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeBlockedDate(id: string): Promise<void> {
    const { error } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Menu management
  async getMenuCategories(businessId: string): Promise<MenuCategory[]> {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('sort_order')

    if (error) throw error
    return data || []
  },

  async createMenuCategory(businessId: string, category: Omit<MenuCategory, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert([{ ...category, business_id: businessId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMenuCategory(id: string, category: Partial<MenuCategory>): Promise<MenuCategory> {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteMenuCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_categories')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
  },

  async getMenuItems(businessId: string, categoryId?: string): Promise<MenuItem[]> {
    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_available', true)
      .order('sort_order')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async createMenuItem(businessId: string, item: Omit<MenuItem, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ ...item, business_id: businessId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(item)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: false })
      .eq('id', id)

    if (error) throw error
  },

  // Partner management
  async getPartners(businessId: string): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)

    if (error) throw error
    return data || []
  },

  async addPartner(businessId: string, userId: string, role: 'owner' | 'manager' | 'staff', permissions: string[]): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert([{
        business_id: businessId,
        user_id: userId,
        role,
        permissions
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePartner(id: string, updates: Partial<Partner>): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removePartner(id: string): Promise<void> {
    const { error } = await supabase
      .from('partners')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
  },

  // Notifications
  async getBookingNotifications(bookingId: string): Promise<BookingNotification[]> {
    const { data, error } = await supabase
      .from('booking_notifications')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createNotification(notification: Omit<BookingNotification, 'id' | 'created_at'>): Promise<BookingNotification> {
    const { data, error } = await supabase
      .from('booking_notifications')
      .insert([notification])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics and reporting
  async getBookingStats(businessId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('status, party_size, created_at')
      .eq('business_id', businessId)
      .gte('booking_date', startDate)
      .lte('booking_date', endDate)

    if (error) throw error

    const stats = {
      totalBookings: data?.length || 0,
      confirmedBookings: data?.filter(b => b.status === 'confirmed').length || 0,
      cancelledBookings: data?.filter(b => b.status === 'cancelled').length || 0,
      completedBookings: data?.filter(b => b.status === 'completed').length || 0,
      noShowBookings: data?.filter(b => b.status === 'no_show').length || 0,
      totalGuests: data?.reduce((sum, b) => sum + (b.party_size || 0), 0) || 0,
      averagePartySize: data?.length ? (data.reduce((sum, b) => sum + (b.party_size || 0), 0) / data.length) : 0
    }

    return stats
  },

  async getUpcomingBookings(businessId: string, days = 7): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0]
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const endDate = futureDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .gte('booking_date', today)
      .lte('booking_date', endDate)
      .in('status', ['pending', 'confirmed'])
      .order('booking_date')
      .order('booking_time')

    if (error) throw error
    return data || []
  },

  async getTodaysBookings(businessId: string): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .eq('booking_date', today)
      .order('booking_time')

    if (error) throw error
    return data || []
  },

  // Partner Restaurant Access
  async getPartnerRestaurants(): Promise<Restaurant[]> {
    // [DEV BYPASS] If dev user is present, return fallback restaurant(s)
    const devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
    if (devUserRaw) {
      // Try to get Shannon's restaurant or fallback
      const { data: allRestaurants, error } = await supabase
        .from('businesses')
        .select('*');
      if (error) throw error;
      let devRestaurants = allRestaurants.filter((r: any) =>
        r.name && r.name.toLowerCase().includes('shannon')
      );
      if (devRestaurants.length === 0) {
        devRestaurants = allRestaurants.slice(0, 1); // fallback to first
      }
      return devRestaurants;
    }
    // Normal Supabase user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required. Please log in to access partner restaurants.');
    }
    // Get restaurants this user has partner access to
    const { data, error } = await supabase
      .from('businesses')
      .select(`*, partners!inner(id, role, permissions, is_active)`)
      .eq('partners.user_id', user.id)
      .eq('partners.is_active', true);
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No restaurants found for this partner account. Please contact support.');
    }
    return data;
  }
} 