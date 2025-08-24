import { BaseEntity } from "@/shared/types";
export interface Service extends BaseEntity {
    category: ServiceCategory;
    subcategory: string;
    services: string[];
    priceRange?: {
        min: number;
        max: number;
        currency: string;
    };
    availability: {
        [key: string]: {
            open: string;
            close: string;
        };
    };
    responseTime?: string;
    rating?: number;
    reviewCount?: number;
    serviceArea: string[];
    languages: string[];
}
export type ServiceCategory = "home-maintenance" | "cleaning" | "beauty-wellness" | "automotive" | "technology" | "health-medical" | "education" | "legal-finance" | "delivery" | "repair" | "installation";
export interface ServiceFilters {
    category?: ServiceCategory[];
    subcategory?: string[];
    location?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    availability?: {
        day: string;
        time: string;
    };
    rating?: number;
    verified?: boolean;
}
export interface ServiceRequest {
    id: string;
    userId: string;
    serviceId: string;
    description: string;
    preferredDate?: Date;
    preferredTime?: string;
    location: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    createdAt: Date;
}
