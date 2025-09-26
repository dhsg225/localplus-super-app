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
// [2024-12-19 22:30] - Partner login form with development bypass for email confirmation
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { restaurantService } from '../services/restaurantService';
export var LoginForm = function (_a) {
    var onLoginSuccess = _a.onLoginSuccess;
    var _b = useState('shannon@localplus.com'), email = _b[0], setEmail = _b[1];
    var _c = useState('testpass123'), password = _c[0], setPassword = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState([]), businesses = _f[0], setBusinesses = _f[1]; // [2024-07-08] - For business selection
    var _g = useState(''), selectedBusiness = _g[0], setSelectedBusiness = _g[1]; // [2024-07-08] - Selected business for signup
    React.useEffect(function () {
        // [2024-12-19] - Fetch businesses for signup using business service
        var fetchBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
            var businessData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('🔄 Fetching businesses for signup...');
                        return [4 /*yield*/, businessService.getBusinessesForSignup()];
                    case 1:
                        businessData = _a.sent();
                        if (businessData.length > 0) {
                            console.log("\u2705 Successfully fetched ".concat(businessData.length, " businesses for signup"));
                            setBusinesses(businessData);
                        }
                        else {
                            console.log('⚠️ No businesses available for signup');
                            setBusinesses([]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('❌ Error fetching businesses:', err_1);
                        setBusinesses([]);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchBusinesses();
    }, []);
    var handleLogin = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, signInError, resendError, err_2, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, signInError = _a.error;
                    if (!signInError) return [3 /*break*/, 6];
                    if (!signInError.message.includes('Email not confirmed')) return [3 /*break*/, 4];
                    setError('Email not confirmed. For development, please check your email or wait for confirmation.');
                    return [4 /*yield*/, supabase.auth.resend({
                            type: 'signup',
                            email: email
                        })];
                case 3:
                    resendError = (_b.sent()).error;
                    if (!resendError) {
                        setError('Email not confirmed. Confirmation email has been resent to ' + email);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setError(signInError.message);
                    _b.label = 5;
                case 5: return [2 /*return*/];
                case 6:
                    if (data.user) {
                        console.log('✅ Partner login successful:', data.user.email);
                        onLoginSuccess();
                    }
                    return [3 /*break*/, 9];
                case 7:
                    err_2 = _b.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Login failed';
                    setError(errorMessage);
                    console.error('Login error:', err_2);
                    return [3 /*break*/, 9];
                case 8:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateAccount = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, signUpError, linkErr_1, err_3, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    setError('');
                    if (!selectedBusiness) {
                        setError('Please select a business to link your account.');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    return [4 /*yield*/, supabase.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                data: {
                                    firstName: 'Shannon',
                                    lastName: 'Restaurant Owner',
                                    phone: '+66-89-123-4567',
                                    role: 'partner'
                                }
                            }
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, signUpError = _a.error;
                    if (signUpError) {
                        setError(signUpError.message);
                        return [2 /*return*/];
                    }
                    if (!data.user) return [3 /*break*/, 7];
                    console.log('✅ Partner account created:', data.user.email);
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, supabase.from('partners').insert({
                            user_id: data.user.id,
                            business_id: selectedBusiness,
                            role: 'owner',
                            is_active: true,
                            accepted_at: new Date().toISOString()
                        })];
                case 4:
                    _b.sent();
                    console.log('✅ User linked to business:', selectedBusiness);
                    return [3 /*break*/, 6];
                case 5:
                    linkErr_1 = _b.sent();
                    console.error('Error linking user to business:', linkErr_1);
                    return [3 /*break*/, 6];
                case 6:
                    // [2024-07-14] - Handle email confirmation properly
                    if (data.user.email_confirmed_at) {
                        // Email already confirmed (development mode)
                        setError('Account created! You can now sign in.');
                        onLoginSuccess();
                    }
                    else {
                        // Email confirmation required
                        setError('Account created! Please check your email to confirm your account before signing in.');
                    }
                    _b.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    err_3 = _b.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Account creation failed';
                    setError(errorMessage);
                    console.error('Signup error:', err_3);
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    // Development bypass function
    var handleDevelopmentBypass = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockUser;
        return __generator(this, function (_a) {
            setLoading(true);
            setError('');
            try {
                // For development, we'll create a mock user session
                console.log('🔧 Development bypass activated');
                mockUser = {
                    id: '550e8400-e29b-41d4-a716-446655440000', // [2024-07-08] - Fixed: Use proper UUID format
                    email: email,
                    firstName: 'Shannon',
                    lastName: 'Restaurant Owner',
                    role: 'partner',
                    roles: ['partner']
                };
                localStorage.setItem('partner_dev_user', JSON.stringify(mockUser));
                console.log('✅ Development bypass successful');
                onLoginSuccess();
            }
            catch (err) {
                setError('Development bypass failed');
                console.error('Bypass error:', err);
            }
            finally {
                setLoading(false);
            }
            return [2 /*return*/];
        });
    }); };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LP</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Partner Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your restaurant bookings
          </p>
          <p className="mt-1 text-center text-xs text-blue-600">
            🔄 Direct Supabase Authentication
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} required placeholder="Enter your email" />
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} required placeholder="Enter your password" />
            {/* [2024-07-08] - Business selector for signup */}
            <label className="block text-sm font-medium text-gray-700">Select Business</label>
            <select className="w-full border rounded px-3 py-2" value={selectedBusiness} onChange={function (e) { return setSelectedBusiness(e.target.value); }} required disabled={businesses.length === 0}>
              <option value="">{businesses.length === 0 ? 'No businesses available' : 'Choose a business'}</option>
              {businesses.map(function (b) { return (<option key={b.id} value={b.id}>{b.name}</option>); })}
            </select>
          </div>

          {error && (<div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>)}

          <div className="space-y-3">
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <button type="button" className="w-full px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50" onClick={handleCreateAccount} disabled={loading || businesses.length === 0}>
              {loading ? 'Working...' : 'Create Partner Account'}
            </button>
            <button type="button" className="w-full px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50" onClick={handleDevelopmentBypass} disabled={loading}>
              🔧 Development Bypass
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Test credentials: shannon@localplus.com / testpass123
            </p>
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Use Development Bypass if email not confirmed
            </p>
          </div>
        </form>
      </div>
    </div>);
};
