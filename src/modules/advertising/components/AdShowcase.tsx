// [2024-05-10 17:30 UTC] - Advertisement Showcase Page
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdContainer from './AdContainer';
var AdShowcase = function () {
    var navigate = useNavigate();
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={function () { return navigate(-1); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Advertisement Showcase</h1>
              <p className="text-sm text-gray-600">Demo of the advertising system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Homepage Cards Demo */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Homepage Cards</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <AdContainer placement="homepage-cards" maxAds={3} size="medium" className="space-y-4"/>
          </div>
        </section>

        {/* Restaurant Top Banner Demo */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Top Banner</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <AdContainer placement="restaurants-top" maxAds={1} displayType="banner" categoryFilter={['dining', 'internal-promotion']}/>
          </div>
        </section>

        {/* External Ads Only */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">External Ads Only</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <AdContainer placement="homepage-cards" maxAds={2} showOnlyExternal={true} size="small" className="space-y-3"/>
          </div>
        </section>

        {/* Internal Promotions Only */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Promotions Only</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <AdContainer placement="homepage-cards" maxAds={2} showOnlyInternal={true} size="large" className="space-y-4"/>
          </div>
        </section>

        {/* Category Filtered */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dining Category Only</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <AdContainer placement="restaurants-top" maxAds={2} categoryFilter={['dining']} displayType="banner" className="space-y-3"/>
          </div>
        </section>

        {/* Mixed Display Types */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mixed Display Types</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Banner Style</h3>
              <AdContainer placement="services-banner" maxAds={1} displayType="banner" categoryFilter={['wellness', 'services']}/>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Card Style</h3>
              <AdContainer placement="services-banner" maxAds={1} displayType="card" categoryFilter={['wellness', 'services']} size="medium"/>
            </div>
          </div>
        </section>

        {/* Analytics Info */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Analytics Tracking</h2>
          <p className="text-blue-800 text-sm mb-4">
            All ad interactions are being tracked. Check the browser console to see analytics events.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-900">Impressions</h4>
              <p className="text-blue-700">Tracked when ads are displayed</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-900">Clicks</h4>
              <p className="text-blue-700">Tracked when users click ads</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-900">Conversions</h4>
              <p className="text-blue-700">Tracked when users complete actions</p>
            </div>
          </div>
        </section>
      </div>
    </div>);
};
export default AdShowcase;
