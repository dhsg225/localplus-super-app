import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Camera, Clock, Menu, Percent, Calendar, TrendingUp, Bell, Settings, Star, Eye, Users, DollarSign, ArrowLeft, Plus, Megaphone } from 'lucide-react';
import { businessManagementSections, mockBusinessAnalytics, mockBusinessNotifications, mockRestaurantProfile } from '../data/mockData';
var iconMap = {
    Building2: Building2,
    Camera: Camera,
    Clock: Clock,
    Menu: Menu,
    Percent: Percent,
    Calendar: Calendar,
    TrendingUp: TrendingUp,
    Bell: Bell,
    Settings: Settings,
    Star: Star
};
var BusinessManagementDashboard = function () {
    var navigate = useNavigate();
    var _a = useState('overview'), activeTab = _a[0], setActiveTab = _a[1];
    var business = mockRestaurantProfile;
    var analytics = mockBusinessAnalytics[0];
    var notifications = mockBusinessNotifications.filter(function (n) { return !n.isRead; });
    var handleSectionClick = function (section) {
        if (section.isEnabled) {
            navigate(section.path);
        }
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0
        }).format(amount);
    };
    return (<div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Business Management</h1>
                <p className="text-sm text-gray-600">{business.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bell size={20} className="text-gray-600"/>
                {notifications.length > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>)}
              </div>
              <div className={"w-3 h-3 rounded-full ".concat(business.isActive ? 'bg-green-500' : 'bg-gray-400')}/>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex space-x-6">
            <button onClick={function () { return setActiveTab('overview'); }} className={"pb-3 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'overview'
            ? 'border-red-500 text-red-600'
            : 'border-transparent text-gray-500 hover:text-gray-700')}>
              Overview
            </button>
            <button onClick={function () { return setActiveTab('sections'); }} className={"pb-3 px-1 border-b-2 font-medium text-sm ".concat(activeTab === 'sections'
            ? 'border-red-500 text-red-600'
            : 'border-transparent text-gray-500 hover:text-gray-700')}>
              Manage
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'overview' && (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2"/>
                  <p className="text-xs font-medium text-gray-600 mb-1">Views</p>
                  <p className="text-xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <Users className="h-6 w-6 text-green-500 mx-auto mb-2"/>
                  <p className="text-xs font-medium text-gray-600 mb-1">Bookings</p>
                  <p className="text-xl font-bold text-gray-900">{analytics.bookings}</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <DollarSign className="h-6 w-6 text-purple-500 mx-auto mb-2"/>
                  <p className="text-xs font-medium text-gray-600 mb-1">Revenue</p>
                  <p className="text-base font-bold text-gray-900">{formatCurrency(analytics.revenue)}</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2"/>
                  <p className="text-xs font-medium text-gray-600 mb-1">Rating</p>
                  <p className="text-xl font-bold text-gray-900">{analytics.averageRating}</p>
                  <p className="text-xs text-gray-500">{analytics.reviewCount} reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockBusinessNotifications.slice(0, 3).map(function (notification) { return (<div key={notification.id} className="p-4 flex items-start space-x-3">
                    <div className={"w-2 h-2 rounded-full mt-2 ".concat(!notification.isRead ? 'bg-blue-500' : 'bg-gray-300')}/>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                      </p>
                    </div>
                  </div>); })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <button onClick={function () { return navigate('/business/menu'); }} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Plus size={20} className="text-green-600"/>
                  <span className="text-sm font-medium text-gray-900">Add Menu Item</span>
                </button>
                <button onClick={function () { return navigate('/business/deals'); }} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Percent size={20} className="text-red-600"/>
                  <span className="text-sm font-medium text-gray-900">Create Deal</span>
                </button>
                
                <button onClick={function () { return navigate('/admin/advertising'); }} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Megaphone size={20} className="text-blue-600"/>
                  <span className="text-sm font-medium text-gray-900">Create Advertisement</span>
                </button>
                
                <button onClick={function () { return navigate('/business/images'); }} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Camera size={20} className="text-blue-600"/>
                  <span className="text-sm font-medium text-gray-900">Upload Photos</span>
                </button>
                <button onClick={function () { return navigate('/business/hours'); }} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Clock size={20} className="text-purple-600"/>
                  <span className="text-sm font-medium text-gray-900">Update Hours</span>
                </button>
                <button onClick={function () { return navigate('/business/loyalty'); }} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Star size={20} className="text-yellow-600"/>
                  <span className="text-sm font-medium text-gray-900">Loyalty Program</span>
                </button>
              </div>
            </div>
          </>)}

        {activeTab === 'sections' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessManagementSections.map(function (section) {
                var IconComponent = iconMap[section.icon];
                return (<button key={section.id} onClick={function () { return handleSectionClick(section); }} disabled={!section.isEnabled} className={"p-4 bg-white rounded-lg border border-gray-200 text-left transition-all ".concat(section.isEnabled
                        ? 'hover:shadow-md hover:border-gray-300'
                        : 'opacity-50 cursor-not-allowed')}>
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                        <IconComponent size={20} className="text-gray-700"/>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 break-words leading-relaxed">{section.description}</p>
                  </div>
                </button>);
            })}
          </div>)}
      </div>
      
      {/* Discreet Build Number */}
      <div className="mt-4">
                                     <p className="text-xs text-gray-400 text-center">v0.31.0</p>
      </div>
    </div>);
};
export default BusinessManagementDashboard;
