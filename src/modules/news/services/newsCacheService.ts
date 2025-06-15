interface CachedNewsData {
  timestamp: number;
  city: string;
  articles: any[];
  categories: any[];
  lastRefresh: number;
}

interface CacheConfig {
  refreshInterval: number; // in milliseconds
  maxAge: number; // in milliseconds
  enabled: boolean;
}

class NewsCacheService {
  private cacheKey = 'ldp_news_cache';
  private configKey = 'ldp_news_cache_config';
  private refreshTimer: NodeJS.Timeout | null = null;
  
  // Default configuration
  private defaultConfig: CacheConfig = {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    maxAge: 30 * 60 * 1000, // 30 minutes max age
    enabled: true
  };

  constructor() {
    this.initializeBackgroundRefresh();
  }

  // Get current cache configuration
  getConfig(): CacheConfig {
    try {
      const stored = localStorage.getItem(this.configKey);
      if (stored) {
        return { ...this.defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load cache config:', error);
    }
    return this.defaultConfig;
  }

  // Update cache configuration
  setConfig(config: Partial<CacheConfig>): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, ...config };
    
    try {
      localStorage.setItem(this.configKey, JSON.stringify(newConfig));
      
      // Restart background refresh with new interval
      if (newConfig.enabled && newConfig.refreshInterval !== currentConfig.refreshInterval) {
        this.stopBackgroundRefresh();
        this.initializeBackgroundRefresh();
      } else if (!newConfig.enabled) {
        this.stopBackgroundRefresh();
      }
    } catch (error) {
      console.error('Failed to save cache config:', error);
    }
  }

  // Store news data in cache
  store(city: string, articles: any[], categories: any[]): void {
    const config = this.getConfig();
    if (!config.enabled) return;

    const cacheData: CachedNewsData = {
      timestamp: Date.now(),
      city,
      articles,
      categories,
      lastRefresh: Date.now()
    };

    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      console.log(`📰 News cached for ${city} (${articles.length} articles)`);
    } catch (error) {
      console.error('Failed to cache news data:', error);
      // If storage is full, try clearing old cache
      this.clearCache();
    }
  }

  // Get cached news data
  get(city: string): CachedNewsData | null {
    const config = this.getConfig();
    if (!config.enabled) return null;

    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (!stored) return null;

      const cached: CachedNewsData = JSON.parse(stored);
      
      // Check if cache is for the right city
      if (cached.city !== city) {
        console.log(`🏙️ Cache city mismatch: ${cached.city} vs ${city}`);
        return null;
      }

      // Check if cache is still valid
      const age = Date.now() - cached.timestamp;
      if (age > config.maxAge) {
        console.log(`⏰ Cache expired (${Math.round(age / 1000 / 60)}min old)`);
        this.clearCache();
        return null;
      }

      console.log(`✅ Cache hit for ${city} (${Math.round(age / 1000)}s old)`);
      return cached;
    } catch (error) {
      console.error('Failed to read cache:', error);
      this.clearCache();
      return null;
    }
  }

  // Check if cache needs refresh (but is still valid for display)
  needsRefresh(city: string): boolean {
    const config = this.getConfig();
    if (!config.enabled) return true;

    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (!stored) return true;

      const cached: CachedNewsData = JSON.parse(stored);
      if (cached.city !== city) return true;

      const timeSinceRefresh = Date.now() - cached.lastRefresh;
      return timeSinceRefresh > config.refreshInterval;
    } catch (error) {
      return true;
    }
  }

  // Clear cache
  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('🗑️ News cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Initialize background refresh
  private initializeBackgroundRefresh(): void {
    const config = this.getConfig();
    if (!config.enabled) return;

    // Only run background refresh if page is visible and user location is available
    this.refreshTimer = setInterval(async () => {
      if (document.hidden) return; // Don't refresh when page is hidden
      
      try {
        const userLocation = localStorage.getItem('ldp_user_location');
        if (!userLocation) return;

        const locationData = JSON.parse(userLocation);
        const city = this.getCityFromLocation(locationData);
        
        if (this.needsRefresh(city)) {
          console.log(`🔄 Background refresh for ${city}`);
          await this.backgroundFetch(city);
        }
      } catch (error) {
        console.error('Background refresh failed:', error);
      }
    }, config.refreshInterval);

    console.log(`🔄 Background news refresh started (${config.refreshInterval / 1000 / 60}min interval)`);
  }

  // Stop background refresh
  private stopBackgroundRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('🛑 Background news refresh stopped');
    }
  }

  // Background fetch news
  private async backgroundFetch(city: string): Promise<void> {
    try {
      const { API_ENDPOINTS, buildApiUrl } = await import('../../../config/api');
      
      const newsUrl = buildApiUrl(API_ENDPOINTS.news(city), { per_page: '20' });
      const response = await fetch(newsUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const articles = await response.json();
      
      // Get categories
      const categoriesResponse = await fetch(API_ENDPOINTS.categories(city));
      const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
      
      this.store(city, articles, categories);
    } catch (error) {
      console.error('Background fetch failed:', error);
    }
  }

  // Extract city from location data
  private getCityFromLocation(locationData: any): string {
    if (locationData.city === 'Hua Hin') return 'hua-hin';
    if (locationData.city === 'Pattaya') return 'pattaya';
    return 'hua-hin'; // Default fallback
  }

  // Get cache statistics
  getCacheStats(): { size: number; age: number; articles: number; city: string } | null {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (!stored) return null;

      const cached: CachedNewsData = JSON.parse(stored);
      const age = Date.now() - cached.timestamp;
      
      return {
        size: new Blob([stored]).size,
        age: Math.round(age / 1000),
        articles: cached.articles.length,
        city: cached.city
      };
    } catch (error) {
      return null;
    }
  }

  // Manual refresh trigger
  async manualRefresh(city: string): Promise<{ articles: any[]; categories: any[] } | null> {
    console.log(`🔄 Manual refresh for ${city}`);
    try {
      await this.backgroundFetch(city);
      return this.get(city);
    } catch (error) {
      console.error('Manual refresh failed:', error);
      return null;
    }
  }

  // Cleanup on page unload
  cleanup(): void {
    this.stopBackgroundRefresh();
  }
}

// Create singleton instance
export const newsCacheService = new NewsCacheService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    newsCacheService.cleanup();
  });
} 