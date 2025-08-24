import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Clock, Percent, Calendar, Users } from 'lucide-react';
import { BusinessOffPeakDeal } from '../types';
import { mockRestaurantProfile } from '../data/mockData';

const DealsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<BusinessOffPeakDeal[]>(mockRestaurantProfile.offPeakDeals);
  const [isAddingDeal, setIsAddingDeal] = useState(false);

  const [newDeal, setNewDeal] = useState<Partial<BusinessOffPeakDeal>>({
    title: '',
    description: '',
    originalPrice: 0,
    discountPercentage: 20,
    dealType: 'early-bird',
    validDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '11:30',
    endTime: '14:30',
    maxSeats: 20,
    terms: [],
    isActive: true
  });

  const dealTypes = [
    { value: 'early-bird', label: 'Early Bird', description: '11:30 - 14:30' },
    { value: 'afternoon', label: 'Afternoon', description: '14:30 - 17:30' },
    { value: 'late-night', label: 'Late Night', description: '21:00 - 23:30' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const handleAddDeal = () => {
    if (newDeal.title && newDeal.originalPrice && newDeal.discountPercentage) {
      const discountedPrice = newDeal.originalPrice * (1 - newDeal.discountPercentage / 100);
      
      const deal: BusinessOffPeakDeal = {
        id: `deal-${Date.now()}`,
        title: newDeal.title,
        description: newDeal.description || '',
        originalPrice: newDeal.originalPrice,
        discountedPrice: Math.round(discountedPrice),
        discountPercentage: newDeal.discountPercentage,
        dealType: newDeal.dealType || 'early-bird',
        validDays: newDeal.validDays || [],
        startTime: newDeal.startTime || '11:30',
        endTime: newDeal.endTime || '14:30',
        maxSeats: newDeal.maxSeats || 20,
        terms: newDeal.terms || [],
        isActive: newDeal.isActive ?? true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      };
      
      setDeals(prev => [...prev, deal]);
      setNewDeal({
        title: '',
        description: '',
        originalPrice: 0,
        discountPercentage: 20,
        dealType: 'early-bird',
        validDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '11:30',
        endTime: '14:30',
        maxSeats: 20,
        terms: [],
        isActive: true
      });
      setIsAddingDeal(false);
      
      // Show success notification
      alert(`✅ Deal "${newDeal.title}" created successfully!\n\nYour ${newDeal.discountPercentage}% off deal is now live and will appear in the off-peak dining section.`);
    }
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setDeals(prev => prev.map(deal => 
      deal.id === id ? { ...deal, isActive: !deal.isActive } : deal
    ));
  };

  const handleDayToggle = (day: string) => {
    const currentDays = newDeal.validDays || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setNewDeal(prev => ({ ...prev, validDays: updatedDays }));
  };

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString()}`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/business')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Deals Management</h1>
                <p className="text-sm text-gray-600">{deals.length} active deals</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingDeal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus size={16} />
              <span>New Deal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {isAddingDeal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddingDeal(false)} />
              
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Create New Deal</h3>
                </div>
                
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title</label>
                    <input
                      type="text"
                      value={newDeal.title}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., Early Bird Special"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newDeal.description}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Describe your deal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (฿)</label>
                      <input
                        type="number"
                        value={newDeal.originalPrice}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="70"
                        value={newDeal.discountPercentage}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {newDeal.originalPrice && newDeal.discountPercentage && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        Final Price: <span className="font-semibold">
                          {formatPrice(newDeal.originalPrice * (1 - newDeal.discountPercentage / 100))}
                        </span>
                        <span className="text-green-600 ml-2">
                          (Save {formatPrice(newDeal.originalPrice * newDeal.discountPercentage / 100)})
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
                    <select
                      value={newDeal.dealType}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, dealType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {dealTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} ({type.description})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            newDeal.validDays?.includes(day.value)
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={newDeal.startTime}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <input
                        type="time"
                        value={newDeal.endTime}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats</label>
                    <input
                      type="number"
                      min="1"
                      value={newDeal.maxSeats}
                      onChange={(e) => setNewDeal(prev => ({ ...prev, maxSeats: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingDeal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDeal}
                    disabled={!newDeal.title || !newDeal.originalPrice || !newDeal.discountPercentage}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{deal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      deal.dealType === 'early-bird' ? 'bg-blue-100 text-blue-800' :
                      deal.dealType === 'afternoon' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {dealTypes.find(t => t.value === deal.dealType)?.label}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                      {deal.discountPercentage}% OFF
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{deal.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Percent size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        <span className="line-through">{formatPrice(deal.originalPrice)}</span>
                        <span className="font-semibold text-green-600 ml-2">
                          {formatPrice(deal.discountedPrice)}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        {formatTimeRange(deal.startTime, deal.endTime)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        Up to {deal.maxSeats} seats
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        {deal.validDays.length} days/week
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {deal.validDays.map(day => (
                      <span
                        key={day}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {daysOfWeek.find(d => d.value === day)?.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleToggleActive(deal.id)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      deal.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {deal.isActive ? 'Active' : 'Inactive'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Percent size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals created yet</h3>
            <p className="text-gray-600 mb-4">Create your first off-peak deal to attract more customers</p>
            <button
              onClick={() => setIsAddingDeal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Create First Deal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsManagement; 