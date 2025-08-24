// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
// [2025-01-07 11:30 UTC] - Updated to use environment-aware API URLs for production compatibility
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
import { API_BASE_URL } from '../config/api';
var GooglePlacesImageService = /** @class */ (function () {
    function GooglePlacesImageService(useBackendProxy) {
        if (useBackendProxy === void 0) { useBackendProxy = true; }
        this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
        this.useBackendProxy = useBackendProxy;
        // Use environment-aware base URL for production compatibility
        this.baseUrl = API_BASE_URL || '';
        if (!this.apiKey && !useBackendProxy) {
            console.warn('⚠️ Google Places API key not found. Backend proxy mode enabled.');
            this.useBackendProxy = true;
        }
    }
    /**
     * Fetch place photos from Google Places API
     */
    GooglePlacesImageService.prototype.getPlacePhotos = function (placeId) {
        return __awaiter(this, void 0, void 0, function () {
            var apiUrl, response, data, response, data, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!placeId) {
                            console.error('❌ Place ID is required');
                            return [2 /*return*/, []];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        if (!this.useBackendProxy) return [3 /*break*/, 4];
                        console.log('🔄 Using backend proxy for place photos');
                        apiUrl = this.baseUrl ? "".concat(this.baseUrl, "/api/places/photos/").concat(placeId) : "/api/places/photos/".concat(placeId);
                        return [4 /*yield*/, fetch(apiUrl)];
                    case 2:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("Backend proxy error: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        return [2 /*return*/, data.photos || []];
                    case 4:
                        // Direct API call (will likely fail due to CORS)
                        console.log('🔄 Direct Google Places API call');
                        return [4 /*yield*/, fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=".concat(placeId, "&fields=photos&key=").concat(this.apiKey))];
                    case 5:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("API error: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 6:
                        data = _b.sent();
                        if (data.status !== 'OK') {
                            throw new Error("Google Places API error: ".concat(data.status));
                        }
                        return [2 /*return*/, ((_a = data.result) === null || _a === void 0 ? void 0 : _a.photos) || []];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        console.error('❌ Error fetching place photos:', error_1);
                        if (error_1 instanceof Error && error_1.message.includes('CORS')) {
                            console.warn('🚨 CORS error detected - Google Places API must be called from backend');
                            console.warn('💡 Switch to backend proxy mode');
                        }
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get Google Places photo URL with proper API key
     */
    GooglePlacesImageService.prototype.getPhotoUrl = function (photoReference, maxWidth, maxHeight) {
        if (this.useBackendProxy) {
            // Use environment-aware URL (localhost in dev, relative path in production)
            var apiUrl = this.baseUrl ? "".concat(this.baseUrl, "/api/places/photo") : "/api/places/photo";
            return "".concat(apiUrl, "?photo_reference=").concat(photoReference, "&maxwidth=").concat(maxWidth, "&maxheight=").concat(maxHeight);
        }
        return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=".concat(maxWidth, "&maxheight=").concat(maxHeight, "&photo_reference=").concat(photoReference, "&key=").concat(this.apiKey);
    };
    /**
     * Get optimized restaurant image URL - ONLY real Google Places images
     */
    GooglePlacesImageService.prototype.getRestaurantImageUrl = function (placeId_1) {
        return __awaiter(this, arguments, void 0, function (placeId, size) {
            var photos, photo, sizeConfig, config, imageUrl, error_2;
            if (size === void 0) { size = 'medium'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPlacePhotos(placeId)];
                    case 1:
                        photos = _a.sent();
                        if (photos.length === 0) {
                            console.log('📸 No Google Places photos found for place:', placeId);
                            return [2 /*return*/, null];
                        }
                        photo = photos[0];
                        sizeConfig = {
                            small: { width: 300, height: 200 },
                            medium: { width: 600, height: 400 },
                            large: { width: 1200, height: 800 }
                        };
                        config = sizeConfig[size];
                        imageUrl = this.getPhotoUrl(photo.photo_reference, config.width, config.height);
                        console.log('📸 Generated Google Places image URL:', imageUrl);
                        return [2 /*return*/, imageUrl];
                    case 2:
                        error_2 = _a.sent();
                        console.error('❌ Error getting restaurant image:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get multiple REAL images for gallery/carousel - NO FAKE IMAGES
     */
    GooglePlacesImageService.prototype.getRestaurantGallery = function (placeId_1) {
        return __awaiter(this, arguments, void 0, function (placeId, limit) {
            var photos, error_3;
            var _this = this;
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPlacePhotos(placeId)];
                    case 1:
                        photos = _a.sent();
                        if (photos.length === 0) {
                            console.log('📸 No Google Places photos available for gallery');
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, photos
                                .slice(0, limit)
                                .map(function (photo) { return _this.getPhotoUrl(photo.photo_reference, 600, 400); })];
                    case 2:
                        error_3 = _a.sent();
                        console.error('❌ Error getting restaurant gallery:', error_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cache images locally for better performance - ONLY REAL IMAGES
     */
    GooglePlacesImageService.prototype.cacheRestaurantImages = function (restaurants) {
        return __awaiter(this, void 0, void 0, function () {
            var imageCache, _i, restaurants_1, restaurant, imageUrl, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageCache = new Map();
                        console.log('📸 Caching Google Places images for', restaurants.length, 'restaurants');
                        _i = 0, restaurants_1 = restaurants;
                        _a.label = 1;
                    case 1:
                        if (!(_i < restaurants_1.length)) return [3 /*break*/, 9];
                        restaurant = restaurants_1[_i];
                        if (!restaurant.google_place_id) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.getRestaurantImageUrl(restaurant.google_place_id, 'medium')];
                    case 3:
                        imageUrl = _a.sent();
                        imageCache.set(restaurant.id, imageUrl);
                        // Add small delay to respect rate limits
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 4:
                        // Add small delay to respect rate limits
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.error('❌ Error caching image for restaurant:', restaurant.id, error_4);
                        imageCache.set(restaurant.id, null);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        console.log('📸 No Google Place ID for restaurant:', restaurant.id);
                        imageCache.set(restaurant.id, null);
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9:
                        console.log('📸 Cached images for', imageCache.size, 'restaurants');
                        return [2 /*return*/, imageCache];
                }
            });
        });
    };
    return GooglePlacesImageService;
}());
export { GooglePlacesImageService };
// Export singleton instance
export var googlePlacesImageService = new GooglePlacesImageService();
