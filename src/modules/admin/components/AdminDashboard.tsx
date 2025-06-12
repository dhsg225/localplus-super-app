import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, Mail, Globe, CheckCircle, Clock, AlertTriangle, Search, BarChart3, Building, Tag, Newspaper } from 'lucide-react';
import { businessAPI, Business, DiscountOffer } from '../../../lib/supabase';
import { curationAPI, SuggestedBusiness, DiscoveryCampaign, CurationStats } from '../../../services/curationAPI';
import { discoveryService } from '../../../services/discoveryService';
import AnalyticsDashboard from './AnalyticsDashboard';
import NewsAdminSettings from './NewsAdminSettings';

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
  const [activeTab, setActiveTab] = useState<'businesses' | 'pipeline' | 'discounts' | 'analytics' | 'news'>('pipeline');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Curation data state
  const [suggestedBusinesses, setSuggestedBusinesses] = useState<SuggestedBusiness[]>([]);
  const [discoveryCampaigns, setDiscoveryCampaigns] = useState<DiscoveryCampaign[]>([]);
  const [curationStats, setCurationStats] = useState<CurationStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    salesLeadsCount: 0,
    averageQualityScore: 0
  });
  const [curationLoading, setCurationLoading] = useState(false);
  
  // Discovery state
  const [runningDiscovery, setRunningDiscovery] = useState(false);
  const [discoveryMessage, setDiscoveryMessage] = useState('');

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
    loadCurationData();
  }, []);

  const loadCurationData = async () => {
    setCurationLoading(true);
    try {
      const [businesses, campaigns, stats] = await Promise.all([
        curationAPI.getSuggestedBusinesses(),
        curationAPI.getDiscoveryCampaigns(), 
        curationAPI.getCurationStats()
      ]);
      
      setSuggestedBusinesses(businesses);
      setDiscoveryCampaigns(campaigns);
      setCurationStats(stats);
    } catch (error) {
      console.error('Error loading curation data:', error);
      setMessage({ type: 'error', text: 'Failed to load curation data' });
    } finally {
      setCurationLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      // Set a default location first
      setUserLocation({ lat: 13.8179, lng: 100.0416 }); // Bangkok default
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            console.log('Location detected:', newLocation);
          },
          (error) => {
            console.log('Geolocation failed, using default location:', error.message);
            // Keep the default location, don't try fallbacks that might fail
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        console.log('Geolocation not supported, using default location');
      }
    } catch (error) {
      console.error('Location detection error:', error);
      // Ensure we always have a location set
      setUserLocation({ lat: 13.8179, lng: 100.0416 });
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

  // Curation action handlers
  const handleApproveBusiness = async (businessId: string) => {
    setLoading(true);
    try {
      console.log('🔄 Approving business:', businessId);
      const success = await curationAPI.approveBusiness(businessId);
      if (success) {
        setMessage({ type: 'success', text: `Business approved successfully!` });
        console.log('✅ Business approved, refreshing data...');
        await loadCurationData(); // Wait for refresh to complete
        console.log('📊 Data refreshed');
      } else {
        setMessage({ type: 'error', text: `Failed to approve business - may not exist in database` });
      }
    } catch (error) {
      console.error('Approval error:', error);
      setMessage({ type: 'error', text: `Error approving business: ${error}` });
    } finally {
      setLoading(false); // Only set loading false after everything completes
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFlagForSales = async (businessId: string) => {
    setLoading(true);
    try {
      console.log('🔄 Flagging business for sales:', businessId);
      const success = await curationAPI.flagForSales(businessId);
      if (success) {
        setMessage({ type: 'success', text: `Business flagged for sales outreach!` });
        console.log('✅ Business flagged, refreshing data...');
        await loadCurationData(); // Wait for refresh to complete
        console.log('📊 Data refreshed');
      } else {
        setMessage({ type: 'error', text: `Failed to flag business for sales - may not exist in database` });
      }
    } catch (error) {
      console.error('Sales flag error:', error);
      setMessage({ type: 'error', text: `Error flagging business: ${error}` });
    } finally {
      setLoading(false); // Only set loading false after everything completes
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRejectBusiness = async (businessId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    setLoading(true);
    try {
      console.log('🔄 Rejecting business:', businessId);
      const success = await curationAPI.rejectBusiness(businessId, reason || undefined);
      if (success) {
        setMessage({ type: 'success', text: `Business rejected successfully!` });
        console.log('✅ Business rejected, refreshing data...');
        await loadCurationData(); // Wait for refresh to complete
        console.log('📊 Data refreshed');
      } else {
        setMessage({ type: 'error', text: `Failed to reject business - may not exist in database` });
      }
    } catch (error) {
      console.error('Rejection error:', error);
      setMessage({ type: 'error', text: `Error rejecting business: ${error}` });
    } finally {
      setLoading(false); // Only set loading false after everything completes
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Discovery action handler
  const handleRunDiscovery = async () => {
    setRunningDiscovery(true);
    setDiscoveryMessage('');
    
    try {
      console.log('🔍 Starting Hua Hin business discovery...');
      
      // Use the Hua Hin specific discovery functions
      const result = await discoveryService.runHuaHinRestaurantDiscovery();
      
      console.log('📊 Discovery completed:', result);
      
      setDiscoveryMessage(
        `✅ Hua Hin Discovery Complete! Found ${result.discovered} businesses, ` +
        `added ${result.added} new ones${result.duplicates > 0 ? `, ${result.duplicates} duplicates` : ''}` +
        `${result.errors.length > 0 ? `. ${result.errors.length} errors occurred.` : ''}`
      );
      
      // Refresh the business list
      await loadCurationData();
      
    } catch (error) {
      console.error('Discovery error:', error);
      setDiscoveryMessage(`❌ Discovery failed: ${error}`);
    } finally {
      setRunningDiscovery(false);
    }
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
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex overflow-x-auto space-x-2 md:space-x-8 scrollbar-hide">
            {[
              { id: 'businesses', label: 'Business Directory', icon: Building },
              { id: 'pipeline', label: 'Business Pipeline', icon: CheckCircle },
              { id: 'discounts', label: 'Discounts', icon: Tag },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'news', label: 'News', icon: Newspaper }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 md:gap-2 py-2 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* News Tab */}
        {activeTab === 'news' && <NewsAdminSettings />}

        {/* Business Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Stats Overview - Bottom-aligned numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col h-24">
                <h4 className="text-sm font-medium text-gray-500 mb-auto">Pending Review</h4>
                <p className="text-3xl font-bold text-orange-600 text-center">{curationStats.pendingCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col h-24">
                <h4 className="text-sm font-medium text-gray-500 mb-auto">Approved</h4>
                <p className="text-3xl font-bold text-green-600 text-center">{curationStats.approvedCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col h-24">
                <h4 className="text-sm font-medium text-gray-500 mb-auto">Sales Leads</h4>
                <p className="text-3xl font-bold text-blue-600 text-center">{curationStats.salesLeadsCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col h-24">
                <h4 className="text-sm font-medium text-gray-500 mb-auto">Quality Score Avg</h4>
                <p className="text-3xl font-bold text-purple-600 text-center">{curationStats.averageQualityScore}</p>
              </div>
            </div>

            {/* Curation Queue */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="space-y-4">
                  {/* Row 1: Title */}
                  <h3 className="text-lg font-semibold text-gray-900">Suggested Businesses</h3>
                  
                  {/* Row 2: Status Dropdown + Refresh Button (Full Width) */}
                  <div className="flex space-x-2">
                    <select className="text-sm border-gray-300 rounded-md flex-1">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>High Quality</option>
                    </select>
                    <button 
                      onClick={loadCurationData}
                      disabled={curationLoading}
                      className="text-sm bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                    >
                      {curationLoading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  
                  {/* Row 3: Discovery Category Buttons (Own Row) */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={async () => {
                        setRunningDiscovery(true);
                        setDiscoveryMessage('');
                        try {
                          console.log('🍽️ Starting Hua Hin restaurant discovery...');
                          const result = await discoveryService.runHuaHinRestaurantDiscovery();
                          setDiscoveryMessage(`✅ Restaurants: Found ${result.discovered}, added ${result.added}`);
                          await loadCurationData();
                        } catch (error) {
                          setDiscoveryMessage(`❌ Restaurant discovery failed: ${error}`);
                        } finally {
                          setRunningDiscovery(false);
                        }
                      }}
                      disabled={runningDiscovery}
                      className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      🍽️ Restaurants
                    </button>
                    
                    <button 
                      onClick={async () => {
                        setRunningDiscovery(true);
                        setDiscoveryMessage('');
                        try {
                          console.log('💆 Starting Hua Hin wellness discovery...');
                          const result = await discoveryService.runHuaHinWellnessDiscovery();
                          setDiscoveryMessage(`✅ Wellness: Found ${result.discovered}, added ${result.added}`);
                          await loadCurationData();
                        } catch (error) {
                          setDiscoveryMessage(`❌ Wellness discovery failed: ${error}`);
                        } finally {
                          setRunningDiscovery(false);
                        }
                      }}
                      disabled={runningDiscovery}
                      className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      💆 Wellness
                    </button>
                    
                    <button 
                      onClick={async () => {
                        setRunningDiscovery(true);
                        setDiscoveryMessage('');
                        try {
                          console.log('🛍️ Starting Hua Hin shopping discovery...');
                          const result = await discoveryService.runHuaHinShoppingDiscovery();
                          setDiscoveryMessage(`✅ Shopping: Found ${result.discovered}, added ${result.added}`);
                          await loadCurationData();
                        } catch (error) {
                          setDiscoveryMessage(`❌ Shopping discovery failed: ${error}`);
                        } finally {
                          setRunningDiscovery(false);
                        }
                      }}
                      disabled={runningDiscovery}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      🛍️ Shopping
                    </button>
                    
                    <button 
                      onClick={async () => {
                        setRunningDiscovery(true);
                        setDiscoveryMessage('');
                        try {
                          console.log('🎯 Starting Hua Hin entertainment discovery...');
                          const result = await discoveryService.runHuaHinEntertainmentDiscovery();
                          setDiscoveryMessage(`✅ Entertainment: Found ${result.discovered}, added ${result.added}`);
                          await loadCurationData();
                        } catch (error) {
                          setDiscoveryMessage(`❌ Entertainment discovery failed: ${error}`);
                        } finally {
                          setRunningDiscovery(false);
                        }
                      }}
                      disabled={runningDiscovery}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      🎯 Entertainment
                    </button>
                  </div>
                  
                  {/* Status Messages */}
                  {runningDiscovery && (
                    <div className="text-xs text-orange-600 animate-pulse">🔍 Discovering...</div>
                  )}
                  {discoveryMessage && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                      {discoveryMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Discovered Businesses List */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Discovered Businesses</h3>
                {curationLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <span className="ml-2 text-gray-600">Loading businesses...</span>
                  </div>
                ) : suggestedBusinesses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No businesses discovered yet.</p>
                    <p className="text-sm mt-1">Use the discovery buttons above to find businesses.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestedBusinesses.map((business) => (
                      <div key={business.id} className="border rounded-lg p-4">
                        {/* Business Name */}
                        <div className="mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <button
                            onClick={() => handleApproveBusiness(business.id)}
                            disabled={loading}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleFlagForSales(business.id)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            Sales Lead
                          </button>
                          <button
                            onClick={() => handleRejectBusiness(business.id)}
                            disabled={loading}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                        
                        {/* Business Details */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {business.primary_category}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Quality Score: {business.quality_score}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            business.curation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            business.curation_status === 'approved' ? 'bg-green-100 text-green-800' :
                            business.curation_status === 'flagged_for_sales' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {business.curation_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">📍 {business.address}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {business.google_rating && (
                            <span>⭐ {business.google_rating} ({business.google_review_count} reviews)</span>
                          )}
                          {business.phone && (
                            <span>📞 {business.phone}</span>
                          )}
                          {business.website_url && (
                            <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              🌐 Website
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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