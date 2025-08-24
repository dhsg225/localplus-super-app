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
// [2025-01-06 17:50 UTC] - Dynamic selector system based on Google Places data and real restaurant availability
import { supabase } from '../../lib/supabase';
var DynamicSelectorService = /** @class */ (function () {
    function DynamicSelectorService() {
    }
    /**
     * Generate location-aware selectors based on actual restaurant data
     */
    DynamicSelectorService.prototype.generateLocationSelectors = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, restaurants, error, cuisineStats, featureStats, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🎯 Generating dynamic selectors for location:', location);
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('*')
                                .eq('partnership_status', 'active')
                                .ilike('address', "%".concat(location, "%"))];
                    case 1:
                        _a = _b.sent(), restaurants = _a.data, error = _a.error;
                        if (error) {
                            console.error('🎯 Database error in dynamic selectors:', error);
                            throw error;
                        }
                        console.log('🏪 Found', (restaurants === null || restaurants === void 0 ? void 0 : restaurants.length) || 0, 'restaurants for dynamic selectors');
                        console.log('🏪 First restaurant data:', restaurants === null || restaurants === void 0 ? void 0 : restaurants[0]);
                        cuisineStats = this.analyzeCuisineDistribution(restaurants || []);
                        featureStats = this.analyzeFeatureDistribution(restaurants || []);
                        console.log('🍽️ Cuisine stats:', Object.fromEntries(cuisineStats));
                        console.log('⚡ Feature stats:', Object.fromEntries(featureStats));
                        result = {
                            location: location,
                            mostPopular: this.generateMostPopularSelectors(cuisineStats, location),
                            popularChoices: this.generatePopularChoicesSelectors(cuisineStats),
                            quickFilters: this.generateQuickFilters(featureStats, restaurants || []),
                            lastUpdated: new Date()
                        };
                        console.log('🎯 Generated selectors:', result);
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _b.sent();
                        console.error('🎯 Error generating dynamic selectors:', error_1);
                        return [2 /*return*/, this.getFallbackSelectors(location)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Analyze cuisine distribution from real restaurant data
     */
    DynamicSelectorService.prototype.analyzeCuisineDistribution = function (restaurants) {
        var _this = this;
        var cuisineCount = new Map();
        restaurants.forEach(function (restaurant) {
            // Use the existing category field as the primary cuisine type
            var category = restaurant.category;
            if (category) {
                var current = cuisineCount.get(category) || { count: 0, confidence: 0, googleTypes: new Set() };
                current.count++;
                current.confidence = Math.min(1.0, current.confidence + 0.15); // High confidence for curated data
                cuisineCount.set(category, current);
            }
            // Process Google Place types as backup if available
            var googleTypes = restaurant.google_types || [];
            googleTypes.forEach(function (type) {
                var mapped = _this.mapGoogleTypeToSelector(type);
                if (mapped && !category) { // Only use Google types if no category set
                    var current = cuisineCount.get(mapped.id) || { count: 0, confidence: 0, googleTypes: new Set() };
                    current.count++;
                    current.googleTypes.add(type);
                    current.confidence = Math.min(1.0, current.confidence + 0.05); // Lower confidence for unmapped
                    cuisineCount.set(mapped.id, current);
                }
            });
        });
        return cuisineCount;
    };
    /**
     * Analyze feature distribution (beachfront, delivery, etc.)
     */
    DynamicSelectorService.prototype.analyzeFeatureDistribution = function (restaurants) {
        var featureCount = new Map();
        restaurants.forEach(function (restaurant) {
            var _a;
            // Check address for location-specific features
            var address = ((_a = restaurant.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            if (address.includes('beach') || address.includes('waterfront')) {
                featureCount.set('beachfront', (featureCount.get('beachfront') || 0) + 1);
            }
            if (address.includes('market') || address.includes('night')) {
                featureCount.set('night_market', (featureCount.get('night_market') || 0) + 1);
            }
            // Check Google types for features
            var googleTypes = restaurant.google_types || [];
            if (googleTypes.includes('meal_delivery')) {
                featureCount.set('delivery', (featureCount.get('delivery') || 0) + 1);
            }
            if (googleTypes.includes('meal_takeaway')) {
                featureCount.set('takeaway', (featureCount.get('takeaway') || 0) + 1);
            }
        });
        return featureCount;
    };
    /**
     * Generate "Most Popular in [Location]" selectors
     */
    DynamicSelectorService.prototype.generateMostPopularSelectors = function (cuisineStats, location) {
        var _this = this;
        var popular = Array.from(cuisineStats.entries())
            .filter(function (_a) {
            var _ = _a[0], stats = _a[1];
            return stats.count >= 3 && stats.confidence > 0.3;
        }) // Minimum threshold
            .sort(function (a, b) { return b[1].count - a[1].count; })
            .slice(0, 3) // Top 3
            .map(function (_a) {
            var cuisineId = _a[0], stats = _a[1];
            return ({
                id: cuisineId,
                label: _this.getCuisineDisplayName(cuisineId),
                description: "".concat(stats.count, " restaurants in ").concat(location),
                type: 'cuisine',
                count: stats.count,
                isPopular: true,
                confidence: stats.confidence,
                localPlusCuisines: [cuisineId],
                icon: _this.getCuisineIcon(cuisineId)
            });
        });
        // Add location-specific defaults if not enough data
        if (popular.length < 3) {
            var locationDefaults = this.getLocationDefaults(location);
            locationDefaults.forEach(function (defaultSelector) {
                if (!popular.find(function (p) { return p.id === defaultSelector.id; })) {
                    popular.push(__assign(__assign({}, defaultSelector), { description: defaultSelector.description || "Available in ".concat(location), type: 'cuisine', count: 0, isPopular: true, confidence: defaultSelector.confidence || 0.5, localPlusCuisines: [defaultSelector.id], icon: defaultSelector.icon || '🍽️' }));
                }
            });
        }
        return popular.slice(0, 3);
    };
    /**
     * Generate "Popular Choices" selectors
     */
    DynamicSelectorService.prototype.generatePopularChoicesSelectors = function (cuisineStats) {
        var _this = this;
        return Array.from(cuisineStats.entries())
            .filter(function (_a) {
            var _ = _a[0], stats = _a[1];
            return stats.count >= 1;
        }) // Any availability
            .sort(function (a, b) { return b[1].count - a[1].count; })
            .slice(3, 7) // Next 4 after most popular
            .map(function (_a) {
            var cuisineId = _a[0], stats = _a[1];
            return ({
                id: cuisineId,
                label: _this.getCuisineDisplayName(cuisineId),
                description: "".concat(stats.count, " options available"),
                type: 'cuisine',
                count: stats.count,
                confidence: stats.confidence,
                localPlusCuisines: [cuisineId],
                icon: _this.getCuisineIcon(cuisineId)
            });
        });
    };
    /**
     * Generate quick filter selectors
     */
    DynamicSelectorService.prototype.generateQuickFilters = function (featureStats, restaurants) {
        var filters = [];
        // Open now (always show if we have restaurants)
        if (restaurants.length > 0) {
            filters.push({
                id: 'open_now',
                label: 'Open Now',
                type: 'feature',
                icon: '🟢',
                count: Math.floor(restaurants.length * 0.7) // Estimate 70% open
            });
        }
        // Promotions (if we detect any promotional keywords)
        var promotionCount = restaurants.filter(function (r) {
            var _a, _b;
            return ((_a = r.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('special')) ||
                ((_b = r.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('promotion'));
        }).length;
        if (promotionCount > 0) {
            filters.push({
                id: 'current_promotions',
                label: 'Current Promotions',
                type: 'feature',
                icon: '💰',
                count: promotionCount
            });
        }
        // Beachfront (location-specific)
        var beachfrontCount = featureStats.get('beachfront') || 0;
        if (beachfrontCount > 0) {
            filters.push({
                id: 'beachfront',
                label: 'Beachfront',
                type: 'feature',
                icon: '🏖️',
                count: beachfrontCount
            });
        }
        // Delivery available
        var deliveryCount = featureStats.get('delivery') || 0;
        if (deliveryCount > 0) {
            filters.push({
                id: 'delivery',
                label: 'Delivery',
                type: 'feature',
                icon: '🛵',
                count: deliveryCount
            });
        }
        return filters.slice(0, 3); // Max 3 quick filters
    };
    /**
     * Map Google Place types to our selector system
     */
    DynamicSelectorService.prototype.mapGoogleTypeToSelector = function (googleType) {
        var mapping = {
            'thai_restaurant': { id: 'thai_traditional', label: 'Thai Traditional', icon: '🍛' },
            'seafood_restaurant': { id: 'seafood_grilled', label: 'Fresh Seafood', icon: '🦐' },
            'japanese_restaurant': { id: 'japanese_sushi', label: 'Japanese', icon: '🍣' },
            'sushi_restaurant': { id: 'japanese_sushi', label: 'Sushi', icon: '🍣' },
            'italian_restaurant': { id: 'italian_pasta', label: 'Italian', icon: '🍝' },
            'pizza_restaurant': { id: 'italian_pizza', label: 'Pizza', icon: '🍕' },
            'chinese_restaurant': { id: 'chinese_cantonese', label: 'Chinese', icon: '🥢' },
            'indian_restaurant': { id: 'indian_north', label: 'Indian', icon: '🍛' },
            'korean_restaurant': { id: 'korean_bbq', label: 'Korean', icon: '🥩' },
            'vietnamese_restaurant': { id: 'vietnamese_pho', label: 'Vietnamese', icon: '🍜' },
            'cafe': { id: 'cafe_coffee', label: 'Cafe', icon: '☕' },
            'bar': { id: 'bar_cocktails', label: 'Bar', icon: '🍸' }
        };
        var mapped = mapping[googleType];
        if (!mapped)
            return null;
        return {
            id: mapped.id,
            label: mapped.label,
            icon: mapped.icon,
            type: 'cuisine',
            googlePlacesTypes: [googleType]
        };
    };
    /**
     * Get display name for cuisine ID
     */
    DynamicSelectorService.prototype.getCuisineDisplayName = function (cuisineId) {
        var displayNames = {
            // Our actual database categories
            'Thai Traditional': 'Thai Traditional',
            'Fresh Seafood': 'Fresh Seafood',
            'Entertainment': 'Entertainment',
            'Wellness': 'Wellness',
            // Legacy mappings for fallbacks
            'thai_traditional': 'Thai Traditional',
            'thai_royal': 'Royal Thai',
            'thai_street_food': 'Street Food',
            'seafood_grilled': 'Fresh Seafood',
            'seafood_steamed': 'Steamed Seafood',
            'japanese_sushi': 'Japanese',
            'japanese_ramen': 'Ramen',
            'italian_pasta': 'Italian',
            'italian_pizza': 'Pizza',
            'chinese_cantonese': 'Chinese',
            'indian_north': 'Indian',
            'korean_bbq': 'Korean',
            'vietnamese_pho': 'Vietnamese',
            'cafe_coffee': 'Cafe',
            'bar_cocktails': 'Bar & Drinks'
        };
        return displayNames[cuisineId] || cuisineId;
    };
    /**
     * Get icon for cuisine
     */
    DynamicSelectorService.prototype.getCuisineIcon = function (cuisineId) {
        var icons = {
            // Our actual database categories
            'Thai Traditional': '🍛',
            'Fresh Seafood': '🦐',
            'Entertainment': '🎭',
            'Wellness': '🧘',
            // Legacy mappings for fallbacks
            'thai_traditional': '🍛',
            'thai_royal': '👑',
            'thai_street_food': '🍢',
            'seafood_grilled': '🦐',
            'seafood_steamed': '🐟',
            'japanese_sushi': '🍣',
            'japanese_ramen': '🍜',
            'italian_pasta': '🍝',
            'italian_pizza': '🍕',
            'chinese_cantonese': '🥢',
            'indian_north': '🍛',
            'korean_bbq': '🥩',
            'vietnamese_pho': '🍜',
            'cafe_coffee': '☕',
            'bar_cocktails': '🍸'
        };
        return icons[cuisineId] || '🍽️';
    };
    /**
     * Location-specific defaults when not enough data
     */
    DynamicSelectorService.prototype.getLocationDefaults = function (location) {
        var coastal = ['hua hin', 'pattaya', 'phuket', 'krabi', 'samui'];
        var isCoastal = coastal.some(function (city) { return location.toLowerCase().includes(city); });
        if (isCoastal) {
            return [
                {
                    id: 'thai_traditional',
                    label: 'Thai Traditional',
                    description: 'Local favorite',
                    type: 'cuisine',
                    icon: '🍛',
                    isPopular: true,
                    confidence: 0.8
                },
                {
                    id: 'seafood_grilled',
                    label: 'Fresh Seafood',
                    description: 'Coastal specialty',
                    type: 'cuisine',
                    icon: '🦐',
                    isPopular: true,
                    confidence: 0.9
                },
                {
                    id: 'thai_street_food',
                    label: 'Street Food',
                    description: 'Authentic local',
                    type: 'cuisine',
                    icon: '🍢',
                    isPopular: true,
                    confidence: 0.7
                }
            ];
        }
        // Urban defaults
        return [
            {
                id: 'thai_traditional',
                label: 'Thai Traditional',
                type: 'cuisine',
                icon: '🍛',
                isPopular: true,
                confidence: 0.8
            },
            {
                id: 'japanese_sushi',
                label: 'Japanese',
                type: 'cuisine',
                icon: '🍣',
                isPopular: true,
                confidence: 0.6
            },
            {
                id: 'italian_pasta',
                label: 'Italian',
                type: 'cuisine',
                icon: '🍝',
                isPopular: true,
                confidence: 0.5
            }
        ];
    };
    /**
     * Fallback selectors when data unavailable
     */
    DynamicSelectorService.prototype.getFallbackSelectors = function (location) {
        return {
            location: location,
            mostPopular: this.getLocationDefaults(location),
            popularChoices: [
                { id: 'indian_north', label: 'Indian', type: 'cuisine', icon: '🍛' },
                { id: 'korean_bbq', label: 'Korean', type: 'cuisine', icon: '🥩' },
                { id: 'vietnamese_pho', label: 'Vietnamese', type: 'cuisine', icon: '🍜' },
                { id: 'cafe_coffee', label: 'Cafe', type: 'cuisine', icon: '☕' }
            ],
            quickFilters: [
                { id: 'open_now', label: 'Open Now', type: 'feature', icon: '🟢' },
                { id: 'current_promotions', label: 'Promotions', type: 'feature', icon: '💰' },
                { id: 'delivery', label: 'Delivery', type: 'feature', icon: '🛵' }
            ],
            lastUpdated: new Date()
        };
    };
    return DynamicSelectorService;
}());
export { DynamicSelectorService };
export var dynamicSelectorService = new DynamicSelectorService();
