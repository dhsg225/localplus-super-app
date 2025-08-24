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
        northeast: {
            lat: number;
            lng: number;
        };
        southwest: {
            lat: number;
            lng: number;
        };
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
export declare const GOOGLE_TO_LOCALPLUS_CUISINE_MAPPING: Record<string, string[]>;
export declare const RESTAURANT_PLACE_TYPES: string[];
export declare class GooglePlacesService {
    private apiKey;
    private baseUrl;
    constructor();
    startNearbyRestaurantDiscovery(location: {
        lat: number;
        lng: number;
    }, radiusMeters?: number): Promise<number | null>;
    private executeNearbySearch;
    private performNearbySearch;
    private processSuggestedBusiness;
    private extractCuisineTypesFromGoogle;
    private determinePrimaryCategory;
    private calculateConfidenceScore;
    getCuratedCuisineCategories(): Promise<any[]>;
    getSuggestedBusinessesForCuration(status?: string, limit?: number): Promise<any[]>;
    approveSuggestedBusiness(suggestedBusinessId: number, curatedCuisineTypes: string[], curationNotes?: string): Promise<boolean>;
    rejectSuggestedBusiness(suggestedBusinessId: number, rejectionReason: string): Promise<boolean>;
    getSyncJobStatus(syncJobId: number): Promise<any>;
}
export declare const googlePlacesService: GooglePlacesService;
