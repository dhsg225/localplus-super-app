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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Newspaper, Database } from 'lucide-react';
import { newsCacheService } from '../../news/services/newsCacheService';
var UserSettingsPage = function () {
    var navigate = useNavigate();
    var _a = useState({
        notifications: {
            push: true,
            email: false,
            deals: true,
            news: true,
        },
        privacy: {
            analytics: true,
            marketing: false,
        },
        news: {
            includeNational: false,
            includeLocal: true,
            selectedCategories: [],
            notificationsEnabled: true,
            cacheInterval: 5, // 5 minutes default
            enableCaching: true, // Enable by default
            headlineTransition: 'slide',
        }
    }), settings = _a[0], setSettings = _a[1];
    var _b = useState([]), availableCategories = _b[0], setAvailableCategories = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    // Mock news categories - in production this would come from your news API
    var newsCategories = [
        { id: 'local-news', name: 'Local News', description: 'City and regional updates' },
        { id: 'business', name: 'Business', description: 'Business and economy news' },
        { id: 'entertainment', name: 'Entertainment', description: 'Events and entertainment' },
        { id: 'food-dining', name: 'Food & Dining', description: 'Restaurant and food news' },
        { id: 'travel', name: 'Travel', description: 'Tourism and travel information' },
        { id: 'lifestyle', name: 'Lifestyle', description: 'Health, wellness, and lifestyle' },
        { id: 'technology', name: 'Technology', description: 'Tech and innovation news' },
        { id: 'sports', name: 'Sports', description: 'Local and national sports' },
    ];
    useEffect(function () {
        // Load saved settings from localStorage
        var loadSettings = function () {
            try {
                var savedSettings = localStorage.getItem('ldp_user_settings');
                if (savedSettings) {
                    var parsed_1 = JSON.parse(savedSettings);
                    setSettings(function (prev) { return (__assign(__assign({}, prev), parsed_1)); });
                }
            }
            catch (error) {
                console.error('Error loading settings:', error);
            }
            setLoading(false);
        };
        loadSettings();
    }, []);
    var saveSettings = function (newSettings) {
        setSettings(newSettings);
        localStorage.setItem('ldp_user_settings', JSON.stringify(newSettings));
    };
    var handleNewsSettingChange = function (key, value) {
        var _a;
        var newSettings = __assign(__assign({}, settings), { news: __assign(__assign({}, settings.news), (_a = {}, _a[key] = value, _a)) });
        saveSettings(newSettings);
    };
    var handleCategoryToggle = function (categoryId) {
        var currentCategories = settings.news.selectedCategories;
        var newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(function (id) { return id !== categoryId; })
            : __spreadArray(__spreadArray([], currentCategories, true), [categoryId], false);
        handleNewsSettingChange('selectedCategories', newCategories);
    };
    var handleNotificationChange = function (key, value) {
        var _a;
        var newSettings = __assign(__assign({}, settings), { notifications: __assign(__assign({}, settings.notifications), (_a = {}, _a[key] = value, _a)) });
        saveSettings(newSettings);
    };
    var handlePrivacyChange = function (key, value) {
        var _a;
        var newSettings = __assign(__assign({}, settings), { privacy: __assign(__assign({}, settings.privacy), (_a = {}, _a[key] = value, _a)) });
        saveSettings(newSettings);
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button onClick={function () { return navigate(-1); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(function (i) { return (<div key={i} className="bg-white rounded-lg p-4 h-20"></div>); })}
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button onClick={function () { return navigate(-1); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3">
            <ArrowLeft size={20} className="text-gray-600"/>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* News Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Newspaper size={20} className="text-blue-600"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">News Settings</h2>
                <p className="text-sm text-gray-600">Customize your news preferences</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* News Types */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">News Types</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Local News</div>
                    <div className="text-xs text-gray-500">News from your current city</div>
                  </div>
                  <input type="checkbox" checked={settings.news.includeLocal} onChange={function (e) { return handleNewsSettingChange('includeLocal', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">National News</div>
                    <div className="text-xs text-gray-500">Thailand-wide news and updates</div>
                  </div>
                  <input type="checkbox" checked={settings.news.includeNational} onChange={function (e) { return handleNewsSettingChange('includeNational', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Preferred Categories</h3>
              <p className="text-xs text-gray-500 mb-3">Select news categories you're interested in</p>
              
              <div className="grid grid-cols-1 gap-2">
                {newsCategories.map(function (category) { return (<label key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </div>
                    <input type="checkbox" checked={settings.news.selectedCategories.includes(category.id)} onChange={function () { return handleCategoryToggle(category.id); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
                  </label>); })}
              </div>
            </div>

            {/* News Notifications */}
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Breaking News Alerts</div>
                  <div className="text-xs text-gray-500">Get notified about important local news</div>
                </div>
                <input type="checkbox" checked={settings.news.notificationsEnabled} onChange={function (e) { return handleNewsSettingChange('notificationsEnabled', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
              </label>
            </div>

            {/* Headline Transition Style */}
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Headline Transitions</div>
                  <div className="text-xs text-gray-500">How headlines change on the home screen</div>
                </div>
                <select value={settings.news.headlineTransition} onChange={function (e) { return handleNewsSettingChange('headlineTransition', e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="crossdissolve">Cross Dissolve</option>
                </select>
              </label>
            </div>

            {/* Headline Transition Style */}
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Headline Transitions</div>
                  <div className="text-xs text-gray-500">How headlines change on the home screen</div>
                </div>
                <select value={settings.news.headlineTransition} onChange={function (e) { return handleNewsSettingChange('headlineTransition', e.target.value); }} className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="crossdissolve">Cross Dissolve</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* General Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell size={20} className="text-green-600"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Push Notifications</div>
                <div className="text-xs text-gray-500">Receive notifications on your device</div>
              </div>
              <input type="checkbox" checked={settings.notifications.push} onChange={function (e) { return handleNotificationChange('push', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Email Updates</div>
                <div className="text-xs text-gray-500">Get weekly digest via email</div>
              </div>
              <input type="checkbox" checked={settings.notifications.email} onChange={function (e) { return handleNotificationChange('email', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Deal Alerts</div>
                <div className="text-xs text-gray-500">Notifications about new deals and offers</div>
              </div>
              <input type="checkbox" checked={settings.notifications.deals} onChange={function (e) { return handleNotificationChange('deals', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield size={20} className="text-purple-600"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
                <p className="text-sm text-gray-600">Control your data preferences</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Analytics</div>
                <div className="text-xs text-gray-500">Help improve our app with usage data</div>
              </div>
              <input type="checkbox" checked={settings.privacy.analytics} onChange={function (e) { return handlePrivacyChange('analytics', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Marketing Communications</div>
                <div className="text-xs text-gray-500">Receive promotional content</div>
              </div>
              <input type="checkbox" checked={settings.privacy.marketing} onChange={function (e) { return handlePrivacyChange('marketing', e.target.checked); }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>
          </div>
        </div>

        {/* News Cache Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Database size={20} className="text-yellow-600"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">News Cache Settings</h2>
                <p className="text-sm text-gray-600">Manage your news cache preferences</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Enable News Caching</div>
                <div className="text-xs text-gray-500">Cache news for faster loading</div>
              </div>
              <input type="checkbox" checked={settings.news.enableCaching} onChange={function (e) {
            var enabled = e.target.checked;
            handleNewsSettingChange('enableCaching', enabled);
            newsCacheService.setConfig({ enabled: enabled });
        }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"/>
            </label>

            {settings.news.enableCaching && (<div>
                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Auto-refresh interval</div>
                    <div className="text-xs text-gray-500">How often to update news in background</div>
                  </div>
                  <select value={settings.news.cacheInterval} onChange={function (e) {
                var minutes = parseInt(e.target.value);
                handleNewsSettingChange('cacheInterval', minutes);
                newsCacheService.setConfig({
                    refreshInterval: minutes * 60 * 1000 // Convert to milliseconds
                });
            }} className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                    <option value={1}>1 minute</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </label>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-blue-800">
                    <strong>📱 Mobile-friendly:</strong> Caching reduces data usage and provides instant news loading, perfect for Thailand's mobile networks!
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Save Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-green-600">✓</div>
            <div className="text-sm text-green-800">
              Settings are automatically saved
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default UserSettingsPage;
