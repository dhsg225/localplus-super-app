export interface DiscountBusiness {
    id: string;
    name: string;
    category: 'restaurant' | 'spa' | 'shopping' | 'activities' | 'hotel' | 'transport';
    subcategory: string;
    description: string;
    location: string;
    address: string;
    image: string;
    discount: {
        percentage: number;
        description: string;
        terms: string[];
        validUntil?: Date;
    };
    rating: number;
    reviewCount: number;
    phone?: string;
    website?: string;
    openingHours: {
        [key: string]: {
            open: string;
            close: string;
            closed?: boolean;
        };
    };
    features: string[];
    isPopular?: boolean;
    isNew?: boolean;
}
export declare const mockDiscountBusinesses: DiscountBusiness[];
export declare const getBusinessesByCategory: (category: string) => DiscountBusiness[];
export declare const getPopularBusinesses: () => DiscountBusiness[];
export declare const getNewBusinesses: () => DiscountBusiness[];
export declare const getCategoryStats: () => Record<string, {
    count: number;
    avgDiscount: number;
}>;
