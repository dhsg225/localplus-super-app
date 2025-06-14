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

      if (status && status !== 'all') {
        query = query.eq('curation_status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Database error fetching suggested businesses:', error);
        
        // Return demo data when database fails (for API key issues)
        console.log('🎭 Using demo data due to database error...');
        return this.getDemoSuggestedBusinesses();
      }

      console.log('📊 Database returned', data?.length || 0, 'suggested businesses');
      console.log('🏢 Businesses:', data);
      
      return data?.map(business => ({
        id: business.id,
        google_place_id: business.google_place_id,
        name: business.name,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
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
      
      // Return demo data when any error occurs
      console.log('🎭 Using demo data due to fetch error...');
      return this.getDemoSuggestedBusinesses();
    }
  },

  // Demo suggested businesses for when database is unavailable
  getDemoSuggestedBusinesses(): SuggestedBusiness[] {
    return [
      {
        id: 'demo_1',
        google_place_id: 'demo_restaurant_1',
        name: 'Seaside Thai Restaurant',
        address: '123 Beach Road, Bangkok',
        latitude: 13.8179,
        longitude: 100.0416,
        google_rating: 4.5,
        google_review_count: 156,
        google_price_level: 2,
        google_types: ['restaurant', 'food', 'establishment'],
        primary_category: 'Restaurants',
        quality_score: 85,
        curation_status: 'pending',
        discovery_source: 'automated_discovery',
        discovery_criteria: { demo: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo_2',
        google_place_id: 'demo_spa_1',
        name: 'Lotus Wellness Spa',
        address: '456 Wellness Street, Bangkok',
        latitude: 13.8200,
        longitude: 100.0400,
        google_rating: 4.7,
        google_review_count: 89,
        google_price_level: 3,
        google_types: ['spa', 'beauty_salon', 'health'],
        primary_category: 'Wellness',
        quality_score: 92,
        curation_status: 'pending',
        discovery_source: 'automated_discovery',
        discovery_criteria: { demo: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo_3',
        google_place_id: 'demo_cafe_1',
        name: 'Coffee Culture Cafe',
        address: '789 Cafe Lane, Bangkok',
        latitude: 13.8150,
        longitude: 100.0450,
        google_rating: 4.3,
        google_review_count: 67,
        google_price_level: 2,
        google_types: ['cafe', 'food', 'establishment'],
        primary_category: 'Restaurants',
        quality_score: 78,
        curation_status: 'pending',
        discovery_source: 'automated_discovery',
        discovery_criteria: { demo: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
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
      const { data: allBusinesses, error } = await supabase
        .from('suggested_businesses')
        .select('curation_status, quality_score');

      if (error) {
        console.error('Error fetching curation stats:', error);
        return {
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
          salesLeadsCount: 0,
          averageQualityScore: 0
        };
      }

      const stats = {
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        salesLeadsCount: 0,
        averageQualityScore: 0
      };

      if (allBusinesses && allBusinesses.length > 0) {
        stats.pendingCount = allBusinesses.filter(b => b.curation_status === 'pending').length;
        stats.approvedCount = allBusinesses.filter(b => b.curation_status === 'approved').length;
        stats.rejectedCount = allBusinesses.filter(b => b.curation_status === 'rejected').length;
        stats.salesLeadsCount = allBusinesses.filter(b => b.curation_status === 'flagged_for_sales').length;

        const qualityScores = allBusinesses
          .map(b => b.quality_score)
          .filter(score => score && score > 0);
        
        if (qualityScores.length > 0) {
          stats.averageQualityScore = Math.round(
            qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
          );
        }
      }

      return stats;
    } catch (error) {
      console.error('Error in getCurationStats:', error);
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
    // 1. Approve and move to businesses table
    const { data: newBusinessId, error } = await supabase
      .rpc('approve_suggested_business', {
        suggested_business_uuid: suggestedBusinessId,
        curator_uuid: curatorId
      });
    if (error) throw error;

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
    if (loyaltyError) throw loyaltyError;

    return newBusinessId;
  }
}; 