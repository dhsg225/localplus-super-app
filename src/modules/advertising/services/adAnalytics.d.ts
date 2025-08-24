import { AdAnalytics } from '../types';
export declare const trackAdInteraction: (adId: string, action: "impression" | "click" | "conversion", placement: string, userId?: string, metadata?: Record<string, any>) => void;
export declare const getAdMetrics: (adId: string) => {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
    lastUpdated: Date;
};
export declare const getPlacementMetrics: (placement: string) => {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
    lastUpdated: Date;
    adId: any;
}[];
export declare const getAllAnalytics: () => AdAnalytics[];
export declare const clearAnalytics: () => void;
export declare const trackConversion: (adId: string, placement: string, userId?: string) => void;
