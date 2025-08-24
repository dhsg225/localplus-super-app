// [2024-12-19 18:45 UTC] - Advertisement Approval Queue for Admin

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  DollarSign,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Advertisement } from '../types';

interface PendingAd extends Advertisement {
  businessName: string;
  submittedAt: Date;
  campaignBudget: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  submissionNotes?: string;
}

const AdApprovalQueue: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [selectedAd, setSelectedAd] = useState<PendingAd | null>(null);

  // Mock pending ads data
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([
    {
      id: 'pending-1',
      businessName: 'Seaside Bistro',
      title: 'Fresh Seafood & Ocean Views',
      description: 'Experience the finest seafood dining with breathtaking ocean views. Daily fresh catches and signature cocktails.',
      imageUrl: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400',
      ctaText: 'Book Table',
      ctaUrl: 'https://seasidebistro.com/book',
      type: 'external',
      category: 'dining',
      placement: ['homepage-cards', 'restaurants-top'],
      priority: 7,
      isActive: false,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      campaignBudget: 1200,
      paymentStatus: 'paid',
      submissionNotes: 'Looking to increase dinner reservations during weekdays'
    },
    {
      id: 'pending-2', 
      businessName: 'Wellness Spa Retreat',
      title: 'Ultimate Relaxation Experience',
      description: 'Rejuvenate your mind and body with our premium spa treatments. Traditional Thai massage and modern wellness therapies.',
      ctaText: 'Book Treatment',
      ctaUrl: 'https://wellnessspa.com',
      type: 'external',
      category: 'wellness',
      placement: ['services-banner', 'homepage-cards'],
      priority: 6,
      isActive: false,
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      campaignBudget: 800,
      paymentStatus: 'paid'
    },
    {
      id: 'pending-3',
      businessName: 'Local Coffee Roasters',
      title: 'Artisan Coffee & Fresh Pastries',
      description: 'Start your day with our locally roasted coffee beans and freshly baked pastries. Cozy atmosphere perfect for work or relaxation.',
      ctaText: 'Visit Us',
      type: 'external',
      category: 'dining',
      placement: ['homepage-cards'],
      priority: 5,
      isActive: false,
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      campaignBudget: 600,
      paymentStatus: 'pending'
    }
  ]);

  const filteredAds = pendingAds.filter(ad => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ad.paymentStatus === 'pending';
    if (filter === 'paid') return ad.paymentStatus === 'paid';
    return true;
  });

  const handleApprove = (adId: string) => {
    setPendingAds(prev => prev.filter(ad => ad.id !== adId));
    // In real app, this would call API to approve and activate the ad
    console.log(`Approved ad: ${adId}`);
    setSelectedAd(null);
  };

  const handleReject = (adId: string, reason: string) => {
    setPendingAds(prev => prev.filter(ad => ad.id !== adId));
    // In real app, this would call API to reject and notify business
    console.log(`Rejected ad: ${adId}, reason: ${reason}`);
    setSelectedAd(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Advertisement Approval Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Review and approve business-submitted advertisements</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: pendingAds.length },
                { key: 'paid', label: 'Paid', count: pendingAds.filter(ad => ad.paymentStatus === 'paid').length },
                { key: 'pending', label: 'Payment Pending', count: pendingAds.filter(ad => ad.paymentStatus === 'pending').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingAds.length}</p>
                </div>
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Received</p>
                  <p className="text-2xl font-bold text-green-600">
                    {pendingAds.filter(ad => ad.paymentStatus === 'paid').length}
                  </p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ฿{pendingAds.reduce((sum, ad) => sum + ad.campaignBudget, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Campaign</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ฿{Math.round(pendingAds.reduce((sum, ad) => sum + ad.campaignBudget, 0) / pendingAds.length || 0)}
                  </p>
                </div>
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Ads List */}
        <div className="divide-y divide-gray-200">
          {filteredAds.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Clock size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending advertisements</h3>
              <p className="text-gray-600">All submitted ads have been reviewed.</p>
            </div>
          ) : (
            filteredAds.map((ad) => (
              <div key={ad.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.paymentStatus)}`}>
                        {ad.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                      </span>
                      {ad.paymentStatus === 'pending' && (
                        <AlertTriangle size={16} className="text-yellow-500" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Business</p>
                        <p className="text-sm text-gray-600">{ad.businessName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Category</p>
                        <p className="text-sm text-gray-600 capitalize">{ad.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Budget</p>
                        <p className="text-sm text-gray-600">฿{ad.campaignBudget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {ad.placement.length} placements
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatTimeAgo(ad.submittedAt)}
                      </span>
                      <span className="flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        ฿{ad.campaignBudget}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedAd(ad)}
                      className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Eye size={14} className="inline mr-1" />
                      Review
                    </button>
                    
                    {ad.paymentStatus === 'paid' && (
                      <>
                        <button
                          onClick={() => handleApprove(ad.id)}
                          className="px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle size={14} className="inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(ad.id, 'Content policy violation')}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          <XCircle size={14} className="inline mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Review Advertisement</h3>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              {/* Ad Preview */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{selectedAd.title}</h4>
                      <p className="text-blue-100 text-sm">{selectedAd.description}</p>
                    </div>
                    <button className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                      {selectedAd.ctaText}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Ad Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business</p>
                    <p className="text-sm text-gray-900">{selectedAd.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <p className="text-sm text-gray-900 capitalize">{selectedAd.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Status</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAd.paymentStatus)}`}>
                      {selectedAd.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Campaign Budget</p>
                    <p className="text-sm text-gray-900">฿{selectedAd.campaignBudget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Placements</p>
                    <p className="text-sm text-gray-900">{selectedAd.placement.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Submitted</p>
                    <p className="text-sm text-gray-900">{formatTimeAgo(selectedAd.submittedAt)}</p>
                  </div>
                </div>
              </div>
              
              {selectedAd.submissionNotes && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Business Notes</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{selectedAd.submissionNotes}</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              {selectedAd.paymentStatus === 'paid' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedAd.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve & Go Live
                  </button>
                  <button
                    onClick={() => handleReject(selectedAd.id, 'Requires modification')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject
                  </button>
                </div>
              )}
              
              {selectedAd.paymentStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Payment is still pending. Advertisement will be available for approval once payment is confirmed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdApprovalQueue; 