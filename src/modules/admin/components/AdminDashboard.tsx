import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, Mail, Globe, CheckCircle, Clock, AlertTriangle, Search, BarChart3 } from 'lucide-react';
import { businessAPI, Business, DiscountOffer } from '../../../lib/supabase';
import BusinessDiscovery from './BusinessDiscovery';
import AnalyticsDashboard from './AnalyticsDashboard';

interface BusinessFormData {
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website_url: string;
  description: string;
}

interface DiscountFormData {
  business_id: string;
  title: string;
  description: string;
  discount_percentage: number;
  terms_conditions: string;
  valid_until: string;
  max_redemptions_per_user: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'businesses' | 'discovery' | 'discounts' | 'analytics'>('businesses');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const [businessForm, setBusinessForm] = useState<BusinessFormData>({
    name: '',
    category: 'Restaurants',
    address: '',
    latitude: 12.5684,
    longitude: 99.9578,
    phone: '',
    email: '',
    website_url: '',
    description: ''
  });

  const [discountForm, setDiscountForm] = useState<DiscountFormData>({
    business_id: '',
    title: '',
    description: '',
    discount_percentage: 20,
    terms_conditions: '',
    valid_until: '',
    max_redemptions_per_user: 1
  });

  const categories = [
    'Restaurants', 'Wellness', 'Shopping', 'Services', 'Entertainment', 'Travel'
  ];

  useEffect(() => {
    loadBusinesses();
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          async () => {
            // Fallback to IP geolocation
            try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              setUserLocation({
                lat: data.latitude || 12.5684,
                lng: data.longitude || 99.9578
              });
            } catch (error) {
              // Final fallback to Hua Hin
              setUserLocation({ lat: 12.5684, lng: 99.9578 });
            }
          }
        );
      } else {
        // Fallback location
        setUserLocation({ lat: 12.5684, lng: 99.9578 });
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setUserLocation({ lat: 12.5684, lng: 99.9578 });
    }
  };

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      // For now, we'll simulate loading from database
      // In production, this would call businessAPI.getAllBusinesses()
      setTimeout(() => {
        setBusinesses([
          {
            id: '1',
            name: 'Seaside Bistro',
            category: 'Restaurants',
            address: '123 Beach Road, Hua Hin 77110',
            latitude: 12.5684,
            longitude: 99.9578,
            phone: '+66-32-512-345',
            email: 'info@seasidebistro.com',
            website_url: 'https://seasidebistro.com',
            partnership_status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ] as Business[]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading businesses:', error);
      setLoading(false);
    }
  };

  const handleBusinessAdded = (newBusiness: Business) => {
    setBusinesses(prev => [...prev, newBusiness]);
    setMessage({ type: 'success', text: `${newBusiness.name} added successfully!` });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate coordinates from address if needed
      const coordinates = await geocodeAddress(businessForm.address);
      
      const newBusiness = await businessAPI.addBusiness({
        ...businessForm,
        latitude: coordinates?.lat || businessForm.latitude,
        longitude: coordinates?.lng || businessForm.longitude,
        partnership_status: 'active'
      });

      if (newBusiness) {
        handleBusinessAdded(newBusiness);
        setShowAddBusiness(false);
        setBusinessForm({
          name: '',
          category: 'Restaurants',
          address: '',
          latitude: 12.5684,
          longitude: 99.9578,
          phone: '',
          email: '',
          website_url: '',
          description: ''
        });
        loadBusinesses();
      } else {
        setMessage({ type: 'error', text: 'Failed to add business. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding business:', error);
      setMessage({ type: 'error', text: 'Error adding business. Please check your database connection.' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newDiscount = await businessAPI.addDiscountOffer({
        ...discountForm,
        valid_from: new Date().toISOString().split('T')[0],
        is_active: true
      });

      if (newDiscount) {
        setMessage({ type: 'success', text: 'Discount offer added successfully!' });
        setShowAddDiscount(false);
        setDiscountForm({
          business_id: '',
          title: '',
          description: '',
          discount_percentage: 20,
          terms_conditions: '',
          valid_until: '',
          max_redemptions_per_user: 1
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to add discount offer. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding discount:', error);
      setMessage({ type: 'error', text: 'Error adding discount offer.' });
    }

    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Geocoding function (you'll need to implement this with Google Maps API)
  const geocodeAddress = async (address: string) => {
    // This is a placeholder - in production, use Google Geocoding API
    try {
      // Example implementation:
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
      // const data = await response.json();
      // return data.results[0]?.geometry?.location;
      
      return null; // For now, use manual coordinates
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">LocalPlus Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage businesses, discounts, and platform analytics</p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 py-2`}>
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'businesses', label: 'Businesses', icon: MapPin },
            { id: 'discovery', label: 'Business Discovery', icon: Search },
            { id: 'discounts', label: 'Discount Offers', icon: CheckCircle },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Business Discovery Tab */}
        {activeTab === 'discovery' && userLocation && (
          <BusinessDiscovery 
            userLocation={userLocation}
            onBusinessAdded={handleBusinessAdded}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Business Directory</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage existing businesses or use Business Discovery to find new ones
                </p>
              </div>
              <button
                onClick={() => setShowAddBusiness(true)}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Manually
              </button>
            </div>

            {/* Business List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading businesses...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {businesses.map((business) => (
                    <div key={business.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{business.category}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            {business.address}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            {business.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone size={14} className="mr-1" />
                                {business.phone}
                              </div>
                            )}
                            {business.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail size={14} className="mr-1" />
                                {business.email}
                              </div>
                            )}
                            {business.website_url && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Globe size={14} className="mr-1" />
                                <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            business.partnership_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : business.partnership_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {business.partnership_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Discount Offers</h2>
              <button
                onClick={() => setShowAddDiscount(true)}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add Discount
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Discount management interface will be displayed here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Business Modal */}
      {showAddBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Business</h3>
              <form onSubmit={handleAddBusiness} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      required
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={businessForm.category}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Full address including city and postal code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={businessForm.latitude}
                      onChange={(e) => setBusinessForm({...businessForm, latitude: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={businessForm.longitude}
                      onChange={(e) => setBusinessForm({...businessForm, longitude: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={businessForm.website_url}
                    onChange={(e) => setBusinessForm({...businessForm, website_url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Brief description of the business..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBusiness(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Business'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Discount Modal */}
      {showAddDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Discount Offer</h3>
              <form onSubmit={handleAddDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                  <select
                    required
                    value={discountForm.business_id}
                    onChange={(e) => setDiscountForm({...discountForm, business_id: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a business</option>
                    {businesses.map(business => (
                      <option key={business.id} value={business.id}>{business.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={discountForm.title}
                    onChange={(e) => setDiscountForm({...discountForm, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Summer Special Discount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={discountForm.description}
                    onChange={(e) => setDiscountForm({...discountForm, description: e.target.value})}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Describe what the discount applies to..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={discountForm.discount_percentage}
                      onChange={(e) => setDiscountForm({...discountForm, discount_percentage: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Redemptions per User</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={discountForm.max_redemptions_per_user}
                      onChange={(e) => setDiscountForm({...discountForm, max_redemptions_per_user: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
                  <input
                    type="date"
                    value={discountForm.valid_until}
                    onChange={(e) => setDiscountForm({...discountForm, valid_until: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    value={discountForm.terms_conditions}
                    onChange={(e) => setDiscountForm({...discountForm, terms_conditions: e.target.value})}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Any restrictions or conditions..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddDiscount(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Discount'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 