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
import { supabase } from './supabase';
import { notificationService } from './notificationService';
import { v4 as uuidv4 } from 'uuid';
// Booking Management
export var bookingService = {
    // Core booking operations
    createBooking: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmationResult, bookingData, _a, booking, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .rpc('generate_booking_confirmation_code')];
                    case 1:
                        confirmationResult = (_b.sent()).data;
                        bookingData = __assign(__assign({}, data), { confirmation_code: confirmationResult, status: 'pending' });
                        return [4 /*yield*/, supabase
                                .from('bookings')
                                .insert([bookingData])
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), booking = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, booking];
                }
            });
        });
    },
    getBookings: function (businessId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase
                            .from('bookings')
                            .select('*')
                            .order('booking_date', { ascending: true })
                            .order('booking_time', { ascending: true });
                        if (businessId) {
                            query = query.eq('business_id', businessId);
                        }
                        if (status) {
                            query = query.eq('status', status);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        console.log('[DEBUG] getBookings businessId:', businessId, 'status:', status, 'data:', data, 'error:', error);
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    getBookingById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    getBookingByConfirmationCode: function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .select('*')
                            .eq('confirmation_code', code)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    updateBooking: function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, booking, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .update(data)
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), booking = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, booking];
                }
            });
        });
    },
    confirmBooking: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var booking, preferences, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateBooking(id, { status: 'confirmed' })
                        // Send confirmation notification
                    ];
                    case 1:
                        booking = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, notificationService.getPreferences(booking.business_id)];
                    case 3:
                        preferences = _a.sent();
                        if (!(preferences === null || preferences === void 0 ? void 0 : preferences.auto_send_confirmations)) return [3 /*break*/, 5];
                        return [4 /*yield*/, notificationService.sendBookingNotification(booking, 'confirmation', preferences)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Failed to send confirmation notification:', error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, booking];
                }
            });
        });
    },
    seatBooking: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, booking, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .update({
                            status: 'seated',
                            seated_at: new Date().toISOString()
                        })
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), booking = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, booking];
                }
            });
        });
    },
    completeBooking: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, booking, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .update({
                            status: 'completed',
                            completed_at: new Date().toISOString()
                        })
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), booking = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, booking];
                }
            });
        });
    },
    markNoShow: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var booking, preferences, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateBooking(id, { status: 'no_show' })
                        // Send no-show notification
                    ];
                    case 1:
                        booking = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, notificationService.getPreferences(booking.business_id)];
                    case 3:
                        preferences = _a.sent();
                        if (!preferences) return [3 /*break*/, 5];
                        return [4 /*yield*/, notificationService.sendBookingNotification(booking, 'no_show', preferences)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error('Failed to send no-show notification:', error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, booking];
                }
            });
        });
    },
    cancelBooking: function (id, reason, cancelledBy) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, booking, error, preferences, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .update({
                            status: 'cancelled',
                            cancellation_reason: reason,
                            cancelled_by: cancelledBy,
                            cancelled_at: new Date().toISOString()
                        })
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), booking = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, notificationService.getPreferences(booking.business_id)];
                    case 3:
                        preferences = _b.sent();
                        if (!preferences) return [3 /*break*/, 5];
                        return [4 /*yield*/, notificationService.sendBookingNotification(booking, 'cancellation', preferences)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _b.sent();
                        console.error('Failed to send cancellation notification:', error_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, booking];
                }
            });
        });
    },
    // Availability checking
    checkAvailability: function (businessId, date, time, partySize) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .rpc('check_booking_availability', {
                            p_business_id: businessId,
                            p_booking_date: date,
                            p_booking_time: time,
                            p_party_size: partySize
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    getAvailableTimeSlots: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('time_slots')
                            .select('*')
                            .eq('business_id', businessId)
                            .order('slot_time')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Restaurant settings
    getRestaurantSettings: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('restaurant_settings')
                            .select('*')
                            .eq('business_id', businessId)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    updateRestaurantSettings: function (businessId, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, id, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('restaurant_settings')
                            .select('id')
                            .eq('business_id', businessId)
                            .single()];
                    case 1:
                        existing = (_b.sent()).data;
                        id = existing === null || existing === void 0 ? void 0 : existing.id;
                        if (!id) {
                            id = uuidv4();
                        }
                        return [4 /*yield*/, supabase
                                .from('restaurant_settings')
                                .upsert([__assign({ id: id, business_id: businessId }, settings)], { onConflict: 'id' })
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Operating hours
    getOperatingHours: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('operating_hours')
                            .select('*')
                            .eq('business_id', businessId)
                            .order('day_of_week')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    updateOperatingHours: function (businessId, hours) {
        return __awaiter(this, void 0, void 0, function () {
            var hoursWithBusinessId, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hoursWithBusinessId = hours.map(function (hour) { return (__assign(__assign({}, hour), { business_id: businessId })); });
                        return [4 /*yield*/, supabase
                                .from('operating_hours')
                                .upsert(hoursWithBusinessId, { onConflict: 'business_id,day_of_week' })
                                .select()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Time slots
    getTimeSlots: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('time_slots')
                            .select('*')
                            .eq('business_id', businessId)
                            .order('slot_time')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    updateTimeSlots: function (businessId, slots) {
        return __awaiter(this, void 0, void 0, function () {
            var slotsWithBusinessId, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        slotsWithBusinessId = slots.map(function (slot) { return (__assign(__assign({}, slot), { business_id: businessId })); });
                        return [4 /*yield*/, supabase
                                .from('time_slots')
                                .upsert(slotsWithBusinessId, { onConflict: 'business_id,slot_time' })
                                .select()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Blocked dates
    getBlockedDates: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('blocked_dates')
                            .select('*')
                            .eq('business_id', businessId)
                            .order('blocked_date')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    addBlockedDate: function (businessId_1, date_1, reason_1) {
        return __awaiter(this, arguments, void 0, function (businessId, date, reason, isRecurring, recurringType) {
            var _a, data, error;
            if (isRecurring === void 0) { isRecurring = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('blocked_dates')
                            .insert([{
                                business_id: businessId,
                                blocked_date: date,
                                reason: reason,
                                is_recurring: isRecurring,
                                recurring_type: recurringType
                            }])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    removeBlockedDate: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('blocked_dates')
                            .delete()
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        });
    },
    // Menu management
    getMenuCategories: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_categories')
                            .select('*')
                            .eq('business_id', businessId)
                            .eq('is_active', true)
                            .order('sort_order')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    createMenuCategory: function (businessId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_categories')
                            .insert([__assign(__assign({}, category), { business_id: businessId })])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    updateMenuCategory: function (id, category) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_categories')
                            .update(category)
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    deleteMenuCategory: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_categories')
                            .update({ is_active: false })
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        });
    },
    getMenuItems: function (businessId, categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase
                            .from('menu_items')
                            .select('*')
                            .eq('business_id', businessId)
                            .eq('is_available', true)
                            .order('sort_order');
                        if (categoryId) {
                            query = query.eq('category_id', categoryId);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    createMenuItem: function (businessId, item) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_items')
                            .insert([__assign(__assign({}, item), { business_id: businessId })])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    updateMenuItem: function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_items')
                            .update(item)
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    deleteMenuItem: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('menu_items')
                            .update({ is_available: false })
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        });
    },
    // Partner management
    getPartners: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .select('*')
                            .eq('business_id', businessId)
                            .eq('is_active', true)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    addPartner: function (businessId, userId, role, permissions) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .insert([{
                                business_id: businessId,
                                user_id: userId,
                                role: role,
                                permissions: permissions
                            }])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    updatePartner: function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .update(updates)
                            .eq('id', id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    removePartner: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('partners')
                            .update({ is_active: false })
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        });
    },
    // Notifications
    getBookingNotifications: function (bookingId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('booking_notifications')
                            .select('*')
                            .eq('booking_id', bookingId)
                            .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    createNotification: function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('booking_notifications')
                            .insert([notification])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Analytics and reporting
    getBookingStats: function (businessId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, stats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('bookings')
                            .select('status, party_size, created_at')
                            .eq('business_id', businessId)
                            .gte('booking_date', startDate)
                            .lte('booking_date', endDate)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        stats = {
                            totalBookings: (data === null || data === void 0 ? void 0 : data.length) || 0,
                            confirmedBookings: (data === null || data === void 0 ? void 0 : data.filter(function (b) { return b.status === 'confirmed'; }).length) || 0,
                            cancelledBookings: (data === null || data === void 0 ? void 0 : data.filter(function (b) { return b.status === 'cancelled'; }).length) || 0,
                            completedBookings: (data === null || data === void 0 ? void 0 : data.filter(function (b) { return b.status === 'completed'; }).length) || 0,
                            noShowBookings: (data === null || data === void 0 ? void 0 : data.filter(function (b) { return b.status === 'no_show'; }).length) || 0,
                            totalGuests: (data === null || data === void 0 ? void 0 : data.reduce(function (sum, b) { return sum + (b.party_size || 0); }, 0)) || 0,
                            averagePartySize: (data === null || data === void 0 ? void 0 : data.length) ? (data.reduce(function (sum, b) { return sum + (b.party_size || 0); }, 0) / data.length) : 0
                        };
                        return [2 /*return*/, stats];
                }
            });
        });
    },
    getUpcomingBookings: function (businessId_1) {
        return __awaiter(this, arguments, void 0, function (businessId, days) {
            var today, futureDate, endDate, _a, data, error;
            if (days === void 0) { days = 7; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        today = new Date().toISOString().split('T')[0];
                        futureDate = new Date();
                        futureDate.setDate(futureDate.getDate() + days);
                        endDate = futureDate.toISOString().split('T')[0];
                        return [4 /*yield*/, supabase
                                .from('bookings')
                                .select('*')
                                .eq('business_id', businessId)
                                .gte('booking_date', today)
                                .lte('booking_date', endDate)
                                .in('status', ['pending', 'confirmed'])
                                .order('booking_date')
                                .order('booking_time')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    getTodaysBookings: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var today, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        today = new Date().toISOString().split('T')[0];
                        return [4 /*yield*/, supabase
                                .from('bookings')
                                .select('*')
                                .eq('business_id', businessId)
                                .eq('booking_date', today)
                                .order('booking_time')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Partner Restaurant Access
    getPartnerRestaurants: function () {
        return __awaiter(this, void 0, void 0, function () {
            var devUserRaw, _a, allRestaurants, error_4, devRestaurants, user, _b, data, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
                        if (!devUserRaw) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('*')];
                    case 1:
                        _a = _c.sent(), allRestaurants = _a.data, error_4 = _a.error;
                        if (error_4)
                            throw error_4;
                        devRestaurants = allRestaurants.filter(function (r) {
                            return r.name && r.name.toLowerCase().includes('shannon');
                        });
                        if (devRestaurants.length === 0) {
                            devRestaurants = allRestaurants.slice(0, 1); // fallback to first
                        }
                        return [2 /*return*/, devRestaurants];
                    case 2: return [4 /*yield*/, supabase.auth.getUser()];
                    case 3:
                        user = (_c.sent()).data.user;
                        if (!user) {
                            throw new Error('Authentication required. Please log in to access partner restaurants.');
                        }
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select("*, partners!inner(id, role, permissions, is_active)")
                                .eq('partners.user_id', user.id)
                                .eq('partners.is_active', true)];
                    case 4:
                        _b = _c.sent(), data = _b.data, error = _b.error;
                        if (error)
                            throw error;
                        if (!data || data.length === 0) {
                            throw new Error('No restaurants found for this partner account. Please contact support.');
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    }
};
