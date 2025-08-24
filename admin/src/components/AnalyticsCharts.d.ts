import React from 'react';
export interface AnalyticsData {
    discoveryStats: {
        labels: string[];
        approved: number[];
        pending: number[];
        rejected: number[];
    };
    monthlyTrends: {
        labels: string[];
        discoveries: number[];
        costs: number[];
    };
    categoryBreakdown: {
        labels: string[];
        values: number[];
        colors: string[];
    };
    geographicData: {
        regions: string[];
        counts: number[];
    };
}
interface AnalyticsChartsProps {
    data: AnalyticsData;
    loading?: boolean;
}
export declare const AnalyticsCharts: React.FC<AnalyticsChartsProps>;
export declare const generateSampleAnalyticsData: () => AnalyticsData;
export {};
