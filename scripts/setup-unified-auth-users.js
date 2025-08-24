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
// [2024-12-19 22:50] - Setup test users for unified authentication system
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function setupUnifiedAuthUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var testUsers, _i, testUsers_1, user, _a, signUpData, signUpError, _b, signInData, signInError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🔧 Setting up unified authentication test users...\n');
                    testUsers = [
                        {
                            email: 'admin@localplus.com',
                            password: 'admin123',
                            firstName: 'LocalPlus',
                            lastName: 'Administrator',
                            role: 'admin',
                            description: 'System administrator with full access'
                        },
                        {
                            email: 'shannon@localplus.com',
                            password: 'testpass123',
                            firstName: 'Shannon',
                            lastName: 'Restaurant Owner',
                            phone: '+66-89-123-4567',
                            role: 'partner',
                            businessId: '12345678-1234-5678-9012-123456789012',
                            description: 'Partner user linked to Shannon\'s Restaurant'
                        },
                        {
                            email: 'consumer@localplus.com',
                            password: 'consumer123',
                            firstName: 'Test',
                            lastName: 'Consumer',
                            phone: '+66-89-987-6543',
                            role: 'consumer',
                            description: 'Test consumer user'
                        }
                    ];
                    _i = 0, testUsers_1 = testUsers;
                    _c.label = 1;
                case 1:
                    if (!(_i < testUsers_1.length)) return [3 /*break*/, 14];
                    user = testUsers_1[_i];
                    console.log("\uD83D\uDC64 Creating user: ".concat(user.email, " (").concat(user.role, ")"));
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 12, , 13]);
                    return [4 /*yield*/, supabase.auth.signUp({
                            email: user.email,
                            password: user.password,
                            options: {
                                data: {
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    phone: user.phone,
                                    role: user.role
                                }
                            }
                        })];
                case 3:
                    _a = _c.sent(), signUpData = _a.data, signUpError = _a.error;
                    if (!signUpError) return [3 /*break*/, 9];
                    if (!signUpError.message.includes('already registered')) return [3 /*break*/, 7];
                    console.log("   \u26A0\uFE0F  User already exists, checking profile...");
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: user.email,
                            password: user.password
                        })];
                case 4:
                    _b = _c.sent(), signInData = _b.data, signInError = _b.error;
                    if (signInError) {
                        console.log("   \u274C Sign in failed: ".concat(signInError.message));
                        return [3 /*break*/, 13];
                    }
                    if (!signInData.user) return [3 /*break*/, 6];
                    console.log("   \u2705 User exists and can sign in");
                    return [4 /*yield*/, createUserProfiles(signInData.user.id, user)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.log("   \u274C Sign up failed: ".concat(signUpError.message));
                    return [3 /*break*/, 13];
                case 8: return [3 /*break*/, 11];
                case 9:
                    if (!signUpData.user) return [3 /*break*/, 11];
                    console.log("   \u2705 User created successfully");
                    return [4 /*yield*/, createUserProfiles(signUpData.user.id, user)];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_1 = _c.sent();
                    console.log("   \u274C Error: ".concat(error_1));
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14:
                    console.log('\n🎉 User setup complete!');
                    console.log('\n📋 Test Credentials:');
                    testUsers.forEach(function (user) {
                        console.log("   ".concat(user.role.toUpperCase(), ": ").concat(user.email, " / ").concat(user.password));
                        console.log("   \uD83D\uDCDD ".concat(user.description));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function createUserProfiles(userId, user) {
    return __awaiter(this, void 0, void 0, function () {
        var userError, _a, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, supabase
                            .from('users')
                            .upsert({
                            id: userId,
                            email: user.email,
                            first_name: user.firstName,
                            last_name: user.lastName,
                            phone: user.phone,
                            is_active: true
                        }, {
                            onConflict: 'id'
                        })];
                case 1:
                    userError = (_b.sent()).error;
                    if (userError) {
                        console.log("   \u26A0\uFE0F  User record error: ".concat(userError.message));
                    }
                    _a = user.role;
                    switch (_a) {
                        case 'admin': return [3 /*break*/, 2];
                        case 'partner': return [3 /*break*/, 4];
                        case 'consumer': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, createAdminProfile(userId)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 4:
                    if (!user.businessId) return [3 /*break*/, 6];
                    return [4 /*yield*/, createPartnerProfile(userId, user.businessId)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, createConsumerProfile(userId)];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 9:
                    console.log("   \u2705 Profiles created for ".concat(user.role));
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _b.sent();
                    console.log("   \u274C Profile creation error: ".concat(error_2));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function createAdminProfile(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('admin_profiles')
                        .upsert({
                        user_id: userId,
                        permissions: ['view_dashboard', 'manage_businesses', 'approve_listings', 'system_settings'],
                        department: 'operations'
                    }, {
                        onConflict: 'user_id'
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error && error.code !== '23505') { // Ignore duplicate key errors
                        console.log("   \u26A0\uFE0F  Admin profile error: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function createPartnerProfile(userId, businessId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('partners')
                        .upsert({
                        user_id: userId,
                        business_id: businessId,
                        role: 'owner',
                        permissions: ['view_bookings', 'manage_bookings', 'view_analytics', 'manage_settings'],
                        is_active: true,
                        accepted_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,business_id'
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error && error.code !== '23505') { // Ignore duplicate key errors
                        console.log("   \u26A0\uFE0F  Partner profile error: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function createConsumerProfile(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('consumer_profiles')
                        .upsert({
                        user_id: userId,
                        preferences: {
                            language: 'en',
                            currency: 'THB',
                            notifications: {
                                email: true,
                                push: true,
                                sms: false,
                                deals: true,
                                events: true,
                                reminders: true
                            },
                            dietary: {
                                vegetarian: false,
                                vegan: false,
                                halal: false,
                                glutenFree: false,
                                allergies: []
                            },
                            cuisinePreferences: ['Thai', 'International'],
                            priceRange: { min: 100, max: 1000 },
                            favoriteDistricts: []
                        }
                    }, {
                        onConflict: 'user_id'
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error && error.code !== '23505') { // Ignore duplicate key errors
                        console.log("   \u26A0\uFE0F  Consumer profile error: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
setupUnifiedAuthUsers().catch(console.error);
