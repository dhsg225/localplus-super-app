import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Newspaper, Database } from 'lucide-react';
import { newsCacheService } from '../../news/services/newsCacheService';

interface NewsSettings {
  includeNational: boolean;
  includeLocal: boolean;
  selectedCategories: string[];
  notificationsEnabled: boolean;
  cacheInterval: number; // in minutes
  enableCaching: boolean;
  headlineTransition: 'slide' | 'fade' | 'crossdissolve';
}

interface UserSettings {
  notifications: {
    push: boolean;
    email: boolean;
    deals: boolean;
    news: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
  };
  news: NewsSettings;
}

const UserSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>({
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
  });

  const [loading, setLoading] = useState(true);

  // Mock news categories - in production this would come from your news API
  const newsCategories = [
    { id: 'local-news', name: 'Local News', description: 'City and regional updates' },
    { id: 'business', name: 'Business', description: 'Business and economy news' },
    { id: 'entertainment', name: 'Entertainment', description: 'Events and entertainment' },
    { id: 'food-dining', name: 'Food & Dining', description: 'Restaurant and food news' },
    { id: 'travel', name: 'Travel', description: 'Tourism and travel information' },
    { id: 'lifestyle', name: 'Lifestyle', description: 'Health, wellness, and lifestyle' },
    { id: 'technology', name: 'Technology', description: 'Tech and innovation news' },
    { id: 'sports', name: 'Sports', description: 'Local and national sports' },
  ];

  useEffect(() => {
    // Load saved settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('ldp_user_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ldp_user_settings', JSON.stringify(newSettings));
  };

  const handleNewsSettingChange = (key: keyof NewsSettings, value: any) => {
    const newSettings = {
      ...settings,
      news: {
        ...settings.news,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = settings.news.selectedCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    handleNewsSettingChange('selectedCategories', newCategories);
  };

  const handleNotificationChange = (key: keyof UserSettings['notifications'], value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handlePrivacyChange = (key: keyof UserSettings['privacy'], value: boolean) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft size={20} className="text-gray-600" />
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
                <Newspaper size={20} className="text-blue-600" />
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
                  <input
                    type="checkbox"
                    checked={settings.news.includeLocal}
                    onChange={(e) => handleNewsSettingChange('includeLocal', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">National News</div>
                    <div className="text-xs text-gray-500">Thailand-wide news and updates</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.news.includeNational}
                    onChange={(e) => handleNewsSettingChange('includeNational', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Preferred Categories</h3>
              <p className="text-xs text-gray-500 mb-3">Select news categories you're interested in</p>
              
              <div className="grid grid-cols-1 gap-2">
                {newsCategories.map(category => (
                  <label key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.news.selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* News Notifications */}
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Breaking News Alerts</div>
                  <div className="text-xs text-gray-500">Get notified about important local news</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.news.notificationsEnabled}
                  onChange={(e) => handleNewsSettingChange('notificationsEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
              </label>
            </div>

            {/* Headline Transition Style */}
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Headline Transitions</div>
                  <div className="text-xs text-gray-500">How headlines change on the home screen</div>
                </div>
                <select
                  value={settings.news.headlineTransition}
                  onChange={(e) => handleNewsSettingChange('headlineTransition', e.target.value as 'slide' | 'fade' | 'crossdissolve')}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
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
                <select
                  value={settings.news.headlineTransition}
                  onChange={(e) => handleNewsSettingChange('headlineTransition', e.target.value as 'slide' | 'fade' | 'crossdissolve')}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
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
                <Bell size={20} className="text-green-600" />
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
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Email Updates</div>
                <div className="text-xs text-gray-500">Get weekly digest via email</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Deal Alerts</div>
                <div className="text-xs text-gray-500">Notifications about new deals and offers</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.deals}
                onChange={(e) => handleNotificationChange('deals', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield size={20} className="text-purple-600" />
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
              <input
                type="checkbox"
                checked={settings.privacy.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Marketing Communications</div>
                <div className="text-xs text-gray-500">Receive promotional content</div>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.marketing}
                onChange={(e) => handlePrivacyChange('marketing', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* News Cache Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Database size={20} className="text-yellow-600" />
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
              <input
                type="checkbox"
                checked={settings.news.enableCaching}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  handleNewsSettingChange('enableCaching', enabled);
                  newsCacheService.setConfig({ enabled });
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </label>

            {settings.news.enableCaching && (
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Auto-refresh interval</div>
                    <div className="text-xs text-gray-500">How often to update news in background</div>
                  </div>
                  <select
                    value={settings.news.cacheInterval}
                    onChange={(e) => {
                      const minutes = parseInt(e.target.value);
                      handleNewsSettingChange('cacheInterval', minutes);
                      newsCacheService.setConfig({ 
                        refreshInterval: minutes * 60 * 1000 // Convert to milliseconds
                      });
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
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
              </div>
            )}
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
    </div>
  );
};

export default UserSettingsPage; 