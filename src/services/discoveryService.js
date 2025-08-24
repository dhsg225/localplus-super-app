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
// Discovery Service for running discovery campaigns
import { supabase } from '../lib/supabase';
import { googlePlacesService } from './googlePlaces';
var DiscoveryService = /** @class */ (function () {
    function DiscoveryService() {
        this.googlePlacesService = googlePlacesService;
        // [2024-12-19 19:00 UTC] - Track discovery state to avoid repeating searches
        this.discoveryState = {
            lastSearches: new Map(),
            usedStrategies: new Set(),
            searchCount: 0
        };
        // [2024-12-19 19:30 UTC] - Intelligent pipeline configuration
        this.pipelineConfig = {
            minPendingBusinesses: 15, // Trigger discovery when below this threshold
            targetPendingBusinesses: 25, // Stop discovery when reaching this target
            searchRadiusIncrement: 1000, // Increase radius by 1km when no results
            maxSearchRadius: 15000, // Maximum 15km search radius
            // [2024-12-19 20:00 UTC] - STRICT LIMITS to prevent excessive API calls
            maxLocationsToSearch: 3, // Only search top 3 locations
            maxQueriesPerLocation: 2, // Only 2 queries per location
            maxTotalDiscovered: 50, // Stop after discovering 50 businesses total
            maxApiCallsPerSession: 10, // Hard limit on API calls
            locationFallbacks: [
                // Primary Hua Hin locations
                { name: 'Hua Hin Center', lat: 12.5684, lng: 99.9578, priority: 1 },
                { name: 'Hua Hin Night Market', lat: 12.5708, lng: 99.9581, priority: 1 },
                { name: 'Hua Hin Beach', lat: 12.5650, lng: 99.9520, priority: 1 },
                // Secondary locations
                { name: 'Cicada Market', lat: 12.5892, lng: 99.9664, priority: 2 },
                { name: 'Hua Hin Railway Station', lat: 12.5703, lng: 99.9496, priority: 2 },
                { name: 'Hua Hin Hills', lat: 12.5500, lng: 99.9400, priority: 2 },
                // Fallback areas
                { name: 'Cha-am', lat: 12.6000, lng: 99.9800, priority: 3 },
                { name: 'Pranburi', lat: 12.3900, lng: 99.9100, priority: 3 },
                { name: 'Khao Takiab', lat: 12.5300, lng: 99.9700, priority: 3 }
            ]
        };
        // Track what's been searched to avoid repetition
        this.searchHistory = new Map();
    }
    // Reset discovery state (call this periodically or when needed)
    DiscoveryService.prototype.resetDiscoveryState = function () {
        this.discoveryState.lastSearches.clear();
        this.discoveryState.usedStrategies.clear();
        this.discoveryState.searchCount = 0;
        console.log('🔄 Discovery state reset - ready for fresh searches');
    };
    // Check if a search strategy was used recently (within last hour)
    DiscoveryService.prototype.isStrategyFresh = function (strategyKey) {
        var lastUsed = this.discoveryState.lastSearches.get(strategyKey);
        if (!lastUsed)
            return true;
        var hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return lastUsed < hourAgo;
    };
    // Mark a strategy as used
    DiscoveryService.prototype.markStrategyUsed = function (strategyKey) {
        this.discoveryState.lastSearches.set(strategyKey, new Date());
        this.discoveryState.usedStrategies.add(strategyKey);
        this.discoveryState.searchCount++;
    };
    // Run a discovery campaign for a specific location and categories
    DiscoveryService.prototype.runDiscoveryForLocation = function (location_1, categories_1) {
        return __awaiter(this, arguments, void 0, function (location, categories, radius, filters) {
            var result, _loop_1, this_1, _i, categories_2, category, error_1;
            var _a;
            if (radius === void 0) { radius = 5000; }
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {
                            discovered: 0,
                            added: 0,
                            duplicates: 0,
                            errors: []
                        };
                        console.log('🔍 Running discovery for location:', location);
                        console.log('🎯 Categories:', categories);
                        console.log('📏 Radius:', radius, 'meters');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _loop_1 = function (category) {
                            var searchQuery, places, filteredPlaces, _c, filteredPlaces_1, place, isDuplicate, _d, existingBusiness, duplicateError, error_2, details, qualityScore, description, businessData, _e, insertResult, error, error_3;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        console.log("\uD83D\uDD0D Discovering ".concat(category, " businesses..."));
                                        searchQuery = category.toLowerCase();
                                        if (category === 'Restaurants') {
                                            searchQuery = 'restaurant food dining cafe';
                                        }
                                        else if (category === 'Wellness') {
                                            searchQuery = 'spa wellness massage beauty salon';
                                        }
                                        else if (category === 'Shopping') {
                                            searchQuery = 'store shop mall market';
                                        }
                                        else if (category === 'Entertainment') {
                                            searchQuery = 'entertainment attraction activity';
                                        }
                                        return [4 /*yield*/, googlePlacesService.searchBusinessesByText(searchQuery, location.lat, location.lng, radius)];
                                    case 1:
                                        places = _f.sent();
                                        filteredPlaces = places.filter(function (place) {
                                            console.log("\uD83D\uDD0D Checking business: ".concat(place.name, ", types: ").concat(place.types.join(', ')));
                                            if (category === 'Restaurants') {
                                                // Must have restaurant-related types
                                                var hasRestaurantType = place.types.some(function (type) {
                                                    return ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery'].includes(type);
                                                });
                                                // Must NOT have non-restaurant types
                                                var hasNonRestaurantType = place.types.some(function (type) {
                                                    return ['lodging', 'spa', 'beauty_salon', 'tourist_attraction', 'amusement_park',
                                                        'hotel', 'resort', 'gym', 'health', 'hospital', 'store', 'shopping_mall'].includes(type);
                                                });
                                                var isRestaurant = hasRestaurantType && !hasNonRestaurantType;
                                                console.log("\uD83C\uDF7D\uFE0F ".concat(place.name, " - hasRestaurantType: ").concat(hasRestaurantType, ", hasNonRestaurantType: ").concat(hasNonRestaurantType, ", isRestaurant: ").concat(isRestaurant));
                                                return isRestaurant;
                                            }
                                            else if (category === 'Wellness') {
                                                var isWellness = place.types.some(function (type) {
                                                    return ['spa', 'beauty_salon', 'health', 'gym', 'physiotherapist'].includes(type);
                                                });
                                                console.log("\uD83D\uDC86 ".concat(place.name, " is wellness: ").concat(isWellness));
                                                return isWellness;
                                            }
                                            else if (category === 'Shopping') {
                                                var isShopping = place.types.some(function (type) {
                                                    return ['store', 'shopping_mall', 'clothing_store', 'electronics_store', 'supermarket'].includes(type);
                                                });
                                                console.log("\uD83D\uDECD\uFE0F ".concat(place.name, " is shopping: ").concat(isShopping));
                                                return isShopping;
                                            }
                                            else if (category === 'Entertainment') {
                                                var isEntertainment = place.types.some(function (type) {
                                                    return ['tourist_attraction', 'amusement_park', 'night_club', 'entertainment', 'movie_theater'].includes(type);
                                                });
                                                console.log("\uD83C\uDFAF ".concat(place.name, " is entertainment: ").concat(isEntertainment));
                                                return isEntertainment;
                                            }
                                            return false; // Default to false for strict filtering
                                        });
                                        result.discovered += filteredPlaces.length;
                                        console.log("\uD83D\uDCCA Found ".concat(filteredPlaces.length, " ").concat(category, " businesses after filtering"));
                                        _c = 0, filteredPlaces_1 = filteredPlaces;
                                        _f.label = 2;
                                    case 2:
                                        if (!(_c < filteredPlaces_1.length)) return [3 /*break*/, 12];
                                        place = filteredPlaces_1[_c];
                                        _f.label = 3;
                                    case 3:
                                        _f.trys.push([3, 10, , 11]);
                                        console.log("\n\uD83D\uDD0D Processing business: ".concat(place.name));
                                        console.log("   \uD83D\uDCCD Location: ".concat(place.vicinity));
                                        console.log("   \uD83C\uDFF7\uFE0F Types: ".concat(place.types.join(', ')));
                                        console.log("   \u2B50 Rating: ".concat(place.rating || 'N/A'));
                                        console.log("   \uD83D\uDCB0 Price Level: ".concat(place.price_level || 'N/A'));
                                        isDuplicate = false;
                                        _f.label = 4;
                                    case 4:
                                        _f.trys.push([4, 6, , 7]);
                                        console.log("   \uD83D\uDD0D Checking for duplicates with google_place_id: ".concat(place.place_id));
                                        return [4 /*yield*/, supabase
                                                .from('suggested_businesses')
                                                .select('id, name, curation_status')
                                                .eq('google_place_id', place.place_id)
                                                .maybeSingle()];
                                    case 5:
                                        _d = _f.sent(), existingBusiness = _d.data, duplicateError = _d.error;
                                        if (duplicateError) {
                                            console.log("   \u26A0\uFE0F Duplicate check failed for ".concat(place.name, ":"), duplicateError.message);
                                        }
                                        else if (existingBusiness) {
                                            isDuplicate = true;
                                            console.log("   \u274C DUPLICATE FOUND: ".concat(place.name, " already exists with status: ").concat(existingBusiness.curation_status));
                                        }
                                        else {
                                            console.log("   \u2705 No duplicate found - proceeding with ".concat(place.name));
                                        }
                                        return [3 /*break*/, 7];
                                    case 6:
                                        error_2 = _f.sent();
                                        console.log("   \u26A0\uFE0F Duplicate check error for ".concat(place.name, ":"), error_2);
                                        return [3 /*break*/, 7];
                                    case 7:
                                        if (isDuplicate) {
                                            console.log("   \u23ED\uFE0F SKIPPING DUPLICATE: ".concat(place.name));
                                            result.duplicates++;
                                            return [3 /*break*/, 11];
                                        }
                                        // Apply quality filters
                                        console.log("   \uD83C\uDFAF Applying quality filters...");
                                        if (!this_1.passesQualityFilters(place, filters)) {
                                            console.log("   \u274C FAILED QUALITY FILTERS: ".concat(place.name));
                                            return [3 /*break*/, 11];
                                        }
                                        // [2024-12-19 18:00 UTC] - Always fetch detailed contact information
                                        console.log("   \uD83D\uDCDE Fetching detailed contact info for: ".concat(place.name));
                                        return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                                    case 8:
                                        details = _f.sent();
                                        qualityScore = this_1.calculateQualityScore(place);
                                        console.log("   \uD83D\uDCCA Quality score calculated: ".concat(qualityScore));
                                        description = this_1.generateBusinessDescription(place, details);
                                        businessData = {
                                            google_place_id: place.place_id,
                                            name: place.name,
                                            address: (details === null || details === void 0 ? void 0 : details.formatted_address) || place.vicinity,
                                            latitude: place.geometry.location.lat,
                                            longitude: place.geometry.location.lng,
                                            phone: (details === null || details === void 0 ? void 0 : details.formatted_phone_number) || null,
                                            website_url: (details === null || details === void 0 ? void 0 : details.website) || null,
                                            google_rating: place.rating || null,
                                            google_review_count: (details === null || details === void 0 ? void 0 : details.user_ratings_total) || 0,
                                            google_price_level: place.price_level || null,
                                            google_types: place.types,
                                            primary_category: category,
                                            quality_score: qualityScore,
                                            curation_status: 'pending',
                                            discovery_source: 'automated_discovery',
                                            discovery_criteria: {
                                                location: location,
                                                category: category,
                                                radius: radius,
                                                filters: filters,
                                                discoveredAt: new Date().toISOString()
                                            }
                                        };
                                        console.log("   \uD83D\uDCCB Business data prepared for insertion:", {
                                            name: businessData.name,
                                            phone: businessData.phone || 'NOT AVAILABLE',
                                            website: businessData.website_url || 'NOT AVAILABLE',
                                            quality_score: businessData.quality_score
                                        });
                                        // Insert into database
                                        console.log("   \uD83D\uDCBE INSERTING: ".concat(place.name, " into suggested_businesses table"));
                                        console.log("      \uD83D\uDCCA Data: Category=".concat(category, ", Rating=").concat(place.rating, ", Types=").concat(place.types.join(', ')));
                                        return [4 /*yield*/, supabase
                                                .from('suggested_businesses')
                                                .insert(businessData)
                                                .select('id, name')];
                                    case 9:
                                        _e = _f.sent(), insertResult = _e.data, error = _e.error;
                                        if (error) {
                                            console.error("   \u274C INSERT FAILED for ".concat(place.name, ":"), error.message);
                                            console.error("   \uD83D\uDCCB Error details:", error);
                                            result.errors.push("".concat(place.name, ": ").concat(error.message));
                                        }
                                        else {
                                            result.added++;
                                            console.log("   \u2705 INSERT SUCCESS: ".concat(place.name, " added with ID=").concat((_a = insertResult === null || insertResult === void 0 ? void 0 : insertResult[0]) === null || _a === void 0 ? void 0 : _a.id));
                                            console.log("      \uD83D\uDCCA Total added so far: ".concat(result.added));
                                        }
                                        return [3 /*break*/, 11];
                                    case 10:
                                        error_3 = _f.sent();
                                        console.error("   \uD83D\uDCA5 PROCESSING ERROR for ".concat(place.name, ":"), error_3);
                                        result.errors.push("Error processing ".concat(place.name, ": ").concat(error_3));
                                        return [3 /*break*/, 11];
                                    case 11:
                                        _c++;
                                        return [3 /*break*/, 2];
                                    case 12: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, categories_2 = categories;
                        _b.label = 2;
                    case 2:
                        if (!(_i < categories_2.length)) return [3 /*break*/, 5];
                        category = categories_2[_i];
                        return [5 /*yield**/, _loop_1(category)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        console.log('📊 Discovery Results:', result);
                        return [2 /*return*/, result];
                    case 6:
                        error_1 = _b.sent();
                        console.error('💥 Discovery error:', error_1);
                        result.errors.push("Discovery error: ".concat(error_1));
                        return [2 /*return*/, result];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Check if a place passes quality filters
    DiscoveryService.prototype.passesQualityFilters = function (place, filters) {
        console.log("     \uD83D\uDD0D Quality check for ".concat(place.name, ":"));
        console.log("       \u2B50 Rating: ".concat(place.rating || 'N/A', " (min required: ").concat(filters.minRating || 'none', ")"));
        console.log("       \uD83D\uDCDD Review count: ".concat(place.user_ratings_total || 'N/A', " (min required: ").concat(filters.minReviewCount || 'none', ")"));
        console.log("       \uD83D\uDCB0 Price level: ".concat(place.price_level || 'N/A'));
        console.log("       \uD83C\uDFF7\uFE0F Types: ".concat(place.types.join(', ')));
        // Check minimum rating
        if (filters.minRating && place.rating && place.rating < filters.minRating) {
            console.log("       \u274C FAILED rating check: ".concat(place.rating, " < ").concat(filters.minRating));
            return false;
        }
        // Check minimum review count - be more lenient
        if (filters.minReviewCount && place.user_ratings_total && place.user_ratings_total < filters.minReviewCount) {
            console.log("       \u274C FAILED review count check: ".concat(place.user_ratings_total, " < ").concat(filters.minReviewCount));
            return false;
        }
        // Check required types
        if (filters.requiredTypes && filters.requiredTypes.length > 0) {
            var hasRequiredType = filters.requiredTypes.some(function (type) {
                return place.types.includes(type);
            });
            if (!hasRequiredType) {
                console.log("       \u274C FAILED required types check. Required: ".concat(filters.requiredTypes.join(', '), ", Has: ").concat(place.types.join(', ')));
                return false;
            }
            else {
                console.log("       \u2705 PASSED required types check");
            }
        }
        // Check excluded types
        if (filters.excludedTypes && filters.excludedTypes.length > 0) {
            var hasExcludedType = filters.excludedTypes.some(function (type) {
                return place.types.includes(type);
            });
            if (hasExcludedType) {
                console.log("       \u274C FAILED excluded types check. Has excluded type: ".concat(place.types.join(', ')));
                return false;
            }
            else {
                console.log("       \u2705 PASSED excluded types check");
            }
        }
        // Check price level
        if (filters.priceLevel && filters.priceLevel.length > 0) {
            if (place.price_level && !filters.priceLevel.includes(place.price_level)) {
                console.log("       \u274C FAILED price level check: ".concat(place.price_level, " not in ").concat(filters.priceLevel.join(', ')));
                return false;
            }
        }
        console.log("       \u2705 PASSED all quality filters");
        return true;
    };
    // Calculate quality score (0-100)
    DiscoveryService.prototype.calculateQualityScore = function (place) {
        var score = 0;
        // Rating component (0-40 points)
        if (place.rating) {
            score += Math.min(place.rating * 8, 40);
        }
        // Review count component (0-25 points) - estimated since we don't have exact count
        var estimatedReviews = place.rating ? Math.max(place.rating * 20, 10) : 10;
        score += Math.min(estimatedReviews / 4, 25);
        // Business status component (0-15 points)
        if (place.business_status === 'OPERATIONAL') {
            score += 15;
        }
        // Type relevance component (0-10 points)
        var importantTypes = ['restaurant', 'spa', 'store', 'cafe', 'shopping_mall'];
        if (place.types.some(function (type) { return importantTypes.includes(type); })) {
            score += 10;
        }
        // Price level component (0-10 points) - having a price level is good
        if (place.price_level) {
            score += 10;
        }
        return Math.round(Math.min(score, 100));
    };
    // Create a new discovery campaign
    DiscoveryService.prototype.createDiscoveryCampaign = function (campaignData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('discovery_campaigns')
                                .insert({
                                name: campaignData.name,
                                description: campaignData.description,
                                target_location: campaignData.targetLocation,
                                center_latitude: campaignData.centerLatitude,
                                center_longitude: campaignData.centerLongitude,
                                search_radius: campaignData.searchRadius,
                                target_categories: campaignData.targetCategories,
                                quality_filters: campaignData.qualityFilters,
                                run_frequency: campaignData.runFrequency,
                                campaign_status: 'active',
                                next_run_at: new Date().toISOString()
                            })
                                .select('id')
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error creating campaign:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data.id];
                    case 2:
                        error_4 = _b.sent();
                        console.error('Error creating discovery campaign:', error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Generate comprehensive business description based on available data
    DiscoveryService.prototype.generateBusinessDescription = function (place, details) {
        var parts = [];
        // Add category-specific description
        if (place.types.includes('restaurant')) {
            parts.push('Restaurant serving delicious local and international cuisine');
        }
        else if (place.types.includes('cafe')) {
            parts.push('Cozy cafe perfect for coffee and light meals');
        }
        else if (place.types.includes('spa')) {
            parts.push('Relaxing spa offering wellness and beauty treatments');
        }
        else if (place.types.includes('store') || place.types.includes('shopping_mall')) {
            parts.push('Local store offering quality products and services');
        }
        else if (place.types.includes('tourist_attraction')) {
            parts.push('Popular attraction offering entertainment and experiences');
        }
        else {
            parts.push('Local business serving the community');
        }
        // Add rating info
        if (place.rating) {
            if (place.rating >= 4.5) {
                parts.push("Highly rated with ".concat(place.rating, "/5 stars"));
            }
            else if (place.rating >= 4.0) {
                parts.push("Well-rated with ".concat(place.rating, "/5 stars"));
            }
            else {
                parts.push("Rated ".concat(place.rating, "/5 stars"));
            }
        }
        // Add price level info
        if (place.price_level) {
            var priceText = place.price_level === 1 ? 'Budget-friendly pricing' :
                place.price_level === 2 ? 'Moderately priced' :
                    place.price_level === 3 ? 'Upscale establishment' :
                        'Fine dining experience';
            parts.push(priceText);
        }
        // Add operational status
        if ((details === null || details === void 0 ? void 0 : details.business_status) === 'OPERATIONAL') {
            parts.push('Currently operational and serving customers');
        }
        // Add location context
        parts.push('Located in the heart of Hua Hin');
        return parts.join('. ') + '.';
    };
    // [2025-01-06 12:15 UTC] - Clear search history when pipeline is critically low
    DiscoveryService.prototype.clearSearchHistory = function () {
        console.log('🧹 Clearing search history to allow fresh discovery');
        this.searchHistory.clear();
    };
    // [2024-12-19 19:30 UTC] - Intelligent pipeline system with force option
    DiscoveryService.prototype.maintainPipelineQueue = function () {
        return __awaiter(this, arguments, void 0, function (category, forceDiscovery) {
            var currentPending;
            if (category === void 0) { category = 'Restaurants'; }
            if (forceDiscovery === void 0) { forceDiscovery = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83E\uDDE0 INTELLIGENT PIPELINE: Maintaining queue for ".concat(category, " (force: ").concat(forceDiscovery, ")"));
                        return [4 /*yield*/, this.getCurrentPendingCount()];
                    case 1:
                        currentPending = _a.sent();
                        console.log("\uD83D\uDCCA Current pending businesses: ".concat(currentPending));
                        // [2025-01-06 12:15 UTC] - Clear search history if pipeline is critically low
                        if (currentPending < 5) {
                            console.log("\uD83D\uDEA8 CRITICAL: Only ".concat(currentPending, " pending businesses - clearing search history for fresh discovery"));
                            this.clearSearchHistory();
                        }
                        if (!forceDiscovery && currentPending >= this.pipelineConfig.minPendingBusinesses) {
                            console.log("\u2705 Pipeline healthy: ".concat(currentPending, " >= ").concat(this.pipelineConfig.minPendingBusinesses, " (minimum)"));
                            return [2 /*return*/, { discovered: 0, added: 0, duplicates: 0, errors: ['Pipeline queue sufficient - use force option to discover anyway'] }];
                        }
                        if (forceDiscovery) {
                            console.log("\uD83D\uDD04 FORCED Discovery: User manually triggered ".concat(category, " discovery"));
                            // Also clear search history for forced discovery to ensure fresh results
                            this.clearSearchHistory();
                        }
                        else {
                            console.log("\uD83D\uDD04 Pipeline needs refill: ".concat(currentPending, " < ").concat(this.pipelineConfig.minPendingBusinesses, " (minimum)"));
                        }
                        return [4 /*yield*/, this.intelligentDiscovery(category)];
                    case 2: 
                    // Step 2: Intelligent discovery with location and category fallbacks
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Get current pending business count
    DiscoveryService.prototype.getCurrentPendingCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, count, error, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('*', { count: 'exact', head: true })
                                .eq('curation_status', 'pending')];
                    case 1:
                        _a = _b.sent(), count = _a.count, error = _a.error;
                        if (error) {
                            console.error('Error getting pending count:', error);
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/, count || 0];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Error in getCurrentPendingCount:', error_5);
                        return [2 /*return*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Intelligent discovery with automatic fallbacks
    DiscoveryService.prototype.intelligentDiscovery = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var result, apiCallCount, maxApiCalls, categoryQueries, locations, consecutiveDuplicateSearches, _i, locations_1, location_1, limitedQueries, _a, limitedQueries_1, query, searchKey, radius, places, processed, expandedResult, relaxedResult;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        result = { discovered: 0, added: 0, duplicates: 0, errors: [] };
                        apiCallCount = 0;
                        maxApiCalls = this.pipelineConfig.maxApiCallsPerSession;
                        console.log("\uD83D\uDEA8 DISCOVERY LIMITS: Max ".concat(maxApiCalls, " API calls, max ").concat(this.pipelineConfig.maxTotalDiscovered, " businesses"));
                        categoryQueries = this.getCategoryQueries(category);
                        locations = this.pipelineConfig.locationFallbacks
                            .sort(function (a, b) { return a.priority - b.priority; })
                            .slice(0, this.pipelineConfig.maxLocationsToSearch);
                        console.log("\uD83D\uDCCD Searching ".concat(locations.length, " locations with max ").concat(this.pipelineConfig.maxQueriesPerLocation, " queries each"));
                        consecutiveDuplicateSearches = 0;
                        _i = 0, locations_1 = locations;
                        _e.label = 1;
                    case 1:
                        if (!(_i < locations_1.length)) return [3 /*break*/, 7];
                        location_1 = locations_1[_i];
                        if (result.added >= this.pipelineConfig.targetPendingBusinesses) {
                            console.log("\uD83C\uDFAF Target reached: ".concat(result.added, " businesses added"));
                            return [3 /*break*/, 7];
                        }
                        if (result.discovered >= this.pipelineConfig.maxTotalDiscovered) {
                            console.log("\uD83D\uDEA8 Discovery limit reached: ".concat(result.discovered, " businesses discovered"));
                            result.errors.push("Discovery stopped at limit: ".concat(this.pipelineConfig.maxTotalDiscovered, " businesses"));
                            return [3 /*break*/, 7];
                        }
                        if (apiCallCount >= maxApiCalls) {
                            console.log("\uD83D\uDEA8 API call limit reached: ".concat(apiCallCount, "/").concat(maxApiCalls, " calls made"));
                            result.errors.push("API call limit reached: ".concat(maxApiCalls, " calls"));
                            return [3 /*break*/, 7];
                        }
                        limitedQueries = categoryQueries.slice(0, this.pipelineConfig.maxQueriesPerLocation);
                        _a = 0, limitedQueries_1 = limitedQueries;
                        _e.label = 2;
                    case 2:
                        if (!(_a < limitedQueries_1.length)) return [3 /*break*/, 6];
                        query = limitedQueries_1[_a];
                        if (apiCallCount >= maxApiCalls) {
                            console.log("\uD83D\uDEA8 API call limit reached during query loop");
                            return [3 /*break*/, 6];
                        }
                        searchKey = "".concat(location_1.name, "-").concat(query);
                        // Skip if searched recently (within 1 hour)
                        if (this.wasSearchedRecently(searchKey)) {
                            console.log("\u23ED\uFE0F Skipping recent search: ".concat(searchKey));
                            return [3 /*break*/, 5];
                        }
                        console.log("\uD83D\uDD0D API Call ".concat(apiCallCount + 1, "/").concat(maxApiCalls, ": \"").concat(query, "\" near ").concat(location_1.name));
                        radius = 5000;
                        if (consecutiveDuplicateSearches >= 3) {
                            radius = 10000; // Expand to 10km
                            console.log("\uD83D\uDD04 Expanding search radius to ".concat(radius, "m due to duplicate saturation"));
                        }
                        if (consecutiveDuplicateSearches >= 6) {
                            radius = 15000; // Expand to 15km
                            console.log("\uD83D\uDD04 Further expanding search radius to ".concat(radius, "m"));
                        }
                        apiCallCount++;
                        return [4 /*yield*/, googlePlacesService.searchBusinessesByText(query, location_1.lat, location_1.lng, radius)];
                    case 3:
                        places = _e.sent();
                        console.log("\uD83D\uDCCD ".concat(location_1.name, " (").concat(radius, "m): Found ").concat(places.length, " places"));
                        if (places.length === 0) {
                            console.log("\u274C No results for ".concat(query, " near ").concat(location_1.name));
                            return [3 /*break*/, 5];
                        }
                        // Mark this search as completed
                        this.markSearchCompleted(searchKey);
                        return [4 /*yield*/, this.processBusinessesIntelligently(places, category, location_1.name)];
                    case 4:
                        processed = _e.sent();
                        result.discovered += processed.discovered;
                        result.added += processed.added;
                        result.duplicates += processed.duplicates;
                        (_b = result.errors).push.apply(_b, processed.errors);
                        // [2025-01-06 12:30 UTC] - Track consecutive duplicate searches
                        if (processed.added === 0 && processed.discovered > 0) {
                            consecutiveDuplicateSearches++;
                            console.log("\u26A0\uFE0F No new businesses added (".concat(consecutiveDuplicateSearches, " consecutive duplicate searches)"));
                        }
                        else if (processed.added > 0) {
                            consecutiveDuplicateSearches = 0; // Reset counter when we find new businesses
                        }
                        console.log("\uD83D\uDCCA Progress: ".concat(result.discovered, " discovered, ").concat(result.added, " added (API calls: ").concat(apiCallCount, "/").concat(maxApiCalls, ")"));
                        if (result.added >= this.pipelineConfig.targetPendingBusinesses) {
                            console.log("\uD83C\uDFAF Target reached: ".concat(result.added, " businesses added"));
                            return [2 /*return*/, result];
                        }
                        if (result.discovered >= this.pipelineConfig.maxTotalDiscovered) {
                            console.log("\uD83D\uDEA8 Discovery limit reached: ".concat(result.discovered, " businesses discovered"));
                            result.errors.push("Discovery stopped at limit: ".concat(this.pipelineConfig.maxTotalDiscovered, " businesses"));
                            return [2 /*return*/, result];
                        }
                        _e.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 2];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        if (!(result.added < 5 && apiCallCount < maxApiCalls && consecutiveDuplicateSearches >= 3)) return [3 /*break*/, 9];
                        console.log("\uD83C\uDF0D EXPANDING SEARCH: Local area saturated, searching wider region...");
                        return [4 /*yield*/, this.expandedAreaSearch(category, maxApiCalls - apiCallCount)];
                    case 8:
                        expandedResult = _e.sent();
                        result.discovered += expandedResult.discovered;
                        result.added += expandedResult.added;
                        result.duplicates += expandedResult.duplicates;
                        (_c = result.errors).push.apply(_c, expandedResult.errors);
                        return [3 /*break*/, 11];
                    case 9:
                        if (!(result.added < 5 && apiCallCount < maxApiCalls)) return [3 /*break*/, 11];
                        console.log("\u26A0\uFE0F Low results (".concat(result.added, "), trying relaxed category filtering..."));
                        return [4 /*yield*/, this.relaxedCategorySearch(category)];
                    case 10:
                        relaxedResult = _e.sent();
                        result.discovered += relaxedResult.discovered;
                        result.added += relaxedResult.added;
                        result.duplicates += relaxedResult.duplicates;
                        (_d = result.errors).push.apply(_d, relaxedResult.errors);
                        _e.label = 11;
                    case 11:
                        console.log("\uD83D\uDCCA Intelligent Discovery Complete: ".concat(apiCallCount, " API calls made"));
                        console.log("\uD83D\uDCCA Final Results:", result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Get category-specific search queries
    DiscoveryService.prototype.getCategoryQueries = function (category) {
        var queryMap = {
            'Restaurants': [
                // Tier 1 - Essential searches for Thai coastal areas
                'thai traditional restaurant',
                'fresh seafood restaurant',
                'street food vendor',
                'chinese thai restaurant',
                'international restaurant',
                // Tier 2 - Important cuisines
                'indian restaurant',
                'japanese restaurant',
                'italian restaurant',
                'fusion restaurant',
                'bbq grill restaurant',
                // Tier 3 - Growing market
                'korean restaurant',
                'vietnamese restaurant',
                'halal restaurant',
                'vegetarian vegan restaurant',
                'cafe coffee shop',
                // Dining style searches
                'beachfront restaurant',
                'waterfront dining',
                'night market food',
                'food court',
                'fine dining',
                'casual dining',
                // Legacy/additional terms
                'restaurant',
                'thai restaurant',
                'seafood restaurant',
                'local restaurant',
                'noodle shop',
                'barbecue grill',
                'pizza restaurant',
                'chinese restaurant',
                'western restaurant',
                'buffet restaurant',
                'family restaurant',
                'local food',
                'authentic thai food',
                'grilled fish',
                'som tam restaurant',
                'pad thai restaurant',
                'curry restaurant'
            ],
            'Wellness': [
                'spa massage',
                'beauty salon',
                'wellness center',
                'fitness gym',
                'yoga studio'
            ],
            'Shopping': [
                'shopping mall',
                'local market',
                'clothing store',
                'souvenir shop',
                'convenience store'
            ],
            'Entertainment': [
                'tourist attraction',
                'entertainment',
                'night market',
                'cultural site',
                'recreation'
            ]
        };
        return queryMap[category] || ['business', 'establishment'];
    };
    // Check if search was done recently
    DiscoveryService.prototype.wasSearchedRecently = function (searchKey) {
        var lastSearch = this.searchHistory.get(searchKey);
        if (!lastSearch)
            return false;
        var oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return lastSearch > oneHourAgo;
    };
    // Mark search as completed
    DiscoveryService.prototype.markSearchCompleted = function (searchKey) {
        this.searchHistory.set(searchKey, new Date());
    };
    // Process businesses with intelligent filtering
    DiscoveryService.prototype.processBusinessesIntelligently = function (places, category, locationName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, filteredPlaces, _i, filteredPlaces_2, place, isDuplicate, details, businessData, _a, insertResult, error, error_6;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = { discovered: 0, added: 0, duplicates: 0, errors: [] };
                        filteredPlaces = this.applyIntelligentFiltering(places, category);
                        result.discovered = filteredPlaces.length;
                        console.log("\uD83E\uDDE0 Intelligent filtering: ".concat(places.length, " \u2192 ").concat(filteredPlaces.length, " businesses"));
                        _i = 0, filteredPlaces_2 = filteredPlaces;
                        _c.label = 1;
                    case 1:
                        if (!(_i < filteredPlaces_2.length)) return [3 /*break*/, 8];
                        place = filteredPlaces_2[_i];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.checkForDuplicates(place)];
                    case 3:
                        isDuplicate = _c.sent();
                        if (isDuplicate) {
                            result.duplicates++;
                            return [3 /*break*/, 7];
                        }
                        return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                    case 4:
                        details = _c.sent();
                        businessData = {
                            google_place_id: place.place_id,
                            name: place.name,
                            address: (details === null || details === void 0 ? void 0 : details.formatted_address) || place.vicinity,
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng,
                            phone: (details === null || details === void 0 ? void 0 : details.formatted_phone_number) || null,
                            website_url: (details === null || details === void 0 ? void 0 : details.website) || null,
                            google_rating: place.rating || null,
                            google_review_count: (details === null || details === void 0 ? void 0 : details.user_ratings_total) || 0,
                            google_price_level: place.price_level || null,
                            google_types: place.types,
                            primary_category: category,
                            quality_score: this.calculateQualityScore(place),
                            curation_status: 'pending',
                            discovery_source: 'intelligent_pipeline',
                            discovery_criteria: {
                                location: locationName,
                                category: category,
                                discoveredAt: new Date().toISOString(),
                                pipelineVersion: '2.0'
                            }
                        };
                        // Insert into database
                        console.log("   \uD83D\uDCBE INSERTING: ".concat(place.name, " into suggested_businesses table"));
                        console.log("      \uD83D\uDCCA Data: Category=".concat(category, ", Rating=").concat(place.rating, ", Types=").concat(place.types.join(', ')));
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .insert(businessData)
                                .select('id, name')];
                    case 5:
                        _a = _c.sent(), insertResult = _a.data, error = _a.error;
                        if (error) {
                            console.error("   \u274C INSERT FAILED for ".concat(place.name, ":"), error.message);
                            console.error("   \uD83D\uDCCB Error details:", error);
                            result.errors.push("".concat(place.name, ": ").concat(error.message));
                        }
                        else {
                            result.added++;
                            console.log("   \u2705 INSERT SUCCESS: ".concat(place.name, " added with ID=").concat((_b = insertResult === null || insertResult === void 0 ? void 0 : insertResult[0]) === null || _b === void 0 ? void 0 : _b.id));
                            console.log("      \uD83D\uDCCA Total added so far: ".concat(result.added));
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_6 = _c.sent();
                        console.error("\uD83D\uDCA5 Error processing ".concat(place.name, ":"), error_6);
                        result.errors.push("".concat(place.name, ": ").concat(error_6));
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    // Apply intelligent filtering based on category
    DiscoveryService.prototype.applyIntelligentFiltering = function (places, category) {
        console.log("\uD83D\uDD0D FILTERING: Applying strict ".concat(category, " filtering to ").concat(places.length, " places"));
        return places.filter(function (place) {
            console.log("   \uD83C\uDFEA Checking: ".concat(place.name, " - Types: ").concat(place.types.join(', ')));
            if (category === 'Restaurants') {
                // STRICT restaurant filtering - must have food-related type
                var foodTypes_1 = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                var hasFoodType = place.types.some(function (type) { return foodTypes_1.includes(type); });
                // STRICT exclusion of non-food businesses
                var nonFoodTypes_1 = [
                    'lodging', 'hospital', 'bank', 'gas_station', 'car_repair', 'pharmacy',
                    'clothing_store', 'electronics_store', 'jewelry_store', 'shoe_store',
                    'book_store', 'furniture_store', 'home_goods_store', 'hardware_store',
                    'beauty_salon', 'hair_care', 'spa', 'gym', 'dentist', 'doctor',
                    'lawyer', 'real_estate_agency', 'insurance_agency', 'travel_agency',
                    'tourist_attraction', 'amusement_park', 'zoo', 'museum',
                    'school', 'university', 'library', 'church', 'mosque', 'temple',
                    'post_office', 'police', 'fire_station', 'government_office',
                    'atm', 'storage', 'moving_company', 'taxi_stand', 'bus_station',
                    'subway_station', 'train_station', 'airport', 'parking',
                    'car_dealer', 'car_rental', 'car_wash', 'bicycle_store',
                    'pet_store', 'veterinary_care', 'florist', 'funeral_home',
                    'laundry', 'dry_cleaning', 'locksmith', 'plumber', 'electrician'
                ];
                var hasNonFoodType = place.types.some(function (type) { return nonFoodTypes_1.includes(type); });
                // Must have food type AND not have non-food type
                var isRestaurant = hasFoodType && !hasNonFoodType;
                console.log("     \uD83C\uDF7D\uFE0F Food type: ".concat(hasFoodType ? '✅' : '❌', " | Non-food type: ").concat(hasNonFoodType ? '❌' : '✅', " | Result: ").concat(isRestaurant ? 'ACCEPT' : 'REJECT'));
                return isRestaurant;
            }
            if (category === 'Wellness') {
                var wellnessTypes_1 = ['spa', 'beauty_salon', 'hair_care', 'gym', 'physiotherapist', 'dentist', 'doctor'];
                var hasWellnessType = place.types.some(function (type) { return wellnessTypes_1.includes(type); });
                console.log("     \uD83D\uDC86 Wellness check: ".concat(hasWellnessType ? 'ACCEPT' : 'REJECT'));
                return hasWellnessType;
            }
            if (category === 'Shopping') {
                var shoppingTypes_1 = [
                    'shopping_mall', 'store', 'clothing_store', 'electronics_store',
                    'jewelry_store', 'shoe_store', 'book_store', 'furniture_store',
                    'home_goods_store', 'hardware_store', 'convenience_store'
                ];
                var hasShoppingType = place.types.some(function (type) { return shoppingTypes_1.includes(type); });
                console.log("     \uD83D\uDECD\uFE0F Shopping check: ".concat(hasShoppingType ? 'ACCEPT' : 'REJECT'));
                return hasShoppingType;
            }
            if (category === 'Entertainment') {
                var entertainmentTypes_1 = [
                    'tourist_attraction', 'amusement_park', 'zoo', 'museum',
                    'night_club', 'bar', 'movie_theater', 'bowling_alley'
                ];
                var hasEntertainmentType = place.types.some(function (type) { return entertainmentTypes_1.includes(type); });
                console.log("     \uD83C\uDFAD Entertainment check: ".concat(hasEntertainmentType ? 'ACCEPT' : 'REJECT'));
                return hasEntertainmentType;
            }
            // Default: reject unknown categories
            console.log("     \u2753 Unknown category: REJECT");
            return false;
        });
    };
    // Check for duplicates
    DiscoveryService.prototype.checkForDuplicates = function (place) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, existing, error, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("   \uD83D\uDD0D DUPLICATE CHECK: ".concat(place.name, " (").concat(place.place_id, ")"));
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('id, name, curation_status, created_at')
                                .eq('google_place_id', place.place_id)
                                .maybeSingle()];
                    case 1:
                        _a = _b.sent(), existing = _a.data, error = _a.error;
                        if (error) {
                            console.log("   \u26A0\uFE0F Duplicate check error for ".concat(place.name, ":"), error.message);
                            return [2 /*return*/, false];
                        }
                        if (existing) {
                            console.log("   \u274C DUPLICATE FOUND: ".concat(place.name, " already exists in database"));
                            console.log("      \uD83D\uDCCA Existing: ID=".concat(existing.id, ", Status=").concat(existing.curation_status, ", Created=").concat(existing.created_at));
                            return [2 /*return*/, true];
                        }
                        else {
                            console.log("   \u2705 NO DUPLICATE: ".concat(place.name, " is NEW - proceeding to add"));
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        console.error("   \uD83D\uDCA5 Duplicate check error for ".concat(place.name, ":"), error_7);
                        return [2 /*return*/, false]; // Assume not duplicate if check fails
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Relaxed category search as fallback - MUCH MORE STRICT
    DiscoveryService.prototype.relaxedCategorySearch = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var places, restaurantBusinesses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDD04 Attempting STRICT relaxed search for ".concat(category, "..."));
                        if (!(category === 'Restaurants')) return [3 /*break*/, 3];
                        return [4 /*yield*/, googlePlacesService.searchBusinessesByText('restaurant food dining', 12.5684, // Hua Hin center
                            99.9578, 8000 // 8km radius
                            )];
                    case 1:
                        places = _a.sent();
                        restaurantBusinesses = this.applyIntelligentFiltering(places, 'Restaurants');
                        console.log("\uD83D\uDD04 Relaxed restaurant search: ".concat(places.length, " \u2192 ").concat(restaurantBusinesses.length, " after filtering"));
                        return [4 /*yield*/, this.processBusinessesIntelligently(restaurantBusinesses.slice(0, 5), category, 'Strict Relaxed Search')];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        // For other categories, return empty result rather than accepting random businesses
                        console.log("\uD83D\uDD04 No relaxed search implemented for ".concat(category, " - returning empty result"));
                        return [2 /*return*/, { discovered: 0, added: 0, duplicates: 0, errors: ["No relaxed search available for ".concat(category)] }];
                }
            });
        });
    };
    // Updated main discovery function to use intelligent pipeline
    DiscoveryService.prototype.runHuaHinRestaurantDiscovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🧠 Starting Intelligent Restaurant Discovery Pipeline...');
                        return [4 /*yield*/, this.maintainPipelineQueue('Restaurants')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Run discovery for multiple categories in Hua Hin
    DiscoveryService.prototype.runMultiCategoryDiscovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var huaHinLocation, categories, filters;
            return __generator(this, function (_a) {
                huaHinLocation = { lat: 12.5684, lng: 99.9578 };
                categories = ['Restaurants', 'Wellness', 'Shopping'];
                filters = {
                    minRating: 4.0,
                    minReviewCount: 20
                };
                return [2 /*return*/, this.runDiscoveryForLocation(huaHinLocation, categories, 3000, filters)];
            });
        });
    };
    // Run discovery for Hua Hin wellness/spa businesses
    DiscoveryService.prototype.runHuaHinWellnessDiscovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var huaHinLocation, categories, filters;
            return __generator(this, function (_a) {
                huaHinLocation = { lat: 12.5684, lng: 99.9578 };
                categories = ['Wellness'];
                filters = {
                    minRating: 4.0,
                    minReviewCount: 10
                };
                return [2 /*return*/, this.runDiscoveryForLocation(huaHinLocation, categories, 3000, filters)];
            });
        });
    };
    // Run discovery for Hua Hin shopping businesses  
    DiscoveryService.prototype.runHuaHinShoppingDiscovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var huaHinLocation, categories, filters;
            return __generator(this, function (_a) {
                huaHinLocation = { lat: 12.5684, lng: 99.9578 };
                categories = ['Shopping'];
                filters = {
                    minRating: 3.8,
                    minReviewCount: 5
                };
                return [2 /*return*/, this.runDiscoveryForLocation(huaHinLocation, categories, 4000, filters)];
            });
        });
    };
    // Run discovery for Hua Hin entertainment/attractions
    DiscoveryService.prototype.runHuaHinEntertainmentDiscovery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var huaHinLocation, categories, filters;
            return __generator(this, function (_a) {
                huaHinLocation = { lat: 12.5684, lng: 99.9578 };
                categories = ['Entertainment'];
                filters = {
                    minRating: 4.2,
                    minReviewCount: 20
                };
                return [2 /*return*/, this.runDiscoveryForLocation(huaHinLocation, categories, 5000, filters)];
            });
        });
    };
    // [2025-01-06 12:30 UTC] - Expanded area search when local area is saturated
    DiscoveryService.prototype.expandedAreaSearch = function (category, remainingApiCalls) {
        return __awaiter(this, void 0, void 0, function () {
            var result, expandedLocations, apiCallCount, categoryQueries, _i, expandedLocations_1, location_2, query, searchKey, radius, places, processed;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = { discovered: 0, added: 0, duplicates: 0, errors: [] };
                        expandedLocations = [
                            { name: 'Cha-am Beach', lat: 12.8000, lng: 99.9667, priority: 1 },
                            { name: 'Pranburi District', lat: 12.3900, lng: 99.9100, priority: 1 },
                            { name: 'Khao Sam Roi Yot', lat: 12.2000, lng: 99.9500, priority: 2 },
                            { name: 'Kui Buri', lat: 12.0833, lng: 99.8500, priority: 2 },
                            { name: 'Bang Saphan', lat: 11.2167, lng: 99.5167, priority: 3 },
                            { name: 'Chumphon', lat: 10.4930, lng: 99.1800, priority: 3 }
                        ];
                        console.log("\uD83C\uDF0D Searching ".concat(expandedLocations.length, " expanded locations with ").concat(remainingApiCalls, " API calls remaining"));
                        apiCallCount = 0;
                        categoryQueries = this.getCategoryQueries(category);
                        _i = 0, expandedLocations_1 = expandedLocations;
                        _b.label = 1;
                    case 1:
                        if (!(_i < expandedLocations_1.length)) return [3 /*break*/, 5];
                        location_2 = expandedLocations_1[_i];
                        if (apiCallCount >= remainingApiCalls) {
                            console.log("\uD83D\uDEA8 Expanded search API limit reached");
                            return [3 /*break*/, 5];
                        }
                        if (result.added >= 10) { // Lower target for expanded search
                            console.log("\uD83C\uDFAF Expanded search target reached: ".concat(result.added, " businesses added"));
                            return [3 /*break*/, 5];
                        }
                        query = categoryQueries[0];
                        searchKey = "expanded-".concat(location_2.name, "-").concat(query);
                        if (this.wasSearchedRecently(searchKey)) {
                            console.log("\u23ED\uFE0F Skipping recent expanded search: ".concat(searchKey));
                            return [3 /*break*/, 4];
                        }
                        console.log("\uD83C\uDF0D Expanded API Call ".concat(apiCallCount + 1, "/").concat(remainingApiCalls, ": \"").concat(query, "\" near ").concat(location_2.name));
                        apiCallCount++;
                        radius = 8000;
                        return [4 /*yield*/, googlePlacesService.searchBusinessesByText(query, location_2.lat, location_2.lng, radius)];
                    case 2:
                        places = _b.sent();
                        console.log("\uD83C\uDF0D ".concat(location_2.name, " (").concat(radius, "m): Found ").concat(places.length, " places"));
                        if (places.length === 0) {
                            console.log("\u274C No results in expanded area: ".concat(location_2.name));
                            return [3 /*break*/, 4];
                        }
                        this.markSearchCompleted(searchKey);
                        return [4 /*yield*/, this.processBusinessesIntelligently(places, category, location_2.name)];
                    case 3:
                        processed = _b.sent();
                        result.discovered += processed.discovered;
                        result.added += processed.added;
                        result.duplicates += processed.duplicates;
                        (_a = result.errors).push.apply(_a, processed.errors);
                        console.log("\uD83C\uDF0D Expanded Progress: ".concat(result.discovered, " discovered, ").concat(result.added, " added from ").concat(location_2.name));
                        if (result.added >= 10) {
                            console.log("\uD83C\uDFAF Expanded search successful: Found ".concat(result.added, " new businesses"));
                            return [3 /*break*/, 5];
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        console.log("\uD83C\uDF0D Expanded Area Search Complete: ".concat(result.discovered, " discovered, ").concat(result.added, " added"));
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // [2024-12-19 20:15 UTC] - Manual business search functionality
    DiscoveryService.prototype.searchBusinessByName = function (query, location) {
        return __awaiter(this, void 0, void 0, function () {
            var searchLocation, results, detailedResults, _i, _a, place, details, error_8, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        console.log('🔍 Manual search for business:', query);
                        searchLocation = location || { lat: 12.5684, lng: 99.9578 };
                        return [4 /*yield*/, googlePlacesService.searchBusinessesByText(query, searchLocation.lat, searchLocation.lng, 10000 // 10km radius for manual search
                            )];
                    case 1:
                        results = _b.sent();
                        console.log("\uD83D\uDD0D Found ".concat(results.length, " results for \"").concat(query, "\""));
                        detailedResults = [];
                        _i = 0, _a = results.slice(0, 5);
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        place = _a[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                    case 4:
                        details = _b.sent();
                        detailedResults.push(__assign(__assign(__assign({}, place), details), { formatted_phone_number: details === null || details === void 0 ? void 0 : details.formatted_phone_number, international_phone_number: details === null || details === void 0 ? void 0 : details.international_phone_number, website: details === null || details === void 0 ? void 0 : details.website, opening_hours: details === null || details === void 0 ? void 0 : details.opening_hours }));
                        return [3 /*break*/, 6];
                    case 5:
                        error_8 = _b.sent();
                        console.error("Error getting details for ".concat(place.name, ":"), error_8);
                        detailedResults.push(place); // Add without details if details fail
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, detailedResults];
                    case 8:
                        error_9 = _b.sent();
                        console.error('Manual search error:', error_9);
                        throw error_9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // [2024-12-19 20:15 UTC] - Add manually searched business to pipeline
    DiscoveryService.prototype.addManualBusiness = function (businessData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingBusiness, primaryCategory, types, _a, data, error, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log('➕ Adding manual business to pipeline:', businessData.name);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('id, name')
                                .eq('google_place_id', businessData.google_place_id)
                                .maybeSingle()];
                    case 1:
                        existingBusiness = (_b.sent()).data;
                        if (existingBusiness) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Business \"".concat(businessData.name, "\" is already in the pipeline")
                                }];
                        }
                        primaryCategory = 'Restaurants';
                        types = businessData.google_types || [];
                        if (types.some(function (type) { return ['spa', 'beauty_salon', 'health', 'gym'].includes(type); })) {
                            primaryCategory = 'Wellness';
                        }
                        else if (types.some(function (type) { return ['store', 'shopping_mall', 'clothing_store'].includes(type); })) {
                            primaryCategory = 'Shopping';
                        }
                        else if (types.some(function (type) { return ['tourist_attraction', 'amusement_park', 'entertainment'].includes(type); })) {
                            primaryCategory = 'Entertainment';
                        }
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .insert({
                                name: businessData.name,
                                address: businessData.address,
                                latitude: businessData.latitude,
                                longitude: businessData.longitude,
                                google_place_id: businessData.google_place_id,
                                google_rating: businessData.google_rating,
                                google_review_count: businessData.google_review_count,
                                google_types: businessData.google_types,
                                phone: businessData.phone,
                                website_url: businessData.website_url,
                                primary_category: primaryCategory,
                                quality_score: businessData.quality_score,
                                curation_status: 'pending',
                                discovery_source: 'manual_search',
                                discovery_criteria: businessData.discovery_criteria || null
                            })
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error adding manual business:', error);
                            return [2 /*return*/, {
                                    success: false,
                                    error: error.message
                                }];
                        }
                        console.log('✅ Manual business added successfully:', data.id);
                        return [2 /*return*/, { success: true }];
                    case 3:
                        error_10 = _b.sent();
                        console.error('Add manual business error:', error_10);
                        return [2 /*return*/, {
                                success: false,
                                error: error_10 instanceof Error ? error_10.message : 'Unknown error'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DiscoveryService;
}());
export { DiscoveryService };
export var discoveryService = new DiscoveryService();
// [2024-12-19 20:15 UTC] - Extend discoveryService with manual search methods
discoveryService.searchBusinessByName = function (query, location) {
    return __awaiter(this, void 0, void 0, function () {
        var searchLocation, results, detailedResults, _i, _a, place, details, error_11, error_12;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    console.log('🔍 Manual search for business:', query);
                    searchLocation = location || { lat: 12.5684, lng: 99.9578 };
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText(query, searchLocation.lat, searchLocation.lng, 10000 // 10km radius for manual search
                        )];
                case 1:
                    results = _b.sent();
                    console.log("\uD83D\uDD0D Found ".concat(results.length, " results for \"").concat(query, "\""));
                    detailedResults = [];
                    _i = 0, _a = results.slice(0, 5);
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    place = _a[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                case 4:
                    details = _b.sent();
                    detailedResults.push(__assign(__assign(__assign({}, place), details), { formatted_phone_number: details === null || details === void 0 ? void 0 : details.formatted_phone_number, international_phone_number: details === null || details === void 0 ? void 0 : details.international_phone_number, website: details === null || details === void 0 ? void 0 : details.website, opening_hours: details === null || details === void 0 ? void 0 : details.opening_hours }));
                    return [3 /*break*/, 6];
                case 5:
                    error_11 = _b.sent();
                    console.error("Error getting details for ".concat(place.name, ":"), error_11);
                    detailedResults.push(place); // Add without details if details fail
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, detailedResults];
                case 8:
                    error_12 = _b.sent();
                    console.error('Manual search error:', error_12);
                    throw error_12;
                case 9: return [2 /*return*/];
            }
        });
    });
};
discoveryService.addManualBusiness = function (businessData) {
    return __awaiter(this, void 0, void 0, function () {
        var existingBusiness, primaryCategory, types, _a, data, error, error_13;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    console.log('➕ Adding manual business to pipeline:', businessData.name);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id, name')
                            .eq('google_place_id', businessData.google_place_id)
                            .maybeSingle()];
                case 1:
                    existingBusiness = (_b.sent()).data;
                    if (existingBusiness) {
                        return [2 /*return*/, {
                                success: false,
                                error: "Business \"".concat(businessData.name, "\" is already in the pipeline")
                            }];
                    }
                    primaryCategory = 'Restaurants';
                    types = businessData.google_types || [];
                    if (types.some(function (type) { return ['spa', 'beauty_salon', 'health', 'gym'].includes(type); })) {
                        primaryCategory = 'Wellness';
                    }
                    else if (types.some(function (type) { return ['store', 'shopping_mall', 'clothing_store'].includes(type); })) {
                        primaryCategory = 'Shopping';
                    }
                    else if (types.some(function (type) { return ['tourist_attraction', 'amusement_park', 'entertainment'].includes(type); })) {
                        primaryCategory = 'Entertainment';
                    }
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert({
                            name: businessData.name,
                            address: businessData.address,
                            latitude: businessData.latitude,
                            longitude: businessData.longitude,
                            google_place_id: businessData.google_place_id,
                            google_rating: businessData.google_rating,
                            google_review_count: businessData.google_review_count,
                            google_types: businessData.google_types,
                            phone: businessData.phone,
                            website_url: businessData.website_url,
                            primary_category: primaryCategory,
                            quality_score: businessData.quality_score,
                            curation_status: 'pending',
                            discovery_source: 'manual_search',
                            discovery_criteria: businessData.discovery_criteria || null
                        })
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error adding manual business:', error);
                        return [2 /*return*/, {
                                success: false,
                                error: error.message
                            }];
                    }
                    console.log('✅ Manual business added successfully:', data.id);
                    return [2 /*return*/, { success: true }];
                case 3:
                    error_13 = _b.sent();
                    console.error('Add manual business error:', error_13);
                    return [2 /*return*/, {
                            success: false,
                            error: error_13 instanceof Error ? error_13.message : 'Unknown error'
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
