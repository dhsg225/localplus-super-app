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
import { createClient } from '@supabase/supabase-js';
// [2024-12-19 10:30] - Notification service for booking status changes and preferences management
// Service role client for dev bypass (bypasses RLS)
var getServiceRoleClient = function () {
    if (typeof window === 'undefined')
        return null; // Server-side, use regular client
    var devUserRaw = localStorage.getItem('partner_dev_user');
    if (!devUserRaw)
        return null; // Not in dev bypass mode
    // Use service role key for dev bypass to bypass RLS
    // Create with a unique key to avoid conflicts
    return createClient('https://joknprahhqdhvdhzmuwl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MjcxMCwiZXhwIjoyMDY1MjI4NzEwfQ.8Esm5KMfVJAQxHoKrEV9exsMASEFTnHfKOdqSt5cDFk', {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });
};
var DEFAULT_EMAIL_TEMPLATES = {
    confirmation: 'Your booking at {{restaurant_name}} has been confirmed for {{date}} at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}',
    reminder: 'Reminder: Your booking at {{restaurant_name}} is tomorrow at {{time}} for {{party_size}} people. Confirmation code: {{confirmation_code}}',
    cancellation: 'Your booking at {{restaurant_name}} for {{date}} at {{time}} has been cancelled. {{cancellation_reason}}',
    no_show: 'Your booking at {{restaurant_name}} for {{date}} at {{time}} has been marked as no-show.'
};
var DEFAULT_SMS_TEMPLATES = {
    confirmation: 'Booking confirmed at {{restaurant_name}} for {{date}} at {{time}}. Code: {{confirmation_code}}',
    reminder: 'Reminder: Booking tomorrow at {{time}} at {{restaurant_name}}. Code: {{confirmation_code}}',
    cancellation: 'Booking cancelled at {{restaurant_name}} for {{date}} at {{time}}.',
    no_show: 'Booking marked as no-show at {{restaurant_name}} for {{date}} at {{time}}.'
};
export var notificationService = {
    // Get notification preferences for a business
    getPreferences: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceClient, client, _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serviceClient = getServiceRoleClient();
                        client = serviceClient || supabase;
                        if (serviceClient) {
                            console.log('🔧 Dev bypass: using service role client for real DB operations');
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client
                                .from('notification_preferences')
                                .select('*')
                                .eq('business_id', businessId)
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error && error.code !== 'PGRST116')
                            throw error; // PGRST116 = no rows returned
                        if (data) {
                            console.log('✅ Found existing notification preferences');
                            return [2 /*return*/, data];
                        }
                        else {
                            console.log('📝 No preferences found, will create defaults when saved');
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error('❌ Error fetching notification preferences:', error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Create or update notification preferences
    savePreferences: function (preferences) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceClient, client, existing, _a, data, error, defaultPreferences, _b, data, error, error_2;
            var _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        serviceClient = getServiceRoleClient();
                        client = serviceClient || supabase;
                        if (serviceClient) {
                            console.log('🔧 Dev bypass: using service role client for real DB operations');
                        }
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.getPreferences(preferences.business_id)];
                    case 2:
                        existing = _k.sent();
                        if (!(existing && existing.id && !existing.id.startsWith('dev-'))) return [3 /*break*/, 4];
                        // Update existing preferences
                        console.log('🔄 Updating existing notification preferences');
                        return [4 /*yield*/, client
                                .from('notification_preferences')
                                .update(__assign(__assign({}, preferences), { updated_at: new Date().toISOString() }))
                                .eq('business_id', preferences.business_id)
                                .select()
                                .single()];
                    case 3:
                        _a = _k.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        console.log('✅ Notification preferences updated successfully');
                        return [2 /*return*/, data];
                    case 4:
                        // Create new preferences with defaults
                        console.log('🆕 Creating new notification preferences');
                        defaultPreferences = {
                            id: '', // Let database generate ID
                            business_id: preferences.business_id,
                            email_enabled: (_c = preferences.email_enabled) !== null && _c !== void 0 ? _c : true,
                            sms_enabled: (_d = preferences.sms_enabled) !== null && _d !== void 0 ? _d : false,
                            email_templates: (_e = preferences.email_templates) !== null && _e !== void 0 ? _e : DEFAULT_EMAIL_TEMPLATES,
                            sms_templates: (_f = preferences.sms_templates) !== null && _f !== void 0 ? _f : DEFAULT_SMS_TEMPLATES,
                            reminder_hours_before: (_g = preferences.reminder_hours_before) !== null && _g !== void 0 ? _g : 24,
                            auto_send_confirmations: (_h = preferences.auto_send_confirmations) !== null && _h !== void 0 ? _h : true,
                            auto_send_reminders: (_j = preferences.auto_send_reminders) !== null && _j !== void 0 ? _j : true,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };
                        return [4 /*yield*/, client
                                .from('notification_preferences')
                                .insert([defaultPreferences])
                                .select()
                                .single()];
                    case 5:
                        _b = _k.sent(), data = _b.data, error = _b.error;
                        if (error)
                            throw error;
                        console.log('✅ Notification preferences created successfully');
                        return [2 /*return*/, data];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _k.sent();
                        console.error('❌ Error saving notification preferences:', error_2);
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    // Send notification for booking status change
    sendBookingNotification: function (booking, notificationType, preferences) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications, restaurant, restaurantName, variables, emailTemplate, emailMessage, emailNotification, _a, emailNotif, emailError, smsTemplate, smsMessage, smsNotification, _b, smsNotif, smsError;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        notifications = [];
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('name')
                                .eq('id', booking.business_id)
                                .single()];
                    case 1:
                        restaurant = (_c.sent()).data;
                        restaurantName = (restaurant === null || restaurant === void 0 ? void 0 : restaurant.name) || 'Restaurant';
                        variables = {
                            restaurant_name: restaurantName,
                            customer_name: booking.customer_name,
                            date: new Date(booking.booking_date).toLocaleDateString(),
                            time: booking.booking_time,
                            party_size: booking.party_size.toString(),
                            confirmation_code: booking.confirmation_code || '',
                            cancellation_reason: booking.cancellation_reason || 'No reason provided'
                        };
                        if (!(preferences.email_enabled && booking.customer_email)) return [3 /*break*/, 3];
                        emailTemplate = preferences.email_templates[notificationType];
                        emailMessage = this.replaceTemplateVariables(emailTemplate, variables);
                        emailNotification = {
                            booking_id: booking.id,
                            notification_type: notificationType,
                            recipient_email: booking.customer_email,
                            subject: "Booking ".concat(notificationType.charAt(0).toUpperCase() + notificationType.slice(1), " - ").concat(restaurantName),
                            message: emailMessage,
                            channel: 'email',
                            status: 'pending'
                        };
                        return [4 /*yield*/, supabase
                                .from('booking_notifications')
                                .insert([emailNotification])
                                .select()
                                .single()];
                    case 2:
                        _a = _c.sent(), emailNotif = _a.data, emailError = _a.error;
                        if (!emailError) {
                            notifications.push(emailNotif);
                        }
                        _c.label = 3;
                    case 3:
                        if (!(preferences.sms_enabled && booking.customer_phone)) return [3 /*break*/, 5];
                        smsTemplate = preferences.sms_templates[notificationType];
                        smsMessage = this.replaceTemplateVariables(smsTemplate, variables);
                        smsNotification = {
                            booking_id: booking.id,
                            notification_type: notificationType,
                            recipient_phone: booking.customer_phone,
                            message: smsMessage,
                            channel: 'sms',
                            status: 'pending'
                        };
                        return [4 /*yield*/, supabase
                                .from('booking_notifications')
                                .insert([smsNotification])
                                .select()
                                .single()];
                    case 4:
                        _b = _c.sent(), smsNotif = _b.data, smsError = _b.error;
                        if (!smsError) {
                            notifications.push(smsNotif);
                        }
                        _c.label = 5;
                    case 5: return [2 /*return*/, notifications];
                }
            });
        });
    },
    // Replace template variables in message
    replaceTemplateVariables: function (template, variables) {
        var message = template;
        Object.entries(variables).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            message = message.replace(new RegExp("{{".concat(key, "}}"), 'g'), value);
        });
        return message;
    },
    // Get notification history for a booking
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
    // Get notification history for a business
    getBusinessNotifications: function (businessId_1) {
        return __awaiter(this, arguments, void 0, function (businessId, limit) {
            var _a, data, error;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('booking_notifications')
                            .select("\n        *,\n        bookings!inner(business_id)\n      ")
                            .eq('bookings.business_id', businessId)
                            .order('created_at', { ascending: false })
                            .limit(limit)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                }
            });
        });
    },
    // Test notification (for settings page)
    sendTestNotification: function (businessId, testEmail, testPhone, preferences) {
        return __awaiter(this, void 0, void 0, function () {
            var testBooking;
            return __generator(this, function (_a) {
                testBooking = {
                    id: 'test-booking',
                    business_id: businessId,
                    customer_name: 'Test Customer',
                    customer_email: testEmail,
                    customer_phone: testPhone,
                    party_size: 2,
                    booking_date: new Date().toISOString().split('T')[0],
                    booking_time: '19:00',
                    status: 'confirmed',
                    confirmation_code: 'TEST123',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                return [2 /*return*/, this.sendBookingNotification(testBooking, 'confirmation', preferences)];
            });
        });
    }
};
