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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, MapPin, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
var ProfileEditPage = function () {
    var _a, _b, _c, _d, _e;
    var navigate = useNavigate();
    var _f = useAuth(), user = _f.user, updateProfile = _f.updateProfile;
    var _g = useState(false), isSaving = _g[0], setIsSaving = _g[1];
    if (!user) {
        navigate('/auth/login');
        return null;
    }
    var _h = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        location: {
            city: ((_a = user.location) === null || _a === void 0 ? void 0 : _a.city) || '',
            country: ((_b = user.location) === null || _b === void 0 ? void 0 : _b.country) || ''
        },
        preferences: {
            language: ((_c = user.preferences) === null || _c === void 0 ? void 0 : _c.language) || 'en',
            currency: ((_d = user.preferences) === null || _d === void 0 ? void 0 : _d.currency) || 'THB',
            cuisinePreferences: ((_e = user.preferences) === null || _e === void 0 ? void 0 : _e.cuisinePreferences) || []
        }
    }), formData = _h[0], setFormData = _h[1];
    var handleInputChange = function (field, value) {
        if (field.includes('.')) {
            var _a = field.split('.'), parent_1 = _a[0], child_1 = _a[1];
            setFormData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[parent_1] = __assign(__assign({}, prev[parent_1]), (_b = {}, _b[child_1] = value, _b)), _a)));
            });
        }
        else {
            setFormData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
            });
        }
    };
    var handleCuisineToggle = function (cuisine) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { preferences: __assign(__assign({}, prev.preferences), { cuisinePreferences: prev.preferences.cuisinePreferences.includes(cuisine)
                    ? prev.preferences.cuisinePreferences.filter(function (c) { return c !== cuisine; })
                    : __spreadArray(__spreadArray([], prev.preferences.cuisinePreferences, true), [cuisine], false) }) })); });
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updates, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    updates = {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        phone: formData.phone,
                        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
                        location: __assign(__assign({}, user.location), { city: formData.location.city, country: formData.location.country }),
                        preferences: __assign(__assign({}, user.preferences), { language: formData.preferences.language, currency: formData.preferences.currency, cuisinePreferences: formData.preferences.cuisinePreferences })
                    };
                    return [4 /*yield*/, updateProfile(updates)];
                case 2:
                    _a.sent();
                    navigate('/profile');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error updating profile:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var cuisineOptions = [
        'Thai', 'Japanese', 'Italian', 'Chinese', 'Korean', 'Mexican',
        'Indian', 'French', 'American', 'Mediterranean', 'Vietnamese', 'German'
    ];
    var languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'th', label: 'ไทย (Thai)' },
        { value: 'ja', label: '日本語 (Japanese)' },
        { value: 'ko', label: '한국어 (Korean)' },
        { value: 'zh', label: '中文 (Chinese)' }
    ];
    var currencyOptions = [
        { value: 'THB', label: 'THB (Thai Baht)' },
        { value: 'USD', label: 'USD (US Dollar)' },
        { value: 'EUR', label: 'EUR (Euro)' },
        { value: 'JPY', label: 'JPY (Japanese Yen)' },
        { value: 'KRW', label: 'KRW (Korean Won)' }
    ];
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/profile'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16}/>
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center relative">
                {user.avatar ? (<img src={user.avatar} alt={"".concat(user.firstName, " ").concat(user.lastName)} className="w-20 h-20 rounded-full object-cover"/>) : (<UserIcon size={32} className="text-gray-400"/>)}
                <button className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                  <Camera size={16}/>
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
                <button className="text-red-600 text-sm font-medium hover:text-red-700">
                  Choose Photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input type="text" value={formData.firstName} onChange={function (e) { return handleInputChange('firstName', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter your first name"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input type="text" value={formData.lastName} onChange={function (e) { return handleInputChange('lastName', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter your last name"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input type="date" value={formData.dateOfBirth} onChange={function (e) { return handleInputChange('dateOfBirth', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16}/>
                  <span>Email Address</span>
                </div>
              </label>
              <input type="email" value={formData.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" placeholder="your@email.com"/>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone size={16}/>
                  <span>Phone Number</span>
                </div>
              </label>
              <input type="tel" value={formData.phone} onChange={function (e) { return handleInputChange('phone', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="+66-X-XXX-XXXX"/>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              <div className="flex items-center space-x-2">
                <MapPin size={20}/>
                <span>Location</span>
              </div>
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input type="text" value={formData.location.city} onChange={function (e) { return handleInputChange('location.city', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Hua Hin"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input type="text" value={formData.location.country} onChange={function (e) { return handleInputChange('location.country', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Thailand"/>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select value={formData.preferences.language} onChange={function (e) { return handleInputChange('preferences.language', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  {languageOptions.map(function (option) { return (<option key={option.value} value={option.value}>
                      {option.label}
                    </option>); })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select value={formData.preferences.currency} onChange={function (e) { return handleInputChange('preferences.currency', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  {currencyOptions.map(function (option) { return (<option key={option.value} value={option.value}>
                      {option.label}
                    </option>); })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Favorite Cuisines
              </label>
              <div className="grid grid-cols-3 gap-2">
                {cuisineOptions.map(function (cuisine) { return (<button key={cuisine} type="button" onClick={function () { return handleCuisineToggle(cuisine); }} className={"px-3 py-2 text-sm rounded-lg border transition-colors ".concat(formData.preferences.cuisinePreferences.includes(cuisine)
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}>
                    {cuisine}
                  </button>); })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default ProfileEditPage;
