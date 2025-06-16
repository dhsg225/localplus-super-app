// [2025-01-06 17:30 UTC] - Google Places API service for restaurant discovery and cuisine categorization
import { supabase } from '../lib/supabase';

// Google Places API Types
export interface GooglePlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

export interface GooglePlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: GooglePlaceGeometry;
  types: string[];
  primaryType?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: GooglePlacePhoto[];
  opening_hours?: {
    open_now: boolean;
    periods?: any[];
  };
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  business_status?: string;
}

export interface GooglePlacesNearbySearchResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

// Cuisine Type Mapping - Google Places types to LocalPlus categories
export const GOOGLE_TO_LOCALPLUS_CUISINE_MAPPING: Record<string, string[]> = {
  // Thai restaurants
  'thai_restaurant': ['thai_traditional'],
  
  // Seafood
  'seafood_restaurant': ['seafood_grilled'],
  
  // Japanese
  'japanese_restaurant': ['japanese_sushi'],
  'sushi_restaurant': ['japanese_sushi'],
  'ramen_restaurant': ['japanese_ramen'],
  
  // Italian
  'italian_restaurant': ['italian_pasta'],
  'pizza_restaurant': ['italian_pizza'],
  
  // Chinese
  'chinese_restaurant': ['chinese_cantonese'],
  
  // Indian
  'indian_restaurant': ['indian_north'],
  
  // Korean
  'korean_restaurant': ['korean_bbq'],
  
  // Vietnamese
  'vietnamese_restaurant': ['vietnamese_pho'],
  
  // American
  'american_restaurant': ['american_burger'],
  'burger_restaurant': ['american_burger'],
  'steak_house': ['american_steak'],
  
  // French
  'french_restaurant': ['french_bistro'],
  
  // Cafes and beverages
  'cafe': ['cafe_coffee'],
  'coffee_shop': ['cafe_coffee'],
  'bar': ['bar_cocktails'],
  
  // Desserts
  'ice_cream_shop': ['dessert_ice_cream'],
  'dessert_restaurant': ['dessert_ice_cream'],
  
  // Dietary
  'vegetarian_restaurant': ['vegetarian'],
  'vegan_restaurant': ['vegan']
};

// Restaurant-specific Google Place Types for filtering
export const RESTAURANT_PLACE_TYPES = [
  'restaurant',
  'food',
  'thai_restaurant',
  'seafood_restaurant',
  'japanese_restaurant',
  'sushi_restaurant',
  'ramen_restaurant',
  'italian_restaurant',
  'pizza_restaurant',
  'chinese_restaurant',
  'indian_restaurant',
  'korean_restaurant',
  'vietnamese_restaurant',
  'american_restaurant',
  'burger_restaurant',
  'steak_house',
  'french_restaurant',
  'vegetarian_restaurant',
  'vegan_restaurant',
  'cafe',
  'coffee_shop',
  'bar',
  'ice_cream_shop',
  'dessert_restaurant'
];

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ Google Places API key not found in environment variables');
    }
  }

  // Start a nearby search job for restaurants
  async startNearbyRestaurantDiscovery(
    location: { lat: number; lng: number },
    radiusMeters: number = 5000
  ): Promise<number | null> {
    try {
      console.log('🔍 Starting Google Places nearby restaurant discovery...');
      
      // Create sync job record
      const { data: syncJob, error: syncError } = await supabase
        .from('google_places_sync_jobs')
        .insert([{
          job_type: 'nearby_search',
          location_lat: location.lat,
          location_lng: location.lng,
          search_radius: radiusMeters,
          status: 'pending',
          started_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (syncError || !syncJob) {
        console.error('❌ Failed to create sync job:', syncError);
        return null;
      }

      // Execute the search
      await this.executeNearbySearch(syncJob.id, location, radiusMeters);
      
      return syncJob.id;
      
    } catch (error) {
      console.error('❌ Error starting nearby restaurant discovery:', error);
      return null;
    }
  }

  // Execute nearby search and process results
  private async executeNearbySearch(
    syncJobId: number,
    location: { lat: number; lng: number },
    radiusMeters: number
  ): Promise<void> {
    try {
      // Update job status to running
      await supabase
        .from('google_places_sync_jobs')
        .update({ status: 'running' })
        .eq('id', syncJobId);

      let nextPageToken: string | undefined;
      let totalProcessed = 0;
      let totalFound = 0;

      do {
        const searchResults = await this.performNearbySearch(
          location,
          radiusMeters,
          nextPageToken
        );

        if (searchResults.status !== 'OK') {
          throw new Error(`Google Places API error: ${searchResults.status} - ${searchResults.error_message}`);
        }

        totalFound += searchResults.results.length;
        
        // Process each place
        for (const place of searchResults.results) {
          await this.processSuggestedBusiness(syncJobId, place);
          totalProcessed++;
        }

        nextPageToken = searchResults.next_page_token;
        
        // Wait before next page (Google requirement)
        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } while (nextPageToken);

      // Update job completion
      await supabase
        .from('google_places_sync_jobs')
        .update({
          status: 'completed',
          businesses_found: totalFound,
          businesses_processed: totalProcessed,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncJobId);

      console.log(`✅ Nearby search completed: ${totalFound} found, ${totalProcessed} processed`);

    } catch (error) {
      console.error('❌ Error executing nearby search:', error);
      
      // Update job with error
      await supabase
        .from('google_places_sync_jobs')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', syncJobId);
    }
  }

  // Perform actual Google Places API nearby search
  private async performNearbySearch(
    location: { lat: number; lng: number },
    radiusMeters: number,
    pageToken?: string
  ): Promise<GooglePlacesNearbySearchResponse> {
    const params = new URLSearchParams({
      location: `${location.lat},${location.lng}`,
      radius: radiusMeters.toString(),
      type: 'restaurant', // Primary type filter
      key: this.apiKey
    });

    if (pageToken) {
      params.append('pagetoken', pageToken);
    }

    const url = `${this.baseUrl}/nearbysearch/json?${params.toString()}`;
    
    console.log('🔍 Making Google Places API request:', url.replace(this.apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data;
  }

  // Process a suggested business from Google Places
  private async processSuggestedBusiness(syncJobId: number, place: GooglePlace): Promise<void> {
    try {
      // Check if this place already exists
      const { data: existing } = await supabase
        .from('suggested_businesses')
        .select('id')
        .eq('google_place_id', place.place_id)
        .single();

      if (existing) {
        console.log(`⏭️ Skipping existing place: ${place.name}`);
        return;
      }

      // Extract cuisine types from Google types
      const cuisineTypes = this.extractCuisineTypesFromGoogle(place.types);
      
      // Calculate confidence score based on available data
      const confidenceScore = this.calculateConfidenceScore(place);

      // Insert into suggested_businesses
      await supabase
        .from('suggested_businesses')
        .insert([{
          google_place_id: place.place_id,
          sync_job_id: syncJobId,
          google_data: place,
          suggested_name: place.name,
          suggested_address: place.formatted_address || '',
          suggested_phone: place.formatted_phone_number || place.international_phone_number,
          suggested_website: place.website,
          suggested_category: this.determinePrimaryCategory(place.types),
          suggested_cuisine_types: cuisineTypes,
          confidence_score: confidenceScore,
          status: 'pending'
        }]);

      console.log(`➕ Added suggested business: ${place.name} (confidence: ${confidenceScore})`);

    } catch (error) {
      console.error('❌ Error processing suggested business:', error);
    }
  }

  // Extract LocalPlus cuisine types from Google Place types
  private extractCuisineTypesFromGoogle(googleTypes: string[]): string[] {
    const cuisineTypes = new Set<string>();

    for (const googleType of googleTypes) {
      const mappedCuisines = GOOGLE_TO_LOCALPLUS_CUISINE_MAPPING[googleType];
      if (mappedCuisines) {
        mappedCuisines.forEach(cuisine => cuisineTypes.add(cuisine));
      }
    }

    // If no specific cuisine mapping found, try to infer from restaurant type
    if (cuisineTypes.size === 0 && googleTypes.includes('restaurant')) {
      cuisineTypes.add('thai_traditional'); // Default for Thailand market
    }

    return Array.from(cuisineTypes);
  }

  // Determine primary business category from Google types
  private determinePrimaryCategory(googleTypes: string[]): string {
    // Priority order for category determination
    const categoryPriority = [
      'thai_restaurant',
      'seafood_restaurant',
      'japanese_restaurant',
      'italian_restaurant',
      'chinese_restaurant',
      'indian_restaurant',
      'korean_restaurant',
      'vietnamese_restaurant',
      'restaurant',
      'cafe',
      'bar',
      'food'
    ];

    for (const priority of categoryPriority) {
      if (googleTypes.includes(priority)) {
        return priority;
      }
    }

    return 'restaurant'; // Default
  }

  // Calculate confidence score based on available data quality
  private calculateConfidenceScore(place: GooglePlace): number {
    let score = 0.0;

    // Base score for having essential data
    if (place.name) score += 0.2;
    if (place.formatted_address) score += 0.2;
    if (place.geometry?.location) score += 0.1;

    // Bonus for rating and reviews
    if (place.rating && place.rating > 0) score += 0.15;
    if (place.user_ratings_total && place.user_ratings_total > 10) score += 0.1;

    // Bonus for contact information
    if (place.formatted_phone_number || place.international_phone_number) score += 0.1;
    if (place.website) score += 0.1;

    // Bonus for photos
    if (place.photos && place.photos.length > 0) score += 0.05;

    return Math.min(Math.round(score * 100) / 100, 1.0);
  }

  // Get curated LocalPlus cuisine categories
  async getCuratedCuisineCategories(): Promise<any[]> {
    const { data, error } = await supabase
      .from('cuisine_categories_localplus')
      .select('*')
      .eq('is_active', true)
      .order('parent_category, display_name');

    if (error) {
      console.error('❌ Error fetching cuisine categories:', error);
      return [];
    }

    return data || [];
  }

  // Get suggested businesses for curation
  async getSuggestedBusinessesForCuration(
    status: string = 'pending',
    limit: number = 50
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from('suggested_businesses')
      .select(`
        *,
        google_places_sync_jobs(*)
      `)
      .eq('status', status)
      .order('confidence_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching suggested businesses:', error);
      return [];
    }

    return data || [];
  }

  // Approve a suggested business and add to main businesses table
  async approveSuggestedBusiness(
    suggestedBusinessId: number,
    curatedCuisineTypes: string[],
    curationNotes?: string
  ): Promise<boolean> {
    try {
      // Get the suggested business
      const { data: suggested, error: fetchError } = await supabase
        .from('suggested_businesses')
        .select('*')
        .eq('id', suggestedBusinessId)
        .single();

      if (fetchError || !suggested) {
        console.error('❌ Suggested business not found:', fetchError);
        return false;
      }

      const googleData = suggested.google_data as GooglePlace;

      // Insert into main businesses table
      const { error: insertError } = await supabase
        .from('businesses')
        .insert([{
          google_place_id: suggested.google_place_id,
          name: suggested.suggested_name,
          category: suggested.suggested_category,
          address: suggested.suggested_address,
          latitude: googleData.geometry.location.lat,
          longitude: googleData.geometry.location.lng,
          phone: suggested.suggested_phone,
          website_url: suggested.suggested_website,
          google_types: googleData.types,
          google_primary_type: googleData.primaryType || suggested.suggested_category,
          cuisine_types_google: suggested.suggested_cuisine_types,
          cuisine_types_localplus: curatedCuisineTypes,
          discovery_source: 'google_places',
          curation_status: 'approved',
          curation_notes: curationNotes,
          partnership_status: 'active',
          last_google_sync: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('❌ Error inserting approved business:', insertError);
        return false;
      }

      // Update suggested business status
      await supabase
        .from('suggested_businesses')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          review_notes: curationNotes
        })
        .eq('id', suggestedBusinessId);

      console.log(`✅ Approved business: ${suggested.suggested_name}`);
      return true;

    } catch (error) {
      console.error('❌ Error approving suggested business:', error);
      return false;
    }
  }

  // Reject a suggested business
  async rejectSuggestedBusiness(
    suggestedBusinessId: number,
    rejectionReason: string
  ): Promise<boolean> {
    try {
      await supabase
        .from('suggested_businesses')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          review_notes: rejectionReason
        })
        .eq('id', suggestedBusinessId);

      console.log(`🚫 Rejected suggested business: ${suggestedBusinessId}`);
      return true;

    } catch (error) {
      console.error('❌ Error rejecting suggested business:', error);
      return false;
    }
  }

  // Get sync job status
  async getSyncJobStatus(syncJobId: number): Promise<any> {
    const { data, error } = await supabase
      .from('google_places_sync_jobs')
      .select('*')
      .eq('id', syncJobId)
      .single();

    if (error) {
      console.error('❌ Error fetching sync job status:', error);
      return null;
    }

    return data;
  }
}

export const googlePlacesService = new GooglePlacesService(); 