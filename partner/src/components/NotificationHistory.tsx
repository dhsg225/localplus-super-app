import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { notificationService } from '../../shared/services/notificationService';
import type { BookingNotification } from '../../shared/types';

// [2024-12-19 10:30] - Notification history component for viewing recent notifications

interface NotificationHistoryProps {
  businessId: string;
  limit?: number;
  showHeader?: boolean;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ 
  businessId, 
  limit = 10, 
  showHeader = true 
}) => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadNotifications();
  }, [businessId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getBusinessNotifications(businessId, limit);
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={16} className="text-blue-500" />;
      case 'sms':
        return <MessageSquare size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <Bell className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <Bell className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getChannelIcon(notification.channel)}
                    {getStatusIcon(notification.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {getNotificationTypeLabel(notification.notification_type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        via {notification.channel}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {notification.recipient_email || notification.recipient_phone}
                    </p>
                    
                    {notification.subject && (
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.subject}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 ml-2">
                  {formatDate(notification.created_at)}
                </div>
              </div>
              
              {notification.error_message && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  Error: {notification.error_message}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => window.location.href = '/notifications'}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationHistory; 