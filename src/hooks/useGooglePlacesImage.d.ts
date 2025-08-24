interface UseGooglePlacesImageOptions {
    size?: 'small' | 'medium' | 'large';
}
export declare const useGooglePlacesImage: (heroImage: string, options?: UseGooglePlacesImageOptions) => {
    imageUrl: string;
    isLoading: boolean;
    error: string;
};
export declare const useRestaurantImageCache: (restaurants: Array<{
    id: string;
    heroImage: string;
}>) => {
    getImageUrl: (restaurantId: string, fallback: string) => string;
    isLoading: boolean;
    cachedImages: Map<string, string>;
};
export {};
