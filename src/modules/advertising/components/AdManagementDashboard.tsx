// [2024-05-10 17:30 UTC] - Advertisement Management Dashboard

import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, BarChart3, TrendingUp, DollarSign, Search } from 'lucide-react';
import { mockAdvertisements } from '../data/mockAds';
import { getAdMetrics } from '../services/adAnalytics';
import AdCard from './AdCard';
import AdBanner from './AdBanner';
import { BusinessAdCreator } from './BusinessAdCreator';

export const AdManagementDashboard: React.FC = () => {
  const [ads] = useState(mockAdvertisements);
  const [activeTab, setActiveTab] = useState<'all' | 'internal' | 'external'>('all');
  const [showCreator, setShowCreator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAds = ads.filter(ad => {
    const matchesTab = activeTab === 'all' || ad.type === activeTab;
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate analytics from ad metrics
  const analytics = ads.map(ad => getAdMetrics(ad.id));
  const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
  const totalRevenue = 0; // analytics.reduce((sum, a) => sum + (a.revenue || 0), 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;

  const deleteAd = (adId: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      // In a real app, this would call an API
      console.log('Deleting ad:', adId);
    }
  };

  if (showCreator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <button
              onClick={() => setShowCreator(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Advertisement Management
            </button>
          </div>
          <BusinessAdCreator />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Advertisement Management</h1>
              <p className="text-gray-600">Manage your advertising campaigns and track performance</p>
            </div>
            <button
              onClick={() => setShowCreator(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} className="mr-2" />
              Create Business Ad
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average CTR</p>
                <p className="text-2xl font-bold text-gray-900">{avgCTR.toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">฿{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tab Filters */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Advertisements', count: ads.length },
                { key: 'internal', label: 'Internal Promotions', count: ads.filter(a => a.type === 'internal').length },
                { key: 'external', label: 'External Ads', count: ads.filter(a => a.type === 'external').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search advertisements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advertisement Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'all' ? 'All Advertisements' : 
               activeTab === 'internal' ? 'Internal Promotions' : 'External Ads'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredAds.length} advertisement{filteredAds.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first advertisement to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreator(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Create Advertisement
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAds.map((ad) => {
                const adAnalytics = analytics.find(a => a.adId === ad.id);
                
                return (
                  <div key={ad.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Ad Preview */}
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Preview</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ad.type === 'internal' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ad.type === 'internal' ? 'Internal' : 'External'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ad.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {ad.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Render actual ad component */}
                      {ad.placement[0] === 'homepage-hero' ? (
                        <AdBanner ad={ad} placement="homepage-hero" />
                      ) : (
                        <AdCard ad={ad} placement="homepage-cards" />
                      )}
                    </div>

                    {/* Ad Details and Actions */}
                    <div className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Ad Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ad.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Placement: {ad.placement}</span>
                            <span>Priority: {ad.priority}</span>
                            {ad.startDate && (
                              <span>
                                {new Date(ad.startDate).toLocaleDateString()} - {' '}
                                {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'Ongoing'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Analytics */}
                        {adAnalytics && (
                          <div className="flex gap-6 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">{adAnalytics.impressions.toLocaleString()}</div>
                              <div className="text-gray-500">Impressions</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">{adAnalytics.clicks.toLocaleString()}</div>
                              <div className="text-gray-500">Clicks</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-gray-900">
                                {adAnalytics.impressions > 0 ? (adAnalytics.clicks / adAnalytics.impressions * 100).toFixed(2) : '0.00'}%
                              </div>
                              <div className="text-gray-500">CTR</div>
                            </div>
                            
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteAd(ad.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdManagementDashboard; 