export interface RealApiCost {
    serviceName: string;
    dailyCost: number;
    weeklyCost: number;
    monthlyCost: number;
    dailyCalls: number;
    weeklyCalls: number;
    monthlyCalls: number;
    currency: string;
    lastUpdated: Date;
}
export interface BillingConfig {
    googleCloud: {
        projectId?: string;
        serviceAccountKey?: string;
    };
    azure: {
        subscriptionId?: string;
        clientId?: string;
        clientSecret?: string;
        tenantId?: string;
    };
}
declare class RealApiCostService {
    private config;
    constructor(config: BillingConfig);
    /**
     * Fetch real Google Cloud Billing data via REST API
     * Note: CORS will prevent direct calls, requires backend proxy
     */
    fetchGoogleCloudCosts(): Promise<RealApiCost[]>;
    /**
     * Fetch real Azure Cost Management data via REST API
     * Note: CORS will prevent direct calls, requires backend proxy
     */
    fetchAzureCosts(): Promise<RealApiCost[]>;
    /**
     * Setup instructions for real API integration
     */
    getSetupInstructions(): {
        google: string[];
        azure: string[];
        backend: string[];
    };
    /**
     * Fallback data when real APIs are not configured
     * Based on your mention of $100+ Google spending
     */
    private getFallbackGoogleData;
    private getFallbackAzureData;
    /**
     * Check if real APIs are properly configured
     */
    isRealApiConfigured(): {
        google: boolean;
        azure: boolean;
    };
}
export default RealApiCostService;
export declare const createRealApiCostService: () => RealApiCostService;
export declare const fetchRealBillingData: () => Promise<RealApiCost[]>;
