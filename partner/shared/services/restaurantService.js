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
import { supabase } from './supabase';
export var restaurantService = {
    // Get all restaurants (for partner dashboard)
    getRestaurants: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .eq('partnership_status', 'active')
                            .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching restaurants:', error);
                            throw error;
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Get all restaurants by location
    getRestaurantsByLocation: function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .ilike('address', "%".concat(location, "%"))
                            .eq('partnership_status', 'active')
                            .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching restaurants by location:', error);
                            throw error;
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Get single restaurant by ID
    getRestaurantById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching restaurant:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Create new restaurant
    createRestaurant: function (restaurant) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .insert([restaurant])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error creating restaurant:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Update restaurant details (for partner app)
    updateRestaurant: function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .update(updates)
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error updating restaurant:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Get restaurants by partner/owner
    getRestaurantsByOwner: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .select("\n        business_id,\n        businesses (*)\n      ")
                            .eq('user_id', userId)
                            .eq('is_active', true)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching partner restaurants:', error);
                            throw error;
                        }
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.map(function (item) { return item.businesses; }).filter(Boolean)) || []];
                }
            });
        });
    },
    // Get restaurants by cuisine type
    getRestaurantsByCuisine: function (cuisines) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .eq('partnership_status', 'active')
                            .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching restaurants by cuisine:', error);
                            throw error;
                        }
                        // Filter by cuisine in JavaScript since we don't have a cuisine column yet
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.filter(function (restaurant) {
                                return cuisines.some(function (cuisine) {
                                    var _a;
                                    return ((_a = restaurant.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(cuisine.toLowerCase())) ||
                                        restaurant.name.toLowerCase().includes(cuisine.toLowerCase());
                                });
                            })) || []];
                }
            });
        });
    }
};
