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
export declare const curationAPI: {
    getSuggestedBusinesses(status?: string): Promise<SuggestedBusiness[]>;
    getDiscoveryCampaigns(): Promise<DiscoveryCampaign[]>;
    getCurationStats(): Promise<CurationStats>;
    approveBusiness(businessId: string): Promise<boolean>;
    flagForSales(businessId: string): Promise<boolean>;
    rejectBusiness(businessId: string, reason?: string): Promise<boolean>;
    approveBusinessAndCreateLoyalty(suggestedBusinessId: string, curatorId: string): Promise<string>;
};
