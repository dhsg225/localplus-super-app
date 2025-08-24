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
// [2024-12-19 10:29] - Shared booking form component
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { bookingService } from '@shared/services/bookingService';
export var BookingForm = function (_a) {
    var businessId = _a.businessId, businessName = _a.businessName, onSuccess = _a.onSuccess, onError = _a.onError, _b = _a.theme, theme = _b === void 0 ? 'blue' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState({
        business_id: businessId,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        party_size: 2,
        booking_date: '',
        booking_time: '',
        special_requests: ''
    }), formData = _d[0], setFormData = _d[1];
    var _e = useState([]), timeSlots = _e[0], setTimeSlots = _e[1];
    var _f = useState(null), settings = _f[0], setSettings = _f[1];
    var _g = useState(null), availability = _g[0], setAvailability = _g[1];
    var _h = useState(false), loading = _h[0], setLoading = _h[1];
    var _j = useState({}), errors = _j[0], setErrors = _j[1];
    // Load restaurant settings and time slots
    useEffect(function () {
        var loadRestaurantData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, settingsData, slotsData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                bookingService.getRestaurantSettings(businessId),
                                bookingService.getTimeSlots(businessId)
                            ])];
                    case 1:
                        _a = _b.sent(), settingsData = _a[0], slotsData = _a[1];
                        setSettings(settingsData);
                        setTimeSlots(slotsData);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error loading restaurant data:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurantData();
    }, [businessId]);
    // Check availability when date/time/party size changes
    useEffect(function () {
        var checkAvailability = function () { return __awaiter(void 0, void 0, void 0, function () {
            var isAvailable, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(formData.booking_date && formData.booking_time && formData.party_size)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, bookingService.checkAvailability(businessId, formData.booking_date, formData.booking_time, formData.party_size)];
                    case 2:
                        isAvailable = _a.sent();
                        setAvailability({ available: isAvailable });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error checking availability:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        checkAvailability();
    }, [businessId, formData.booking_date, formData.booking_time, formData.party_size]);
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = '', _a)));
            });
        }
    };
    var validateForm = function () {
        var newErrors = {};
        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Name is required';
        }
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
            newErrors.customer_email = 'Please enter a valid email';
        }
        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Phone number is required';
        }
        if (!formData.booking_date) {
            newErrors.booking_date = 'Booking date is required';
        }
        else {
            var bookingDate = new Date(formData.booking_date);
            var today_1 = new Date();
            today_1.setHours(0, 0, 0, 0);
            if (bookingDate < today_1) {
                newErrors.booking_date = 'Cannot book for past dates';
            }
        }
        if (!formData.booking_time) {
            newErrors.booking_time = 'Booking time is required';
        }
        if (formData.party_size < 1) {
            newErrors.party_size = 'Party size must be at least 1';
        }
        else if ((settings === null || settings === void 0 ? void 0 : settings.max_party_size) && formData.party_size > settings.max_party_size) {
            newErrors.party_size = "Maximum party size is ".concat(settings.max_party_size);
        }
        if (availability && !availability.available) {
            newErrors.booking_time = 'Selected time slot is not available';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var booking, error_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, bookingService.createBooking(formData)];
                case 2:
                    booking = _a.sent();
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(booking);
                    // Reset form
                    setFormData({
                        business_id: businessId,
                        customer_name: '',
                        customer_email: '',
                        customer_phone: '',
                        party_size: 2,
                        booking_date: '',
                        booking_time: '',
                        special_requests: ''
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    errorMessage = error_3 instanceof Error ? error_3.message : 'Failed to create booking';
                    onError === null || onError === void 0 ? void 0 : onError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Generate date options (next 30 days)
    var dateOptions = [];
    var today = new Date();
    for (var i = 0; i < ((settings === null || settings === void 0 ? void 0 : settings.advance_booking_days) || 30); i++) {
        var date = new Date(today);
        date.setDate(today.getDate() + i);
        dateOptions.push({
            value: date.toISOString().split('T')[0],
            label: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
    }
    // Generate time slot options
    var timeOptions = timeSlots.map(function (slot) { return ({
        value: slot.slot_time,
        label: new Date("2000-01-01T".concat(slot.slot_time)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }); });
    // Generate party size options
    var partySizeOptions = [];
    var maxSize = (settings === null || settings === void 0 ? void 0 : settings.max_party_size) || 12;
    for (var i = 1; i <= maxSize; i++) {
        partySizeOptions.push({
            value: i.toString(),
            label: i === 1 ? '1 person' : "".concat(i, " people")
        });
    }
    return (<div className={"booking-form ".concat(className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Book a Table at {businessName}
        </h2>
        {(settings === null || settings === void 0 ? void 0 : settings.special_instructions) && (<p className="text-gray-600 text-sm">
            {settings.special_instructions}
          </p>)}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Full Name" type="text" value={formData.customer_name} onChange={function (e) { return handleInputChange('customer_name', e.target.value); }} error={errors.customer_name} required/>

          <FormInput label="Email Address" type="email" value={formData.customer_email} onChange={function (e) { return handleInputChange('customer_email', e.target.value); }} error={errors.customer_email} required/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Phone Number" type="tel" value={formData.customer_phone} onChange={function (e) { return handleInputChange('customer_phone', e.target.value); }} error={errors.customer_phone} required/>

          <FormSelect label="Party Size" value={formData.party_size.toString()} onChange={function (e) { return handleInputChange('party_size', parseInt(e.target.value)); }} options={partySizeOptions} error={errors.party_size} required/>

          <FormSelect label="Date" value={formData.booking_date} onChange={function (e) { return handleInputChange('booking_date', e.target.value); }} options={dateOptions} error={errors.booking_date} required/>
        </div>

        <FormSelect label="Time" value={formData.booking_time} onChange={function (e) { return handleInputChange('booking_time', e.target.value); }} options={timeOptions} error={errors.booking_time} required/>

        {availability && !availability.available && (<div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              The selected time slot is not available. Please choose a different time.
            </p>
          </div>)}

        <FormInput label="Special Requests (Optional)" type="textarea" value={formData.special_requests || ''} onChange={function (e) { return handleInputChange('special_requests', e.target.value); }} placeholder="Any dietary restrictions, seating preferences, or special occasions..."/>

        {(settings === null || settings === void 0 ? void 0 : settings.cancellation_policy) && (<div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-600 text-sm">
              <strong>Cancellation Policy:</strong> {settings.cancellation_policy}
            </p>
          </div>)}

        <Button type="submit" theme={theme} isLoading={loading} disabled={loading || (availability && !availability.available)} className="w-full">
          {loading ? 'Creating Booking...' : 'Book Table'}
        </Button>
      </form>
    </div>);
};
