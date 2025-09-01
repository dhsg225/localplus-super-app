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
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Settings, Shield, MapPin, Calendar, Mail, Phone, Star, Award } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
var ProfilePage = function () {
    var navigate = useNavigate();
    var _a = useAuth(), user = _a.user, logout = _a.logout;
    var _b = useState(false), isLoggingOut = _b[0], setIsLoggingOut = _b[1];
    if (!user) {
        navigate('/auth/login');
        return null;
    }
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoggingOut(true);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent(); // Simulate delay
                    logout();
                    navigate('/auth/login');
                    return [2 /*return*/];
            }
        });
    }); };
    var formatJoinDate = function (date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long'
        }).format(date);
    };
    var getVerificationStatus = function () {
        var emailVerified = user.isEmailVerified;
        var phoneVerified = user.isPhoneVerified;
        if (emailVerified && phoneVerified)
            return { status: 'verified', text: 'Fully Verified', color: 'text-green-600 bg-green-100' };
        if (emailVerified || phoneVerified)
            return { status: 'partial', text: 'Partially Verified', color: 'text-yellow-600 bg-yellow-100' };
        return { status: 'unverified', text: 'Unverified', color: 'text-red-600 bg-red-100' };
    };
    var verification = getVerificationStatus();
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={function () { return navigate('/'); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
              <p className="text-sm text-gray-600">Manage your account and preferences</p>
            </div>
            <button onClick={function () { return navigate('/profile/edit'); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <Edit3 size={20} className="text-gray-600"/>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Savings Passport Info Link */}
        <Link to="/passport/info" className="block bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center">
                <Award size={20} className="mr-2"/>
                Learn About Savings Passport
              </h3>
              <p className="text-orange-100 text-sm">Everything about gamification, rewards, and exclusive benefits</p>
            </div>
            <div className="text-white">
              <ArrowLeft size={20} className="rotate-180"/>
            </div>
          </div>
        </Link>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.avatar ? (<img src={user.avatar} alt={"".concat(user.firstName, " ").concat(user.lastName)} className="w-20 h-20 rounded-full object-cover"/>) : (<span className="text-2xl font-bold text-white">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-red-100 text-sm mb-2">{user.email}</p>
                <div className="flex items-center space-x-3">
                  <span className={"text-xs px-2 py-1 rounded-full ".concat(verification.color)}>
                    {verification.text}
                  </span>
                  {user.loginProvider !== 'email' && (<span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {user.loginProvider.toUpperCase()} Account
                    </span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                <div className="text-sm font-medium text-gray-900">Member Since</div>
                <div className="text-xs text-gray-600">{formatJoinDate(user.createdAt)}</div>
              </div>
              
              <div className="text-center">
                <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                <div className="text-sm font-medium text-gray-900">Location</div>
                <div className="text-xs text-gray-600">
                  {user.location ? "".concat(user.location.city, ", ").concat(user.location.country) : 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2"/>
              <div className="text-lg font-bold text-gray-900">
                {user.preferences.cuisinePreferences.length}
              </div>
              <div className="text-sm text-gray-600">Favorite Cuisines</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2"/>
              <div className="text-lg font-bold text-gray-900">
                {user.preferences.favoriteDistricts.length}
              </div>
              <div className="text-sm text-gray-600">Favorite Areas</div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
          </div>
          
          <div className="p-4 space-y-1">
            <button onClick={function () { return navigate('/profile/edit'); }} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Edit3 size={20} className="text-gray-400"/>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Edit Profile</div>
                  <div className="text-sm text-gray-500">Update your personal information</div>
                </div>
              </div>
              <ArrowLeft size={16} className="text-gray-400 rotate-180"/>
            </button>

            <button onClick={function () { return navigate('/profile/preferences'); }} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Settings size={20} className="text-gray-400"/>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Preferences</div>
                  <div className="text-sm text-gray-500">Language, notifications, and dietary preferences</div>
                </div>
              </div>
              <ArrowLeft size={16} className="text-gray-400 rotate-180"/>
            </button>

            <button onClick={function () { return navigate('/profile/account-settings'); }} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-gray-400"/>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Account & Security</div>
                  <div className="text-sm text-gray-500">Privacy settings and security options</div>
                </div>
              </div>
              <ArrowLeft size={16} className="text-gray-400 rotate-180"/>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400"/>
                <div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">
                    {user.isEmailVerified ? (<span className="text-green-600">✓ Verified</span>) : (<span className="text-red-600">Not verified</span>)}
                  </div>
                </div>
              </div>
            </div>

            {user.phone && (<div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-gray-400"/>
                  <div>
                    <div className="font-medium text-gray-900">{user.phone}</div>
                    <div className="text-sm text-gray-500">
                      {user.isPhoneVerified ? (<span className="text-green-600">✓ Verified</span>) : (<span className="text-red-600">Not verified</span>)}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
          {isLoggingOut ? (<div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              <span>Signing out...</span>
            </div>) : ('Sign Out')}
        </button>
      </div>
    </div>);
};
export default ProfilePage;
