export interface GooglePlacePhoto {
    height: number;
    width: number;
    photo_reference: string;
}
export interface GooglePlaceDetails {
    place_id: string;
    name: string;
    photos?: GooglePlacePhoto[];
}
export declare class GooglePlacesImageService {
    private apiKey;
    private useBackendProxy;
    private baseUrl;
    constructor(useBackendProxy?: boolean);
    /**
     * Fetch place photos from Google Places API
     */
    getPlacePhotos(placeId: string): Promise<GooglePlacePhoto[]>;
    /**
     * Get Google Places photo URL with proper API key
     */
    getPhotoUrl(photoReference: string, maxWidth: number, maxHeight: number): string;
    /**
     * Get optimized restaurant image URL - ONLY real Google Places images
     */
    getRestaurantImageUrl(placeId: string, size?: 'small' | 'medium' | 'large'): Promise<string | null>;
    /**
     * Get multiple REAL images for gallery/carousel - NO FAKE IMAGES
     */
    getRestaurantGallery(placeId: string, limit?: number): Promise<string[]>;
    /**
     * Cache images locally for better performance - ONLY REAL IMAGES
     */
    cacheRestaurantImages(restaurants: Array<{
        google_place_id?: string;
        id: string;
    }>): Promise<Map<string, string | null>>;
}
export declare const googlePlacesImageService: GooglePlacesImageService;
