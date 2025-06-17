// [2025-01-07 12:05 UTC] - Admin Example Implementation
// Shows how to integrate MapSearchModule in the Admin Dashboard

import React, { useState } from 'react';
import MapSearchModule from '../index';
import { BusinessResult, BusinessCardAction } from '../types';

const AdminMapExample: React.FC = () => {
  const [approvedBusinesses, setApprovedBusinesses] = useState<BusinessResult[]>([]);
  const [rejectedBusinesses, setRejectedBusinesses] = useState<BusinessResult[]>([]);
  const [leads, setLeads] = useState<BusinessResult[]>([]);

  // Handle business approval
  const handleApprove = (business: BusinessResult) => {
    console.log('Approving business:', business.name);
    setApprovedBusinesses(prev => [...prev, { ...business, approvalStatus: 'approved' }]);
    // In real implementation, would call API to update database
  };

  // Handle business rejection
  const handleReject = (business: BusinessResult) => {
    console.log('Rejecting business:', business.name);
    setRejectedBusinesses(prev => [...prev, { ...business, approvalStatus: 'rejected' }]);
    // In real implementation, would call API to update database
  };

  // Handle lead creation
  const handleCreateLead = (business: BusinessResult) => {
    console.log('Creating lead for:', business.name);
    setLeads(prev => [...prev, business]);
    // In real implementation, would call CRM API or save to leads table
  };

  // Handle other business actions
  const handleBusinessAction = (action: BusinessCardAction, business: BusinessResult) => {
    switch (action) {
      case 'details':
        // Open business details modal or page
        console.log('View details for:', business.name);
        break;
        
      case 'edit':
        // Open edit business modal
        console.log('Edit business:', business.name);
        break;
        
      default:
        console.log('Action not handled:', action);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Discovery</h1>
              <p className="text-gray-600">Discover and manage business listings</p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{approvedBusinesses.length}</div>
                <div className="text-gray-500">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{rejectedBusinesses.length}</div>
                <div className="text-gray-500">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{leads.length}</div>
                <div className="text-gray-500">Leads</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Search Module */}
      <div className="p-6">
        <MapSearchModule
          context="admin"
          resultCardType="restaurant"
          actions={['approve', 'reject', 'lead', 'details']}
          filtersEnabled={true}
          radiusSlider={true}
          showMap={true}
          cardLayout="list"
          mapHeight="400px"
          maxResults={50}
          onApprove={handleApprove}
          onReject={handleReject}
          onCreateLead={handleCreateLead}
          onBusinessAction={handleBusinessAction}
          onBusinessSelect={(business) => {
            console.log('Selected business for review:', business.name);
          }}
          onLocationChange={(location) => {
            console.log('Admin search location changed:', location);
          }}
          onFiltersChange={(filters) => {
            console.log('Admin filters changed:', filters);
          }}
          className="max-w-7xl mx-auto"
        />
      </div>

      {/* Pipeline Summary */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Approved Businesses */}
            <div>
              <h4 className="font-medium text-green-800 mb-2">Recently Approved</h4>
              <div className="space-y-2">
                {approvedBusinesses.slice(0, 3).map((business, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-green-50 rounded">
                    {business.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Rejected Businesses */}
            <div>
              <h4 className="font-medium text-red-800 mb-2">Recently Rejected</h4>
              <div className="space-y-2">
                {rejectedBusinesses.slice(0, 3).map((business, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-red-50 rounded">
                    {business.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Leads */}
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Generated Leads</h4>
              <div className="space-y-2">
                {leads.slice(0, 3).map((business, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
                    {business.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMapExample; 