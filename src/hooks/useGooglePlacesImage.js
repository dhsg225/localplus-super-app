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
// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
import { useState, useEffect } from 'react';
export var useGooglePlacesImage = function (heroImage, options) {
    if (options === void 0) { options = {}; }
    var _a = useState(null), imageUrl = _a[0], setImageUrl = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = options.size, size = _d === void 0 ? 'medium' : _d;
    useEffect(function () {
        // Check if this is a Google Places placeholder
        if (!heroImage.startsWith('google-places:')) {
            setImageUrl(heroImage || null);
            return;
        }
        var placeId = heroImage.replace('google-places:', '');
        if (!placeId) {
            setImageUrl(null);
            return;
        }
        var loadGooglePlacesImage = function () { return __awaiter(void 0, void 0, void 0, function () {
            var googlePlacesImageService, imageUrl_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, import('../services/googlePlacesImageService')];
                    case 2:
                        googlePlacesImageService = (_a.sent()).googlePlacesImageService;
                        console.log('📸 Loading Google Places image for:', placeId);
                        return [4 /*yield*/, googlePlacesImageService.getRestaurantImageUrl(placeId, size)];
                    case 3:
                        imageUrl_1 = _a.sent();
                        if (imageUrl_1) {
                            console.log('📸 Successfully loaded Google Places image');
                            setImageUrl(imageUrl_1);
                        }
                        else {
                            console.log('📸 No Google Places image available');
                            setImageUrl(null);
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        console.error('📸 Error loading Google Places image:', err_1);
                        setError(err_1 instanceof Error ? err_1.message : 'Failed to load image');
                        setImageUrl(null);
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadGooglePlacesImage();
    }, [heroImage, size]);
    return { imageUrl: imageUrl, isLoading: isLoading, error: error };
};
// Hook for preloading multiple restaurant images
export var useRestaurantImageCache = function (restaurants) {
    var _a = useState(new Map()), cachedImages = _a[0], setCachedImages = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    useEffect(function () {
        var loadImages = function () { return __awaiter(void 0, void 0, void 0, function () {
            var googlePlacesImageService, googlePlacesRestaurants, imageCache, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, import('../services/googlePlacesImageService')];
                    case 2:
                        googlePlacesImageService = (_a.sent()).googlePlacesImageService;
                        googlePlacesRestaurants = restaurants.filter(function (r) {
                            return r.heroImage.startsWith('google-places:');
                        }).map(function (r) { return ({
                            id: r.id,
                            google_place_id: r.heroImage.replace('google-places:', '')
                        }); });
                        if (!(googlePlacesRestaurants.length > 0)) return [3 /*break*/, 4];
                        console.log('📸 Preloading images for', googlePlacesRestaurants.length, 'restaurants');
                        return [4 /*yield*/, googlePlacesImageService.cacheRestaurantImages(googlePlacesRestaurants)];
                    case 3:
                        imageCache = _a.sent();
                        setCachedImages(imageCache);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error('📸 Error preloading images:', error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        if (restaurants.length > 0) {
            loadImages();
        }
    }, [restaurants]);
    var getImageUrl = function (restaurantId, fallback) {
        return cachedImages.get(restaurantId) || fallback;
    };
    return {
        getImageUrl: getImageUrl,
        isLoading: isLoading,
        cachedImages: cachedImages
    };
};
