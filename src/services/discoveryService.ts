// Discovery Service for running discovery campaigns
import { supabase } from '../lib/supabase';
import { googlePlacesService } from './googlePlaces';

export interface DiscoveryResult {
  discovered: number;
  added: number;
  duplicates: number;
  errors: string[];
}

export interface DiscoveryFilters {
  minRating?: number;
  minReviewCount?: number;
  maxDistance?: number;
  requiredTypes?: string[];
  excludedTypes?: string[];
  priceLevel?: number[];
}

export class DiscoveryService {
  
  // [2024-12-19 19:00 UTC] - Track discovery state to avoid repeating searches
  private discoveryState = {
    lastSearches: new Map<string, Date>(),
    usedStrategies: new Set<string>(),
    searchCount: 0
  };

  // [2024-12-19 19:30 UTC] - Intelligent pipeline configuration
  private pipelineConfig = {
    minPendingBusinesses: 15, // Trigger discovery when below this threshold
    targetPendingBusinesses: 25, // Stop discovery when reaching this target
    searchRadiusIncrement: 1000, // Increase radius by 1km when no results
    maxSearchRadius: 15000, // Maximum 15km search radius
    // [2024-12-19 20:00 UTC] - STRICT LIMITS to prevent excessive API calls
    maxLocationsToSearch: 3, // Only search top 3 locations
    maxQueriesPerLocation: 2, // Only 2 queries per location
    maxTotalDiscovered: 50, // Stop after discovering 50 businesses total
    maxApiCallsPerSession: 10, // Hard limit on API calls
    locationFallbacks: [
      // Primary Hua Hin locations
      { name: 'Hua Hin Center', lat: 12.5684, lng: 99.9578, priority: 1 },
      { name: 'Hua Hin Night Market', lat: 12.5708, lng: 99.9581, priority: 1 },
      { name: 'Hua Hin Beach', lat: 12.5650, lng: 99.9520, priority: 1 },
      
      // Secondary locations
      { name: 'Cicada Market', lat: 12.5892, lng: 99.9664, priority: 2 },
      { name: 'Hua Hin Railway Station', lat: 12.5703, lng: 99.9496, priority: 2 },
      { name: 'Hua Hin Hills', lat: 12.5500, lng: 99.9400, priority: 2 },
      
      // Fallback areas
      { name: 'Cha-am', lat: 12.6000, lng: 99.9800, priority: 3 },
      { name: 'Pranburi', lat: 12.3900, lng: 99.9100, priority: 3 },
      { name: 'Khao Takiab', lat: 12.5300, lng: 99.9700, priority: 3 }
    ]
  };

  // Track what's been searched to avoid repetition
  private searchHistory = new Map<string, Date>();

  // Reset discovery state (call this periodically or when needed)
  resetDiscoveryState() {
    this.discoveryState.lastSearches.clear();
    this.discoveryState.usedStrategies.clear();
    this.discoveryState.searchCount = 0;
    console.log('🔄 Discovery state reset - ready for fresh searches');
  }

  // Check if a search strategy was used recently (within last hour)
  private isStrategyFresh(strategyKey: string): boolean {
    const lastUsed = this.discoveryState.lastSearches.get(strategyKey);
    if (!lastUsed) return true;
    
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastUsed < hourAgo;
  }

  // Mark a strategy as used
  private markStrategyUsed(strategyKey: string) {
    this.discoveryState.lastSearches.set(strategyKey, new Date());
    this.discoveryState.usedStrategies.add(strategyKey);
    this.discoveryState.searchCount++;
  }

  // Run a discovery campaign for a specific location and categories
  async runDiscoveryForLocation(
    location: { lat: number; lng: number },
    categories: string[],
    radius: number = 5000,
    filters: DiscoveryFilters = {}
  ): Promise<DiscoveryResult> {
    const result: DiscoveryResult = {
      discovered: 0,
      added: 0,
      duplicates: 0,
      errors: []
    };

    console.log('🔍 Running discovery for location:', location);
    console.log('🎯 Categories:', categories);
    console.log('📏 Radius:', radius, 'meters');

    try {
      for (const category of categories) {
        console.log(`🔍 Discovering ${category} businesses...`);
        
        // [2024-12-19 16:30 UTC] - Enhanced category-specific search
        let searchQuery = category.toLowerCase();
        if (category === 'Restaurants') {
          searchQuery = 'restaurant food dining cafe';
        } else if (category === 'Wellness') {
          searchQuery = 'spa wellness massage beauty salon';
        } else if (category === 'Shopping') {
          searchQuery = 'store shop mall market';
        } else if (category === 'Entertainment') {
          searchQuery = 'entertainment attraction activity';
        }
        
        // Get businesses from Google Places with category-specific search
        const places = await googlePlacesService.searchBusinessesByText(
          searchQuery,
          location.lat,
          location.lng,
          radius
        );

        // [2024-12-19 17:00 UTC] - Apply STRICT category filtering to exclude non-restaurants
        const filteredPlaces = places.filter(place => {
          console.log(`🔍 Checking business: ${place.name}, types: ${place.types.join(', ')}`);
          
          if (category === 'Restaurants') {
            // Must have restaurant-related types
            const hasRestaurantType = place.types.some(type => 
              ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery'].includes(type)
            );
            
            // Must NOT have non-restaurant types
            const hasNonRestaurantType = place.types.some(type => 
              ['lodging', 'spa', 'beauty_salon', 'tourist_attraction', 'amusement_park', 
               'hotel', 'resort', 'gym', 'health', 'hospital', 'store', 'shopping_mall'].includes(type)
            );
            
            const isRestaurant = hasRestaurantType && !hasNonRestaurantType;
            console.log(`🍽️ ${place.name} - hasRestaurantType: ${hasRestaurantType}, hasNonRestaurantType: ${hasNonRestaurantType}, isRestaurant: ${isRestaurant}`);
            return isRestaurant;
            
          } else if (category === 'Wellness') {
            const isWellness = place.types.some(type => 
              ['spa', 'beauty_salon', 'health', 'gym', 'physiotherapist'].includes(type)
            );
            console.log(`💆 ${place.name} is wellness: ${isWellness}`);
            return isWellness;
            
          } else if (category === 'Shopping') {
            const isShopping = place.types.some(type => 
              ['store', 'shopping_mall', 'clothing_store', 'electronics_store', 'supermarket'].includes(type)
            );
            console.log(`🛍️ ${place.name} is shopping: ${isShopping}`);
            return isShopping;
            
          } else if (category === 'Entertainment') {
            const isEntertainment = place.types.some(type => 
              ['tourist_attraction', 'amusement_park', 'night_club', 'entertainment', 'movie_theater'].includes(type)
            );
            console.log(`🎯 ${place.name} is entertainment: ${isEntertainment}`);
            return isEntertainment;
          }
          
          return false; // Default to false for strict filtering
        });

        result.discovered += filteredPlaces.length;
        console.log(`📊 Found ${filteredPlaces.length} ${category} businesses after filtering`);

        for (const place of filteredPlaces) {
          try {
            console.log(`\n🔍 Processing business: ${place.name}`);
            console.log(`   📍 Location: ${place.vicinity}`);
            console.log(`   🏷️ Types: ${place.types.join(', ')}`);
            console.log(`   ⭐ Rating: ${place.rating || 'N/A'}`);
            console.log(`   💰 Price Level: ${place.price_level || 'N/A'}`);
            
            // Check for duplicates
            let isDuplicate = false;
            try {
              console.log(`   🔍 Checking for duplicates with google_place_id: ${place.place_id}`);
              const { data: existingBusiness, error: duplicateError } = await supabase
                .from('suggested_businesses')
                .select('id, name, curation_status')
                .eq('google_place_id', place.place_id)
                .maybeSingle();

              if (duplicateError) {
                console.log(`   ⚠️ Duplicate check failed for ${place.name}:`, duplicateError.message);
              } else if (existingBusiness) {
                isDuplicate = true;
                console.log(`   ❌ DUPLICATE FOUND: ${place.name} already exists with status: ${existingBusiness.curation_status}`);
              } else {
                console.log(`   ✅ No duplicate found - proceeding with ${place.name}`);
              }
            } catch (error) {
              console.log(`   ⚠️ Duplicate check error for ${place.name}:`, error);
            }

            if (isDuplicate) {
              console.log(`   ⏭️ SKIPPING DUPLICATE: ${place.name}`);
              result.duplicates++;
              continue;
            }

            // Apply quality filters
            console.log(`   🎯 Applying quality filters...`);
            if (!this.passesQualityFilters(place, filters)) {
              console.log(`   ❌ FAILED QUALITY FILTERS: ${place.name}`);
              continue;
            }

            // [2024-12-19 18:00 UTC] - Always fetch detailed contact information
            console.log(`   📞 Fetching detailed contact info for: ${place.name}`);
            const details = await googlePlacesService.getPlaceDetails(place.place_id);
            
            // Calculate quality score
            const qualityScore = this.calculateQualityScore(place);
            console.log(`   📊 Quality score calculated: ${qualityScore}`);

            // [2024-12-19 18:00 UTC] - Generate comprehensive business description
            const description = this.generateBusinessDescription(place, details);

            // [2024-12-19 18:00 UTC] - Enhanced business data with all available contact details
            const businessData = {
              google_place_id: place.place_id,
              name: place.name,
              address: details?.formatted_address || place.vicinity,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              phone: details?.formatted_phone_number || null,
              website_url: details?.website || null,
              google_rating: place.rating || null,
              google_review_count: details?.user_ratings_total || 0,
              google_price_level: place.price_level || null,
              google_types: place.types,
              primary_category: category,
              quality_score: qualityScore,
              curation_status: 'pending',
              discovery_source: 'automated_discovery',
              discovery_criteria: {
                location: location,
                category: category,
                radius: radius,
                filters: filters,
                discoveredAt: new Date().toISOString()
              }
            };

            console.log(`   📋 Business data prepared for insertion:`, {
              name: businessData.name,
              phone: businessData.phone || 'NOT AVAILABLE',
              website: businessData.website_url || 'NOT AVAILABLE',
              quality_score: businessData.quality_score
            });

            // Insert into database
            console.log(`   💾 INSERTING: ${place.name} into suggested_businesses table`);
            console.log(`      📊 Data: Category=${category}, Rating=${place.rating}, Types=${place.types.join(', ')}`);
            
            const { data: insertResult, error } = await supabase
              .from('suggested_businesses')
              .insert(businessData)
              .select('id, name');
            
            if (error) {
              console.error(`   ❌ INSERT FAILED for ${place.name}:`, error.message);
              console.error(`   📋 Error details:`, error);
              result.errors.push(`${place.name}: ${error.message}`);
            } else {
              result.added++;
              console.log(`   ✅ INSERT SUCCESS: ${place.name} added with ID=${insertResult?.[0]?.id}`);
              console.log(`      📊 Total added so far: ${result.added}`);
            }

          } catch (error) {
            console.error(`   💥 PROCESSING ERROR for ${place.name}:`, error);
            result.errors.push(`Error processing ${place.name}: ${error}`);
          }
        }
      }

      console.log('📊 Discovery Results:', result);
      return result;

    } catch (error) {
      console.error('💥 Discovery error:', error);
      result.errors.push(`Discovery error: ${error}`);
      return result;
    }
  }

  // Check if a place passes quality filters
  private passesQualityFilters(place: any, filters: DiscoveryFilters): boolean {
    console.log(`     🔍 Quality check for ${place.name}:`);
    console.log(`       ⭐ Rating: ${place.rating || 'N/A'} (min required: ${filters.minRating || 'none'})`);
    console.log(`       📝 Review count: ${place.user_ratings_total || 'N/A'} (min required: ${filters.minReviewCount || 'none'})`);
    console.log(`       💰 Price level: ${place.price_level || 'N/A'}`);
    console.log(`       🏷️ Types: ${place.types.join(', ')}`);
    
    // Check minimum rating
    if (filters.minRating && place.rating && place.rating < filters.minRating) {
      console.log(`       ❌ FAILED rating check: ${place.rating} < ${filters.minRating}`);
      return false;
    }

    // Check minimum review count - be more lenient
    if (filters.minReviewCount && place.user_ratings_total && place.user_ratings_total < filters.minReviewCount) {
      console.log(`       ❌ FAILED review count check: ${place.user_ratings_total} < ${filters.minReviewCount}`);
      return false;
    }

    // Check required types
    if (filters.requiredTypes && filters.requiredTypes.length > 0) {
      const hasRequiredType = filters.requiredTypes.some(type => 
        place.types.includes(type)
      );
      if (!hasRequiredType) {
        console.log(`       ❌ FAILED required types check. Required: ${filters.requiredTypes.join(', ')}, Has: ${place.types.join(', ')}`);
        return false;
      } else {
        console.log(`       ✅ PASSED required types check`);
      }
    }

    // Check excluded types
    if (filters.excludedTypes && filters.excludedTypes.length > 0) {
      const hasExcludedType = filters.excludedTypes.some(type => 
        place.types.includes(type)
      );
      if (hasExcludedType) {
        console.log(`       ❌ FAILED excluded types check. Has excluded type: ${place.types.join(', ')}`);
        return false;
      } else {
        console.log(`       ✅ PASSED excluded types check`);
      }
    }

    // Check price level
    if (filters.priceLevel && filters.priceLevel.length > 0) {
      if (place.price_level && !filters.priceLevel.includes(place.price_level)) {
        console.log(`       ❌ FAILED price level check: ${place.price_level} not in ${filters.priceLevel.join(', ')}`);
        return false;
      }
    }

    console.log(`       ✅ PASSED all quality filters`);
    return true;
  }

  // Calculate quality score (0-100)
  private calculateQualityScore(place: any): number {
    let score = 0;

    // Rating component (0-40 points)
    if (place.rating) {
      score += Math.min(place.rating * 8, 40);
    }

    // Review count component (0-25 points) - estimated since we don't have exact count
    const estimatedReviews = place.rating ? Math.max(place.rating * 20, 10) : 10;
    score += Math.min(estimatedReviews / 4, 25);

    // Business status component (0-15 points)
    if (place.business_status === 'OPERATIONAL') {
      score += 15;
    }

    // Type relevance component (0-10 points)
    const importantTypes = ['restaurant', 'spa', 'store', 'cafe', 'shopping_mall'];
    if (place.types.some((type: string) => importantTypes.includes(type))) {
      score += 10;
    }

    // Price level component (0-10 points) - having a price level is good
    if (place.price_level) {
      score += 10;
    }

    return Math.round(Math.min(score, 100));
  }

  // Create a new discovery campaign
  async createDiscoveryCampaign(campaignData: {
    name: string;
    description?: string;
    targetLocation: string;
    centerLatitude: number;
    centerLongitude: number;
    searchRadius: number;
    targetCategories: string[];
    qualityFilters: DiscoveryFilters;
    runFrequency: string;
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('discovery_campaigns')
        .insert({
          name: campaignData.name,
          description: campaignData.description,
          target_location: campaignData.targetLocation,
          center_latitude: campaignData.centerLatitude,
          center_longitude: campaignData.centerLongitude,
          search_radius: campaignData.searchRadius,
          target_categories: campaignData.targetCategories,
          quality_filters: campaignData.qualityFilters,
          run_frequency: campaignData.runFrequency,
          campaign_status: 'active',
          next_run_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating discovery campaign:', error);
      return null;
    }
  }

  // Generate comprehensive business description based on available data
  private generateBusinessDescription(place: any, details?: any): string {
    const parts = [];
    
    // Add category-specific description
    if (place.types.includes('restaurant')) {
      parts.push('Restaurant serving delicious local and international cuisine');
    } else if (place.types.includes('cafe')) {
      parts.push('Cozy cafe perfect for coffee and light meals');
    } else if (place.types.includes('spa')) {
      parts.push('Relaxing spa offering wellness and beauty treatments');
    } else if (place.types.includes('store') || place.types.includes('shopping_mall')) {
      parts.push('Local store offering quality products and services');
    } else if (place.types.includes('tourist_attraction')) {
      parts.push('Popular attraction offering entertainment and experiences');
    } else {
      parts.push('Local business serving the community');
    }

    // Add rating info
    if (place.rating) {
      if (place.rating >= 4.5) {
        parts.push(`Highly rated with ${place.rating}/5 stars`);
      } else if (place.rating >= 4.0) {
        parts.push(`Well-rated with ${place.rating}/5 stars`);
      } else {
        parts.push(`Rated ${place.rating}/5 stars`);
      }
    }

    // Add price level info
    if (place.price_level) {
      const priceText = place.price_level === 1 ? 'Budget-friendly pricing' :
                       place.price_level === 2 ? 'Moderately priced' :
                       place.price_level === 3 ? 'Upscale establishment' : 
                       'Fine dining experience';
      parts.push(priceText);
    }

    // Add operational status
    if (details?.business_status === 'OPERATIONAL') {
      parts.push('Currently operational and serving customers');
    }

    // Add location context
    parts.push('Located in the heart of Hua Hin');

    return parts.join('. ') + '.';
  }

  // [2025-01-06 12:15 UTC] - Clear search history when pipeline is critically low
  private clearSearchHistory(): void {
    console.log('🧹 Clearing search history to allow fresh discovery');
    this.searchHistory.clear();
  }

  // [2024-12-19 19:30 UTC] - Intelligent pipeline system with force option
  async maintainPipelineQueue(category: string = 'Restaurants', forceDiscovery: boolean = false): Promise<DiscoveryResult> {
    console.log(`🧠 INTELLIGENT PIPELINE: Maintaining queue for ${category} (force: ${forceDiscovery})`);
    
    // Step 1: Check current pipeline status
    const currentPending = await this.getCurrentPendingCount();
    console.log(`📊 Current pending businesses: ${currentPending}`);
    
    // [2025-01-06 12:15 UTC] - Clear search history if pipeline is critically low
    if (currentPending < 5) {
      console.log(`🚨 CRITICAL: Only ${currentPending} pending businesses - clearing search history for fresh discovery`);
      this.clearSearchHistory();
    }
    
    if (!forceDiscovery && currentPending >= this.pipelineConfig.minPendingBusinesses) {
      console.log(`✅ Pipeline healthy: ${currentPending} >= ${this.pipelineConfig.minPendingBusinesses} (minimum)`);
      return { discovered: 0, added: 0, duplicates: 0, errors: ['Pipeline queue sufficient - use force option to discover anyway'] };
    }
    
    if (forceDiscovery) {
      console.log(`🔄 FORCED Discovery: User manually triggered ${category} discovery`);
      // Also clear search history for forced discovery to ensure fresh results
      this.clearSearchHistory();
    } else {
      console.log(`🔄 Pipeline needs refill: ${currentPending} < ${this.pipelineConfig.minPendingBusinesses} (minimum)`);
    }
    
    // Step 2: Intelligent discovery with location and category fallbacks
    return await this.intelligentDiscovery(category);
  }

  // Get current pending business count
  private async getCurrentPendingCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('suggested_businesses')
        .select('*', { count: 'exact', head: true })
        .eq('curation_status', 'pending');
      
      if (error) {
        console.error('Error getting pending count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getCurrentPendingCount:', error);
      return 0;
    }
  }

  // Intelligent discovery with automatic fallbacks
  private async intelligentDiscovery(category: string): Promise<DiscoveryResult> {
    const result: DiscoveryResult = { discovered: 0, added: 0, duplicates: 0, errors: [] };
    
    // [2024-12-19 20:00 UTC] - STRICT LIMITS to prevent excessive API calls
    let apiCallCount = 0;
    const maxApiCalls = this.pipelineConfig.maxApiCallsPerSession;
    
    console.log(`🚨 DISCOVERY LIMITS: Max ${maxApiCalls} API calls, max ${this.pipelineConfig.maxTotalDiscovered} businesses`);
    
    // Step 1: Try category-specific searches with location intelligence
    const categoryQueries = this.getCategoryQueries(category);
    const locations = this.pipelineConfig.locationFallbacks
      .sort((a, b) => a.priority - b.priority)
      .slice(0, this.pipelineConfig.maxLocationsToSearch); // LIMIT: Only top 3 locations
    
    console.log(`📍 Searching ${locations.length} locations with max ${this.pipelineConfig.maxQueriesPerLocation} queries each`);
    
    // [2025-01-06 12:30 UTC] - Track if we're finding only duplicates
    let consecutiveDuplicateSearches = 0;
    
    for (const location of locations) {
      if (result.added >= this.pipelineConfig.targetPendingBusinesses) {
        console.log(`🎯 Target reached: ${result.added} businesses added`);
        break;
      }
      
      if (result.discovered >= this.pipelineConfig.maxTotalDiscovered) {
        console.log(`🚨 Discovery limit reached: ${result.discovered} businesses discovered`);
        result.errors.push(`Discovery stopped at limit: ${this.pipelineConfig.maxTotalDiscovered} businesses`);
        break;
      }
      
      if (apiCallCount >= maxApiCalls) {
        console.log(`🚨 API call limit reached: ${apiCallCount}/${maxApiCalls} calls made`);
        result.errors.push(`API call limit reached: ${maxApiCalls} calls`);
        break;
      }
      
      // LIMIT: Only use first 2 queries per location
      const limitedQueries = categoryQueries.slice(0, this.pipelineConfig.maxQueriesPerLocation);
      
      for (const query of limitedQueries) {
        if (apiCallCount >= maxApiCalls) {
          console.log(`🚨 API call limit reached during query loop`);
          break;
        }
        
        const searchKey = `${location.name}-${query}`;
        
        // Skip if searched recently (within 1 hour)
        if (this.wasSearchedRecently(searchKey)) {
          console.log(`⏭️ Skipping recent search: ${searchKey}`);
          continue;
        }
        
        console.log(`🔍 API Call ${apiCallCount + 1}/${maxApiCalls}: "${query}" near ${location.name}`);
        
        // [2025-01-06 12:30 UTC] - Expand radius if finding only duplicates
        let radius = 5000; // Start with 5km
        if (consecutiveDuplicateSearches >= 3) {
          radius = 10000; // Expand to 10km
          console.log(`🔄 Expanding search radius to ${radius}m due to duplicate saturation`);
        }
        if (consecutiveDuplicateSearches >= 6) {
          radius = 15000; // Expand to 15km
          console.log(`🔄 Further expanding search radius to ${radius}m`);
        }
        
        apiCallCount++;
        
        const places = await googlePlacesService.searchBusinessesByText(
          query,
          location.lat,
          location.lng,
          radius
        );
        
        console.log(`📍 ${location.name} (${radius}m): Found ${places.length} places`);
        
        if (places.length === 0) {
          console.log(`❌ No results for ${query} near ${location.name}`);
          continue;
        }
        
        // Mark this search as completed
        this.markSearchCompleted(searchKey);
        
        // Process businesses with intelligent filtering
        const processed = await this.processBusinessesIntelligently(places, category, location.name);
        result.discovered += processed.discovered;
        result.added += processed.added;
        result.duplicates += processed.duplicates;
        result.errors.push(...processed.errors);
        
        // [2025-01-06 12:30 UTC] - Track consecutive duplicate searches
        if (processed.added === 0 && processed.discovered > 0) {
          consecutiveDuplicateSearches++;
          console.log(`⚠️ No new businesses added (${consecutiveDuplicateSearches} consecutive duplicate searches)`);
        } else if (processed.added > 0) {
          consecutiveDuplicateSearches = 0; // Reset counter when we find new businesses
        }
        
        console.log(`📊 Progress: ${result.discovered} discovered, ${result.added} added (API calls: ${apiCallCount}/${maxApiCalls})`);
        
        if (result.added >= this.pipelineConfig.targetPendingBusinesses) {
          console.log(`🎯 Target reached: ${result.added} businesses added`);
          return result;
        }
        
        if (result.discovered >= this.pipelineConfig.maxTotalDiscovered) {
          console.log(`🚨 Discovery limit reached: ${result.discovered} businesses discovered`);
          result.errors.push(`Discovery stopped at limit: ${this.pipelineConfig.maxTotalDiscovered} businesses`);
          return result;
        }
      }
    }

    // Step 2: If still not enough and finding only duplicates, try expanded area search
    if (result.added < 5 && apiCallCount < maxApiCalls && consecutiveDuplicateSearches >= 3) {
      console.log(`🌍 EXPANDING SEARCH: Local area saturated, searching wider region...`);
      const expandedResult = await this.expandedAreaSearch(category, maxApiCalls - apiCallCount);
      result.discovered += expandedResult.discovered;
      result.added += expandedResult.added;
      result.duplicates += expandedResult.duplicates;
      result.errors.push(...expandedResult.errors);
    }

    // Step 3: If still not enough, try relaxed category filtering
    else if (result.added < 5 && apiCallCount < maxApiCalls) {
      console.log(`⚠️ Low results (${result.added}), trying relaxed category filtering...`);
      const relaxedResult = await this.relaxedCategorySearch(category);
      result.discovered += relaxedResult.discovered;
      result.added += relaxedResult.added;
      result.duplicates += relaxedResult.duplicates;
      result.errors.push(...relaxedResult.errors);
    }
    
    console.log(`📊 Intelligent Discovery Complete: ${apiCallCount} API calls made`);
    console.log(`📊 Final Results:`, result);
    return result;
  }

  // Get category-specific search queries
  private getCategoryQueries(category: string): string[] {
    const queryMap: { [key: string]: string[] } = {
      'Restaurants': [
        // Tier 1 - Essential searches for Thai coastal areas
        'thai traditional restaurant',
        'fresh seafood restaurant',
        'street food vendor',
        'chinese thai restaurant',
        'international restaurant',
        
        // Tier 2 - Important cuisines
        'indian restaurant',
        'japanese restaurant', 
        'italian restaurant',
        'fusion restaurant',
        'bbq grill restaurant',
        
        // Tier 3 - Growing market
        'korean restaurant',
        'vietnamese restaurant',
        'halal restaurant',
        'vegetarian vegan restaurant',
        'cafe coffee shop',
        
        // Dining style searches
        'beachfront restaurant',
        'waterfront dining',
        'night market food',
        'food court',
        'fine dining',
        'casual dining',
        
        // Legacy/additional terms
        'restaurant',
        'thai restaurant',
        'seafood restaurant', 
        'local restaurant',
        'noodle shop',
        'barbecue grill',
        'pizza restaurant',
        'chinese restaurant',
        'western restaurant',
        'buffet restaurant',
        'family restaurant',
        'local food',
        'authentic thai food',
        'grilled fish',
        'som tam restaurant',
        'pad thai restaurant',
        'curry restaurant'
      ],
      'Wellness': [
        'spa massage',
        'beauty salon',
        'wellness center',
        'fitness gym',
        'yoga studio'
      ],
      'Shopping': [
        'shopping mall',
        'local market',
        'clothing store',
        'souvenir shop',
        'convenience store'
      ],
      'Entertainment': [
        'tourist attraction',
        'entertainment',
        'night market',
        'cultural site',
        'recreation'
      ]
    };
    
    return queryMap[category] || ['business', 'establishment'];
  }

  // Check if search was done recently
  private wasSearchedRecently(searchKey: string): boolean {
    const lastSearch = this.searchHistory.get(searchKey);
    if (!lastSearch) return false;
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastSearch > oneHourAgo;
  }

  // Mark search as completed
  private markSearchCompleted(searchKey: string): void {
    this.searchHistory.set(searchKey, new Date());
  }

  // Process businesses with intelligent filtering
  private async processBusinessesIntelligently(
    places: any[], 
    category: string, 
    locationName: string
  ): Promise<DiscoveryResult> {
    const result: DiscoveryResult = { discovered: 0, added: 0, duplicates: 0, errors: [] };
    
    // Apply intelligent filtering based on category
    const filteredPlaces = this.applyIntelligentFiltering(places, category);
    result.discovered = filteredPlaces.length;
    
    console.log(`🧠 Intelligent filtering: ${places.length} → ${filteredPlaces.length} businesses`);
    
    for (const place of filteredPlaces) {
      try {
        // Check for duplicates (by google_place_id and similar names)
        const isDuplicate = await this.checkForDuplicates(place);
        if (isDuplicate) {
          result.duplicates++;
          continue;
        }
        
        // Get detailed information
        const details = await googlePlacesService.getPlaceDetails(place.place_id);
        
        // Create business data
        const businessData = {
          google_place_id: place.place_id,
          name: place.name,
          address: details?.formatted_address || place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          phone: details?.formatted_phone_number || null,
          website_url: details?.website || null,
          google_rating: place.rating || null,
          google_review_count: details?.user_ratings_total || 0,
          google_price_level: place.price_level || null,
          google_types: place.types,
          primary_category: category,
          quality_score: this.calculateQualityScore(place),
          curation_status: 'pending',
          discovery_source: 'intelligent_pipeline',
          discovery_criteria: {
            location: locationName,
            category: category,
            discoveredAt: new Date().toISOString(),
            pipelineVersion: '2.0'
          }
        };
        
        // Insert into database
        console.log(`   💾 INSERTING: ${place.name} into suggested_businesses table`);
        console.log(`      📊 Data: Category=${category}, Rating=${place.rating}, Types=${place.types.join(', ')}`);
        
        const { data: insertResult, error } = await supabase
          .from('suggested_businesses')
          .insert(businessData)
          .select('id, name');
        
        if (error) {
          console.error(`   ❌ INSERT FAILED for ${place.name}:`, error.message);
          console.error(`   📋 Error details:`, error);
          result.errors.push(`${place.name}: ${error.message}`);
        } else {
          result.added++;
          console.log(`   ✅ INSERT SUCCESS: ${place.name} added with ID=${insertResult?.[0]?.id}`);
          console.log(`      📊 Total added so far: ${result.added}`);
        }
        
      } catch (error) {
        console.error(`💥 Error processing ${place.name}:`, error);
        result.errors.push(`${place.name}: ${error}`);
      }
    }
    
    return result;
  }

  // Apply intelligent filtering based on category
  private applyIntelligentFiltering(places: any[], category: string): any[] {
    console.log(`🔍 FILTERING: Applying strict ${category} filtering to ${places.length} places`);
    
    return places.filter(place => {
      console.log(`   🏪 Checking: ${place.name} - Types: ${place.types.join(', ')}`);
      
      if (category === 'Restaurants') {
        // STRICT restaurant filtering - must have food-related type
        const foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
        const hasFoodType = place.types.some((type: string) => foodTypes.includes(type));
        
        // STRICT exclusion of non-food businesses
        const nonFoodTypes = [
          'lodging', 'hospital', 'bank', 'gas_station', 'car_repair', 'pharmacy',
          'clothing_store', 'electronics_store', 'jewelry_store', 'shoe_store',
          'book_store', 'furniture_store', 'home_goods_store', 'hardware_store',
          'beauty_salon', 'hair_care', 'spa', 'gym', 'dentist', 'doctor',
          'lawyer', 'real_estate_agency', 'insurance_agency', 'travel_agency',
          'tourist_attraction', 'amusement_park', 'zoo', 'museum',
          'school', 'university', 'library', 'church', 'mosque', 'temple',
          'post_office', 'police', 'fire_station', 'government_office',
          'atm', 'storage', 'moving_company', 'taxi_stand', 'bus_station',
          'subway_station', 'train_station', 'airport', 'parking',
          'car_dealer', 'car_rental', 'car_wash', 'bicycle_store',
          'pet_store', 'veterinary_care', 'florist', 'funeral_home',
          'laundry', 'dry_cleaning', 'locksmith', 'plumber', 'electrician'
        ];
        
        const hasNonFoodType = place.types.some((type: string) => nonFoodTypes.includes(type));
        
        // Must have food type AND not have non-food type
        const isRestaurant = hasFoodType && !hasNonFoodType;
        
        console.log(`     🍽️ Food type: ${hasFoodType ? '✅' : '❌'} | Non-food type: ${hasNonFoodType ? '❌' : '✅'} | Result: ${isRestaurant ? 'ACCEPT' : 'REJECT'}`);
        
        return isRestaurant;
      }
      
      if (category === 'Wellness') {
        const wellnessTypes = ['spa', 'beauty_salon', 'hair_care', 'gym', 'physiotherapist', 'dentist', 'doctor'];
        const hasWellnessType = place.types.some((type: string) => wellnessTypes.includes(type));
        console.log(`     💆 Wellness check: ${hasWellnessType ? 'ACCEPT' : 'REJECT'}`);
        return hasWellnessType;
      }
      
      if (category === 'Shopping') {
        const shoppingTypes = [
          'shopping_mall', 'store', 'clothing_store', 'electronics_store', 
          'jewelry_store', 'shoe_store', 'book_store', 'furniture_store',
          'home_goods_store', 'hardware_store', 'convenience_store'
        ];
        const hasShoppingType = place.types.some((type: string) => shoppingTypes.includes(type));
        console.log(`     🛍️ Shopping check: ${hasShoppingType ? 'ACCEPT' : 'REJECT'}`);
        return hasShoppingType;
      }
      
      if (category === 'Entertainment') {
        const entertainmentTypes = [
          'tourist_attraction', 'amusement_park', 'zoo', 'museum', 
          'night_club', 'bar', 'movie_theater', 'bowling_alley'
        ];
        const hasEntertainmentType = place.types.some((type: string) => entertainmentTypes.includes(type));
        console.log(`     🎭 Entertainment check: ${hasEntertainmentType ? 'ACCEPT' : 'REJECT'}`);
        return hasEntertainmentType;
      }
      
      // Default: reject unknown categories
      console.log(`     ❓ Unknown category: REJECT`);
      return false;
    });
  }

  // Check for duplicates
  private async checkForDuplicates(place: any): Promise<boolean> {
    try {
      console.log(`   🔍 DUPLICATE CHECK: ${place.name} (${place.place_id})`);
      
      const { data: existing, error } = await supabase
        .from('suggested_businesses')
        .select('id, name, curation_status, created_at')
        .eq('google_place_id', place.place_id)
        .maybeSingle();
      
      if (error) {
        console.log(`   ⚠️ Duplicate check error for ${place.name}:`, error.message);
        return false;
      }
      
      if (existing) {
        console.log(`   ❌ DUPLICATE FOUND: ${place.name} already exists in database`);
        console.log(`      📊 Existing: ID=${existing.id}, Status=${existing.curation_status}, Created=${existing.created_at}`);
        return true;
      } else {
        console.log(`   ✅ NO DUPLICATE: ${place.name} is NEW - proceeding to add`);
        return false;
      }
    } catch (error) {
      console.error(`   💥 Duplicate check error for ${place.name}:`, error);
      return false; // Assume not duplicate if check fails
    }
  }

  // Relaxed category search as fallback - MUCH MORE STRICT
  private async relaxedCategorySearch(category: string): Promise<DiscoveryResult> {
    console.log(`🔄 Attempting STRICT relaxed search for ${category}...`);
    
    if (category === 'Restaurants') {
      // For restaurants, search specifically for food establishments
      const places = await googlePlacesService.searchBusinessesByText(
        'restaurant food dining',
        12.5684, // Hua Hin center
        99.9578,
        8000 // 8km radius
      );
      
      // Apply the same strict filtering
      const restaurantBusinesses = this.applyIntelligentFiltering(places, 'Restaurants');
      console.log(`🔄 Relaxed restaurant search: ${places.length} → ${restaurantBusinesses.length} after filtering`);
      
      return await this.processBusinessesIntelligently(restaurantBusinesses.slice(0, 5), category, 'Strict Relaxed Search');
    }
    
    // For other categories, return empty result rather than accepting random businesses
    console.log(`🔄 No relaxed search implemented for ${category} - returning empty result`);
    return { discovered: 0, added: 0, duplicates: 0, errors: [`No relaxed search available for ${category}`] };
  }

  // Updated main discovery function to use intelligent pipeline
  async runHuaHinRestaurantDiscovery(): Promise<DiscoveryResult> {
    console.log('🧠 Starting Intelligent Restaurant Discovery Pipeline...');
    return await this.maintainPipelineQueue('Restaurants');
  }

  // Run discovery for multiple categories in Hua Hin
  async runMultiCategoryDiscovery(): Promise<DiscoveryResult> {
    const huaHinLocation = { lat: 12.5684, lng: 99.9578 }; // Hua Hin coordinates
    const categories = ['Restaurants', 'Wellness', 'Shopping'];
    const filters: DiscoveryFilters = {
      minRating: 4.0,
      minReviewCount: 20
    };

    return this.runDiscoveryForLocation(huaHinLocation, categories, 3000, filters);
  }

  // Run discovery for Hua Hin wellness/spa businesses
  async runHuaHinWellnessDiscovery(): Promise<DiscoveryResult> {
    const huaHinLocation = { lat: 12.5684, lng: 99.9578 }; // Hua Hin coordinates
    const categories = ['Wellness'];
    const filters: DiscoveryFilters = {
      minRating: 4.0,
      minReviewCount: 10
    };

    return this.runDiscoveryForLocation(huaHinLocation, categories, 3000, filters);
  }

  // Run discovery for Hua Hin shopping businesses  
  async runHuaHinShoppingDiscovery(): Promise<DiscoveryResult> {
    const huaHinLocation = { lat: 12.5684, lng: 99.9578 }; // Hua Hin coordinates
    const categories = ['Shopping'];
    const filters: DiscoveryFilters = {
      minRating: 3.8,
      minReviewCount: 5
    };

    return this.runDiscoveryForLocation(huaHinLocation, categories, 4000, filters);
  }

  // Run discovery for Hua Hin entertainment/attractions
  async runHuaHinEntertainmentDiscovery(): Promise<DiscoveryResult> {
    const huaHinLocation = { lat: 12.5684, lng: 99.9578 }; // Hua Hin coordinates
    const categories = ['Entertainment'];
    const filters: DiscoveryFilters = {
      minRating: 4.2,
      minReviewCount: 20
    };

    return this.runDiscoveryForLocation(huaHinLocation, categories, 5000, filters);
  }

  // [2025-01-06 12:30 UTC] - Expanded area search when local area is saturated
  private async expandedAreaSearch(category: string, remainingApiCalls: number): Promise<DiscoveryResult> {
    const result: DiscoveryResult = { discovered: 0, added: 0, duplicates: 0, errors: [] };
    
    // Expanded search locations - further from Hua Hin
    const expandedLocations = [
      { name: 'Cha-am Beach', lat: 12.8000, lng: 99.9667, priority: 1 },
      { name: 'Pranburi District', lat: 12.3900, lng: 99.9100, priority: 1 },
      { name: 'Khao Sam Roi Yot', lat: 12.2000, lng: 99.9500, priority: 2 },
      { name: 'Kui Buri', lat: 12.0833, lng: 99.8500, priority: 2 },
      { name: 'Bang Saphan', lat: 11.2167, lng: 99.5167, priority: 3 },
      { name: 'Chumphon', lat: 10.4930, lng: 99.1800, priority: 3 }
    ];
    
    console.log(`🌍 Searching ${expandedLocations.length} expanded locations with ${remainingApiCalls} API calls remaining`);
    
    let apiCallCount = 0;
    const categoryQueries = this.getCategoryQueries(category);
    
    for (const location of expandedLocations) {
      if (apiCallCount >= remainingApiCalls) {
        console.log(`🚨 Expanded search API limit reached`);
        break;
      }
      
      if (result.added >= 10) { // Lower target for expanded search
        console.log(`🎯 Expanded search target reached: ${result.added} businesses added`);
        break;
      }
      
      // Use only the first query for expanded locations to conserve API calls
      const query = categoryQueries[0];
      const searchKey = `expanded-${location.name}-${query}`;
      
      if (this.wasSearchedRecently(searchKey)) {
        console.log(`⏭️ Skipping recent expanded search: ${searchKey}`);
        continue;
      }
      
      console.log(`🌍 Expanded API Call ${apiCallCount + 1}/${remainingApiCalls}: "${query}" near ${location.name}`);
      
      apiCallCount++;
      const radius = 8000; // 8km radius for expanded search
      
      const places = await googlePlacesService.searchBusinessesByText(
        query,
        location.lat,
        location.lng,
        radius
      );
      
      console.log(`🌍 ${location.name} (${radius}m): Found ${places.length} places`);
      
      if (places.length === 0) {
        console.log(`❌ No results in expanded area: ${location.name}`);
        continue;
      }
      
      this.markSearchCompleted(searchKey);
      
      // Process with same intelligent filtering
      const processed = await this.processBusinessesIntelligently(places, category, location.name);
      result.discovered += processed.discovered;
      result.added += processed.added;
      result.duplicates += processed.duplicates;
      result.errors.push(...processed.errors);
      
      console.log(`🌍 Expanded Progress: ${result.discovered} discovered, ${result.added} added from ${location.name}`);
      
      if (result.added >= 10) {
        console.log(`🎯 Expanded search successful: Found ${result.added} new businesses`);
        break;
      }
    }
    
    console.log(`🌍 Expanded Area Search Complete: ${result.discovered} discovered, ${result.added} added`);
    return result;
  }

  // [2024-12-19 20:15 UTC] - Manual business search functionality
  async searchBusinessByName(query: string, location?: { lat: number; lng: number }): Promise<any[]> {
    try {
      console.log('🔍 Manual search for business:', query);
      
      // Use Google Places text search
      const searchLocation = location || { lat: 12.5684, lng: 99.9578 }; // Default to Hua Hin
      
      const results = await googlePlacesService.searchBusinessesByText(
        query,
        searchLocation.lat,
        searchLocation.lng,
        10000 // 10km radius for manual search
      );
      
      console.log(`🔍 Found ${results.length} results for "${query}"`);
      
      // Get detailed information for each result
      const detailedResults = [];
      for (const place of results.slice(0, 5)) { // Limit to top 5 results
        try {
          const details = await googlePlacesService.getPlaceDetails(place.place_id);
          detailedResults.push({
            ...place,
            ...details,
            formatted_phone_number: details?.formatted_phone_number,
            website: details?.website,
            opening_hours: details?.opening_hours
          });
        } catch (error) {
          console.error(`Error getting details for ${place.name}:`, error);
          detailedResults.push(place); // Add without details if details fail
        }
      }
      
      return detailedResults;
      
    } catch (error) {
      console.error('Manual search error:', error);
      throw error;
    }
  }

  // [2024-12-19 20:15 UTC] - Add manually searched business to pipeline
  async addManualBusiness(businessData: any): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('➕ Adding manual business to pipeline:', businessData.name);
      
      // Check for duplicates first
      const { data: existingBusiness } = await supabase
        .from('suggested_businesses')
        .select('id, name')
        .eq('google_place_id', businessData.google_place_id)
        .maybeSingle();
      
      if (existingBusiness) {
        return {
          success: false,
          error: `Business "${businessData.name}" is already in the pipeline`
        };
      }
      
      // Determine primary category based on Google types
      let primaryCategory = 'Restaurants'; // Default
      const types = businessData.google_types || [];
      
      if (types.some((type: string) => ['spa', 'beauty_salon', 'health', 'gym'].includes(type))) {
        primaryCategory = 'Wellness';
      } else if (types.some((type: string) => ['store', 'shopping_mall', 'clothing_store'].includes(type))) {
        primaryCategory = 'Shopping';
      } else if (types.some((type: string) => ['tourist_attraction', 'amusement_park', 'entertainment'].includes(type))) {
        primaryCategory = 'Entertainment';
      }
      
      // Insert into suggested_businesses table
      const { data, error } = await supabase
        .from('suggested_businesses')
        .insert({
          name: businessData.name,
          address: businessData.address,
          latitude: businessData.latitude,
          longitude: businessData.longitude,
          google_place_id: businessData.google_place_id,
          google_rating: businessData.google_rating,
          google_review_count: businessData.google_review_count,
          google_types: businessData.google_types,
          phone: businessData.phone,
          website_url: businessData.website_url,
          primary_category: primaryCategory,
          quality_score: businessData.quality_score,
          curation_status: 'pending',
          discovery_source: 'manual_search',
          discovery_criteria: businessData.discovery_criteria || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding manual business:', error);
        return {
          success: false,
          error: error.message
        };
      }
      
      console.log('✅ Manual business added successfully:', data.id);
      return { success: true };
      
    } catch (error) {
      console.error('Add manual business error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const discoveryService = new DiscoveryService();

// [2024-12-19 20:15 UTC] - Extend discoveryService with manual search methods
discoveryService.searchBusinessByName = async function(query: string, location?: { lat: number; lng: number }): Promise<any[]> {
  try {
    console.log('🔍 Manual search for business:', query);
    
    // Use Google Places text search
    const searchLocation = location || { lat: 12.5684, lng: 99.9578 }; // Default to Hua Hin
    
    const results = await googlePlacesService.searchBusinessesByText(
      query,
      searchLocation.lat,
      searchLocation.lng,
      10000 // 10km radius for manual search
    );
    
    console.log(`🔍 Found ${results.length} results for "${query}"`);
    
    // Get detailed information for each result
    const detailedResults = [];
    for (const place of results.slice(0, 5)) { // Limit to top 5 results
      try {
        const details = await googlePlacesService.getPlaceDetails(place.place_id);
        detailedResults.push({
          ...place,
          ...details,
          formatted_phone_number: details?.formatted_phone_number,
          website: details?.website,
          opening_hours: details?.opening_hours
        });
      } catch (error) {
        console.error(`Error getting details for ${place.name}:`, error);
        detailedResults.push(place); // Add without details if details fail
      }
    }
    
    return detailedResults;
    
  } catch (error) {
    console.error('Manual search error:', error);
    throw error;
  }
};

discoveryService.addManualBusiness = async function(businessData: any): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('➕ Adding manual business to pipeline:', businessData.name);
    
    // Check for duplicates first
    const { data: existingBusiness } = await supabase
      .from('suggested_businesses')
      .select('id, name')
      .eq('google_place_id', businessData.google_place_id)
      .maybeSingle();
    
    if (existingBusiness) {
      return {
        success: false,
        error: `Business "${businessData.name}" is already in the pipeline`
      };
    }
    
    // Determine primary category based on Google types
    let primaryCategory = 'Restaurants'; // Default
    const types = businessData.google_types || [];
    
    if (types.some((type: string) => ['spa', 'beauty_salon', 'health', 'gym'].includes(type))) {
      primaryCategory = 'Wellness';
    } else if (types.some((type: string) => ['store', 'shopping_mall', 'clothing_store'].includes(type))) {
      primaryCategory = 'Shopping';
    } else if (types.some((type: string) => ['tourist_attraction', 'amusement_park', 'entertainment'].includes(type))) {
      primaryCategory = 'Entertainment';
    }
    
    // Insert into suggested_businesses table
    const { data, error } = await supabase
      .from('suggested_businesses')
      .insert({
        name: businessData.name,
        address: businessData.address,
        latitude: businessData.latitude,
        longitude: businessData.longitude,
        google_place_id: businessData.google_place_id,
        google_rating: businessData.google_rating,
        google_review_count: businessData.google_review_count,
        google_types: businessData.google_types,
        phone: businessData.phone,
        website_url: businessData.website_url,
        primary_category: primaryCategory,
        quality_score: businessData.quality_score,
        curation_status: 'pending',
        discovery_source: 'manual_search',
        discovery_criteria: businessData.discovery_criteria || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding manual business:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('✅ Manual business added successfully:', data.id);
    return { success: true };
    
  } catch (error) {
    console.error('Add manual business error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 