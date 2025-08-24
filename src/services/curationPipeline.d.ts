export interface DiscoveryFilters {
    minRating?: number;
    minReviewCount?: number;
    maxDistance?: number;
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
    priorityLevel: number;
    estimatedPartnershipValue?: number;
    outreachStatus: 'new' | 'contacted' | 'interested' | 'negotiating' | 'converted' | 'declined' | 'inactive';
    assignedTo?: string;
    notes?: string;
    partnershipTier?: 'basic' | 'premium' | 'enterprise';
}
export declare class CurationPipelineService {
    private googlePlaces;
    createDiscoveryCampaign(campaign: DiscoveryCampaign): Promise<DiscoveryCampaign>;
    getDiscoveryCampaigns(): Promise<DiscoveryCampaign[]>;
    runDiscoveryCampaign(campaignId: string): Promise<{
        discovered: number;
        added: number;
        duplicates: number;
        errors: string[];
    }>;
    getSuggestedBusinesses(status?: string): Promise<SuggestedBusiness[]>;
    addSuggestedBusiness(business: Omit<SuggestedBusiness, 'id'>): Promise<SuggestedBusiness>;
    approveSuggestedBusiness(suggestedBusinessId: string, curatorId: string): Promise<string>;
    rejectSuggestedBusiness(suggestedBusinessId: string, curatorId: string, reason: string): Promise<void>;
    flagForSalesOutreach(suggestedBusinessId: string, curatorId: string, priorityLevel?: number, estimatedValue?: number): Promise<string>;
    getSalesLeads(): Promise<SalesLead[]>;
    updateSalesLeadStatus(leadId: string, status: SalesLead['outreachStatus'], notes?: string): Promise<void>;
    private checkBusinessExists;
    private passesQualityFilters;
    private calculateQualityScore;
    private mapCategoryToGoogleType;
    private calculateNextRun;
    private logCurationActivity;
    private mapDiscoveryCampaign;
    private mapSuggestedBusiness;
    private mapSalesLead;
    private getDiscoveryCampaignById;
}
