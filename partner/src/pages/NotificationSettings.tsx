import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Send, Settings, TestTube } from 'lucide-react';
import { notificationService, type NotificationPreferences } from '../../shared/services/notificationService';
import { restaurantService } from '../../shared/services/restaurantService';
import { useToast } from '../../shared/components/Toast';
import type { Restaurant } from '../../shared/types';

// [2024-12-19 10:30] - Notification settings page for partners to configure booking notifications

const NotificationSettings: React.FC<{ user: any }> = ({ user }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'templates' | 'test'>('general');
  const { showToast } = useToast();

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      loadPreferences();
    }
  }, [selectedRestaurant]);

  const loadRestaurants = async () => {
    try {
      // Try to get partner restaurants by user ID
      let userRestaurants = await restaurantService.getRestaurantsByOwner(user.id);
      if (!userRestaurants || userRestaurants.length === 0) {
        // Fallback: get all restaurants and pick Shannon's or the first
        const allRestaurants = await restaurantService.getRestaurants();
        userRestaurants = allRestaurants.filter(r => 
          r.name.toLowerCase().includes('shannon')
        );
        if (userRestaurants.length === 0) {
          userRestaurants = allRestaurants.slice(0, 1);
        }
        console.log('🔧 NotificationSettings fallback restaurants:', userRestaurants.length);
      }
      setRestaurants(userRestaurants);
      if (userRestaurants.length > 0) {
        setSelectedRestaurant(userRestaurants[0].id);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      showToast('Failed to load restaurants', 'error');
    }
  };

  const loadPreferences = async () => {
    if (!selectedRestaurant) return;
    
    setLoading(true);
    try {
      const prefs = await notificationService.getPreferences(selectedRestaurant);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
      showToast('Failed to load notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!selectedRestaurant || !preferences) return;
    
    setSaving(true);
    try {
      const { business_id, ...prefData } = preferences;
      const updatedPrefs = await notificationService.savePreferences({
        business_id: selectedRestaurant,
        ...prefData
      });
      setPreferences(updatedPrefs);
      showToast('Notification preferences saved successfully', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save notification preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sendTestNotification = async () => {
    if (!selectedRestaurant || !preferences || (!testEmail && !testPhone)) {
      showToast('Please provide an email or phone number for testing', 'error');
      return;
    }

    setTesting(true);
    try {
      await notificationService.sendTestNotification(
        selectedRestaurant,
        testEmail,
        testPhone,
        preferences
      );
      showToast('Test notification sent successfully', 'success');
      setTestEmail('');
      setTestPhone('');
    } catch (error) {
      console.error('Error sending test notification:', error);
      showToast('Failed to send test notification', 'error');
    } finally {
      setTesting(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  const updateTemplate = (type: 'email' | 'sms', templateType: string, value: string) => {
    if (!preferences) return;
    const templates = type === 'email' ? preferences.email_templates : preferences.sms_templates;
    const updatedTemplates = { ...templates, [templateType]: value };
    setPreferences({
      ...preferences,
      [`${type}_templates`]: updatedTemplates
    });
  };

  if (restaurants.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Restaurants Found</h3>
          <p className="text-gray-600">You need to be associated with a restaurant to configure notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Configure how customers are notified about their bookings</p>
      </div>

      {/* Restaurant Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Restaurant
        </label>
        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notification preferences...</p>
        </div>
      ) : preferences ? (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'general', label: 'General Settings', icon: Settings },
                { id: 'templates', label: 'Message Templates', icon: MessageSquare },
                { id: 'test', label: 'Test Notifications', icon: TestTube }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                        <div className="text-xs text-gray-500">Send booking updates via email</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.email_enabled}
                      onChange={(e) => updatePreference('email_enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-xs text-gray-500">Send booking updates via text message</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.sms_enabled}
                      onChange={(e) => updatePreference('sms_enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
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
                    <input
                      type="checkbox"
                      checked={preferences.auto_send_confirmations}
                      onChange={(e) => updatePreference('auto_send_confirmations', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Auto-send Reminders</div>
                      <div className="text-xs text-gray-500">Automatically send reminder notifications before bookings</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.auto_send_reminders}
                      onChange={(e) => updatePreference('auto_send_reminders', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Hours Before Booking
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={preferences.reminder_hours_before}
                      onChange={(e) => updatePreference('reminder_hours_before', parseInt(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hours before the booking time to send reminders</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize the email messages sent to customers. Use variables like {'{restaurant_name}'}, {'{date}'}, {'{time}'}, {'{party_size}'}, {'{confirmation_code}'}, {'{cancellation_reason}'}
                </p>
                
                <div className="space-y-4">
                  {Object.entries(preferences.email_templates).map(([type, template]) => (
                    <div key={type}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {type} Email
                      </label>
                      <textarea
                        value={template}
                        onChange={(e) => updateTemplate('email', type, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${type} email template...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Templates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize the SMS messages sent to customers. Keep messages short and concise.
                </p>
                
                <div className="space-y-4">
                  {Object.entries(preferences.sms_templates).map(([type, template]) => (
                    <div key={type}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {type} SMS
                      </label>
                      <textarea
                        value={template}
                        onChange={(e) => updateTemplate('sms', type, e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${type} SMS template...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Test Tab */}
          {activeTab === 'test' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Notifications</h3>
              <p className="text-sm text-gray-600 mb-6">
                Send test notifications to verify your settings are working correctly.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email address for testing"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Phone Number
                  </label>
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Enter phone number for testing"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={sendTestNotification}
                  disabled={testing || (!testEmail && !testPhone)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Test Notification
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Preferences Found</h3>
          <p className="text-gray-600">Click "Save Preferences" to create default notification settings.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings; 