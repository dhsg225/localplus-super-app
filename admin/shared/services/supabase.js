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
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
export var supabase = createClient(supabaseUrl, supabaseAnonKey);
// Debug logging for development
if (import.meta.env.DEV) {
    console.log('🔧 Shared Supabase URL:', supabaseUrl);
    console.log('🔧 Shared Supabase Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
}
// Helper function for distance calculation
export function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth's radius in kilometers
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return Math.round(distance * 10) / 10;
}
// Business API Functions (migrated from consumer app)
export var businessAPI = {
    // Get all businesses
    getAllBusinesses: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching all businesses:', error);
                            throw error;
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Get all businesses within radius
    getBusinessesNearby: function (lat, lng, radiusKm) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select("\n        *,\n        discount_offers(*)\n      ")
                            .eq('partnership_status', 'active')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching businesses:', error);
                            return [2 /*return*/, []];
                        }
                        // Calculate distances and filter
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.filter(function (business) {
                                var distance = calculateDistance(lat, lng, business.latitude, business.longitude);
                                return distance <= radiusKm;
                            }).map(function (business) { return (__assign(__assign({}, business), { distance: calculateDistance(lat, lng, business.latitude, business.longitude) })); }).sort(function (a, b) { return a.distance - b.distance; })) || []];
                }
            });
        });
    },
    // Add new business
    addBusiness: function (businessData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .insert([__assign(__assign({}, businessData), { partnership_status: 'active' })])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error adding business:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Add discount offer
    addDiscountOffer: function (offerData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('discount_offers')
                            .insert([offerData])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error adding discount offer:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Record redemption
    recordRedemption: function (redemptionData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('user_redemptions')
                            .insert([redemptionData])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error recording redemption:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Check if user can redeem
    canUserRedeem: function (userId, businessId, discountOfferId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, offer, redemptionCount, maxRedemptions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('user_redemptions')
                            .select('*')
                            .eq('user_id', userId)
                            .eq('business_id', businessId)
                            .eq('discount_offer_id', discountOfferId)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error checking redemption eligibility:', error);
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, supabase
                                .from('discount_offers')
                                .select('max_redemptions_per_user')
                                .eq('id', discountOfferId)
                                .single()];
                    case 2:
                        offer = (_b.sent()).data;
                        redemptionCount = (data === null || data === void 0 ? void 0 : data.length) || 0;
                        maxRedemptions = (offer === null || offer === void 0 ? void 0 : offer.max_redemptions_per_user) || 1;
                        return [2 /*return*/, redemptionCount < maxRedemptions];
                }
            });
        });
    }
};
