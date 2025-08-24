// Curation API for Admin Dashboard
import { supabase } from '../lib/supabase';

export interface SuggestedBusiness {
  id: string;
  google_place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website_url?: string;
  google_rating?: number;
  google_review_count?: number;
  google_price_level?: number;
  google_types?: string[];
  primary_category: string;
  quality_score: number;
  curation_status: 'pending' | 'approved' | 'rejected' | 'flagged_for_sales';
  discovery_source: string;
  discovery_criteria?: any;
  created_at: string;
  updated_at: string;
}

export interface DiscoveryCampaign {
  id: string;
  name: string;
  description?: string;
  target_location: string;
  center_latitude: number;
  center_longitude: number;
  search_radius: number;
  target_categories: string[];
  quality_filters: any;
  campaign_status: 'active' | 'paused' | 'completed';
  businesses_discovered?: number;
  businesses_approved?: number;
  businesses_flagged_for_sales?: number;
  last_run_at?: string;
  next_run_at?: string;
  run_frequency: string;
  created_at: string;
  updated_at: string;
}

export interface CurationStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  salesLeadsCount: number;
  averageQualityScore: number;
}

export const curationAPI = {
  // Get all suggested businesses
  async getSuggestedBusinesses(status?: string): Promise<SuggestedBusiness[]> {
    try {
      console.log('🔍 Fetching suggested businesses from database...');
      
      let query = supabase
        .from('suggested_businesses')
        .select('*')
        .order('created_at', { ascending: false });

      // [2024-12-19 18:00 UTC] - Default to pending only for cleaner pipeline
      const filterStatus = status || 'pending';
      if (filterStatus !== 'all') {
        query = query.eq('curation_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Database error fetching suggested businesses:', error);
        // [2024-12-19 16:30 UTC] - Return empty array instead of demo data for production
        return [];
      }

      console.log(`📊 Database returned ${data?.length || 0} ${filterStatus} businesses`);
      console.log('🏢 Businesses:', data);
      
      return data?.map(business => ({
        id: business.id,
        google_place_id: business.google_place_id,
        name: business.name,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
        phone: business.phone,
        website_url: business.website_url,
        google_rating: business.google_rating,
        google_review_count: business.google_review_count,
        google_price_level: business.google_price_level,
        google_types: business.google_types,
        primary_category: business.primary_category,
        quality_score: business.quality_score,
        curation_status: business.curation_status,
        discovery_source: business.discovery_source,
        discovery_criteria: business.discovery_criteria,
        created_at: business.created_at,
        updated_at: business.updated_at
      })) || [];
    } catch (error) {
      console.error('💥 Error fetching suggested businesses:', error);
      // [2024-12-19 16:30 UTC] - Return empty array instead of demo data for production
      return [];
    }
  },

  // Get discovery campaigns
  async getDiscoveryCampaigns(): Promise<DiscoveryCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('discovery_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching discovery campaigns:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDiscoveryCampaigns:', error);
      return [];
    }
  },

  // Get curation statistics
  async getCurationStats(): Promise<CurationStats> {
    try {
      console.log('📊 Fetching curation stats from database...');
      
      // [2024-12-19 16:30 UTC] - Get real data from suggested_businesses table
      const { data: suggestedBusinesses } = await supabase
        .from('suggested_businesses')
        .select('curation_status, quality_score, created_at');

      // [2024-12-19 16:30 UTC] - Also get data from main businesses table
      const { data: mainBusinesses } = await supabase
        .from('businesses')
        .select('partnership_status, created_at');

      console.log('📊 Suggested businesses data:', suggestedBusinesses?.length || 0, 'records');
      console.log('📊 Main businesses data:', mainBusinesses?.length || 0, 'records');

      let stats = {
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        salesLeadsCount: 0,
        averageQualityScore: 0
      };

      // Calculate stats from suggested_businesses table
      if (suggestedBusinesses && suggestedBusinesses.length > 0) {
        stats.pendingCount = suggestedBusinesses.filter(b => b.curation_status === 'pending').length;
        stats.approvedCount = suggestedBusinesses.filter(b => b.curation_status === 'approved').length;
        stats.rejectedCount = suggestedBusinesses.filter(b => b.curation_status === 'rejected').length;
        stats.salesLeadsCount = suggestedBusinesses.filter(b => b.curation_status === 'flagged_for_sales').length;

        const qualityScores = suggestedBusinesses
          .map(b => b.quality_score)
          .filter(score => score && score > 0);
        
        if (qualityScores.length > 0) {
          stats.averageQualityScore = Math.round(
            qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
          );
        }
      }

      // Add approved businesses from main businesses table to approved count
      if (mainBusinesses && mainBusinesses.length > 0) {
        const activeBusinesses = mainBusinesses.filter(b => b.partnership_status === 'active').length;
        stats.approvedCount += activeBusinesses;
      }

      // [2024-12-19 16:30 UTC] - Always use real database stats for production
      console.log('✅ Using real database stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getCurationStats:', error);
      // [2024-12-19 16:30 UTC] - Return zeros for production instead of demo data
      return {
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        salesLeadsCount: 0,
        averageQualityScore: 0
      };
    }
  },

  // Approve a suggested business
  async approveBusiness(businessId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('suggested_businesses')
        .update({ 
          curation_status: 'approved',
          curated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) {
        console.error('Error approving business:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in approveBusiness:', error);
      return false;
    }
  },

  // Flag business for sales
  async flagForSales(businessId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('suggested_businesses')
        .update({ 
          curation_status: 'flagged_for_sales',
          curated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) {
        console.error('Error flagging business for sales:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in flagForSales:', error);
      return false;
    }
  },

  // Reject a suggested business
  async rejectBusiness(businessId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('suggested_businesses')
        .update({ 
          curation_status: 'rejected',
          rejection_reason: reason,
          curated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) {
        console.error('Error rejecting business:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in rejectBusiness:', error);
      return false;
    }
  },

  // Approve a suggested business and create a default loyalty program
  async approveBusinessAndCreateLoyalty(suggestedBusinessId: string, curatorId: string): Promise<string> {
    try {
      // [2025-01-06 13:00 UTC] - Handle empty or invalid curator ID
      let validCuratorId = curatorId;
      if (!curatorId || curatorId.trim() === '' || curatorId.length < 10) {
        console.warn('⚠️ Invalid curator ID provided, using system default');
        // Generate a system UUID for cases where user authentication fails
        validCuratorId = '00000000-0000-0000-0000-000000000000'; // System default UUID
      }

      // [2024-12-19 17:45 UTC] - Check for duplicates before approval
      console.log('🔍 Checking for duplicates before approving business:', suggestedBusinessId);
      
      // Get the suggested business details
      const { data: suggestedBusiness, error: fetchError } = await supabase
        .from('suggested_businesses')
        .select('google_place_id, name')
        .eq('id', suggestedBusinessId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching suggested business:', fetchError);
        throw new Error(`Failed to fetch business details: ${fetchError.message}`);
      }

      if (!suggestedBusiness) {
        throw new Error('Suggested business not found');
      }

      // Check if business already exists in main businesses table
      const { data: existingBusiness, error: duplicateError } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('google_place_id', suggestedBusiness.google_place_id)
        .maybeSingle();

      if (duplicateError) {
        console.error('❌ Error checking for duplicates:', duplicateError);
        throw new Error(`Duplicate check failed: ${duplicateError.message}`);
      }

      if (existingBusiness) {
        console.log('⚠️ Business already exists in main table:', existingBusiness.name);
        
        // Mark the suggested business as approved but don't create duplicate
        const { error: updateError } = await supabase
          .from('suggested_businesses')
          .update({ 
            curation_status: 'approved',
            curated_at: new Date().toISOString()
          })
          .eq('id', suggestedBusinessId);

        if (updateError) {
          console.error('❌ Error updating suggested business status:', updateError);
          throw new Error(`Failed to update status: ${updateError.message}`);
        }

        console.log('✅ Marked as approved, returning existing business ID:', existingBusiness.id);
        return existingBusiness.id;
      }

      // 1. Approve and move to businesses table (no duplicate found)
      console.log('✅ No duplicate found, proceeding with approval...');
      const { data: newBusinessId, error } = await supabase
        .rpc('approve_suggested_business', {
          suggested_business_uuid: suggestedBusinessId,
          curator_uuid: validCuratorId
        });
      
      if (error) {
        console.error('❌ RPC approval error:', error);
        throw new Error(`Approval failed: ${error.message}`);
      }

      console.log('✅ Business approved, new ID:', newBusinessId);

      // 2. Create a default loyalty program
      const { error: loyaltyError } = await supabase
        .from('loyalty_programs')
        .insert([{
          business_id: newBusinessId,
          title: 'Default Loyalty Program',
          stamps_required: 10,
          prize_description: 'Free reward after 10 stamps',
          terms_conditions: 'One stamp per visit. Not valid with other offers.'
        }]);
      
      if (loyaltyError) {
        console.error('❌ Loyalty program creation error:', loyaltyError);
        // Don't throw here - business is already approved
        console.log('⚠️ Business approved but loyalty program creation failed');
      } else {
        console.log('✅ Loyalty program created successfully');
      }

      return newBusinessId;
    } catch (error) {
      console.error('💥 Error in approveBusinessAndCreateLoyalty:', error);
      throw error;
    }
  }
}; 