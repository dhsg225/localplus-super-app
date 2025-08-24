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
// [2024-12-19 23:00] - Enhanced admin authentication with better error handling
import { createClient } from '@supabase/supabase-js';
// Use shared Supabase configuration
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Create admin-specific supabase client
export var adminSupabase = createClient(supabaseUrl, supabaseAnonKey);
// Re-export shared services for backward compatibility
export { supabase, businessAPI, calculateDistance } from '@shared/services/supabase';
// Enhanced admin authentication functions
export var adminAuth = {
    signUp: function (email_1, password_1) {
        return __awaiter(this, arguments, void 0, function (email, password, firstName, lastName) {
            var _a, data, error, error_1;
            if (firstName === void 0) { firstName = ''; }
            if (lastName === void 0) { lastName = ''; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🔐 Attempting admin signup for:', email);
                        return [4 /*yield*/, adminSupabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                    data: {
                                        role: 'admin',
                                        firstName: firstName,
                                        lastName: lastName
                                    }
                                }
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Admin signup error:', error);
                            throw error;
                        }
                        console.log('✅ Admin signup successful:', data);
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _b.sent();
                        console.error('❌ Admin signup failed:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    signIn: function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🔐 Attempting admin signin for:', email);
                        return [4 /*yield*/, adminSupabase.auth.signInWithPassword({
                                email: email,
                                password: password
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Admin signin error:', error);
                            throw error;
                        }
                        console.log('✅ Admin signin successful:', data);
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _b.sent();
                        console.error('❌ Admin signin failed:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getCurrentUser: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, error, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, adminSupabase.auth.getUser()];
                    case 1:
                        _a = _b.sent(), user = _a.data.user, error = _a.error;
                        if (error) {
                            console.error('❌ Get current user error:', error);
                            throw error;
                        }
                        return [2 /*return*/, user];
                    case 2:
                        error_3 = _b.sent();
                        console.error('❌ Get current user failed:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    signOut: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, adminSupabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('❌ Admin signout error:', error);
                            throw error;
                        }
                        console.log('✅ Admin signout successful');
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('❌ Admin signout failed:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    checkAdminRole: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, adminSupabase
                                .from('profiles')
                                .select('role')
                                .eq('id', userId)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error && error.code !== 'PGRST116') {
                            console.error('❌ Check admin role error:', error);
                            throw error;
                        }
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.role) === 'admin'];
                    case 2:
                        error_5 = _b.sent();
                        console.error('❌ Check admin role failed:', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
// Listen for auth state changes
adminSupabase.auth.onAuthStateChange(function (event, session) {
    var _a;
    console.log('🔄 Admin auth state changed:', event, (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email);
});
