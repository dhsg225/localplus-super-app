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
// [2024-12-19 22:15] - Unified Authentication Service for all LocalPlus apps
import { supabase } from './supabase';
var UnifiedAuthService = /** @class */ (function () {
    function UnifiedAuthService() {
        this.tokenKey = 'localplus_auth_token';
        this.userKey = 'localplus_user';
    }
    // Core Authentication Methods
    UnifiedAuthService.prototype.signIn = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, user;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: credentials.email,
                            password: credentials.password
                        })];
                    case 1:
                        _a = _d.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user)
                            throw new Error('Login failed');
                        return [4 /*yield*/, this.getUserProfile(data.user)];
                    case 2:
                        user = _d.sent();
                        // Store session info
                        if (credentials.rememberMe) {
                            localStorage.setItem(this.tokenKey, ((_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) || '');
                            localStorage.setItem(this.userKey, JSON.stringify(user));
                        }
                        else {
                            sessionStorage.setItem(this.tokenKey, ((_c = data.session) === null || _c === void 0 ? void 0 : _c.access_token) || '');
                            sessionStorage.setItem(this.userKey, JSON.stringify(user));
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UnifiedAuthService.prototype.signUp = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase.auth.signUp({
                            email: credentials.email,
                            password: credentials.password,
                            options: {
                                data: {
                                    firstName: credentials.firstName,
                                    lastName: credentials.lastName,
                                    phone: credentials.phone,
                                    role: credentials.role
                                }
                            }
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!data.user)
                            throw new Error('Registration failed');
                        // Create user profile based on role
                        return [4 /*yield*/, this.createUserProfile(data.user, credentials)];
                    case 2:
                        // Create user profile based on role
                        _b.sent();
                        return [4 /*yield*/, this.getUserProfile(data.user)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    UnifiedAuthService.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase.auth.signOut()];
                    case 1:
                        _a.sent();
                        localStorage.removeItem(this.tokenKey);
                        localStorage.removeItem(this.userKey);
                        sessionStorage.removeItem(this.tokenKey);
                        sessionStorage.removeItem(this.userKey);
                        return [2 /*return*/];
                }
            });
        });
    };
    UnifiedAuthService.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var devUserRaw, devUser, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
                        if (devUserRaw) {
                            try {
                                devUser = JSON.parse(devUserRaw);
                                // Return a mock UnifiedUser object
                                return [2 /*return*/, {
                                        id: devUser.id,
                                        email: devUser.email,
                                        firstName: devUser.firstName,
                                        lastName: devUser.lastName,
                                        phone: devUser.phone || '',
                                        avatar: '',
                                        roles: ['partner'],
                                        isEmailVerified: true,
                                        isActive: true,
                                        createdAt: new Date(),
                                        lastLoginAt: new Date(),
                                        loginProvider: 'email',
                                        partnerProfile: {
                                            businessIds: [devUser.businessId],
                                            permissions: ['all'],
                                            role: 'owner',
                                        },
                                    }];
                            }
                            catch (e) {
                                // Ignore parse errors
                            }
                        }
                        return [4 /*yield*/, supabase.auth.getUser()];
                    case 1:
                        user = (_a.sent()).data.user;
                        if (!user)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.getUserProfile(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UnifiedAuthService.prototype.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('users')
                            .select('id, email, first_name, last_name')
                            .eq('id', userId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, {
                                id: data.id,
                                email: data.email,
                                firstName: data.first_name,
                                lastName: data.last_name
                            }];
                }
            });
        });
    };
    // Role-Based Access Control
    UnifiedAuthService.prototype.hasRole = function (user, role) {
        return user.roles.includes(role);
    };
    UnifiedAuthService.prototype.hasPermission = function (user, permission) {
        var _a, _b;
        // Check admin permissions
        if ((_a = user.adminProfile) === null || _a === void 0 ? void 0 : _a.permissions.includes(permission))
            return true;
        // Check partner permissions
        if ((_b = user.partnerProfile) === null || _b === void 0 ? void 0 : _b.permissions.includes(permission))
            return true;
        // Super admin has all permissions
        if (user.roles.includes('super_admin'))
            return true;
        return false;
    };
    UnifiedAuthService.prototype.canAccessApp = function (user, app) {
        switch (app) {
            case 'consumer':
                return this.hasRole(user, 'consumer');
            case 'partner':
                return this.hasRole(user, 'partner');
            case 'admin':
                return this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin');
            default:
                return false;
        }
    };
    // Profile Management
    UnifiedAuthService.prototype.getUserProfile = function (supabaseUser) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userData, userError, _b, consumerProfile, partnerProfile, adminProfile, roles;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('users')
                            .select('*')
                            .eq('id', supabaseUser.id)
                            .single()];
                    case 1:
                        _a = _g.sent(), userData = _a.data, userError = _a.error;
                        if (userError && userError.code !== 'PGRST116') { // Not found is OK for new users
                            console.warn('Error fetching user data:', userError);
                        }
                        return [4 /*yield*/, Promise.all([
                                this.getConsumerProfile(supabaseUser.id),
                                this.getPartnerProfile(supabaseUser.id),
                                this.getAdminProfile(supabaseUser.id)
                            ])];
                    case 2:
                        _b = _g.sent(), consumerProfile = _b[0], partnerProfile = _b[1], adminProfile = _b[2];
                        roles = [];
                        if (consumerProfile)
                            roles.push('consumer');
                        if (partnerProfile)
                            roles.push('partner');
                        if (adminProfile) {
                            roles.push(adminProfile.permissions.includes('super_admin') ? 'super_admin' : 'admin');
                        }
                        return [2 /*return*/, {
                                id: supabaseUser.id,
                                email: supabaseUser.email || '',
                                firstName: (userData === null || userData === void 0 ? void 0 : userData.first_name) || ((_c = supabaseUser.user_metadata) === null || _c === void 0 ? void 0 : _c.firstName) || '',
                                lastName: (userData === null || userData === void 0 ? void 0 : userData.last_name) || ((_d = supabaseUser.user_metadata) === null || _d === void 0 ? void 0 : _d.lastName) || '',
                                phone: (userData === null || userData === void 0 ? void 0 : userData.phone) || ((_e = supabaseUser.user_metadata) === null || _e === void 0 ? void 0 : _e.phone),
                                avatar: userData === null || userData === void 0 ? void 0 : userData.avatar_url,
                                roles: roles,
                                isEmailVerified: !!supabaseUser.email_confirmed_at,
                                isActive: (_f = userData === null || userData === void 0 ? void 0 : userData.is_active) !== null && _f !== void 0 ? _f : true,
                                createdAt: new Date(supabaseUser.created_at),
                                lastLoginAt: new Date(),
                                loginProvider: 'email',
                                consumerProfile: consumerProfile,
                                partnerProfile: partnerProfile,
                                adminProfile: adminProfile
                            }];
                }
            });
        });
    };
    UnifiedAuthService.prototype.createUserProfile = function (supabaseUser, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var userError, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('users')
                            .upsert({
                            id: supabaseUser.id,
                            email: supabaseUser.email,
                            first_name: credentials.firstName,
                            last_name: credentials.lastName,
                            phone: credentials.phone,
                            is_active: true
                        })];
                    case 1:
                        userError = (_b.sent()).error;
                        if (userError)
                            console.warn('Error creating user record:', userError);
                        _a = credentials.role;
                        switch (_a) {
                            case 'partner': return [3 /*break*/, 2];
                            case 'consumer': return [3 /*break*/, 5];
                            case 'admin': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 2:
                        if (!credentials.businessId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createPartnerProfile(supabaseUser.id, credentials.businessId)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.createConsumerProfile(supabaseUser.id)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.createAdminProfile(supabaseUser.id)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UnifiedAuthService.prototype.getConsumerProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('consumer_profiles')
                            .select('*')
                            .eq('user_id', userId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    UnifiedAuthService.prototype.getPartnerProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .select('*')
                            .eq('user_id', userId)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error || !(data === null || data === void 0 ? void 0 : data.length))
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, {
                                businessIds: data.map(function (p) { return p.business_id; }),
                                permissions: data[0].permissions || [],
                                role: data[0].role || 'staff'
                            }];
                }
            });
        });
    };
    UnifiedAuthService.prototype.getAdminProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('admin_profiles')
                            .select('*')
                            .eq('user_id', userId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    UnifiedAuthService.prototype.createPartnerProfile = function (userId, businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .insert({
                            user_id: userId,
                            business_id: businessId,
                            role: 'owner',
                            permissions: ['view_bookings', 'manage_bookings', 'view_analytics', 'manage_settings'],
                            is_active: true,
                            accepted_at: new Date().toISOString()
                        })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            console.warn('Error creating partner profile:', error);
                        return [2 /*return*/];
                }
            });
        });
    };
    UnifiedAuthService.prototype.createConsumerProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('consumer_profiles')
                            .insert({
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
                                cuisinePreferences: [],
                                priceRange: { min: 100, max: 1000 },
                                favoriteDistricts: []
                            }
                        })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            console.warn('Error creating consumer profile:', error);
                        return [2 /*return*/];
                }
            });
        });
    };
    UnifiedAuthService.prototype.createAdminProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('admin_profiles')
                            .insert({
                            user_id: userId,
                            permissions: ['view_dashboard', 'manage_businesses'],
                            department: 'operations'
                        })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            console.warn('Error creating admin profile:', error);
                        return [2 /*return*/];
                }
            });
        });
    };
    return UnifiedAuthService;
}());
export var authService = new UnifiedAuthService();
