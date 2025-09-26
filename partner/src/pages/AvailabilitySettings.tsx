var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
// [2024-12-19 10:33] - Availability settings page for managing restaurant hours and time slots
import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
var AvailabilitySettings = function () {
    var _a = useState([]), restaurants = _a[0], setRestaurants = _a[1];
    var _b = useState(''), selectedRestaurant = _b[0], setSelectedRestaurant = _b[1];
    var _c = useState([]), operatingHours = _c[0], setOperatingHours = _c[1];
    var _d = useState([]), timeSlots = _d[0], setTimeSlots = _d[1];
    var _e = useState(null), settings = _e[0], setSettings = _e[1];
    var _f = useState(true), loading = _f[0], setLoading = _f[1];
    var _g = useState(false), saving = _g[0], setSaving = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var _j = useState(''), success = _j[0], setSuccess = _j[1];
    var daysOfWeek = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' }
    ];
    useEffect(function () {
        var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
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
                        else {
                            setError('No restaurants found for this partner account.');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        setError('Failed to load restaurants');
                        console.error('Error loading restaurants:', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurants();
    }, []);
    useEffect(function () {
        var loadRestaurantData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, hoursData, slotsData, settingsData, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                bookingService.getOperatingHours(selectedRestaurant),
                                bookingService.getTimeSlots(selectedRestaurant),
                                bookingService.getRestaurantSettings(selectedRestaurant)
                            ])];
                    case 2:
                        _a = _b.sent(), hoursData = _a[0], slotsData = _a[1], settingsData = _a[2];
                        setOperatingHours(hoursData);
                        setTimeSlots(slotsData);
                        setSettings(settingsData);
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _b.sent();
                        setError('Failed to load restaurant data');
                        console.error('Error loading restaurant data:', err_2);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurantData();
    }, [selectedRestaurant]);
    var handleOperatingHoursChange = function (dayOfWeek, field, value) {
        setOperatingHours(function (prev) {
            var existing = prev.find(function (h) { return h.day_of_week === dayOfWeek; });
            if (existing) {
                return prev.map(function (h) {
                    var _a;
                    return h.day_of_week === dayOfWeek
                        ? __assign(__assign({}, h), (_a = {}, _a[field] = value, _a)) : h;
                });
            }
            else {
                return __spreadArray(__spreadArray([], prev, true), [{
                        id: "temp-".concat(dayOfWeek),
                        business_id: selectedRestaurant,
                        day_of_week: dayOfWeek,
                        is_open: field === 'is_open' ? value : true,
                        open_time: field === 'open_time' ? value : '09:00',
                        close_time: field === 'close_time' ? value : '22:00',
                        created_at: new Date().toISOString()
                    }], false);
            }
        });
    };
    var handleTimeSlotChange = function (index, field, value) {
        setTimeSlots(function (prev) { return prev.map(function (slot, i) {
            var _a;
            return i === index ? __assign(__assign({}, slot), (_a = {}, _a[field] = value, _a)) : slot;
        }); });
    };
    var addTimeSlot = function () {
        var newSlot = {
            id: "temp-".concat(Date.now()),
            business_id: selectedRestaurant,
            slot_time: '12:00',
            capacity: 50,
            duration_minutes: 120,
            is_active: true,
            created_at: new Date().toISOString()
        };
        setTimeSlots(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newSlot], false); });
    };
    var removeTimeSlot = function (index) {
        setTimeSlots(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var handleSettingsChange = function (field, value) {
        setSettings(function (prev) {
            var _a;
            return prev ? __assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)) : null;
        });
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var hoursToSave, slotsToSave, id, business_id, created_at, updated_at, settingsToSave, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedRestaurant)
                        return [2 /*return*/];
                    setSaving(true);
                    setError('');
                    setSuccess('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    hoursToSave = operatingHours.map(function (_a) {
                        var id = _a.id, business_id = _a.business_id, created_at = _a.created_at, rest = __rest(_a, ["id", "business_id", "created_at"]);
                        return rest;
                    });
                    return [4 /*yield*/, bookingService.updateOperatingHours(selectedRestaurant, hoursToSave)];
                case 2:
                    _a.sent();
                    slotsToSave = timeSlots.map(function (_a) {
                        var id = _a.id, business_id = _a.business_id, created_at = _a.created_at, rest = __rest(_a, ["id", "business_id", "created_at"]);
                        return rest;
                    });
                    return [4 /*yield*/, bookingService.updateTimeSlots(selectedRestaurant, slotsToSave)];
                case 3:
                    _a.sent();
                    if (!settings) return [3 /*break*/, 5];
                    id = settings.id, business_id = settings.business_id, created_at = settings.created_at, updated_at = settings.updated_at, settingsToSave = __rest(settings, ["id", "business_id", "created_at", "updated_at"]);
                    return [4 /*yield*/, bookingService.updateRestaurantSettings(selectedRestaurant, settingsToSave)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    setSuccess('Settings saved successfully!');
                    setTimeout(function () { return setSuccess(''); }, 3000);
                    return [3 /*break*/, 8];
                case 6:
                    err_3 = _a.sent();
                    setError('Failed to save settings');
                    console.error('Error saving settings:', err_3);
                    return [3 /*break*/, 8];
                case 7:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var getOperatingHoursForDay = function (dayOfWeek) {
        return operatingHours.find(function (h) { return h.day_of_week === dayOfWeek; }) || {
            day_of_week: dayOfWeek,
            is_open: true,
            open_time: '09:00',
            close_time: '22:00'
        };
    };
    if (loading) {
        return (<div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading settings...</p>
      </div>);
    }
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Settings</h1>
        <p className="text-gray-600">Manage your restaurant's operating hours and booking slots</p>
      </div>

      {error && (<div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>)}

      {success && (<div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-600">{success}</p>
        </div>)}

      {/* Restaurant Selection */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Restaurant</h2>
          <select value={selectedRestaurant} onChange={function (e) { return setSelectedRestaurant(e.target.value); }} className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {restaurants.map(function (restaurant) { return (<option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>); })}
          </select>
        </div>
      </div>

      {/* General Settings */}
      {settings && (<div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Party Size
                </label>
                <input type="number" min="1" max="50" value={settings.max_party_size} onChange={function (e) { return handleSettingsChange('max_party_size', parseInt(e.target.value)); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advance Booking Days
                </label>
                <input type="number" min="1" max="90" value={settings.advance_booking_days} onChange={function (e) { return handleSettingsChange('advance_booking_days', parseInt(e.target.value)); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Buffer (minutes)
                </label>
                <input type="number" min="0" max="60" value={settings.booking_buffer_minutes} onChange={function (e) { return handleSettingsChange('booking_buffer_minutes', parseInt(e.target.value)); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="auto_confirm" checked={settings.auto_confirm} onChange={function (e) { return handleSettingsChange('auto_confirm', e.target.checked); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                <label htmlFor="auto_confirm" className="ml-2 block text-sm text-gray-900">
                  Auto-confirm bookings
                </label>
              </div>
            </div>
          </div>
        </div>)}

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
          <div className="space-y-4">
            {daysOfWeek.map(function (day) {
            var hours = getOperatingHoursForDay(day.value);
            return (<div key={day.value} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="text-sm font-medium text-gray-700">
                      {day.label}
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input type="checkbox" checked={hours.is_open} onChange={function (e) { return handleOperatingHoursChange(day.value, 'is_open', e.target.checked); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                    <label className="ml-2 text-sm text-gray-900">Open</label>
                  </div>

                  {hours.is_open && (<>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Open Time</label>
                        <input type="time" value={hours.open_time} onChange={function (e) { return handleOperatingHoursChange(day.value, 'open_time', e.target.value); }} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Close Time</label>
                        <input type="time" value={hours.close_time} onChange={function (e) { return handleOperatingHoursChange(day.value, 'close_time', e.target.value); }} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                    </>)}
                </div>);
        })}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Time Slots</h2>
            <button onClick={addTimeSlot} theme="blue" size="sm" class="px-3 py-2 bg-blue-600 text-white rounded"
              Add Time Slot
            </Button>
          </div>
          {/* Heading row for slot fields */}
          <div className="flex items-center gap-2 px-2 pb-1 text-xs text-gray-500 font-semibold">
            <span className="w-20">Time</span>
            <span className="w-16">Capacity</span>
            <span className="w-16">Duration</span>
            <span className="w-16">Active</span>
            <span className="flex-1"/>
            <span className="w-16 text-right">Remove</span>
          </div>
          
          <div className="space-y-2">
            {timeSlots.map(function (slot, index) { return (<div key={slot.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                <input type="time" value={slot.slot_time} onChange={function (e) { return handleTimeSlotChange(index, 'slot_time', e.target.value); }} className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Time"/>
                <input type="number" min="1" max="200" value={slot.capacity} onChange={function (e) { return handleTimeSlotChange(index, 'capacity', parseInt(e.target.value)); }} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Capacity" placeholder="Cap."/>
                <input type="number" min="30" max="300" step="15" value={slot.duration_minutes} onChange={function (e) { return handleTimeSlotChange(index, 'duration_minutes', parseInt(e.target.value)); }} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Duration" placeholder="Min."/>
                <label className="flex items-center text-xs gap-1">
                  <input type="checkbox" checked={slot.is_active} onChange={function (e) { return handleTimeSlotChange(index, 'is_active', e.target.checked); }} className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" aria-label="Active"/>
                  Active
                </label>
                <div className="flex-1"/>
                <button onClick={function () { return removeTimeSlot(index); }} className="text-red-600 hover:text-red-800 text-xs font-medium ml-auto" tabIndex={-1}>
                  Remove
                </button>
              </div>); })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} isLoading={saving} disabled={saving} theme="blue" class="px-3 py-2 bg-blue-600 text-white rounded"
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>);
};
export default AvailabilitySettings;
