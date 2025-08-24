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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Send, Settings, TestTube } from 'lucide-react';
import { notificationService } from '../../shared/services/notificationService';
import { restaurantService } from '../../shared/services/restaurantService';
import { useToast } from '../../shared/components/Toast';
// [2024-12-19 10:30] - Notification settings page for partners to configure booking notifications
var NotificationSettings = function (_a) {
    var user = _a.user;
    var _b = useState(''), selectedRestaurant = _b[0], setSelectedRestaurant = _b[1];
    var _c = useState([]), restaurants = _c[0], setRestaurants = _c[1];
    var _d = useState(null), preferences = _d[0], setPreferences = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(false), saving = _f[0], setSaving = _f[1];
    var _g = useState(false), testing = _g[0], setTesting = _g[1];
    var _h = useState(''), testEmail = _h[0], setTestEmail = _h[1];
    var _j = useState(''), testPhone = _j[0], setTestPhone = _j[1];
    var _k = useState('general'), activeTab = _k[0], setActiveTab = _k[1];
    var showToast = useToast().showToast;
    useEffect(function () {
        loadRestaurants();
    }, []);
    useEffect(function () {
        if (selectedRestaurant) {
            loadPreferences();
        }
    }, [selectedRestaurant]);
    var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userRestaurants, allRestaurants, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, restaurantService.getRestaurantsByOwner(user.id)];
                case 1:
                    userRestaurants = _a.sent();
                    if (!(!userRestaurants || userRestaurants.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, restaurantService.getRestaurants()];
                case 2:
                    allRestaurants = _a.sent();
                    userRestaurants = allRestaurants.filter(function (r) {
                        return r.name.toLowerCase().includes('shannon');
                    });
                    if (userRestaurants.length === 0) {
                        userRestaurants = allRestaurants.slice(0, 1);
                    }
                    console.log('🔧 NotificationSettings fallback restaurants:', userRestaurants.length);
                    _a.label = 3;
                case 3:
                    setRestaurants(userRestaurants);
                    if (userRestaurants.length > 0) {
                        setSelectedRestaurant(userRestaurants[0].id);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error loading restaurants:', error_1);
                    showToast('Failed to load restaurants', 'error');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var loadPreferences = function () { return __awaiter(void 0, void 0, void 0, function () {
        var prefs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedRestaurant)
                        return [2 /*return*/];
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, notificationService.getPreferences(selectedRestaurant)];
                case 2:
                    prefs = _a.sent();
                    setPreferences(prefs);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error loading preferences:', error_2);
                    showToast('Failed to load notification preferences', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var savePreferences = function () { return __awaiter(void 0, void 0, void 0, function () {
        var business_id, prefData, updatedPrefs, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedRestaurant || !preferences)
                        return [2 /*return*/];
                    setSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    business_id = preferences.business_id, prefData = __rest(preferences, ["business_id"]);
                    return [4 /*yield*/, notificationService.savePreferences(__assign({ business_id: selectedRestaurant }, prefData))];
                case 2:
                    updatedPrefs = _a.sent();
                    setPreferences(updatedPrefs);
                    showToast('Notification preferences saved successfully', 'success');
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error saving preferences:', error_3);
                    showToast('Failed to save notification preferences', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var sendTestNotification = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedRestaurant || !preferences || (!testEmail && !testPhone)) {
                        showToast('Please provide an email or phone number for testing', 'error');
                        return [2 /*return*/];
                    }
                    setTesting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, notificationService.sendTestNotification(selectedRestaurant, testEmail, testPhone, preferences)];
                case 2:
                    _a.sent();
                    showToast('Test notification sent successfully', 'success');
                    setTestEmail('');
                    setTestPhone('');
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error sending test notification:', error_4);
                    showToast('Failed to send test notification', 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setTesting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var updatePreference = function (key, value) {
        var _a;
        if (!preferences)
            return;
        setPreferences(__assign(__assign({}, preferences), (_a = {}, _a[key] = value, _a)));
    };
    var updateTemplate = function (type, templateType, value) {
        var _a, _b;
        if (!preferences)
            return;
        var templates = type === 'email' ? preferences.email_templates : preferences.sms_templates;
        var updatedTemplates = __assign(__assign({}, templates), (_a = {}, _a[templateType] = value, _a));
        setPreferences(__assign(__assign({}, preferences), (_b = {}, _b["".concat(type, "_templates")] = updatedTemplates, _b)));
    };
    if (restaurants.length === 0) {
        return (<div className="p-6">
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Restaurants Found</h3>
          <p className="text-gray-600">You need to be associated with a restaurant to configure notifications.</p>
        </div>
      </div>);
    }
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Configure how customers are notified about their bookings</p>
      </div>

      {/* Restaurant Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Restaurant
        </label>
        <select value={selectedRestaurant} onChange={function (e) { return setSelectedRestaurant(e.target.value); }} className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          {restaurants.map(function (restaurant) { return (<option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>); })}
        </select>
      </div>

      {loading ? (<div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notification preferences...</p>
        </div>) : preferences ? (<div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'general', label: 'General Settings', icon: Settings },
                { id: 'templates', label: 'Message Templates', icon: MessageSquare },
                { id: 'test', label: 'Test Notifications', icon: TestTube }
            ].map(function (tab) {
                var Icon = tab.icon;
                return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ".concat(activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                    <Icon size={16}/>
                    <span>{tab.label}</span>
                  </button>);
            })}
            </nav>
          </div>

          {/* General Settings Tab */}
          {activeTab === 'general' && (<div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400"/>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                        <div className="text-xs text-gray-500">Send booking updates via email</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={preferences.email_enabled} onChange={function (e) { return updatePreference('email_enabled', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400"/>
                      <div>
                        <div className="text-sm font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-xs text-gray-500">Send booking updates via text message</div>
                      </div>
                    </div>
                    <input type="checkbox" checked={preferences.sms_enabled} onChange={function (e) { return updatePreference('sms_enabled', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Settings</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Auto-send Confirmations</div>
                      <div className="text-xs text-gray-500">Automatically send confirmation emails when bookings are confirmed</div>
                    </div>
                    <input type="checkbox" checked={preferences.auto_send_confirmations} onChange={function (e) { return updatePreference('auto_send_confirmations', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Auto-send Reminders</div>
                      <div className="text-xs text-gray-500">Automatically send reminder notifications before bookings</div>
                    </div>
                    <input type="checkbox" checked={preferences.auto_send_reminders} onChange={function (e) { return updatePreference('auto_send_reminders', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Hours Before Booking
                    </label>
                    <input type="number" min="1" max="168" value={preferences.reminder_hours_before} onChange={function (e) { return updatePreference('reminder_hours_before', parseInt(e.target.value)); }} className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    <p className="text-xs text-gray-500 mt-1">Hours before the booking time to send reminders</p>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Templates Tab */}
          {activeTab === 'templates' && (<div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize the email messages sent to customers. Use variables like {'{restaurant_name}'}, {'{date}'}, {'{time}'}, {'{party_size}'}, {'{confirmation_code}'}, {'{cancellation_reason}'}
                </p>
                
                <div className="space-y-4">
                  {Object.entries(preferences.email_templates).map(function (_a) {
                    var type = _a[0], template = _a[1];
                    return (<div key={type}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {type} Email
                      </label>
                      <textarea value={template} onChange={function (e) { return updateTemplate('email', type, e.target.value); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={"Enter ".concat(type, " email template...")}/>
                    </div>);
                })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Templates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize the SMS messages sent to customers. Keep messages short and concise.
                </p>
                
                <div className="space-y-4">
                  {Object.entries(preferences.sms_templates).map(function (_a) {
                    var type = _a[0], template = _a[1];
                    return (<div key={type}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {type} SMS
                      </label>
                      <textarea value={template} onChange={function (e) { return updateTemplate('sms', type, e.target.value); }} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={"Enter ".concat(type, " SMS template...")}/>
                    </div>);
                })}
                </div>
              </div>
            </div>)}

          {/* Test Tab */}
          {activeTab === 'test' && (<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Notifications</h3>
              <p className="text-sm text-gray-600 mb-6">
                Send test notifications to verify your settings are working correctly.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <input type="email" value={testEmail} onChange={function (e) { return setTestEmail(e.target.value); }} placeholder="Enter email address for testing" className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Phone Number
                  </label>
                  <input type="tel" value={testPhone} onChange={function (e) { return setTestPhone(e.target.value); }} placeholder="Enter phone number for testing" className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <button onClick={sendTestNotification} disabled={testing || (!testEmail && !testPhone)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {testing ? (<>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>) : (<>
                      <Send size={16} className="mr-2"/>
                      Send Test Notification
                    </>)}
                </button>
              </div>
            </div>)}

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={savePreferences} disabled={saving} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>) : (<>
                  <Save size={16} className="mr-2"/>
                  Save Preferences
                </>)}
            </button>
          </div>
        </div>) : (<div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Preferences Found</h3>
          <p className="text-gray-600">Click "Save Preferences" to create default notification settings.</p>
        </div>)}
    </div>);
};
export default NotificationSettings;
