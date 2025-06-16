// [2025-01-06 17:50 UTC] - Dynamic selector system based on Google Places data and real restaurant availability
import { supabase } from '../../lib/supabase';

export interface DynamicSelector {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  type: 'cuisine' | 'feature' | 'dietary' | 'dining_style';
  googlePlacesTypes?: string[];
  localPlusCuisines?: string[];
  count?: number; // Number of restaurants available
  isPopular?: boolean;
  confidence?: number; // 0-1 based on local availability
}

export interface LocationBasedSelectors {
  location: string;
  mostPopular: DynamicSelector[];
  popularChoices: DynamicSelector[];
  quickFilters: DynamicSelector[];
  lastUpdated: Date;
}

export class DynamicSelectorService {
  
  /**
   * Generate location-aware selectors based on actual restaurant data
   */
  async generateLocationSelectors(location: string): Promise<LocationBasedSelectors> {
    try {
      console.log('🎯 Generating dynamic selectors for location:', location);
      
      // Get all restaurants in location with their cuisine data
      const { data: restaurants, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('partnership_status', 'active')
        .ilike('address', `%${location}%`);

      if (error) {
        console.error('🎯 Database error in dynamic selectors:', error);
        throw error;
      }

      console.log('🏪 Found', restaurants?.length || 0, 'restaurants for dynamic selectors');
      console.log('🏪 First restaurant data:', restaurants?.[0]);

      const cuisineStats = this.analyzeCuisineDistribution(restaurants || []);
      const featureStats = this.analyzeFeatureDistribution(restaurants || []);
      
      console.log('🍽️ Cuisine stats:', Object.fromEntries(cuisineStats));
      console.log('⚡ Feature stats:', Object.fromEntries(featureStats));
      
      const result = {
        location,
        mostPopular: this.generateMostPopularSelectors(cuisineStats, location),
        popularChoices: this.generatePopularChoicesSelectors(cuisineStats),
        quickFilters: this.generateQuickFilters(featureStats, restaurants || []),
        lastUpdated: new Date()
      };
      
      console.log('🎯 Generated selectors:', result);
      return result;

    } catch (error) {
      console.error('🎯 Error generating dynamic selectors:', error);
      return this.getFallbackSelectors(location);
    }
  }

  /**
   * Analyze cuisine distribution from real restaurant data
   */
  private analyzeCuisineDistribution(restaurants: any[]) {
    const cuisineCount = new Map<string, { count: number; confidence: number; googleTypes: Set<string> }>();
    
    restaurants.forEach(restaurant => {
      // Use the existing category field as the primary cuisine type
      const category = restaurant.category;
      if (category) {
        const current = cuisineCount.get(category) || { count: 0, confidence: 0, googleTypes: new Set() };
        current.count++;
        current.confidence = Math.min(1.0, current.confidence + 0.15); // High confidence for curated data
        cuisineCount.set(category, current);
      }

      // Process Google Place types as backup if available
      const googleTypes = restaurant.google_types || [];
      googleTypes.forEach((type: string) => {
        const mapped = this.mapGoogleTypeToSelector(type);
        if (mapped && !category) { // Only use Google types if no category set
          const current = cuisineCount.get(mapped.id) || { count: 0, confidence: 0, googleTypes: new Set() };
          current.count++;
          current.googleTypes.add(type);
          current.confidence = Math.min(1.0, current.confidence + 0.05); // Lower confidence for unmapped
          cuisineCount.set(mapped.id, current);
        }
      });
    });

    return cuisineCount;
  }

  /**
   * Analyze feature distribution (beachfront, delivery, etc.)
   */
  private analyzeFeatureDistribution(restaurants: any[]) {
    const featureCount = new Map<string, number>();
    
    restaurants.forEach(restaurant => {
      // Check address for location-specific features
      const address = restaurant.address?.toLowerCase() || '';
      if (address.includes('beach') || address.includes('waterfront')) {
        featureCount.set('beachfront', (featureCount.get('beachfront') || 0) + 1);
      }
      if (address.includes('market') || address.includes('night')) {
        featureCount.set('night_market', (featureCount.get('night_market') || 0) + 1);
      }

      // Check Google types for features
      const googleTypes = restaurant.google_types || [];
      if (googleTypes.includes('meal_delivery')) {
        featureCount.set('delivery', (featureCount.get('delivery') || 0) + 1);
      }
      if (googleTypes.includes('meal_takeaway')) {
        featureCount.set('takeaway', (featureCount.get('takeaway') || 0) + 1);
      }
    });

    return featureCount;
  }

  /**
   * Generate "Most Popular in [Location]" selectors
   */
  private generateMostPopularSelectors(cuisineStats: Map<string, any>, location: string): DynamicSelector[] {
    const popular = Array.from(cuisineStats.entries())
      .filter(([_, stats]) => stats.count >= 3 && stats.confidence > 0.3) // Minimum threshold
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3) // Top 3
      .map(([cuisineId, stats]) => ({
        id: cuisineId,
        label: this.getCuisineDisplayName(cuisineId),
        description: `${stats.count} restaurants in ${location}`,
        type: 'cuisine' as const,
        count: stats.count,
        isPopular: true,
        confidence: stats.confidence,
        localPlusCuisines: [cuisineId],
        icon: this.getCuisineIcon(cuisineId)
      }));

    // Add location-specific defaults if not enough data
    if (popular.length < 3) {
      const locationDefaults = this.getLocationDefaults(location);
      locationDefaults.forEach(defaultSelector => {
        if (!popular.find(p => p.id === defaultSelector.id)) {
                     popular.push({
            ...defaultSelector,
            description: defaultSelector.description || `Available in ${location}`,
            type: 'cuisine' as const,
            count: 0,
            isPopular: true,
            confidence: defaultSelector.confidence || 0.5,
            localPlusCuisines: [defaultSelector.id],
            icon: defaultSelector.icon || '🍽️'
          });
        }
      });
    }

    return popular.slice(0, 3);
  }

  /**
   * Generate "Popular Choices" selectors
   */
  private generatePopularChoicesSelectors(cuisineStats: Map<string, any>): DynamicSelector[] {
    return Array.from(cuisineStats.entries())
      .filter(([_, stats]) => stats.count >= 1) // Any availability
      .sort((a, b) => b[1].count - a[1].count)
      .slice(3, 7) // Next 4 after most popular
      .map(([cuisineId, stats]) => ({
        id: cuisineId,
        label: this.getCuisineDisplayName(cuisineId),
        description: `${stats.count} options available`,
        type: 'cuisine' as const,
        count: stats.count,
        confidence: stats.confidence,
        localPlusCuisines: [cuisineId],
        icon: this.getCuisineIcon(cuisineId)
      }));
  }

  /**
   * Generate quick filter selectors
   */
  private generateQuickFilters(featureStats: Map<string, number>, restaurants: any[]): DynamicSelector[] {
    const filters: DynamicSelector[] = [];

    // Open now (always show if we have restaurants)
    if (restaurants.length > 0) {
      filters.push({
        id: 'open_now',
        label: 'Open Now',
        type: 'feature',
        icon: '🟢',
        count: Math.floor(restaurants.length * 0.7) // Estimate 70% open
      });
    }

    // Promotions (if we detect any promotional keywords)
    const promotionCount = restaurants.filter(r => 
      r.name?.toLowerCase().includes('special') || 
      r.description?.toLowerCase().includes('promotion')
    ).length;
    
    if (promotionCount > 0) {
      filters.push({
        id: 'current_promotions',
        label: 'Current Promotions',
        type: 'feature',
        icon: '💰',
        count: promotionCount
      });
    }

    // Beachfront (location-specific)
    const beachfrontCount = featureStats.get('beachfront') || 0;
    if (beachfrontCount > 0) {
      filters.push({
        id: 'beachfront',
        label: 'Beachfront',
        type: 'feature',
        icon: '🏖️',
        count: beachfrontCount
      });
    }

    // Delivery available
    const deliveryCount = featureStats.get('delivery') || 0;
    if (deliveryCount > 0) {
      filters.push({
        id: 'delivery',
        label: 'Delivery',
        type: 'feature',
        icon: '🛵',
        count: deliveryCount
      });
    }

    return filters.slice(0, 3); // Max 3 quick filters
  }

  /**
   * Map Google Place types to our selector system
   */
  private mapGoogleTypeToSelector(googleType: string): DynamicSelector | null {
    const mapping: Record<string, Partial<DynamicSelector>> = {
      'thai_restaurant': { id: 'thai_traditional', label: 'Thai Traditional', icon: '🍛' },
      'seafood_restaurant': { id: 'seafood_grilled', label: 'Fresh Seafood', icon: '🦐' },
      'japanese_restaurant': { id: 'japanese_sushi', label: 'Japanese', icon: '🍣' },
      'sushi_restaurant': { id: 'japanese_sushi', label: 'Sushi', icon: '🍣' },
      'italian_restaurant': { id: 'italian_pasta', label: 'Italian', icon: '🍝' },
      'pizza_restaurant': { id: 'italian_pizza', label: 'Pizza', icon: '🍕' },
      'chinese_restaurant': { id: 'chinese_cantonese', label: 'Chinese', icon: '🥢' },
      'indian_restaurant': { id: 'indian_north', label: 'Indian', icon: '🍛' },
      'korean_restaurant': { id: 'korean_bbq', label: 'Korean', icon: '🥩' },
      'vietnamese_restaurant': { id: 'vietnamese_pho', label: 'Vietnamese', icon: '🍜' },
      'cafe': { id: 'cafe_coffee', label: 'Cafe', icon: '☕' },
      'bar': { id: 'bar_cocktails', label: 'Bar', icon: '🍸' }
    };

    const mapped = mapping[googleType];
    if (!mapped) return null;

    return {
      id: mapped.id!,
      label: mapped.label!,
      icon: mapped.icon,
      type: 'cuisine',
      googlePlacesTypes: [googleType]
    } as DynamicSelector;
  }

  /**
   * Get display name for cuisine ID
   */
  private getCuisineDisplayName(cuisineId: string): string {
    const displayNames: Record<string, string> = {
      // Our actual database categories
      'Thai Traditional': 'Thai Traditional',
      'Fresh Seafood': 'Fresh Seafood',
      'Entertainment': 'Entertainment',
      'Wellness': 'Wellness',
      
      // Legacy mappings for fallbacks
      'thai_traditional': 'Thai Traditional',
      'thai_royal': 'Royal Thai',
      'thai_street_food': 'Street Food',
      'seafood_grilled': 'Fresh Seafood',
      'seafood_steamed': 'Steamed Seafood',
      'japanese_sushi': 'Japanese',
      'japanese_ramen': 'Ramen',
      'italian_pasta': 'Italian',
      'italian_pizza': 'Pizza',
      'chinese_cantonese': 'Chinese',
      'indian_north': 'Indian',
      'korean_bbq': 'Korean',
      'vietnamese_pho': 'Vietnamese',
      'cafe_coffee': 'Cafe',
      'bar_cocktails': 'Bar & Drinks'
    };
    return displayNames[cuisineId] || cuisineId;
  }

  /**
   * Get icon for cuisine
   */
  private getCuisineIcon(cuisineId: string): string {
    const icons: Record<string, string> = {
      // Our actual database categories
      'Thai Traditional': '🍛',
      'Fresh Seafood': '🦐',
      'Entertainment': '🎭',
      'Wellness': '🧘',
      
      // Legacy mappings for fallbacks
      'thai_traditional': '🍛',
      'thai_royal': '👑',
      'thai_street_food': '🍢',
      'seafood_grilled': '🦐',
      'seafood_steamed': '🐟',
      'japanese_sushi': '🍣',
      'japanese_ramen': '🍜',
      'italian_pasta': '🍝',
      'italian_pizza': '🍕',
      'chinese_cantonese': '🥢',
      'indian_north': '🍛',
      'korean_bbq': '🥩',
      'vietnamese_pho': '🍜',
      'cafe_coffee': '☕',
      'bar_cocktails': '🍸'
    };
    return icons[cuisineId] || '🍽️';
  }

  /**
   * Location-specific defaults when not enough data
   */
  private getLocationDefaults(location: string): DynamicSelector[] {
    const coastal = ['hua hin', 'pattaya', 'phuket', 'krabi', 'samui'];
    const isCoastal = coastal.some(city => location.toLowerCase().includes(city));

    if (isCoastal) {
      return [
        {
          id: 'thai_traditional',
          label: 'Thai Traditional',
          description: 'Local favorite',
          type: 'cuisine',
          icon: '🍛',
          isPopular: true,
          confidence: 0.8
        },
        {
          id: 'seafood_grilled',
          label: 'Fresh Seafood',
          description: 'Coastal specialty',
          type: 'cuisine',
          icon: '🦐',
          isPopular: true,
          confidence: 0.9
        },
        {
          id: 'thai_street_food',
          label: 'Street Food',
          description: 'Authentic local',
          type: 'cuisine',
          icon: '🍢',
          isPopular: true,
          confidence: 0.7
        }
      ];
    }

    // Urban defaults
    return [
      {
        id: 'thai_traditional',
        label: 'Thai Traditional',
        type: 'cuisine',
        icon: '🍛',
        isPopular: true,
        confidence: 0.8
      },
      {
        id: 'japanese_sushi',
        label: 'Japanese',
        type: 'cuisine',
        icon: '🍣',
        isPopular: true,
        confidence: 0.6
      },
      {
        id: 'italian_pasta',
        label: 'Italian',
        type: 'cuisine',
        icon: '🍝',
        isPopular: true,
        confidence: 0.5
      }
    ];
  }

  /**
   * Fallback selectors when data unavailable
   */
  private getFallbackSelectors(location: string): LocationBasedSelectors {
    return {
      location,
      mostPopular: this.getLocationDefaults(location),
      popularChoices: [
        { id: 'indian_north', label: 'Indian', type: 'cuisine', icon: '🍛' },
        { id: 'korean_bbq', label: 'Korean', type: 'cuisine', icon: '🥩' },
        { id: 'vietnamese_pho', label: 'Vietnamese', type: 'cuisine', icon: '🍜' },
        { id: 'cafe_coffee', label: 'Cafe', type: 'cuisine', icon: '☕' }
      ],
      quickFilters: [
        { id: 'open_now', label: 'Open Now', type: 'feature', icon: '🟢' },
        { id: 'current_promotions', label: 'Promotions', type: 'feature', icon: '💰' },
        { id: 'delivery', label: 'Delivery', type: 'feature', icon: '🛵' }
      ],
      lastUpdated: new Date()
    };
  }
}

export const dynamicSelectorService = new DynamicSelectorService(); 