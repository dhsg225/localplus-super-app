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
// [2024-12-19 23:15] - Updated to use unified authentication system exclusively
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@shared/services/authService';
// Initial state
var initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};
// Auth reducer
function authReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return __assign(__assign({}, state), { isLoading: action.payload });
        case 'SET_USER':
            return __assign(__assign({}, state), { user: action.payload, isAuthenticated: true, isLoading: false, error: null });
        case 'SET_ERROR':
            return __assign(__assign({}, state), { error: action.payload, isLoading: false });
        case 'CLEAR_ERROR':
            return __assign(__assign({}, state), { error: null });
        case 'LOGOUT':
            return __assign(__assign({}, state), { user: null, isAuthenticated: false, error: null });
        case 'INIT_AUTH':
            return __assign(__assign({}, state), { user: action.payload.user, isAuthenticated: !!action.payload.user, isLoading: action.payload.isLoading });
        default:
            return state;
    }
}
// Create context
var AuthContext = createContext(undefined);
// [2024-12-19 22:45] - Map unified user to consumer app user format
function mapUnifiedUserToAppUser(unifiedUser) {
    var _a, _b;
    return {
        id: unifiedUser.id,
        email: unifiedUser.email,
        firstName: unifiedUser.firstName,
        lastName: unifiedUser.lastName,
        phone: unifiedUser.phone || '',
        avatar: unifiedUser.avatar || '',
        dateOfBirth: undefined,
        gender: 'prefer_not_to_say',
        location: (_a = unifiedUser.consumerProfile) === null || _a === void 0 ? void 0 : _a.location,
        preferences: ((_b = unifiedUser.consumerProfile) === null || _b === void 0 ? void 0 : _b.preferences) || {
            language: 'en',
            currency: 'THB',
            notifications: {
                email: true,
                push: true,
                sms: false,
                deals: true,
                events: true,
                reminders: true,
            },
            dietary: {
                vegetarian: false,
                vegan: false,
                halal: false,
                glutenFree: false,
                allergies: [],
            },
            cuisinePreferences: [],
            priceRange: { min: 100, max: 1000 },
            favoriteDistricts: [],
        },
        accountSettings: {
            privacy: {
                profileVisibility: 'public',
                showActivityStatus: true,
                allowLocationTracking: false,
            },
            security: {
                twoFactorEnabled: false,
                loginAlerts: true,
            },
        },
        isEmailVerified: unifiedUser.isEmailVerified,
        isPhoneVerified: false,
        createdAt: unifiedUser.createdAt,
        lastLoginAt: unifiedUser.lastLoginAt,
        loginProvider: unifiedUser.loginProvider,
    };
}
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useReducer(authReducer, initialState), state = _b[0], dispatch = _b[1];
    // Initialize auth state on app load
    useEffect(function () {
        var initAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, authService.getCurrentUser()];
                    case 1:
                        user = _a.sent();
                        dispatch({
                            type: 'INIT_AUTH',
                            payload: {
                                user: user ? mapUnifiedUserToAppUser(user) : null,
                                isLoading: false
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Auth initialization error:', error_1);
                        dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        initAuth();
    }, []);
    var login = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dispatch({ type: 'SET_LOADING', payload: true });
                    dispatch({ type: 'CLEAR_ERROR' });
                    return [4 /*yield*/, authService.signIn({
                            email: credentials.email,
                            password: credentials.password,
                            rememberMe: credentials.rememberMe
                        })];
                case 1:
                    user = _a.sent();
                    dispatch({ type: 'SET_USER', payload: mapUnifiedUserToAppUser(user) });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    dispatch({ type: 'SET_ERROR', payload: error_2 instanceof Error ? error_2.message : 'Login failed' });
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var register = function (credentials) { return __awaiter(void 0, void 0, void 0, function () {
        var user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    dispatch({ type: 'SET_LOADING', payload: true });
                    dispatch({ type: 'CLEAR_ERROR' });
                    return [4 /*yield*/, authService.signUp({
                            email: credentials.email,
                            password: credentials.password,
                            firstName: credentials.firstName,
                            lastName: credentials.lastName,
                            phone: credentials.phone,
                            role: 'consumer'
                        })];
                case 1:
                    user = _a.sent();
                    dispatch({ type: 'SET_USER', payload: mapUnifiedUserToAppUser(user) });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    dispatch({ type: 'SET_ERROR', payload: error_3 instanceof Error ? error_3.message : 'Registration failed' });
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService.signOut()];
                case 1:
                    _a.sent();
                    dispatch({ type: 'LOGOUT' });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Logout error:', error_4);
                    dispatch({ type: 'LOGOUT' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var clearError = function () {
        dispatch({ type: 'CLEAR_ERROR' });
    };
    var contextValue = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login: login,
        register: register,
        logout: logout,
        resetPassword: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            throw new Error('Not implemented yet in unified auth');
        }); }); },
        updateProfile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            throw new Error('Not implemented yet in unified auth');
        }); }); },
        deleteAccount: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            throw new Error('Not implemented yet in unified auth');
        }); }); },
        clearError: clearError
    };
    return (<AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>);
};
// Custom hook to use auth context
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
