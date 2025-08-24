export interface DynamicSelector {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    type: 'cuisine' | 'feature' | 'dietary' | 'dining_style';
    googlePlacesTypes?: string[];
    localPlusCuisines?: string[];
    count?: number;
    isPopular?: boolean;
    confidence?: number;
}
export interface LocationBasedSelectors {
    location: string;
    mostPopular: DynamicSelector[];
    popularChoices: DynamicSelector[];
    quickFilters: DynamicSelector[];
    lastUpdated: Date;
}
export declare class DynamicSelectorService {
    /**
     * Generate location-aware selectors based on actual restaurant data
     */
    generateLocationSelectors(location: string): Promise<LocationBasedSelectors>;
    /**
     * Analyze cuisine distribution from real restaurant data
     */
    private analyzeCuisineDistribution;
    /**
     * Analyze feature distribution (beachfront, delivery, etc.)
     */
    private analyzeFeatureDistribution;
    /**
     * Generate "Most Popular in [Location]" selectors
     */
    private generateMostPopularSelectors;
    /**
     * Generate "Popular Choices" selectors
     */
    private generatePopularChoicesSelectors;
    /**
     * Generate quick filter selectors
     */
    private generateQuickFilters;
    /**
     * Map Google Place types to our selector system
     */
    private mapGoogleTypeToSelector;
    /**
     * Get display name for cuisine ID
     */
    private getCuisineDisplayName;
    /**
     * Get icon for cuisine
     */
    private getCuisineIcon;
    /**
     * Location-specific defaults when not enough data
     */
    private getLocationDefaults;
    /**
     * Fallback selectors when data unavailable
     */
    private getFallbackSelectors;
}
export declare const dynamicSelectorService: DynamicSelectorService;
