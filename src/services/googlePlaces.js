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
var GooglePlacesService = /** @class */ (function () {
    function GooglePlacesService() {
        this.isGoogleLoaded = false;
        // [2025-01-06 12:00 UTC] - Don't check immediately, wait for Google Maps to load
        // this.checkGoogleMapsAvailable();
    }
    GooglePlacesService.prototype.checkGoogleMapsAvailable = function () {
        // Check if Google Maps is available
        if (window.google && window.google.maps && window.google.maps.places) {
            this.isGoogleLoaded = true;
            return true;
        }
        else {
            this.isGoogleLoaded = false;
            return false;
        }
    };
    // [2025-01-06 12:00 UTC] - Wait for Google Maps to load with retry mechanism
    GooglePlacesService.prototype.waitForGoogleMaps = function () {
        return __awaiter(this, arguments, void 0, function (maxRetries, delayMs) {
            var i;
            if (maxRetries === void 0) { maxRetries = 10; }
            if (delayMs === void 0) { delayMs = 500; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxRetries)) return [3 /*break*/, 4];
                        if (this.checkGoogleMapsAvailable()) {
                            console.log('✅ Google Maps API is now available');
                            return [2 /*return*/, true];
                        }
                        console.log("\u23F3 Waiting for Google Maps API... (attempt ".concat(i + 1, "/").concat(maxRetries, ")"));
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delayMs); })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.error('❌ Google Maps API failed to load after maximum retries');
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // Discover businesses near a location
    GooglePlacesService.prototype.discoverBusinessesNearby = function (lat_1, lng_1) {
        return __awaiter(this, arguments, void 0, function (lat, lng, radiusMeters, businessType) {
            var realResults, error_1;
            if (radiusMeters === void 0) { radiusMeters = 3000; }
            if (businessType === void 0) { businessType = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.searchRealGooglePlaces(lat, lng, radiusMeters, businessType)];
                    case 1:
                        realResults = _a.sent();
                        console.log("\uD83C\uDF1F Found ".concat(realResults.length, " real businesses via Google Places API"));
                        return [2 /*return*/, realResults];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in discoverBusinessesNearby:', error_1);
                        // [2024-12-19 16:30 UTC] - Return empty array for production instead of demo data
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get detailed information about a specific place
    GooglePlacesService.prototype.getPlaceDetails = function (placeId) {
        return __awaiter(this, void 0, void 0, function () {
            var isAvailable, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.waitForGoogleMaps()];
                    case 1:
                        isAvailable = _a.sent();
                        if (!isAvailable) {
                            console.error('Google Maps API not available');
                            return [2 /*return*/, null];
                        }
                        // Use real Google Places API to get details
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var service = new window.google.maps.places.PlacesService(document.createElement('div'));
                                service.getDetails({
                                    placeId: placeId,
                                    fields: [
                                        'place_id', 'name', 'formatted_address', 'formatted_phone_number',
                                        'website', 'rating', 'user_ratings_total', 'price_level',
                                        'opening_hours', 'photos', 'geometry', 'types', 'business_status'
                                    ]
                                }, function (place, status) {
                                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                                        resolve({
                                            place_id: place.place_id,
                                            name: place.name,
                                            formatted_address: place.formatted_address,
                                            formatted_phone_number: place.formatted_phone_number,
                                            website: place.website,
                                            rating: place.rating,
                                            user_ratings_total: place.user_ratings_total,
                                            price_level: place.price_level,
                                            opening_hours: place.opening_hours,
                                            photos: place.photos,
                                            geometry: place.geometry,
                                            types: place.types,
                                            business_status: place.business_status
                                        });
                                    }
                                    else {
                                        console.error('Place details request failed:', status);
                                        resolve(null);
                                    }
                                });
                            })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting place details:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Search for businesses by text query
    GooglePlacesService.prototype.searchBusinessesByText = function (query_1, lat_1, lng_1) {
        return __awaiter(this, arguments, void 0, function (query, lat, lng, radiusMeters) {
            var results, error_3;
            if (radiusMeters === void 0) { radiusMeters = 5000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("\uD83D\uDD0D Searching for \"".concat(query, "\" near ").concat(lat, ", ").concat(lng));
                        return [4 /*yield*/, this.searchRealGooglePlaces(lat, lng, radiusMeters, query)];
                    case 1:
                        results = _a.sent();
                        console.log("\uD83D\uDCCA Real businesses found:", results.length);
                        console.log("\uD83C\uDFE2 Businesses:", results);
                        return [2 /*return*/, results];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error in text search:', error_3);
                        // [2024-12-19 16:30 UTC] - Return empty array for production
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Convert Google Place to our Business format
    GooglePlacesService.prototype.googlePlaceToBusiness = function (place, details) {
        var category = this.categorizeGooglePlace(place.types);
        return {
            google_place_id: place.place_id,
            name: place.name,
            category: category,
            address: (details === null || details === void 0 ? void 0 : details.formatted_address) || place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            phone: details === null || details === void 0 ? void 0 : details.formatted_phone_number,
            website_url: details === null || details === void 0 ? void 0 : details.website,
            partnership_status: 'pending'
        };
    };
    // Get photo URL from Google Places photo reference
    GooglePlacesService.prototype.getPhotoUrl = function (photoReference, maxWidth) {
        if (maxWidth === void 0) { maxWidth = 400; }
        return photoReference || '/placeholder-business.jpg';
    };
    // Categorize Google Place types into our categories
    GooglePlacesService.prototype.categorizeGooglePlace = function (types) {
        var typeMap = {
            'restaurant': 'Restaurants',
            'food': 'Restaurants',
            'meal_takeaway': 'Restaurants',
            'cafe': 'Restaurants',
            'spa': 'Wellness',
            'beauty_salon': 'Wellness',
            'gym': 'Wellness',
            'health': 'Wellness',
            'store': 'Shopping',
            'shopping_mall': 'Shopping',
            'clothing_store': 'Shopping',
            'electronics_store': 'Shopping',
            'tourist_attraction': 'Entertainment',
            'amusement_park': 'Entertainment',
            'night_club': 'Entertainment',
            'lodging': 'Travel',
            'travel_agency': 'Travel',
            'car_rental': 'Services',
            'bank': 'Services',
            'hospital': 'Services'
        };
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            if (typeMap[type]) {
                return typeMap[type];
            }
        }
        return 'Services';
    };
    // Get Google Place types for category
    GooglePlacesService.prototype.getGooglePlaceTypes = function (category) {
        var categoryMap = {
            'Restaurants': 'restaurant,food,meal_takeaway,cafe',
            'Wellness': 'spa,beauty_salon,gym,health',
            'Shopping': 'store,shopping_mall,clothing_store',
            'Services': 'bank,car_rental,hospital',
            'Entertainment': 'tourist_attraction,amusement_park,night_club',
            'Travel': 'lodging,travel_agency'
        };
        return categoryMap[category] || 'establishment';
    };
    // Generate business description
    GooglePlacesService.prototype.generateBusinessDescription = function (place, details) {
        var _a;
        var rating = place.rating ? "".concat(place.rating, "\u2B50") : '';
        var price = place.price_level ? '฿'.repeat(place.price_level) : '';
        var status = ((_a = place.opening_hours) === null || _a === void 0 ? void 0 : _a.open_now) ? 'Currently Open' : '';
        return [rating, price, status].filter(Boolean).join(' • ') || 'Local business in your area';
    };
    // Real Google Places API integration - production ready
    GooglePlacesService.prototype.searchRealGooglePlaces = function (lat, lng, radiusMeters, businessType) {
        return __awaiter(this, void 0, void 0, function () {
            var isAvailable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.waitForGoogleMaps()];
                    case 1:
                        isAvailable = _a.sent();
                        if (!isAvailable) {
                            console.error('❌ Google Maps API not available - cannot search for real businesses');
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, new Promise(function (resolve) {
                                var service = new window.google.maps.places.PlacesService(document.createElement('div'));
                                // [2025-01-06 13:00 UTC] - Determine if this is a text search or category search
                                var isTextSearch = businessType && !['Restaurants', 'Wellness', 'Shopping', 'Entertainment', 'Services', 'Travel'].includes(businessType);
                                if (isTextSearch) {
                                    // Use text search for specific queries like "daddy" or "pizza"
                                    console.log("\uD83D\uDD0D Performing TEXT search for \"".concat(businessType, "\""));
                                    var request = {
                                        query: businessType,
                                        location: new window.google.maps.LatLng(lat, lng),
                                        radius: radiusMeters
                                    };
                                    service.textSearch(request, function (results, status) {
                                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                                            console.log("\u2705 Found ".concat(results.length, " businesses for query: \"").concat(businessType, "\""));
                                            var mappedResults = results.map(function (place) { return ({
                                                place_id: place.place_id,
                                                name: place.name,
                                                vicinity: place.vicinity || place.formatted_address || 'Hua Hin, Thailand',
                                                geometry: {
                                                    location: {
                                                        lat: place.geometry.location.lat(),
                                                        lng: place.geometry.location.lng()
                                                    }
                                                },
                                                rating: place.rating || null,
                                                price_level: place.price_level || null,
                                                types: place.types || [],
                                                photos: place.photos || [],
                                                opening_hours: place.opening_hours || null,
                                                business_status: place.business_status || 'OPERATIONAL'
                                            }); });
                                            resolve(mappedResults);
                                        }
                                        else {
                                            console.error("\u274C Google Places text search error for \"".concat(businessType, "\": ").concat(status));
                                            resolve([]);
                                        }
                                    });
                                }
                                else {
                                    // Use nearby search for category-based searches
                                    var getSingleGoogleType = function (businessType) {
                                        if (businessType.includes('restaurant') || businessType.includes('food') || businessType.includes('dining')) {
                                            return 'restaurant'; // Single most relevant type
                                        }
                                        var typeMap = {
                                            'Wellness': 'spa',
                                            'spa wellness massage beauty salon': 'spa',
                                            'Shopping': 'store',
                                            'store shop mall market': 'store',
                                            'Entertainment': 'tourist_attraction',
                                            'entertainment attraction activity': 'tourist_attraction'
                                        };
                                        return typeMap[businessType] || 'establishment';
                                    };
                                    var googleType_1 = getSingleGoogleType(businessType);
                                    console.log("\uD83D\uDD0D Performing NEARBY search for category: ".concat(businessType));
                                    console.log("\uD83C\uDFF7\uFE0F Using Google type: ".concat(googleType_1));
                                    console.log("\uD83D\uDCCD Location: ".concat(lat, ", ").concat(lng, " (radius: ").concat(radiusMeters, "m)"));
                                    var request = {
                                        location: new window.google.maps.LatLng(lat, lng),
                                        radius: radiusMeters,
                                        type: googleType_1
                                    };
                                    service.nearbySearch(request, function (results, status) {
                                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                                            console.log("\u2705 Found ".concat(results.length, " businesses for type: ").concat(googleType_1));
                                            var mappedResults = results.map(function (place) { return ({
                                                place_id: place.place_id,
                                                name: place.name,
                                                vicinity: place.vicinity || 'Hua Hin, Thailand',
                                                geometry: {
                                                    location: {
                                                        lat: place.geometry.location.lat(),
                                                        lng: place.geometry.location.lng()
                                                    }
                                                },
                                                rating: place.rating || null,
                                                price_level: place.price_level || null,
                                                types: place.types || [],
                                                photos: place.photos || [],
                                                opening_hours: place.opening_hours || null,
                                                business_status: place.business_status || 'OPERATIONAL'
                                            }); });
                                            resolve(mappedResults);
                                        }
                                        else {
                                            console.error("\u274C Google Places API error for type ".concat(googleType_1, ": ").concat(status));
                                            resolve([]);
                                        }
                                    });
                                }
                            })];
                }
            });
        });
    };
    return GooglePlacesService;
}());
// Export singleton instance
export var googlePlacesService = new GooglePlacesService();
// Export types and service
export default GooglePlacesService;
export { GooglePlacesService };
