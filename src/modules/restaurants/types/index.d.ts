import { BaseEntity } from "@/shared/types";
export interface Restaurant extends BaseEntity {
    cuisine: string[];
    priceRange: "budget" | "mid-range" | "upscale" | "fine-dining";
    openingHours: {
        [key: string]: {
            open: string;
            close: string;
        };
    };
    photos?: string[];
    menu?: MenuItem[];
    averageRating?: number;
    reviewCount?: number;
    hasDelivery?: boolean;
    hasReservation?: boolean;
    todaysDeal?: Deal;
}
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable: boolean;
    isSpicy?: boolean;
    isVegetarian?: boolean;
}
export interface Deal {
    id: string;
    restaurantId: string;
    title: string;
    description: string;
    discount?: number;
    validUntil: Date;
    isActive: boolean;
}
export interface RestaurantFilters {
    cuisine?: string[];
    priceRange?: string[];
    diningStyle?: string[];
    hasDelivery?: boolean;
    hasReservation?: boolean;
    hasBeachfront?: boolean;
    isHalal?: boolean;
    location?: string;
    isOpen?: boolean;
}
