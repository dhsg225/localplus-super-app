/// <reference types="vite/client" />
// [2025-01-07 12:00] - Migrated to shared Supabase client
export { 
  supabase, 
  businessAPI, 
  calculateDistance,
  type Business,
  type DiscountOffer,
  type UserRedemption
} from '../../shared/services/supabase'; 