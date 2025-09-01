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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
var RegisterPage = function () {
    var navigate = useNavigate();
    var _a = useAuth(), register = _a.register, isLoading = _a.isLoading, error = _a.error, clearError = _a.clearError;
    var _b = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        subscribeToNewsletter: true
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState(false), showPassword = _c[0], setShowPassword = _c[1];
    var _d = useState(false), showConfirmPassword = _d[0], setShowConfirmPassword = _d[1];
    var _e = useState({}), validationErrors = _e[0], setValidationErrors = _e[1];
    var validateForm = function () {
        var errors = {};
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s|-/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        }
        else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    clearError();
                    if (!validateForm())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, register(formData)];
                case 2:
                    _a.sent();
                    navigate('/', { replace: true });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var getPasswordStrength = function (password) {
        var strength = 0;
        if (password.length >= 8)
            strength++;
        if (/[a-z]/.test(password))
            strength++;
        if (/[A-Z]/.test(password))
            strength++;
        if (/\d/.test(password))
            strength++;
        if (/[^a-zA-Z\d]/.test(password))
            strength++;
        if (strength <= 2)
            return { strength: strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3)
            return { strength: strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4)
            return { strength: strength, label: 'Good', color: 'bg-blue-500' };
        return { strength: strength, label: 'Strong', color: 'bg-green-500' };
    };
    var passwordStrength = getPasswordStrength(formData.password);
    return (<div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={function () { return navigate('/auth/login'); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
              <p className="text-sm text-gray-600">Join LocalPlus and start exploring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0"/>
                <p className="text-red-700 text-sm">{error}</p>
              </div>)}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400"/>
                  </div>
                  <input type="text" value={formData.firstName} onChange={function (e) { return handleInputChange('firstName', e.target.value); }} className={"w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="First name" autoComplete="given-name"/>
                </div>
                {validationErrors.firstName && (<p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input type="text" value={formData.lastName} onChange={function (e) { return handleInputChange('lastName', e.target.value); }} className={"w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="Last name" autoComplete="family-name"/>
                {validationErrors.lastName && (<p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>)}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400"/>
                </div>
                <input type="email" value={formData.email} onChange={function (e) { return handleInputChange('email', e.target.value); }} className={"w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="Enter your email" autoComplete="email"/>
              </div>
              {validationErrors.email && (<p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>)}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400"/>
                </div>
                <input type="tel" value={formData.phone} onChange={function (e) { return handleInputChange('phone', e.target.value); }} className={"w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="+66-XX-XXX-XXXX" autoComplete="tel"/>
              </div>
              {validationErrors.phone && (<p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>)}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400"/>
                </div>
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={function (e) { return handleInputChange('password', e.target.value); }} className={"w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="Create a password" autoComplete="new-password"/>
                <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? (<EyeOff size={20} className="text-gray-400"/>) : (<Eye size={20} className="text-gray-400"/>)}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (<div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={"h-2 rounded-full transition-all ".concat(passwordStrength.color)} style={{ width: "".concat((passwordStrength.strength / 5) * 100, "%") }}/>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>)}
              
              {validationErrors.password && (<p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>)}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400"/>
                </div>
                <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={function (e) { return handleInputChange('confirmPassword', e.target.value); }} className={"w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ".concat(validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300')} placeholder="Confirm your password" autoComplete="new-password"/>
                <button type="button" onClick={function () { return setShowConfirmPassword(!showConfirmPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? (<EyeOff size={20} className="text-gray-400"/>) : (<Eye size={20} className="text-gray-400"/>)}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (<div className="mt-2 flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500"/>
                  <span className="text-sm text-green-600">Passwords match</span>
                </div>)}
              {validationErrors.confirmPassword && (<p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>)}
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input type="checkbox" checked={formData.agreeToTerms} onChange={function (e) { return handleInputChange('agreeToTerms', e.target.checked); }} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"/>
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-red-600 hover:text-red-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {validationErrors.agreeToTerms && (<p className="text-sm text-red-600">{validationErrors.agreeToTerms}</p>)}

              <label className="flex items-start space-x-3">
                <input type="checkbox" checked={formData.subscribeToNewsletter} onChange={function (e) { return handleInputChange('subscribeToNewsletter', e.target.checked); }} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"/>
                <span className="text-sm text-gray-600">
                  I want to receive emails about deals, events, and updates from LocalPlus
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  <span>Creating account...</span>
                </div>) : ('Create Account')}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-red-600 hover:text-red-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>);
};
export default RegisterPage;
