interface CachedNewsData {
    timestamp: number;
    city: string;
    articles: any[];
    categories: any[];
    lastRefresh: number;
}
interface CacheConfig {
    refreshInterval: number;
    maxAge: number;
    enabled: boolean;
}
declare class NewsCacheService {
    private cacheKey;
    private configKey;
    private refreshTimer;
    private defaultConfig;
    constructor();
    getConfig(): CacheConfig;
    setConfig(config: Partial<CacheConfig>): void;
    store(city: string, articles: any[], categories: any[]): void;
    get(city: string): CachedNewsData | null;
    needsRefresh(city: string): boolean;
    clearCache(): void;
    private initializeBackgroundRefresh;
    private stopBackgroundRefresh;
    private backgroundFetch;
    private getCityFromLocation;
    getCacheStats(): {
        size: number;
        age: number;
        articles: number;
        city: string;
    } | null;
    manualRefresh(city: string): Promise<{
        articles: any[];
        categories: any[];
    } | null>;
    cleanup(): void;
}
export declare const newsCacheService: NewsCacheService;
export {};
