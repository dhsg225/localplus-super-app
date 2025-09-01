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
// [2024-12-19 10:32] - Partner booking dashboard for managing restaurant bookings
import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/components';
import { useToast } from '../../shared/components/Toast';
import { bookingService } from '../../../shared/services/bookingService';
var BookingDashboard = function () {
    var _a = useState([]), bookings = _a[0], setBookings = _a[1];
    var _b = useState([]), restaurants = _b[0], setRestaurants = _b[1];
    var _c = useState(''), selectedRestaurant = _c[0], setSelectedRestaurant = _c[1];
    var _d = useState('all'), selectedStatus = _d[0], setSelectedStatus = _d[1];
    var _e = useState(''), selectedDate = _e[0], setSelectedDate = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(null), actionLoading = _h[0], setActionLoading = _h[1]; // bookingId of action in progress
    
    // Get toast function at component level
    var toast = useToast();
    var showToast = toast.showToast;
    // Load partner's restaurants
    useEffect(function () {
        var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bookingService.getPartnerRestaurants()];
                    case 1:
                        data = _a.sent();
                        setRestaurants(data);
                        if (data.length > 0) {
                            setSelectedRestaurant(data[0].id);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        errorMessage = err_1 instanceof Error ? err_1.message : 'Failed to load restaurants';
                        setError(errorMessage);
                        console.error('Error loading restaurants:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurants();
    }, []);
    // Load bookings when restaurant selection changes
    useEffect(function () {
        var loadBookings = function () { return __awaiter(void 0, void 0, void 0, function () {
            var status_1, data, filteredData, normalizedDate_1, _a, dd, mm, yyyy, dateObj, yyyy, mm, dd, err_2, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        setLoading(true);
                        status_1 = selectedStatus === 'all' ? undefined : selectedStatus;
                        return [4 /*yield*/, bookingService.getBookings(selectedRestaurant, status_1)];
                    case 2:
                        data = _b.sent();
                        console.log('[DEBUG] Raw bookings fetched:', data);
                        filteredData = data;
                        if (selectedDate) {
                            normalizedDate_1 = selectedDate;
                            // If selectedDate is in DD/MM/YYYY format, convert to YYYY-MM-DD
                            if (/^\d{2}\/\d{2}\/\d{4}$/.test(selectedDate)) {
                                _a = selectedDate.split('/'), dd = _a[0], mm = _a[1], yyyy = _a[2];
                                normalizedDate_1 = "".concat(yyyy, "-").concat(mm, "-").concat(dd);
                            }
                            else if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
                                normalizedDate_1 = selectedDate;
                            }
                            else {
                                dateObj = new Date(selectedDate);
                                yyyy = dateObj.getFullYear();
                                mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                                dd = String(dateObj.getDate()).padStart(2, '0');
                                normalizedDate_1 = "".concat(yyyy, "-").concat(mm, "-").concat(dd);
                            }
                            console.log('Selected date:', selectedDate, 'Normalized:', normalizedDate_1);
                            filteredData = data.filter(function (booking) {
                                console.log('Compare booking.booking_date:', booking.booking_date, 'to', normalizedDate_1);
                                return booking.booking_date === normalizedDate_1;
                            });
                        }
                        setBookings(filteredData);
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _b.sent();
                        console.error('Error loading bookings:', err_2);
                        errorMessage = err_2 instanceof Error ? err_2.message : String(err_2);
                        if (errorMessage.includes('RLS') || errorMessage.includes('policy')) {
                            setError('Authentication required: Please run the database setup scripts first (booking-system-schema.sql and shannon-restaurant-setup.sql)');
                        }
                        else {
                            setError('Failed to load bookings');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadBookings();
    }, [selectedRestaurant, selectedStatus, selectedDate]);
    var handleStatusChange = function (bookingId, newStatus) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedBooking_1, actionMsg, _a, err_3, msg;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setActionLoading(bookingId);
                    setError('');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 15, 16, 17]);
                    actionMsg = '';
                    _a = newStatus;
                    switch (_a) {
                        case 'confirmed': return [3 /*break*/, 2];
                        case 'seated': return [3 /*break*/, 4];
                        case 'completed': return [3 /*break*/, 6];
                        case 'no_show': return [3 /*break*/, 8];
                        case 'cancelled': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 2: return [4 /*yield*/, bookingService.confirmBooking(bookingId)];
                case 3:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Booking confirmed!';
                    return [3 /*break*/, 14];
                case 4: return [4 /*yield*/, bookingService.seatBooking(bookingId)];
                case 5:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Booking marked as seated.';
                    return [3 /*break*/, 14];
                case 6: return [4 /*yield*/, bookingService.completeBooking(bookingId)];
                case 7:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Booking completed.';
                    return [3 /*break*/, 14];
                case 8: return [4 /*yield*/, bookingService.markNoShow(bookingId)];
                case 9:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Marked as no-show.';
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, bookingService.cancelBooking(bookingId, 'Cancelled by restaurant', 'restaurant')];
                case 11:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Booking cancelled.';
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, bookingService.updateBooking(bookingId, { status: newStatus })];
                case 13:
                    updatedBooking_1 = _d.sent();
                    actionMsg = 'Booking updated.';
                    _d.label = 14;
                case 14:
                    setBookings(function (prev) { return prev.map(function (booking) { return booking.id === bookingId ? updatedBooking_1 : booking; }); });
                                            showToast(actionMsg, 'success');
                    return [3 /*break*/, 17];
                case 15:
                    err_3 = _d.sent();
                    msg = 'Failed to update booking status';
                    if ((_b = err_3 === null || err_3 === void 0 ? void 0 : err_3.message) === null || _b === void 0 ? void 0 : _b.includes('already confirmed'))
                        msg = 'Booking is already confirmed.';
                    else if ((_c = err_3 === null || err_3 === void 0 ? void 0 : err_3.message) === null || _c === void 0 ? void 0 : _c.includes('RLS'))
                        msg = 'Permission denied. Please check your database policies.';
                    else if (err_3 === null || err_3 === void 0 ? void 0 : err_3.message)
                        msg = err_3.message;
                    setError(msg);
                                            showToast(msg, 'error');
                    console.error('Error updating booking:', err_3);
                    return [3 /*break*/, 17];
                case 16:
                    setActionLoading(null);
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    var getStatusColor = function (status) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'seated': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var formatTime = function (time) {
        return new Date("2000-01-01T".concat(time)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    var formatDate = function (date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };
    var todayBookings = bookings.filter(function (booking) {
        return booking.booking_date === new Date().toISOString().split('T')[0];
    });
    var upcomingBookings = bookings.filter(function (booking) {
        var bookingDate = new Date(booking.booking_date);
        var today = new Date();
        return bookingDate > today;
    });
    if (error) {
        return (<div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>);
    }
    return (<div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant bookings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(function (b) { return b.status === 'confirmed'; }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(function (b) { return b.status === 'pending'; }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant
                </label>
                <select value={selectedRestaurant} onChange={function (e) { return setSelectedRestaurant(e.target.value); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {restaurants.map(function (restaurant) { return (<option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>); })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select value={selectedStatus} onChange={function (e) { return setSelectedStatus(e.target.value); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input type="date" value={selectedDate} onChange={function (e) { return setSelectedDate(e.target.value); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div className="flex items-end">
                <Button onClick={function () {
            setSelectedStatus('all');
            setSelectedDate('');
        }} theme="gray" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({bookings.length})
            </h2>
          </div>

          {loading ? (<div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>) : bookings.length === 0 ? (<div className="p-8 text-center">
              <p className="text-gray-500">No bookings found</p>
            </div>) : (<div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confirmation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map(function (booking) { return (<tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer_email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.booking_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.booking_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(booking.status))}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.confirmation_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {booking.status === 'pending' && (<>
                            <Button onClick={function () { return handleStatusChange(booking.id, 'confirmed'); }} theme="blue" size="sm" isLoading={actionLoading === booking.id} disabled={actionLoading === booking.id}>
                              Confirm
                            </Button>
                            <Button onClick={function () { return handleStatusChange(booking.id, 'cancelled'); }} theme="red" size="sm" isLoading={actionLoading === booking.id} disabled={actionLoading === booking.id}>
                              Cancel
                            </Button>
                          </>)}
                        {booking.status === 'confirmed' && (<>
                            <Button onClick={function () { return handleStatusChange(booking.id, 'seated'); }} theme="blue" size="sm" isLoading={actionLoading === booking.id} disabled={actionLoading === booking.id}>
                              Seat
                            </Button>
                            <Button onClick={function () { return handleStatusChange(booking.id, 'no_show'); }} theme="red" size="sm" isLoading={actionLoading === booking.id} disabled={actionLoading === booking.id}>
                              No Show
                            </Button>
                          </>)}
                        {booking.status === 'seated' && (<Button onClick={function () { return handleStatusChange(booking.id, 'completed'); }} theme="blue" size="sm" isLoading={actionLoading === booking.id} disabled={actionLoading === booking.id}>
                            Complete
                          </Button>)}
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>)}
        </div>
      </div>);
};
export default BookingDashboard;
