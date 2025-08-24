export interface ProductionRestaurant {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    description: string;
    status: 'active' | 'inactive';
    photo_gallery?: any[];
    google_place_id?: string;
    google_types?: string[];
    google_primary_type?: string;
    cuisine_types_google?: string[];
    cuisine_types_localplus?: string[];
    cuisine_display_names?: string[];
    discovery_source?: 'google_places' | 'manual' | 'partner_signup';
    curation_status?: 'pending' | 'reviewed' | 'approved';
    cuisine?: string[];
    priceRange?: number;
    rating?: number;
    reviewCount?: number;
    heroImage?: string;
    signatureDishes?: string[];
    openingHours?: string;
    features?: string[];
    loyaltyProgram?: {
        name: string;
        pointsMultiplier: number;
    };
    currentPromotions?: string[];
}
export declare class RestaurantService {
    getRestaurantsByLocation(location: string): Promise<ProductionRestaurant[]>;
    getRestaurantsByCuisine(cuisineTypes: string[], location?: string): Promise<ProductionRestaurant[]>;
    getCuisineCategories(): Promise<any[]>;
    private transformDatabaseBusiness;
    private generateDescription;
    private determineCuisine;
    private determinePriceRange;
    private getHeroImage;
    private getSignatureDishes;
    private getOpeningHours;
    private getFeatures;
    private getLoyaltyProgram;
    private getCurrentPromotions;
    private generateRating;
    private generateReviewCount;
}
export declare const restaurantService: RestaurantService;
