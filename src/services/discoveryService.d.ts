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
export declare class DiscoveryService {
    private googlePlacesService;
    private discoveryState;
    private pipelineConfig;
    private searchHistory;
    resetDiscoveryState(): void;
    private isStrategyFresh;
    private markStrategyUsed;
    runDiscoveryForLocation(location: {
        lat: number;
        lng: number;
    }, categories: string[], radius?: number, filters?: DiscoveryFilters): Promise<DiscoveryResult>;
    private passesQualityFilters;
    private calculateQualityScore;
    createDiscoveryCampaign(campaignData: {
        name: string;
        description?: string;
        targetLocation: string;
        centerLatitude: number;
        centerLongitude: number;
        searchRadius: number;
        targetCategories: string[];
        qualityFilters: DiscoveryFilters;
        runFrequency: string;
    }): Promise<string | null>;
    private generateBusinessDescription;
    private clearSearchHistory;
    maintainPipelineQueue(category?: string, forceDiscovery?: boolean): Promise<DiscoveryResult>;
    private getCurrentPendingCount;
    private intelligentDiscovery;
    private getCategoryQueries;
    private wasSearchedRecently;
    private markSearchCompleted;
    private processBusinessesIntelligently;
    private applyIntelligentFiltering;
    private checkForDuplicates;
    private relaxedCategorySearch;
    runHuaHinRestaurantDiscovery(): Promise<DiscoveryResult>;
    runMultiCategoryDiscovery(): Promise<DiscoveryResult>;
    runHuaHinWellnessDiscovery(): Promise<DiscoveryResult>;
    runHuaHinShoppingDiscovery(): Promise<DiscoveryResult>;
    runHuaHinEntertainmentDiscovery(): Promise<DiscoveryResult>;
    private expandedAreaSearch;
    searchBusinessByName(query: string, location?: {
        lat: number;
        lng: number;
    }): Promise<any[]>;
    addManualBusiness(businessData: any): Promise<{
        success: boolean;
        error?: string;
    }>;
}
export declare const discoveryService: DiscoveryService;
