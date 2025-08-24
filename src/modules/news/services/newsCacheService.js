var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var NewsCacheService = /** @class */ (function () {
    function NewsCacheService() {
        this.cacheKey = 'ldp_news_cache';
        this.configKey = 'ldp_news_cache_config';
        this.refreshTimer = null;
        // Default configuration
        this.defaultConfig = {
            refreshInterval: 5 * 60 * 1000, // 5 minutes
            maxAge: 30 * 60 * 1000, // 30 minutes max age
            enabled: true
        };
        this.initializeBackgroundRefresh();
    }
    // Get current cache configuration
    NewsCacheService.prototype.getConfig = function () {
        try {
            var stored = localStorage.getItem(this.configKey);
            if (stored) {
                return __assign(__assign({}, this.defaultConfig), JSON.parse(stored));
            }
        }
        catch (error) {
            console.warn('Failed to load cache config:', error);
        }
        return this.defaultConfig;
    };
    // Update cache configuration
    NewsCacheService.prototype.setConfig = function (config) {
        var currentConfig = this.getConfig();
        var newConfig = __assign(__assign({}, currentConfig), config);
        try {
            localStorage.setItem(this.configKey, JSON.stringify(newConfig));
            // Restart background refresh with new interval
            if (newConfig.enabled && newConfig.refreshInterval !== currentConfig.refreshInterval) {
                this.stopBackgroundRefresh();
                this.initializeBackgroundRefresh();
            }
            else if (!newConfig.enabled) {
                this.stopBackgroundRefresh();
            }
        }
        catch (error) {
            console.error('Failed to save cache config:', error);
        }
    };
    // Store news data in cache
    NewsCacheService.prototype.store = function (city, articles, categories) {
        var config = this.getConfig();
        if (!config.enabled)
            return;
        var cacheData = {
            timestamp: Date.now(),
            city: city,
            articles: articles,
            categories: categories,
            lastRefresh: Date.now()
        };
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log("\uD83D\uDCF0 News cached for ".concat(city, " (").concat(articles.length, " articles)"));
        }
        catch (error) {
            console.error('Failed to cache news data:', error);
            // If storage is full, try clearing old cache
            this.clearCache();
        }
    };
    // Get cached news data
    NewsCacheService.prototype.get = function (city) {
        var config = this.getConfig();
        if (!config.enabled)
            return null;
        try {
            var stored = localStorage.getItem(this.cacheKey);
            if (!stored)
                return null;
            var cached = JSON.parse(stored);
            // Check if cache is for the right city
            if (cached.city !== city) {
                console.log("\uD83C\uDFD9\uFE0F Cache city mismatch: ".concat(cached.city, " vs ").concat(city));
                return null;
            }
            // Check if cache is still valid
            var age = Date.now() - cached.timestamp;
            if (age > config.maxAge) {
                console.log("\u23F0 Cache expired (".concat(Math.round(age / 1000 / 60), "min old)"));
                this.clearCache();
                return null;
            }
            console.log("\u2705 Cache hit for ".concat(city, " (").concat(Math.round(age / 1000), "s old)"));
            return cached;
        }
        catch (error) {
            console.error('Failed to read cache:', error);
            this.clearCache();
            return null;
        }
    };
    // Check if cache needs refresh (but is still valid for display)
    NewsCacheService.prototype.needsRefresh = function (city) {
        var config = this.getConfig();
        if (!config.enabled)
            return true;
        try {
            var stored = localStorage.getItem(this.cacheKey);
            if (!stored)
                return true;
            var cached = JSON.parse(stored);
            if (cached.city !== city)
                return true;
            var timeSinceRefresh = Date.now() - cached.lastRefresh;
            return timeSinceRefresh > config.refreshInterval;
        }
        catch (error) {
            return true;
        }
    };
    // Clear cache
    NewsCacheService.prototype.clearCache = function () {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('🗑️ News cache cleared');
        }
        catch (error) {
            console.error('Failed to clear cache:', error);
        }
    };
    // Initialize background refresh
    NewsCacheService.prototype.initializeBackgroundRefresh = function () {
        var _this = this;
        var config = this.getConfig();
        if (!config.enabled)
            return;
        // Only run background refresh if page is visible and user location is available
        this.refreshTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var userLocation, locationData, city, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (document.hidden)
                            return [2 /*return*/]; // Don't refresh when page is hidden
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        userLocation = localStorage.getItem('ldp_user_location');
                        if (!userLocation)
                            return [2 /*return*/];
                        locationData = JSON.parse(userLocation);
                        city = this.getCityFromLocation(locationData);
                        if (!this.needsRefresh(city)) return [3 /*break*/, 3];
                        console.log("\uD83D\uDD04 Background refresh for ".concat(city));
                        return [4 /*yield*/, this.backgroundFetch(city)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Background refresh failed:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); }, config.refreshInterval);
        console.log("\uD83D\uDD04 Background news refresh started (".concat(config.refreshInterval / 1000 / 60, "min interval)"));
    };
    // Stop background refresh
    NewsCacheService.prototype.stopBackgroundRefresh = function () {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            console.log('🛑 Background news refresh stopped');
        }
    };
    // Background fetch news
    NewsCacheService.prototype.backgroundFetch = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, API_ENDPOINTS, buildApiUrl, newsUrl, response, articles, categoriesResponse, categories, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, import('../../../config/api')];
                    case 1:
                        _a = _c.sent(), API_ENDPOINTS = _a.API_ENDPOINTS, buildApiUrl = _a.buildApiUrl;
                        newsUrl = buildApiUrl(API_ENDPOINTS.news(city), { per_page: '20' });
                        return [4 /*yield*/, fetch(newsUrl)];
                    case 2:
                        response = _c.sent();
                        if (!response.ok)
                            throw new Error("HTTP ".concat(response.status));
                        return [4 /*yield*/, response.json()];
                    case 3:
                        articles = _c.sent();
                        return [4 /*yield*/, fetch(API_ENDPOINTS.categories(city))];
                    case 4:
                        categoriesResponse = _c.sent();
                        if (!categoriesResponse.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, categoriesResponse.json()];
                    case 5:
                        _b = _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _b = [];
                        _c.label = 7;
                    case 7:
                        categories = _b;
                        this.store(city, articles, categories);
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _c.sent();
                        console.error('Background fetch failed:', error_2);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // Extract city from location data
    NewsCacheService.prototype.getCityFromLocation = function (locationData) {
        if (locationData.city === 'Hua Hin')
            return 'hua-hin';
        if (locationData.city === 'Pattaya')
            return 'pattaya';
        return 'hua-hin'; // Default fallback
    };
    // Get cache statistics
    NewsCacheService.prototype.getCacheStats = function () {
        try {
            var stored = localStorage.getItem(this.cacheKey);
            if (!stored)
                return null;
            var cached = JSON.parse(stored);
            var age = Date.now() - cached.timestamp;
            return {
                size: new Blob([stored]).size,
                age: Math.round(age / 1000),
                articles: cached.articles.length,
                city: cached.city
            };
        }
        catch (error) {
            return null;
        }
    };
    // Manual refresh trigger
    NewsCacheService.prototype.manualRefresh = function (city) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD04 Manual refresh for ".concat(city));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.backgroundFetch(city)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.get(city)];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Manual refresh failed:', error_3);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Cleanup on page unload
    NewsCacheService.prototype.cleanup = function () {
        this.stopBackgroundRefresh();
    };
    return NewsCacheService;
}());
// Create singleton instance
export var newsCacheService = new NewsCacheService();
// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', function () {
        newsCacheService.cleanup();
    });
}
