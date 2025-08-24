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
import { v4 as uuidv4 } from 'uuid';
// Mock user data for development
var mockUsers = [
    {
        id: 'b3e1c2d4-1234-5678-9abc-def012345678',
        email: 'siriporn@localplus.co.th',
        firstName: 'Siriporn',
        lastName: 'Tanaka',
        phone: '+66-89-123-4567',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150',
        location: {
            city: 'Hua Hin',
            country: 'Thailand',
            coordinates: { lat: 12.5684, lng: 99.9578 }
        },
        preferences: {
            language: 'th',
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
            cuisinePreferences: ['Thai', 'Japanese', 'Italian'],
            priceRange: { min: 100, max: 1500 },
            favoriteDistricts: ['Hua Hin Beach', 'Town Center', 'Royal Golf Course Area']
        },
        accountSettings: {
            privacy: {
                profileVisibility: 'public',
                showActivityStatus: true,
                allowLocationTracking: true
            },
            security: {
                twoFactorEnabled: false,
                loginAlerts: true
            }
        },
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: new Date('2024-08-15'),
        lastLoginAt: new Date(),
        loginProvider: 'email'
    }
];
// Storage keys
var TOKEN_KEY = 'localplus_auth_token';
var REFRESH_TOKEN_KEY = 'localplus_refresh_token';
var USER_KEY = 'localplus_user';
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.baseURL = 'http://localhost:3000/api';
    }
    // Simulate API delay
    AuthService.prototype.delay = function (ms) {
        if (ms === void 0) { ms = 1000; }
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    AuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var user, authResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay()];
                    case 1:
                        _a.sent();
                        user = mockUsers.find(function (u) { return u.email === credentials.email; });
                        if (!user) {
                            throw new Error('User not found');
                        }
                        // In real implementation, verify password hash
                        if (credentials.password !== 'password123') {
                            throw new Error('Invalid password');
                        }
                        authResponse = {
                            user: __assign(__assign({}, user), { lastLoginAt: new Date() }),
                            token: this.generateMockToken(),
                            refreshToken: this.generateMockToken(),
                            expiresIn: 86400 // 24 hours
                        };
                        // Store auth data
                        if (credentials.rememberMe) {
                            localStorage.setItem(TOKEN_KEY, authResponse.token);
                            localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
                            localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
                        }
                        else {
                            sessionStorage.setItem(TOKEN_KEY, authResponse.token);
                            sessionStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
                        }
                        return [2 /*return*/, authResponse];
                }
            });
        });
    };
    AuthService.prototype.register = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, newUser, authResponse;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.delay(1500)];
                    case 1:
                        _b.sent();
                        existingUser = mockUsers.find(function (u) { return u.email === credentials.email; });
                        if (existingUser) {
                            throw new Error('User already exists with this email');
                        }
                        newUser = {
                            id: uuidv4(),
                            email: credentials.email,
                            firstName: credentials.firstName,
                            lastName: credentials.lastName,
                            phone: credentials.phone,
                            preferences: {
                                language: 'en',
                                currency: 'THB',
                                notifications: {
                                    email: (_a = credentials.subscribeToNewsletter) !== null && _a !== void 0 ? _a : true,
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
                            },
                            accountSettings: {
                                privacy: {
                                    profileVisibility: 'public',
                                    showActivityStatus: true,
                                    allowLocationTracking: false
                                },
                                security: {
                                    twoFactorEnabled: false,
                                    loginAlerts: true
                                }
                            },
                            isEmailVerified: false,
                            isPhoneVerified: false,
                            createdAt: new Date(),
                            lastLoginAt: new Date(),
                            loginProvider: 'email'
                        };
                        mockUsers.push(newUser);
                        authResponse = {
                            user: newUser,
                            token: this.generateMockToken(),
                            refreshToken: this.generateMockToken(),
                            expiresIn: 86400
                        };
                        // Store auth data
                        localStorage.setItem(TOKEN_KEY, authResponse.token);
                        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
                        localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
                        return [2 /*return*/, authResponse];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay()];
                    case 1:
                        _a.sent();
                        user = mockUsers.find(function (u) { return u.email === email; });
                        if (!user) {
                            throw new Error('No user found with this email address');
                        }
                        // In real implementation, send reset email
                        console.log("Password reset email sent to ".concat(email));
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.updateProfile = function (userId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var userIndex, updatedUser, storedUser, storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay(800)];
                    case 1:
                        _a.sent();
                        userIndex = mockUsers.findIndex(function (u) { return u.id === userId; });
                        if (userIndex === -1) {
                            throw new Error('User not found');
                        }
                        updatedUser = __assign(__assign({}, mockUsers[userIndex]), updates);
                        mockUsers[userIndex] = updatedUser;
                        storedUser = this.getStoredUser();
                        if (storedUser && storedUser.id === userId) {
                            storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
                            storage.setItem(USER_KEY, JSON.stringify(updatedUser));
                        }
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    };
    AuthService.prototype.getStoredToken = function () {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    };
    AuthService.prototype.getStoredUser = function () {
        var userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
        if (!userStr)
            return null;
        try {
            var user = JSON.parse(userStr);
            // Convert date strings back to Date objects
            return __assign(__assign({}, user), { createdAt: new Date(user.createdAt), lastLoginAt: new Date(user.lastLoginAt), dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined });
        }
        catch (_a) {
            return null;
        }
    };
    AuthService.prototype.validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay(300)];
                    case 1:
                        _a.sent();
                        // In real implementation, validate token with backend
                        return [2 /*return*/, token.startsWith('mock_token_')];
                }
            });
        });
    };
    AuthService.prototype.socialLogin = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var socialUser, authResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay(2000)];
                    case 1:
                        _a.sent();
                        socialUser = {
                            id: "".concat(provider, "_").concat(Date.now()),
                            email: "user@".concat(provider, ".com"),
                            firstName: 'Social',
                            lastName: 'User',
                            avatar: "https://via.placeholder.com/150?text=".concat(provider.toUpperCase()),
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
                            },
                            accountSettings: {
                                privacy: {
                                    profileVisibility: 'public',
                                    showActivityStatus: true,
                                    allowLocationTracking: false
                                },
                                security: {
                                    twoFactorEnabled: false,
                                    loginAlerts: true
                                }
                            },
                            isEmailVerified: true,
                            isPhoneVerified: false,
                            createdAt: new Date(),
                            lastLoginAt: new Date(),
                            loginProvider: provider
                        };
                        authResponse = {
                            user: socialUser,
                            token: this.generateMockToken(),
                            refreshToken: this.generateMockToken(),
                            expiresIn: 86400
                        };
                        localStorage.setItem(TOKEN_KEY, authResponse.token);
                        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
                        localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
                        return [2 /*return*/, authResponse];
                }
            });
        });
    };
    AuthService.prototype.generateMockToken = function () {
        return "mock_token_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    return AuthService;
}());
export var authService = new AuthService();
