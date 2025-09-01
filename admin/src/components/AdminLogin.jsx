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
// [2024-12-19 23:00] - Admin Login Component using enhanced admin authentication
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { adminAuth } from '../lib/supabase';
export var AdminLogin = function (_a) {
    var onLogin = _a.onLogin;
    var _b = useState({
        email: 'admin@localplus.com', // Updated for unified auth
        password: 'admin123',
        rememberMe: false
    }), credentials = _b[0], setCredentials = _b[1];
    var _c = useState(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var result, hasAdminRole, user, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, adminAuth.signIn(credentials.email, credentials.password)];
                case 2:
                    result = _c.sent();
                    if (!result.user) {
                        setError('Login failed: No user returned');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, adminAuth.checkAdminRole(result.user.id)];
                case 3:
                    hasAdminRole = _c.sent();
                    if (!hasAdminRole) {
                        setError('Access denied: Admin privileges required');
                        return [2 /*return*/];
                    }
                    user = {
                        id: result.user.id,
                        email: result.user.email || '',
                        firstName: ((_a = result.user.user_metadata) === null || _a === void 0 ? void 0 : _a.firstName) || '',
                        lastName: ((_b = result.user.user_metadata) === null || _b === void 0 ? void 0 : _b.lastName) || '',
                        roles: ['admin']
                    };
                    onLogin(user);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _c.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Login failed');
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateAdminAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, adminAuth.signUp(credentials.email, credentials.password, 'LocalPlus', 'Administrator')];
                case 2:
                    result = _a.sent();
                    if (!result.user) {
                        setError('Account creation failed: No user returned');
                        return [2 /*return*/];
                    }
                    user = {
                        id: result.user.id,
                        email: result.user.email || '',
                        firstName: 'LocalPlus',
                        lastName: 'Administrator',
                        roles: ['admin']
                    };
                    console.log('✅ Admin account created:', user.email);
                    onLogin(user);
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Account creation failed');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setCredentials(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        if (error)
            setError(null);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-2xl">
            <Shield size={32} className="text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            LocalPlus Admin
          </h1>
          <p className="text-gray-300">
            Secure access to dashboard
          </p>
          <p className="text-purple-300 text-sm mt-1">
            🔄 Now using Unified Authentication
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0"/>
                <p className="text-red-200 text-sm">{error}</p>
              </div>)}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400"/>
                </div>
                <input type="email" value={credentials.email} onChange={function (e) { return handleInputChange('email', e.target.value); }} className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm" placeholder="Enter admin email" required/>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400"/>
                </div>
                <input type={showPassword ? 'text' : 'password'} value={credentials.password} onChange={function (e) { return handleInputChange('password', e.target.value); }} className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm" placeholder="Enter password" required/>
                <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200">
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center text-gray-200">
                <input type="checkbox" checked={credentials.rememberMe} onChange={function (e) { return handleInputChange('rememberMe', e.target.checked); }} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 bg-white/10"/>
                <span className="ml-2 text-sm">Keep me signed in</span>
              </label>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {isLoading ? (<div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  <span>Signing in...</span>
                </div>) : ('Access Dashboard')}
            </button>

            {/* Create Admin Account Button */}
            <button type="button" onClick={handleCreateAdminAccount} disabled={isLoading} className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              Create Admin Account
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-200 font-medium mb-2">Unified Auth Credentials:</h4>
            <div className="text-sm text-blue-100 space-y-1">
              <div><strong>Test Admin:</strong> admin@localplus.com / admin123</div>
              <div><strong>Partner:</strong> shannon@localplus.com / testpass123</div>
              <div className="text-xs text-blue-200 mt-2">
                ✨ Same login works across all LocalPlus apps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
