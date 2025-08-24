// Curated Business Pipeline Service
// Handles automated discovery, quality filtering, and curation workflow

import { supabase } from '../lib/supabase';
import { googlePlacesService } from './googlePlaces';

export interface DiscoveryFilters {
  minRating?: number;
  minReviewCount?: number;
  maxDistance?: number; // in meters
  requiredTypes?: string[];
  excludedTypes?: string[];
  priceLevel?: number[];
}

export interface DiscoveryCampaign {
  id?: string;
  name: string;
  description?: string;
  targetLocation: string;
  centerLatitude: number;
  centerLongitude: number;
  searchRadius: number;
  targetCategories: string[];
  qualityFilters: DiscoveryFilters;
  runFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  nextRunAt?: Date;
  businessesDiscovered?: number;
}

export interface SuggestedBusiness {
  id?: string;
  googlePlaceId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  websiteUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  googlePriceLevel?: number;
  googleTypes?: string[];
  primaryCategory: string;
  googlePhotos?: any;
  businessHours?: any;
  qualityScore: number;
  curationStatus: 'pending' | 'approved' | 'rejected' | 'flagged_for_sales';
  discoverySource: string;
  discoveryCriteria?: any;
}

export interface SalesLead {
  id?: string;
  businessId?: string;
  suggestedBusinessId?: string;
  leadSource: string;
  priorityLevel: number; // 1-5
  estimatedPartnershipValue?: number;
  outreachStatus: 'new' | 'contacted' | 'interested' | 'negotiating' | 'converted' | 'declined' | 'inactive';
  assignedTo?: string;
  notes?: string;
  partnershipTier?: 'basic' | 'premium' | 'enterprise';
}

export class CurationPipelineService {
  private googlePlaces = googlePlacesService;

  // ====================
  // DISCOVERY CAMPAIGNS
  // ====================

  async createDiscoveryCampaign(campaign: DiscoveryCampaign): Promise<DiscoveryCampaign> {
    const { data, error } = await supabase
      .from('discovery_campaigns')
      .insert([{
        name: campaign.name,
        description: campaign.description,
        target_location: campaign.targetLocation,
        center_latitude: campaign.centerLatitude,
        center_longitude: campaign.centerLongitude,
        search_radius: campaign.searchRadius,
        target_categories: campaign.targetCategories,
        quality_filters: campaign.qualityFilters,
        run_frequency: campaign.runFrequency,
        next_run_at: campaign.nextRunAt?.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapDiscoveryCampaign(data);
  }

  async getDiscoveryCampaigns(): Promise<DiscoveryCampaign[]> {
    const { data, error } = await supabase
      .from('discovery_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDiscoveryCampaign);
  }

  async runDiscoveryCampaign(campaignId: string): Promise<{
    discovered: number;
    added: number;
    duplicates: number;
    errors: string[];
  }> {
    const campaign = await this.getDiscoveryCampaignById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const results = {
      discovered: 0,
      added: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    try {
      // Run discovery for each target category
      for (const category of campaign.targetCategories) {
        const placeType = this.mapCategoryToGoogleType(category);
        
        const places = await this.googlePlaces.discoverBusinessesNearby(
          campaign.centerLatitude,
          campaign.centerLongitude,
          campaign.searchRadius,
          placeType
        );

        results.discovered += places.length;

        for (const place of places) {
          try {
            // Apply quality filters
            if (!this.passesQualityFilters(place, campaign.qualityFilters)) {
              continue;
            }

            // Check if already exists
            const exists = await this.checkBusinessExists(place.place_id);
            if (exists) {
              results.duplicates++;
              continue;
            }

            // Add to suggested businesses queue
            await this.addSuggestedBusiness({
              googlePlaceId: place.place_id,
              name: place.name,
              address: place.vicinity || '',
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              googleRating: place.rating,
              googleReviewCount: 0, // Will be populated from details if needed
              googlePriceLevel: place.price_level,
              googleTypes: place.types,
              primaryCategory: category,
              qualityScore: this.calculateQualityScore(place),
              curationStatus: 'pending',
              discoverySource: 'automated_campaign',
              discoveryCriteria: {
                campaignId,
                campaignName: campaign.name,
                searchCategory: category,
                filters: campaign.qualityFilters
              }
            });

            results.added++;
          } catch (error) {
            results.errors.push(`Error processing ${place.name}: ${error}`);
          }
        }
      }

      // Update campaign statistics
      await supabase
        .from('discovery_campaigns')
        .update({
          businesses_discovered: (campaign.businessesDiscovered || 0) + results.discovered,
          last_run_at: new Date().toISOString(),
          next_run_at: this.calculateNextRun(campaign.runFrequency)
        })
        .eq('id', campaignId);

    } catch (error) {
      results.errors.push(`Campaign execution error: ${error}`);
    }

    return results;
  }

  // ====================
  // SUGGESTED BUSINESSES
  // ====================

  async getSuggestedBusinesses(status?: string): Promise<SuggestedBusiness[]> {
    let query = supabase
      .from('suggested_businesses')
      .select('*')
      .order('quality_score', { ascending: false });

    if (status) {
      query = query.eq('curation_status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(this.mapSuggestedBusiness);
  }

  async addSuggestedBusiness(business: Omit<SuggestedBusiness, 'id'>): Promise<SuggestedBusiness> {
    const { data, error } = await supabase
      .from('suggested_businesses')
      .insert([{
        google_place_id: business.googlePlaceId,
        name: business.name,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
        phone: business.phone,
        website_url: business.websiteUrl,
        google_rating: business.googleRating,
        google_review_count: business.googleReviewCount,
        google_price_level: business.googlePriceLevel,
        google_types: business.googleTypes,
        primary_category: business.primaryCategory,
        google_photos: business.googlePhotos,
        business_hours: business.businessHours,
        quality_score: business.qualityScore,
        curation_status: business.curationStatus,
        discovery_source: business.discoverySource,
        discovery_criteria: business.discoveryCriteria
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapSuggestedBusiness(data);
  }

  async approveSuggestedBusiness(
    suggestedBusinessId: string, 
    curatorId: string
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('approve_suggested_business', {
        suggested_business_uuid: suggestedBusinessId,
        curator_uuid: curatorId
      });

    if (error) throw error;
    return data; // Returns new business ID
  }

  async rejectSuggestedBusiness(
    suggestedBusinessId: string,
    curatorId: string,
    reason: string
  ): Promise<void> {
    const { error } = await supabase
      .from('suggested_businesses')
      .update({
        curation_status: 'rejected',
        curated_by: curatorId,
        curated_at: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', suggestedBusinessId);

    if (error) throw error;

    // Log activity
    await this.logCurationActivity(curatorId, 'rejected', 'suggested_business', suggestedBusinessId, reason);
  }

  async flagForSalesOutreach(
    suggestedBusinessId: string,
    curatorId: string,
    priorityLevel: number = 3,
    estimatedValue: number = 500
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('flag_for_sales_outreach', {
        suggested_business_uuid: suggestedBusinessId,
        curator_uuid: curatorId,
        priority_level: priorityLevel,
        estimated_value: estimatedValue
      });

    if (error) throw error;
    return data; // Returns sales lead ID
  }

  // ====================
  // SALES LEADS
  // ====================

  async getSalesLeads(): Promise<SalesLead[]> {
    const { data, error } = await supabase
      .from('sales_leads')
      .select(`
        *,
        suggested_businesses(name, address, phone, google_rating),
        businesses(name, address, phone)
      `)
      .order('priority_level', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapSalesLead);
  }

  async updateSalesLeadStatus(
    leadId: string,
    status: SalesLead['outreachStatus'],
    notes?: string
  ): Promise<void> {
    const updates: any = {
      outreach_status: status,
      updated_at: new Date().toISOString()
    };

    if (notes) updates.notes = notes;

    if (status === 'contacted' || status === 'interested') {
      updates.last_contact_date = new Date().toISOString().split('T')[0];
      if (status === 'contacted') {
        // Increment contact attempts
        const { data: currentLead } = await supabase
          .from('sales_leads')
          .select('contact_attempts')
          .eq('id', leadId)
          .single();
        
        if (currentLead) {
          updates.contact_attempts = (currentLead.contact_attempts || 0) + 1;
        }
      }
    }

    if (status === 'converted') {
      updates.conversion_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('sales_leads')
      .update(updates)
      .eq('id', leadId);

    if (error) throw error;
  }

  // ====================
  // UTILITY METHODS
  // ====================

  private async checkBusinessExists(googlePlaceId: string): Promise<boolean> {
    // Check both main businesses table and suggested businesses
    const [businessCheck, suggestedCheck] = await Promise.all([
      supabase.from('businesses').select('id').eq('google_place_id', googlePlaceId).single(),
      supabase.from('suggested_businesses').select('id').eq('google_place_id', googlePlaceId).single()
    ]);

    return !businessCheck.error || !suggestedCheck.error;
  }

  private passesQualityFilters(place: any, filters: DiscoveryFilters): boolean {
    if (filters.minRating && (!place.rating || place.rating < filters.minRating)) {
      return false;
    }

    if (filters.minReviewCount && (!place.user_ratings_total || place.user_ratings_total < filters.minReviewCount)) {
      return false;
    }

    if (filters.priceLevel && place.price_level && !filters.priceLevel.includes(place.price_level)) {
      return false;
    }

    if (filters.excludedTypes && place.types) {
      const hasExcludedType = place.types.some((type: string) => 
        filters.excludedTypes!.includes(type)
      );
      if (hasExcludedType) return false;
    }

    if (filters.requiredTypes && place.types) {
      const hasRequiredType = filters.requiredTypes.some(type => 
        place.types.includes(type)
      );
      if (!hasRequiredType) return false;
    }

    return true;
  }

  private calculateQualityScore(place: any): number {
    return Math.min(100, Math.floor(
      (place.rating || 0) * 15 +
      Math.min((place.user_ratings_total || 0) / 10, 25) +
      (place.price_level ? 10 : 0) +
      (place.formatted_phone_number ? 10 : 0) +
      (place.website ? 10 : 0) +
      (place.photos && place.photos.length > 0 ? 15 : 0) +
      (place.opening_hours ? 10 : 0) +
      (place.types && place.types.length > 0 ? 5 : 0)
    ));
  }

  private mapCategoryToGoogleType(category: string): string {
    const mapping: Record<string, string> = {
      'Restaurants': 'restaurant',
      'Wellness': 'spa',
      'Shopping': 'store',
      'Services': 'establishment',
      'Entertainment': 'amusement_park',
      'Travel': 'travel_agency'
    };
    return mapping[category] || 'establishment';
  }

  private calculateNextRun(frequency: string): string {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return now.toISOString();
    }
  }

  private async logCurationActivity(
    curatorId: string,
    action: string,
    targetType: string,
    targetId: string,
    notes?: string
  ): Promise<void> {
    await supabase.from('curation_activities').insert([{
      curator_id: curatorId,
      action,
      target_type: targetType,
      target_id: targetId,
      notes
    }]);
  }

  // Mapping functions
  private mapDiscoveryCampaign(data: any): DiscoveryCampaign {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      targetLocation: data.target_location,
      centerLatitude: data.center_latitude,
      centerLongitude: data.center_longitude,
      searchRadius: data.search_radius,
      targetCategories: data.target_categories,
      qualityFilters: data.quality_filters,
      runFrequency: data.run_frequency,
      nextRunAt: data.next_run_at ? new Date(data.next_run_at) : undefined,
      businessesDiscovered: data.businesses_discovered || 0
    };
  }

  private mapSuggestedBusiness(data: any): SuggestedBusiness {
    return {
      id: data.id,
      googlePlaceId: data.google_place_id,
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      websiteUrl: data.website_url,
      googleRating: data.google_rating,
      googleReviewCount: data.google_review_count,
      googlePriceLevel: data.google_price_level,
      googleTypes: data.google_types,
      primaryCategory: data.primary_category,
      googlePhotos: data.google_photos,
      businessHours: data.business_hours,
      qualityScore: data.quality_score,
      curationStatus: data.curation_status,
      discoverySource: data.discovery_source,
      discoveryCriteria: data.discovery_criteria
    };
  }

  private mapSalesLead(data: any): SalesLead {
    return {
      id: data.id,
      businessId: data.business_id,
      suggestedBusinessId: data.suggested_business_id,
      leadSource: data.lead_source,
      priorityLevel: data.priority_level,
      estimatedPartnershipValue: data.estimated_partnership_value,
      outreachStatus: data.outreach_status,
      assignedTo: data.assigned_to,
      notes: data.notes,
      partnershipTier: data.partnership_tier
    };
  }

  private async getDiscoveryCampaignById(id: string): Promise<DiscoveryCampaign | null> {
    const { data, error } = await supabase
      .from('discovery_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapDiscoveryCampaign(data);
  }
} 