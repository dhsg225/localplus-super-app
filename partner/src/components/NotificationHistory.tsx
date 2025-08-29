var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { notificationService } from '../../shared/services/notificationService';
var NotificationHistory = function (_a) {
    var businessId = _a.businessId, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.showHeader, showHeader = _c === void 0 ? true : _c;
    var _d = useState([]), notifications = _d[0], setNotifications = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    useEffect(function () {
        loadNotifications();
    }, [businessId]);
    var loadNotifications = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, notificationService.getBusinessNotifications(businessId, limit)];
                case 1:
                    data = _a.sent();
                    setNotifications(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error loading notifications:', err_1);
                    setError('Failed to load notifications');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'sent':
                return <CheckCircle size={16} className="text-green-500"/>;
            case 'delivered':
                return <CheckCircle size={16} className="text-green-600"/>;
            case 'failed':
                return <XCircle size={16} className="text-red-500"/>;
            default:
                return <Clock size={16} className="text-yellow-500"/>;
        }
    };
    var getChannelIcon = function (channel) {
        switch (channel) {
            case 'email':
                return <Mail size={16} className="text-blue-500"/>;
            case 'sms':
                return <MessageSquare size={16} className="text-green-500"/>;
            default:
                return <Bell size={16} className="text-gray-500"/>;
        }
    };
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        var now = new Date();
        var diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1) {
            return 'Just now';
        }
        else if (diffInHours < 24) {
            return "".concat(diffInHours, "h ago");
        }
        else {
            return date.toLocaleDateString();
        }
    };
    var getNotificationTypeLabel = function (type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };
    if (loading) {
        return (<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {__spreadArray([], Array(3), true).map(function (_, i) { return (<div key={i} className="h-12 bg-gray-200 rounded"></div>); })}
          </div>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <Bell className="mx-auto h-8 w-8 mb-2"/>
          <p className="text-sm">{error}</p>
        </div>
      </div>);
    }
    return (<div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {showHeader && (<div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
        </div>)}
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (<div className="px-4 py-6 text-center text-gray-500">
            <Bell className="mx-auto h-8 w-8 mb-2"/>
            <p className="text-sm">No notifications yet</p>
          </div>) : (notifications.map(function (notification) { return (<div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
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
                    
                    {notification.subject && (<p className="text-xs text-gray-500 mt-1">
                        {notification.subject}
                      </p>)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 ml-2">
                  {formatDate(notification.created_at)}
                </div>
              </div>
              
              {notification.error_message && (<div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  Error: {notification.error_message}
                </div>)}
            </div>); }))}
      </div>
      
      {notifications.length > 0 && (<div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button onClick={function () { return window.location.href = '/notifications'; }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all notifications →
          </button>
        </div>)}
    </div>);
};
export default NotificationHistory;
