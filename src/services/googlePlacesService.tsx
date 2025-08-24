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
// [2025-01-06 17:30 UTC] - Google Places API service for restaurant discovery and cuisine categorization
import { supabase } from '../lib/supabase';
// Cuisine Type Mapping - Google Places types to LocalPlus categories
export var GOOGLE_TO_LOCALPLUS_CUISINE_MAPPING = {
    // Thai restaurants
    'thai_restaurant': ['thai_traditional'],
    // Seafood
    'seafood_restaurant': ['seafood_grilled'],
    // Japanese
    'japanese_restaurant': ['japanese_sushi'],
    'sushi_restaurant': ['japanese_sushi'],
    'ramen_restaurant': ['japanese_ramen'],
    // Italian
    'italian_restaurant': ['italian_pasta'],
    'pizza_restaurant': ['italian_pizza'],
    // Chinese
    'chinese_restaurant': ['chinese_cantonese'],
    // Indian
    'indian_restaurant': ['indian_north'],
    // Korean
    'korean_restaurant': ['korean_bbq'],
    // Vietnamese
    'vietnamese_restaurant': ['vietnamese_pho'],
    // American
    'american_restaurant': ['american_burger'],
    'burger_restaurant': ['american_burger'],
    'steak_house': ['american_steak'],
    // French
    'french_restaurant': ['french_bistro'],
    // Cafes and beverages
    'cafe': ['cafe_coffee'],
    'coffee_shop': ['cafe_coffee'],
    'bar': ['bar_cocktails'],
    // Desserts
    'ice_cream_shop': ['dessert_ice_cream'],
    'dessert_restaurant': ['dessert_ice_cream'],
    // Dietary
    'vegetarian_restaurant': ['vegetarian'],
    'vegan_restaurant': ['vegan']
};
// Restaurant-specific Google Place Types for filtering
export var RESTAURANT_PLACE_TYPES = [
    'restaurant',
    'food',
    'thai_restaurant',
    'seafood_restaurant',
    'japanese_restaurant',
    'sushi_restaurant',
    'ramen_restaurant',
    'italian_restaurant',
    'pizza_restaurant',
    'chinese_restaurant',
    'indian_restaurant',
    'korean_restaurant',
    'vietnamese_restaurant',
    'american_restaurant',
    'burger_restaurant',
    'steak_house',
    'french_restaurant',
    'vegetarian_restaurant',
    'vegan_restaurant',
    'cafe',
    'coffee_shop',
    'bar',
    'ice_cream_shop',
    'dessert_restaurant'
];
var GooglePlacesService = /** @class */ (function () {
    function GooglePlacesService() {
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
        this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
        if (!this.apiKey) {
            console.warn('⚠️ Google Places API key not found in environment variables');
        }
    }
    // Start a nearby search job for restaurants
    GooglePlacesService.prototype.startNearbyRestaurantDiscovery = function (location_1) {
        return __awaiter(this, arguments, void 0, function (location, radiusMeters) {
            var _a, syncJob, syncError, error_1;
            if (radiusMeters === void 0) { radiusMeters = 5000; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log('🔍 Starting Google Places nearby restaurant discovery...');
                        return [4 /*yield*/, supabase
                                .from('google_places_sync_jobs')
                                .insert([{
                                    job_type: 'nearby_search',
                                    location_lat: location.lat,
                                    location_lng: location.lng,
                                    search_radius: radiusMeters,
                                    status: 'pending',
                                    started_at: new Date().toISOString()
                                }])
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), syncJob = _a.data, syncError = _a.error;
                        if (syncError || !syncJob) {
                            console.error('❌ Failed to create sync job:', syncError);
                            return [2 /*return*/, null];
                        }
                        // Execute the search
                        return [4 /*yield*/, this.executeNearbySearch(syncJob.id, location, radiusMeters)];
                    case 2:
                        // Execute the search
                        _b.sent();
                        return [2 /*return*/, syncJob.id];
                    case 3:
                        error_1 = _b.sent();
                        console.error('❌ Error starting nearby restaurant discovery:', error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Execute nearby search and process results
    GooglePlacesService.prototype.executeNearbySearch = function (syncJobId, location, radiusMeters) {
        return __awaiter(this, void 0, void 0, function () {
            var nextPageToken, totalProcessed, totalFound, searchResults, _i, _a, place, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 12, , 14]);
                        // Update job status to running
                        return [4 /*yield*/, supabase
                                .from('google_places_sync_jobs')
                                .update({ status: 'running' })
                                .eq('id', syncJobId)];
                    case 1:
                        // Update job status to running
                        _b.sent();
                        nextPageToken = void 0;
                        totalProcessed = 0;
                        totalFound = 0;
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.performNearbySearch(location, radiusMeters, nextPageToken)];
                    case 3:
                        searchResults = _b.sent();
                        if (searchResults.status !== 'OK') {
                            throw new Error("Google Places API error: ".concat(searchResults.status, " - ").concat(searchResults.error_message));
                        }
                        totalFound += searchResults.results.length;
                        _i = 0, _a = searchResults.results;
                        _b.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        place = _a[_i];
                        return [4 /*yield*/, this.processSuggestedBusiness(syncJobId, place)];
                    case 5:
                        _b.sent();
                        totalProcessed++;
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        nextPageToken = searchResults.next_page_token;
                        if (!nextPageToken) return [3 /*break*/, 9];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        if (nextPageToken) return [3 /*break*/, 2];
                        _b.label = 10;
                    case 10: 
                    // Update job completion
                    return [4 /*yield*/, supabase
                            .from('google_places_sync_jobs')
                            .update({
                            status: 'completed',
                            businesses_found: totalFound,
                            businesses_processed: totalProcessed,
                            completed_at: new Date().toISOString()
                        })
                            .eq('id', syncJobId)];
                    case 11:
                        // Update job completion
                        _b.sent();
                        console.log("\u2705 Nearby search completed: ".concat(totalFound, " found, ").concat(totalProcessed, " processed"));
                        return [3 /*break*/, 14];
                    case 12:
                        error_2 = _b.sent();
                        console.error('❌ Error executing nearby search:', error_2);
                        // Update job with error
                        return [4 /*yield*/, supabase
                                .from('google_places_sync_jobs')
                                .update({
                                status: 'failed',
                                error_message: error_2 instanceof Error ? error_2.message : 'Unknown error'
                            })
                                .eq('id', syncJobId)];
                    case 13:
                        // Update job with error
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    // Perform actual Google Places API nearby search
    GooglePlacesService.prototype.performNearbySearch = function (location, radiusMeters, pageToken) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            location: "".concat(location.lat, ",").concat(location.lng),
                            radius: radiusMeters.toString(),
                            type: 'restaurant', // Primary type filter
                            key: this.apiKey
                        });
                        if (pageToken) {
                            params.append('pagetoken', pageToken);
                        }
                        url = "".concat(this.baseUrl, "/nearbysearch/json?").concat(params.toString());
                        console.log('🔍 Making Google Places API request:', url.replace(this.apiKey, 'API_KEY_HIDDEN'));
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    // Process a suggested business from Google Places
    GooglePlacesService.prototype.processSuggestedBusiness = function (syncJobId, place) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, cuisineTypes, confidenceScore, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('id')
                                .eq('google_place_id', place.place_id)
                                .single()];
                    case 1:
                        existing = (_a.sent()).data;
                        if (existing) {
                            console.log("\u23ED\uFE0F Skipping existing place: ".concat(place.name));
                            return [2 /*return*/];
                        }
                        cuisineTypes = this.extractCuisineTypesFromGoogle(place.types);
                        confidenceScore = this.calculateConfidenceScore(place);
                        // Insert into suggested_businesses
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .insert([{
                                    google_place_id: place.place_id,
                                    sync_job_id: syncJobId,
                                    google_data: place,
                                    suggested_name: place.name,
                                    suggested_address: place.formatted_address || '',
                                    suggested_phone: place.formatted_phone_number || place.international_phone_number,
                                    suggested_website: place.website,
                                    suggested_category: this.determinePrimaryCategory(place.types),
                                    suggested_cuisine_types: cuisineTypes,
                                    confidence_score: confidenceScore,
                                    status: 'pending'
                                }])];
                    case 2:
                        // Insert into suggested_businesses
                        _a.sent();
                        console.log("\u2795 Added suggested business: ".concat(place.name, " (confidence: ").concat(confidenceScore, ")"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('❌ Error processing suggested business:', error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Extract LocalPlus cuisine types from Google Place types
    GooglePlacesService.prototype.extractCuisineTypesFromGoogle = function (googleTypes) {
        var cuisineTypes = new Set();
        for (var _i = 0, googleTypes_1 = googleTypes; _i < googleTypes_1.length; _i++) {
            var googleType = googleTypes_1[_i];
            var mappedCuisines = GOOGLE_TO_LOCALPLUS_CUISINE_MAPPING[googleType];
            if (mappedCuisines) {
                mappedCuisines.forEach(function (cuisine) { return cuisineTypes.add(cuisine); });
            }
        }
        // If no specific cuisine mapping found, try to infer from restaurant type
        if (cuisineTypes.size === 0 && googleTypes.includes('restaurant')) {
            cuisineTypes.add('thai_traditional'); // Default for Thailand market
        }
        return Array.from(cuisineTypes);
    };
    // Determine primary business category from Google types
    GooglePlacesService.prototype.determinePrimaryCategory = function (googleTypes) {
        // Priority order for category determination
        var categoryPriority = [
            'thai_restaurant',
            'seafood_restaurant',
            'japanese_restaurant',
            'italian_restaurant',
            'chinese_restaurant',
            'indian_restaurant',
            'korean_restaurant',
            'vietnamese_restaurant',
            'restaurant',
            'cafe',
            'bar',
            'food'
        ];
        for (var _i = 0, categoryPriority_1 = categoryPriority; _i < categoryPriority_1.length; _i++) {
            var priority = categoryPriority_1[_i];
            if (googleTypes.includes(priority)) {
                return priority;
            }
        }
        return 'restaurant'; // Default
    };
    // Calculate confidence score based on available data quality
    GooglePlacesService.prototype.calculateConfidenceScore = function (place) {
        var _a;
        var score = 0.0;
        // Base score for having essential data
        if (place.name)
            score += 0.2;
        if (place.formatted_address)
            score += 0.2;
        if ((_a = place.geometry) === null || _a === void 0 ? void 0 : _a.location)
            score += 0.1;
        // Bonus for rating and reviews
        if (place.rating && place.rating > 0)
            score += 0.15;
        if (place.user_ratings_total && place.user_ratings_total > 10)
            score += 0.1;
        // Bonus for contact information
        if (place.formatted_phone_number || place.international_phone_number)
            score += 0.1;
        if (place.website)
            score += 0.1;
        // Bonus for photos
        if (place.photos && place.photos.length > 0)
            score += 0.05;
        return Math.min(Math.round(score * 100) / 100, 1.0);
    };
    // Get curated LocalPlus cuisine categories
    GooglePlacesService.prototype.getCuratedCuisineCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('cuisine_categories_localplus')
                            .select('*')
                            .eq('is_active', true)
                            .order('parent_category, display_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Error fetching cuisine categories:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    };
    // Get suggested businesses for curation
    GooglePlacesService.prototype.getSuggestedBusinessesForCuration = function () {
        return __awaiter(this, arguments, void 0, function (status, limit) {
            var _a, data, error;
            if (status === void 0) { status = 'pending'; }
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select("\n        *,\n        google_places_sync_jobs(*)\n      ")
                            .eq('status', status)
                            .order('confidence_score', { ascending: false })
                            .limit(limit)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Error fetching suggested businesses:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    };
    // Approve a suggested business and add to main businesses table
    GooglePlacesService.prototype.approveSuggestedBusiness = function (suggestedBusinessId, curatedCuisineTypes, curationNotes) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, suggested, fetchError, googleData, insertError, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('*')
                                .eq('id', suggestedBusinessId)
                                .single()];
                    case 1:
                        _a = _b.sent(), suggested = _a.data, fetchError = _a.error;
                        if (fetchError || !suggested) {
                            console.error('❌ Suggested business not found:', fetchError);
                            return [2 /*return*/, false];
                        }
                        googleData = suggested.google_data;
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .insert([{
                                    google_place_id: suggested.google_place_id,
                                    name: suggested.suggested_name,
                                    category: suggested.suggested_category,
                                    address: suggested.suggested_address,
                                    latitude: googleData.geometry.location.lat,
                                    longitude: googleData.geometry.location.lng,
                                    phone: suggested.suggested_phone,
                                    website_url: suggested.suggested_website,
                                    google_types: googleData.types,
                                    google_primary_type: googleData.primaryType || suggested.suggested_category,
                                    cuisine_types_google: suggested.suggested_cuisine_types,
                                    cuisine_types_localplus: curatedCuisineTypes,
                                    discovery_source: 'google_places',
                                    curation_status: 'approved',
                                    curation_notes: curationNotes,
                                    partnership_status: 'active',
                                    last_google_sync: new Date().toISOString()
                                }])];
                    case 2:
                        insertError = (_b.sent()).error;
                        if (insertError) {
                            console.error('❌ Error inserting approved business:', insertError);
                            return [2 /*return*/, false];
                        }
                        // Update suggested business status
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                status: 'approved',
                                reviewed_at: new Date().toISOString(),
                                review_notes: curationNotes
                            })
                                .eq('id', suggestedBusinessId)];
                    case 3:
                        // Update suggested business status
                        _b.sent();
                        console.log("\u2705 Approved business: ".concat(suggested.suggested_name));
                        return [2 /*return*/, true];
                    case 4:
                        error_4 = _b.sent();
                        console.error('❌ Error approving suggested business:', error_4);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Reject a suggested business
    GooglePlacesService.prototype.rejectSuggestedBusiness = function (suggestedBusinessId, rejectionReason) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                status: 'rejected',
                                reviewed_at: new Date().toISOString(),
                                review_notes: rejectionReason
                            })
                                .eq('id', suggestedBusinessId)];
                    case 1:
                        _a.sent();
                        console.log("\uD83D\uDEAB Rejected suggested business: ".concat(suggestedBusinessId));
                        return [2 /*return*/, true];
                    case 2:
                        error_5 = _a.sent();
                        console.error('❌ Error rejecting suggested business:', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get sync job status
    GooglePlacesService.prototype.getSyncJobStatus = function (syncJobId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('google_places_sync_jobs')
                            .select('*')
                            .eq('id', syncJobId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Error fetching sync job status:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    return GooglePlacesService;
}());
export { GooglePlacesService };
export var googlePlacesService = new GooglePlacesService();
