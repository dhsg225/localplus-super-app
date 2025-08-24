import { Business } from '../lib/supabase';
declare global {
    interface Window {
        google: any;
    }
}
export interface GooglePlaceResult {
    place_id: string;
    name: string;
    vicinity: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    rating?: number;
    price_level?: number;
    types: string[];
    photos?: Array<{
        photo_reference: string;
        width: number;
        height: number;
    }>;
    opening_hours?: {
        open_now: boolean;
        weekday_text: string[];
    };
    formatted_phone_number?: string;
    website?: string;
    business_status?: string;
}
export interface GooglePlaceDetails {
    place_id: string;
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    price_level?: number;
    opening_hours?: {
        open_now: boolean;
        periods: Array<{
            close: {
                day: number;
                time: string;
            };
            open: {
                day: number;
                time: string;
            };
        }>;
        weekday_text: string[];
    };
    photos?: Array<{
        photo_reference: string;
        width: number;
        height: number;
    }>;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    types: string[];
    business_status: string;
}
declare class GooglePlacesService {
    private isGoogleLoaded;
    constructor();
    private checkGoogleMapsAvailable;
    private waitForGoogleMaps;
    discoverBusinessesNearby(lat: number, lng: number, radiusMeters?: number, businessType?: string): Promise<GooglePlaceResult[]>;
    getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null>;
    searchBusinessesByText(query: string, lat: number, lng: number, radiusMeters?: number): Promise<GooglePlaceResult[]>;
    googlePlaceToBusiness(place: GooglePlaceResult, details?: GooglePlaceDetails): Partial<Business>;
    getPhotoUrl(photoReference: string, maxWidth?: number): string;
    private categorizeGooglePlace;
    private getGooglePlaceTypes;
    private generateBusinessDescription;
    private searchRealGooglePlaces;
}
export declare const googlePlacesService: GooglePlacesService;
export default GooglePlacesService;
export { GooglePlacesService };
