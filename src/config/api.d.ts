export declare const API_BASE_URL: string;
export declare const API_ENDPOINTS: {
    news: (city: string) => string;
    categories: (city: string) => string;
    places: () => string;
    health: () => string;
};
export declare const buildApiUrl: (endpoint: string, params?: Record<string, string | number>) => string;
export declare const isDev: boolean;
export declare const isProd: boolean;
