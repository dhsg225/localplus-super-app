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
// [2025-01-06 15:00 UTC] - Restaurant service for production data from database
import { supabase } from '../lib/supabase';
var RestaurantService = /** @class */ (function () {
    function RestaurantService() {
    }
    // [2025-01-06 17:45 UTC] - Enhanced restaurant service with Google Places integration and curated cuisine system
    RestaurantService.prototype.getRestaurantsByLocation = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, businesses, error, transformedRestaurants, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🏪 Querying database for restaurants in location:', location);
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('*')
                                .eq('partnership_status', 'active')
                                .ilike('address', "%".concat(location, "%"))];
                    case 1:
                        _a = _b.sent(), businesses = _a.data, error = _a.error;
                        if (error) {
                            console.error('🏪 Database query error:', error);
                            throw error;
                        }
                        console.log('🏪 Database businesses found:', (businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0);
                        if (!businesses || businesses.length === 0) {
                            console.log('🏪 No restaurants found in database for location:', location);
                            console.log('🏪 Returning empty array - no fallback data');
                            return [2 /*return*/, []];
                        }
                        console.log('🏪 Found', businesses.length, 'restaurant businesses in database');
                        console.log('🏪 First business:', businesses[0]);
                        transformedRestaurants = businesses.map(function (business) {
                            return _this.transformDatabaseBusiness(business);
                        });
                        return [2 /*return*/, transformedRestaurants];
                    case 2:
                        error_1 = _b.sent();
                        console.error('🏪 Restaurant service error:', error_1);
                        console.log('🏪 Returning empty array - no fallback data');
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get restaurants by curated cuisine types
    RestaurantService.prototype.getRestaurantsByCuisine = function (cuisineTypes, location) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, businesses, error, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🍽️ Querying restaurants by cuisine types:', cuisineTypes);
                        query = supabase
                            .from('businesses')
                            .select('*')
                            .eq('partnership_status', 'active');
                        // Filter by cuisine types using category field
                        if (cuisineTypes.length > 0) {
                            query = query.in('category', cuisineTypes);
                        }
                        // Optional location filter
                        if (location) {
                            query = query.ilike('address', "%".concat(location, "%"));
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), businesses = _a.data, error = _a.error;
                        if (error) {
                            console.error('🍽️ Cuisine query error:', error);
                            throw error;
                        }
                        console.log('🍽️ Found', (businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0, 'restaurants for cuisines:', cuisineTypes);
                        return [2 /*return*/, (businesses === null || businesses === void 0 ? void 0 : businesses.map(function (business) { return _this.transformDatabaseBusiness(business); })) || []];
                    case 2:
                        error_2 = _b.sent();
                        console.error('🍽️ Error querying by cuisine:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get available cuisine categories
    RestaurantService.prototype.getCuisineCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, categories, error, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('cuisine_categories_localplus')
                                .select('*')
                                .eq('is_active', true)
                                .order('parent_category, display_name')];
                    case 1:
                        _a = _b.sent(), categories = _a.data, error = _a.error;
                        if (error) {
                            console.error('🏷️ Error fetching cuisine categories:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, categories || []];
                    case 2:
                        error_3 = _b.sent();
                        console.error('🏷️ Error in getCuisineCategories:', error_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Transform database business data to restaurant format
    RestaurantService.prototype.transformDatabaseBusiness = function (dbBusiness) {
        return {
            id: dbBusiness.id,
            name: dbBusiness.name,
            address: dbBusiness.address,
            latitude: dbBusiness.latitude || 0,
            longitude: dbBusiness.longitude || 0,
            phone: dbBusiness.phone || '',
            email: dbBusiness.email || '',
            description: this.generateDescription(dbBusiness),
            status: dbBusiness.partnership_status === 'active' ? 'active' : 'inactive',
            // Google Places integration fields (fallback to undefined if not available)
            google_place_id: dbBusiness.google_place_id,
            google_types: dbBusiness.google_types || [],
            google_primary_type: dbBusiness.google_primary_type,
            cuisine_types_google: dbBusiness.cuisine_types_google || [],
            cuisine_types_localplus: dbBusiness.cuisine_types_localplus || [dbBusiness.category],
            cuisine_display_names: dbBusiness.cuisine_display_names || [],
            discovery_source: dbBusiness.discovery_source || (dbBusiness.source || 'manual'),
            curation_status: dbBusiness.curation_status || 'approved',
            // Pass through the photo gallery data
            photo_gallery: dbBusiness.photo_gallery,
            // Enhanced data based on business type and curation
            cuisine: this.determineCuisine(dbBusiness),
            priceRange: this.determinePriceRange(dbBusiness),
            rating: this.generateRating(),
            reviewCount: this.generateReviewCount(),
            heroImage: this.getHeroImage(dbBusiness),
            signatureDishes: this.getSignatureDishes(dbBusiness),
            openingHours: this.getOpeningHours(dbBusiness),
            features: this.getFeatures(dbBusiness),
            loyaltyProgram: this.getLoyaltyProgram(dbBusiness),
            currentPromotions: this.getCurrentPromotions()
        };
    };
    // Generate description using enhanced data
    RestaurantService.prototype.generateDescription = function (business) {
        var _a, _b;
        if (business.description) {
            return business.description;
        }
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        var category = ((_b = business.category) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        var cuisineTypes = business.cuisine_types_localplus || [];
        // Use curated cuisine information for better descriptions
        if (cuisineTypes.includes('thai_traditional')) {
            return 'Authentic traditional Thai cuisine with time-honored recipes and flavors';
        }
        if (cuisineTypes.includes('thai_royal')) {
            return 'Refined royal Thai cuisine with elegant presentation and sophisticated flavors';
        }
        if (cuisineTypes.includes('seafood_grilled')) {
            return 'Fresh grilled seafood with ocean-to-table quality and authentic preparations';
        }
        if (cuisineTypes.includes('japanese_sushi')) {
            return 'Traditional Japanese sushi and sashimi with premium ingredients';
        }
        if (cuisineTypes.includes('italian_pasta')) {
            return 'Authentic Italian pasta dishes with traditional recipes and fresh ingredients';
        }
        // Fallback to legacy description generation
        if (name.includes('palace') || name.includes('golden')) {
            return 'Authentic royal Thai cuisine in an elegant traditional setting';
        }
        if (name.includes('seaside') || name.includes('grill')) {
            return 'Fresh seafood and international cuisine with stunning ocean views';
        }
        return 'Quality dining experience with authentic flavors and welcoming atmosphere';
    };
    // Determine cuisine type using enhanced categorization
    RestaurantService.prototype.determineCuisine = function (business) {
        var _a;
        // Use the existing category field as primary source
        if (business.category) {
            return [business.category];
        }
        // Fallback to curated LocalPlus cuisine types
        if (business.cuisine_types_localplus && business.cuisine_types_localplus.length > 0) {
            return business.cuisine_types_localplus;
        }
        // Fallback to Google types conversion
        if (business.cuisine_types_google && business.cuisine_types_google.length > 0) {
            return business.cuisine_types_google;
        }
        // Legacy fallback
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (name.includes('seaside') || name.includes('grill')) {
            return ['Fresh Seafood'];
        }
        if (name.includes('palace') || name.includes('golden')) {
            return ['Thai Traditional'];
        }
        return ['Thai Traditional']; // Default for Thailand market
    };
    // Enhanced price range determination
    RestaurantService.prototype.determinePriceRange = function (business) {
        var _a, _b;
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        var category = ((_b = business.category) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        var cuisineTypes = business.cuisine_types_localplus || [];
        // Use curated cuisine types for better price estimation
        if (cuisineTypes.includes('thai_royal') || cuisineTypes.includes('french_bistro')) {
            return 4; // Fine dining
        }
        if (cuisineTypes.includes('american_steak') || cuisineTypes.includes('japanese_teppanyaki')) {
            return 3; // Upscale
        }
        if (cuisineTypes.includes('thai_street_food') || cuisineTypes.includes('cafe_coffee')) {
            return 1; // Budget-friendly
        }
        // Legacy fallback
        if (name.includes('palace') || name.includes('golden') || category.includes('fine')) {
            return 4;
        }
        if (name.includes('seaside') || name.includes('grill') || category.includes('upscale')) {
            return 3;
        }
        return 2; // Mid-range default
    };
    // Enhanced hero image selection with Google Places integration
    RestaurantService.prototype.getHeroImage = function (business) {
        // For Google Places restaurants, we'll handle image loading in the component
        // to avoid blocking the restaurant loading with image API calls
        if (business.google_place_id) {
            // Return a placeholder that the component can replace with actual Google Places image
            return "google-places:".concat(business.google_place_id);
        }
        // [2025-01-07 02:10 UTC] - NO FAKE IMAGES - only Google Places IDs or empty
        // No fallback images - only real Google Places images or no images at all
        return '';
    };
    // Enhanced signature dishes based on curated cuisine
    RestaurantService.prototype.getSignatureDishes = function (business) {
        var cuisineTypes = business.cuisine_types_localplus || [];
        if (cuisineTypes.includes('seafood_grilled')) {
            return ['Grilled Sea Bass', 'Tom Yum Talay', 'Seafood Platter'];
        }
        if (cuisineTypes.includes('thai_traditional')) {
            return ['Pad Thai', 'Green Curry', 'Mango Sticky Rice'];
        }
        if (cuisineTypes.includes('thai_royal')) {
            return ['Royal Pad Thai', 'Massaman Beef', 'Golden Curry'];
        }
        if (cuisineTypes.includes('japanese_sushi')) {
            return ['Sushi Platter', 'Sashimi Selection', 'Chirashi Bowl'];
        }
        if (cuisineTypes.includes('japanese_ramen')) {
            return ['Tonkotsu Ramen', 'Miso Ramen', 'Gyoza'];
        }
        if (cuisineTypes.includes('italian_pasta')) {
            return ['Pasta Carbonara', 'Seafood Linguine', 'Pesto Gnocchi'];
        }
        if (cuisineTypes.includes('italian_pizza')) {
            return ['Margherita Pizza', 'Quattro Stagioni', 'Prosciutto e Funghi'];
        }
        if (cuisineTypes.includes('korean_bbq')) {
            return ['Bulgogi', 'Galbi', 'Kimchi Fried Rice'];
        }
        return ['Chef Special', 'House Favorite', 'Seasonal Dish'];
    };
    // Enhanced opening hours
    RestaurantService.prototype.getOpeningHours = function (business) {
        var _a;
        var cuisineTypes = business.cuisine_types_localplus || [];
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (cuisineTypes.includes('thai_royal') || name.includes('palace')) {
            return '5:00 PM - 11:00 PM'; // Fine dining hours
        }
        if (cuisineTypes.includes('cafe_coffee')) {
            return '7:00 AM - 8:00 PM'; // Cafe hours
        }
        if (cuisineTypes.includes('bar_cocktails')) {
            return '6:00 PM - 2:00 AM'; // Bar hours
        }
        return '11:00 AM - 10:00 PM'; // Standard restaurant hours
    };
    // Enhanced features based on cuisine and business type
    RestaurantService.prototype.getFeatures = function (business) {
        var _a;
        var features = ['air-conditioning'];
        var cuisineTypes = business.cuisine_types_localplus || [];
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (name.includes('seaside') || name.includes('beach')) {
            features.push('beachfront-view', 'outdoor-seating', 'parking');
        }
        if (cuisineTypes.includes('thai_royal') || name.includes('palace')) {
            features.push('parking', 'groups', 'reservations', 'private-dining');
        }
        if (cuisineTypes.includes('cafe_coffee')) {
            features.push('wifi', 'outdoor-seating');
        }
        if (cuisineTypes.includes('bar_cocktails')) {
            features.push('live-music', 'outdoor-seating', 'happy-hour');
        }
        if (name.includes('resort')) {
            features.push('resort-dining', 'poolside', 'parking');
        }
        return features;
    };
    // Enhanced loyalty program
    RestaurantService.prototype.getLoyaltyProgram = function (business) {
        var _a;
        var cuisineTypes = business.cuisine_types_localplus || [];
        var name = ((_a = business.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (cuisineTypes.includes('thai_royal') || name.includes('palace')) {
            return { name: 'Royal Club', pointsMultiplier: 3 };
        }
        if (cuisineTypes.includes('seafood_grilled') || name.includes('seaside')) {
            return { name: 'Ocean Club', pointsMultiplier: 2 };
        }
        if (name.includes('resort')) {
            return { name: 'Resort Members', pointsMultiplier: 2 };
        }
        if (cuisineTypes.includes('japanese_sushi')) {
            return { name: 'Sushi Circle', pointsMultiplier: 2 };
        }
        return undefined;
    };
    // Generate current promotions
    RestaurantService.prototype.getCurrentPromotions = function () {
        var promotions = [
            '20% off dinner sets',
            '20% off lunch orders',
            'Happy Hour 5-7 PM',
            'Free dessert with main course',
            'Early bird special',
            'Weekend brunch special',
            'Family meal deals'
        ];
        // Randomly assign 0-1 promotions
        if (Math.random() > 0.4) {
            return [promotions[Math.floor(Math.random() * promotions.length)]];
        }
        return [];
    };
    // Generate realistic rating
    RestaurantService.prototype.generateRating = function () {
        return Math.round((4.2 + Math.random() * 0.7) * 10) / 10; // 4.2-4.9 range
    };
    // Generate realistic review count
    RestaurantService.prototype.generateReviewCount = function () {
        return Math.floor(300 + Math.random() * 1500); // 300-1800 range
    };
    return RestaurantService;
}());
export { RestaurantService };
export var restaurantService = new RestaurantService();
