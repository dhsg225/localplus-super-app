// [2024-12-19 23:00] - Enhanced admin authentication with better error handling
import { createClient } from '@supabase/supabase-js'

// Use shared Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create admin-specific supabase client
export const adminSupabase = createClient(supabaseUrl, supabaseAnonKey)

// Re-export shared services for backward compatibility
export { 
  supabase, 
  businessAPI, 
  calculateDistance,
  type Business,
  type DiscountOffer,
  type UserRedemption
} from '@shared/services/supabase';

// Enhanced admin authentication functions
export const adminAuth = {
  async signUp(email: string, password: string, firstName: string = '', lastName: string = '') {
    try {
      console.log('🔐 Attempting admin signup for:', email)
      
      const { data, error } = await adminSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            firstName,
            lastName
          }
        }
      })

      if (error) {
        console.error('❌ Admin signup error:', error)
        throw error
      }

      console.log('✅ Admin signup successful:', data)
      return data
    } catch (error) {
      console.error('❌ Admin signup failed:', error)
      throw error
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Attempting admin signin for:', email)
      
      const { data, error } = await adminSupabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Admin signin error:', error)
        throw error
      }

      console.log('✅ Admin signin successful:', data)
      return data
    } catch (error) {
      console.error('❌ Admin signin failed:', error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await adminSupabase.auth.getUser()
      
      if (error) {
        console.error('❌ Get current user error:', error)
        throw error
      }

      return user
    } catch (error) {
      console.error('❌ Get current user failed:', error)
      throw error
    }
  },

  async signOut() {
    try {
      const { error } = await adminSupabase.auth.signOut()
      
      if (error) {
        console.error('❌ Admin signout error:', error)
        throw error
      }

      console.log('✅ Admin signout successful')
    } catch (error) {
      console.error('❌ Admin signout failed:', error)
      throw error
    }
  },

  async checkAdminRole(userId: string) {
    try {
      const { data, error } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Check admin role error:', error)
        throw error
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('❌ Check admin role failed:', error)
      return false;
    }
  }
}

// Listen for auth state changes
adminSupabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Admin auth state changed:', event, session?.user?.email)
}) 