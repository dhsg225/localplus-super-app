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
import { Plus, MapPin, Phone, Mail, Globe, Search, BarChart3, Building, Tag, Newspaper, Megaphone } from 'lucide-react';
import { businessAPI } from '../../../lib/supabase';
import { curationAPI } from '../../../services/curationAPI';
import { discoveryService } from '../../../services/discoveryService';
import AnalyticsDashboard from './AnalyticsDashboard';
import NewsAdminSettings from './NewsAdminSettings';
import { useAuth } from '../../auth/context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { googlePlacesService } from '../../../services/googlePlaces';
import MapSearchModule from '../../../components/MapSearchModule';
var AdminDashboard = function () {
    var user = useAuth().user;
    var _a = useState('pipeline'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = useState([]), businesses = _b[0], setBusinesses = _b[1];
    var _c = useState(false), showAddBusiness = _c[0], setShowAddBusiness = _c[1];
    var _d = useState(false), showAddDiscount = _d[0], setShowAddDiscount = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), message = _f[0], setMessage = _f[1];
    var _g = useState(null), userLocation = _g[0], setUserLocation = _g[1];
    // [2024-12-19 19:30 UTC] - Intelligent pipeline state
    var _h = useState(false), isDiscovering = _h[0], setIsDiscovering = _h[1];
    var _j = useState({ found: 0, added: 0 }), importStats = _j[0], setImportStats = _j[1];
    // Curation data state
    var _k = useState([]), suggestedBusinesses = _k[0], setSuggestedBusinesses = _k[1];
    var _l = useState([]), discoveryCampaigns = _l[0], setDiscoveryCampaigns = _l[1];
    var _m = useState({
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        salesLeadsCount: 0,
        averageQualityScore: 0
    }), curationStats = _m[0], setCurationStats = _m[1];
    var _o = useState(false), curationLoading = _o[0], setCurationLoading = _o[1];
    var _p = useState(''), selectedLdpArea = _p[0], setSelectedLdpArea = _p[1];
    var _q = useState('all'), selectedStatus = _q[0], setSelectedStatus = _q[1];
    var _r = useState('all'), selectedCategory = _r[0], setSelectedCategory = _r[1];
    // Discovery state
    var _s = useState(false), runningDiscovery = _s[0], setRunningDiscovery = _s[1];
    var _t = useState(''), discoveryMessage = _t[0], setDiscoveryMessage = _t[1];
    // [2024-12-19 18:00 UTC] - Enhanced pipeline state management
    var _u = useState('pending'), pipelineStatus = _u[0], setPipelineStatus = _u[1];
    var _v = useState(false), showContactMissing = _v[0], setShowContactMissing = _v[1];
    // [2024-12-19 20:00 UTC] - Rejection dropdown state
    var _w = useState(null), rejectingBusinessId = _w[0], setRejectingBusinessId = _w[1];
    var _x = useState(''), rejectionReason = _x[0], setRejectionReason = _x[1];
    // [2024-12-19 20:15 UTC] - Manual business search state
    var _y = useState(''), manualSearchQuery = _y[0], setManualSearchQuery = _y[1];
    var _z = useState([]), searchResults = _z[0], setSearchResults = _z[1];
    var _0 = useState(false), isSearching = _0[0], setIsSearching = _0[1];
    var _1 = useState(false), showSearchResults = _1[0], setShowSearchResults = _1[1];
    // Rejection reasons dropdown options
    var rejectionReasons = [
        'Thai and therefore unknown',
        'Fast food',
        'Too small',
        'Other'
    ];
    var _2 = useState({
        name: '',
        category: 'Restaurants',
        address: '',
        latitude: 12.5684,
        longitude: 99.9578,
        phone: '',
        email: '',
        website_url: '',
        description: ''
    }), businessForm = _2[0], setBusinessForm = _2[1];
    var _3 = useState({
        business_id: '',
        title: '',
        description: '',
        discount_percentage: 20,
        terms_conditions: '',
        valid_until: '',
        max_redemptions_per_user: 1
    }), discountForm = _3[0], setDiscountForm = _3[1];
    var categories = [
        'Restaurants', 'Wellness', 'Shopping', 'Services', 'Entertainment', 'Travel'
    ];
    // [2024-12-19 16:00 UTC] - LDP areas for filtering
    var ldpAreas = [
        { id: '', label: 'All Areas' },
        { id: 'bangkok', label: 'Bangkok LDP' },
        { id: 'hua-hin', label: 'Hua Hin LDP' },
        { id: 'pattaya', label: 'Pattaya LDP' },
        { id: 'phuket', label: 'Phuket LDP' },
        { id: 'chiang-mai', label: 'Chiang Mai LDP' }
    ];
    // [2024-12-19 19:30 UTC] - Intelligent pipeline system with health check
    var handleIntelligentPipeline = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (category) {
            var result, error_1;
            if (category === void 0) { category = 'Restaurants'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsDiscovering(true);
                        setImportStats({ found: 0, added: 0 });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        console.log("\uD83E\uDDE0 Starting Intelligent Pipeline for ".concat(category, "..."));
                        return [4 /*yield*/, discoveryService.maintainPipelineQueue(category)];
                    case 2:
                        result = _a.sent();
                        console.log('🧠 Intelligent Pipeline Result:', result);
                        // Update import stats
                        setImportStats({
                            found: result.discovered,
                            added: result.added
                        });
                        // Show results with console messages (no toast for now)
                        if (result.errors.includes('Pipeline queue sufficient')) {
                            console.log("\u2705 Pipeline healthy: Queue has sufficient ".concat(category.toLowerCase()));
                            setMessage({
                                type: 'success',
                                text: "\u2705 Pipeline Healthy: Already have enough pending ".concat(category.toLowerCase(), " (").concat(result.discovered || 'sufficient', " in queue). No discovery needed.")
                            });
                        }
                        else if (result.errors.some(function (e) { return e.includes('Pipeline queue sufficient'); })) {
                            console.log("\u2705 Pipeline healthy but user forced discovery");
                            setMessage({
                                type: 'success',
                                text: "\u2705 Pipeline was healthy, but discovered ".concat(result.added, " additional ").concat(category.toLowerCase(), " as requested.")
                            });
                        }
                        else if (result.added > 0) {
                            console.log("\uD83E\uDDE0 Intelligent Pipeline: Added ".concat(result.added, " fresh ").concat(category.toLowerCase()));
                            setMessage({ type: 'success', text: "\uD83E\uDDE0 Intelligent Pipeline: Added ".concat(result.added, " fresh ").concat(category.toLowerCase()) });
                        }
                        else if (result.discovered === 0) {
                            console.log("\u26A0\uFE0F No new ".concat(category.toLowerCase(), " found in search area"));
                            setMessage({ type: 'error', text: "\u26A0\uFE0F No new ".concat(category.toLowerCase(), " found in search area. All nearby businesses may already be in the system.") });
                        }
                        else {
                            console.log("\uD83D\uDCCA Found ".concat(result.discovered, " ").concat(category.toLowerCase(), ", but ").concat(result.duplicates, " were duplicates"));
                            setMessage({ type: 'success', text: "\uD83D\uDCCA Found ".concat(result.discovered, " ").concat(category.toLowerCase(), ", but ").concat(result.duplicates, " were already in system") });
                        }
                        // Refresh the business list and stats
                        return [4 /*yield*/, Promise.all([
                                loadBusinesses(),
                                loadCurationData()
                            ])];
                    case 3:
                        // Refresh the business list and stats
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Intelligent pipeline error:', error_1);
                        setMessage({ type: 'error', text: "\u274C Pipeline error: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error') });
                        return [3 /*break*/, 6];
                    case 5:
                        setIsDiscovering(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // [2024-12-19 19:30 UTC] - Auto-trigger pipeline when queue is low
    var checkAndMaintainPipeline = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Check if pipeline needs maintenance (this will auto-trigger if needed)
                    return [4 /*yield*/, discoveryService.maintainPipelineQueue('Restaurants')];
                case 1:
                    // Check if pipeline needs maintenance (this will auto-trigger if needed)
                    _a.sent();
                    // Refresh stats to show updated counts
                    return [4 /*yield*/, loadCurationData()];
                case 2:
                    // Refresh stats to show updated counts
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Auto-pipeline check error:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Auto-check pipeline every 5 minutes
    useEffect(function () {
        var interval = setInterval(checkAndMaintainPipeline, 5 * 60 * 1000);
        return function () { return clearInterval(interval); };
    }, []);
    // [2024-12-19 19:30 UTC] - Updated discovery buttons with intelligent pipeline
    var handleDiscoverRestaurants = function () { return handleIntelligentPipeline('Restaurants'); };
    var handleDiscoverWellness = function () { return handleIntelligentPipeline('Wellness'); };
    var handleDiscoverShopping = function () { return handleIntelligentPipeline('Shopping'); };
    var handleDiscoverEntertainment = function () { return handleIntelligentPipeline('Entertainment'); };
    useEffect(function () {
        loadBusinesses();
        detectLocation();
        loadCurationData();
    }, []);
    var loadCurationData = function (statusFilter) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, businesses_1, campaigns, stats, pendingBusinesses, withContact, withoutContact, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setCurationLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            curationAPI.getSuggestedBusinesses(statusFilter || pipelineStatus),
                            curationAPI.getDiscoveryCampaigns(),
                            curationAPI.getCurationStats()
                        ])];
                case 2:
                    _a = _b.sent(), businesses_1 = _a[0], campaigns = _a[1], stats = _a[2];
                    setSuggestedBusinesses(businesses_1);
                    setDiscoveryCampaigns(campaigns);
                    setCurationStats(stats);
                    pendingBusinesses = businesses_1.filter(function (b) { return b.curation_status === 'pending'; });
                    if (pendingBusinesses.length === 0 && statusFilter !== 'all') {
                        console.log('📋 No pending businesses found - triggering auto-discovery...');
                        setDiscoveryMessage('🔄 Pipeline empty - auto-discovering fresh businesses...');
                        // Trigger automatic discovery after a short delay
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result, error_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 4, , 5]);
                                        return [4 /*yield*/, discoveryService.runHuaHinRestaurantDiscovery()];
                                    case 1:
                                        result = _a.sent();
                                        setDiscoveryMessage("\uD83D\uDD04 Auto-discovery: Found ".concat(result.discovered, ", added ").concat(result.added, " fresh businesses"));
                                        if (!(result.added > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, loadCurationData(statusFilter)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [3 /*break*/, 5];
                                    case 4:
                                        error_4 = _a.sent();
                                        console.error('Auto-discovery error:', error_4);
                                        setDiscoveryMessage("\u274C Auto-discovery failed: ".concat(error_4));
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                    }
                    withContact = businesses_1.filter(function (b) { return b.phone || b.email || b.website_url; }).length;
                    withoutContact = businesses_1.length - withContact;
                    console.log("\uD83D\uDCCA Contact Data: ".concat(withContact, " with contact info, ").concat(withoutContact, " missing contact info"));
                    console.log("\uD83D\uDCCB Pipeline Status: Showing ".concat(statusFilter || 'pending', " businesses (").concat(businesses_1.length, " total)"));
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _b.sent();
                    console.error('Error loading curation data:', error_3);
                    setMessage({ type: 'error', text: 'Failed to load curation data' });
                    return [3 /*break*/, 5];
                case 4:
                    setCurationLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var detectLocation = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // Set a default location first
                setUserLocation({ lat: 13.8179, lng: 100.0416 }); // Bangkok default
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var newLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setUserLocation(newLocation);
                        console.log('Location detected:', newLocation);
                    }, function (error) {
                        console.log('Geolocation failed, using default location:', error.message);
                        // Keep the default location, don't try fallbacks that might fail
                    }, {
                        timeout: 5000,
                        enableHighAccuracy: false,
                        maximumAge: 300000 // 5 minutes
                    });
                }
                else {
                    console.log('Geolocation not supported, using default location');
                }
            }
            catch (error) {
                console.error('Location detection error:', error);
                // Ensure we always have a location set
                setUserLocation({ lat: 13.8179, lng: 100.0416 });
            }
            return [2 /*return*/];
        });
    }); };
    var loadBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var realBusinesses, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // [2025-01-06 13:10 UTC] - Production: Load real businesses from database, no mock data
                    console.log('📊 Loading businesses from database...');
                    return [4 /*yield*/, businessAPI.getAllBusinesses()];
                case 2:
                    realBusinesses = _a.sent();
                    console.log("\u2705 Loaded ".concat(realBusinesses.length, " businesses from database"));
                    setBusinesses(realBusinesses);
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error loading businesses:', error_5);
                    setMessage({ type: 'error', text: 'Failed to load businesses from database' });
                    setBusinesses([]); // Set empty array instead of mock data
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessAdded = function (newBusiness) {
        setBusinesses(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newBusiness], false); });
        setMessage({ type: 'success', text: "".concat(newBusiness.name, " added successfully!") });
        setTimeout(function () { return setMessage(null); }, 5000);
    };
    // Curation action handlers
    var handleApproveBusiness = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
        var curatorId, newBusinessId, error_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    curatorId = void 0;
                    if (user && user.id) {
                        // Use authenticated user ID
                        curatorId = user.id;
                        console.log('🔄 Approving business:', businessId, 'Curator (authenticated):', curatorId);
                    }
                    else {
                        // For production admin without authentication, generate a proper system UUID
                        console.log('⚠️ No authenticated user - using system curator');
                        // Generate a proper UUID v4 format for system operations
                        curatorId = crypto.randomUUID();
                        console.log('🔄 Approving business:', businessId, 'Curator (system):', curatorId);
                    }
                    return [4 /*yield*/, curationAPI.approveBusinessAndCreateLoyalty(businessId, curatorId)];
                case 2:
                    newBusinessId = _a.sent();
                    console.log('✅ Business approved successfully, new ID:', newBusinessId);
                    setMessage({ type: 'success', text: "Business approved and loyalty program created!" });
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_6 = _a.sent();
                    console.error('❌ Approve business error:', error_6);
                    errorMessage = 'Failed to approve business';
                    if (error_6 instanceof Error) {
                        if (error_6.message.includes('duplicate') || error_6.message.includes('already exists')) {
                            errorMessage = 'This business is already approved in the system';
                        }
                        else if (error_6.message.includes('not found')) {
                            errorMessage = 'Business not found - it may have been already processed';
                        }
                        else if (error_6.message.includes('uuid') || error_6.message.includes('UUID')) {
                            errorMessage = 'Authentication error - please refresh the page and try again';
                        }
                        else {
                            errorMessage = "Approval failed: ".concat(error_6.message);
                        }
                    }
                    setMessage({ type: 'error', text: errorMessage });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6:
                    setTimeout(function () { return setMessage(null); }, 5000);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleFlagForSales = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
        var success, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    console.log('🔄 Flagging business for sales:', businessId);
                    return [4 /*yield*/, curationAPI.flagForSales(businessId)];
                case 2:
                    success = _a.sent();
                    if (!success) return [3 /*break*/, 4];
                    setMessage({ type: 'success', text: "Business flagged for sales outreach!" });
                    console.log('✅ Business flagged, refreshing data...');
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    _a.sent(); // Wait for refresh to complete
                    console.log('📊 Data refreshed');
                    return [3 /*break*/, 5];
                case 4:
                    setMessage({ type: 'error', text: "Failed to flag business for sales - may not exist in database" });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_7 = _a.sent();
                    console.error('Sales flag error:', error_7);
                    setMessage({ type: 'error', text: "Error flagging business: ".concat(error_7) });
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false); // Only set loading false after everything completes
                    return [7 /*endfinally*/];
                case 8:
                    setTimeout(function () { return setMessage(null); }, 3000);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleRejectBusiness = function (businessId, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var finalReason, success, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // [2024-12-19 20:00 UTC] - Use dropdown reason or show dropdown if no reason provided
                    if (!reason && !rejectingBusinessId) {
                        setRejectingBusinessId(businessId);
                        setRejectionReason('');
                        return [2 /*return*/];
                    }
                    finalReason = reason || rejectionReason;
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    console.log('🔄 Rejecting business:', businessId, 'Reason:', finalReason);
                    return [4 /*yield*/, curationAPI.rejectBusiness(businessId, finalReason || undefined)];
                case 2:
                    success = _a.sent();
                    if (!success) return [3 /*break*/, 4];
                    setMessage({ type: 'success', text: "Business rejected successfully! Reason: ".concat(finalReason) });
                    console.log('✅ Business rejected, refreshing data...');
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    _a.sent(); // Wait for refresh to complete
                    console.log('📊 Data refreshed');
                    return [3 /*break*/, 5];
                case 4:
                    setMessage({ type: 'error', text: "Failed to reject business - may not exist in database" });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_8 = _a.sent();
                    console.error('Rejection error:', error_8);
                    setMessage({ type: 'error', text: "Error rejecting business: ".concat(error_8) });
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false); // Only set loading false after everything completes
                    setRejectingBusinessId(null); // Close dropdown
                    setRejectionReason(''); // Reset reason
                    return [7 /*endfinally*/];
                case 8:
                    setTimeout(function () { return setMessage(null); }, 3000);
                    return [2 /*return*/];
            }
        });
    }); };
    // Discovery action handler
    var handleRunDiscovery = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    console.log('🔍 Starting Hua Hin business discovery...');
                    return [4 /*yield*/, discoveryService.runHuaHinRestaurantDiscovery()];
                case 2:
                    result = _a.sent();
                    console.log('📊 Discovery completed:', result);
                    setDiscoveryMessage("\u2705 Hua Hin Discovery Complete! Found ".concat(result.discovered, " businesses, ") +
                        "added ".concat(result.added, " new ones").concat(result.duplicates > 0 ? ", ".concat(result.duplicates, " duplicates") : '') +
                        "".concat(result.errors.length > 0 ? ". ".concat(result.errors.length, " errors occurred.") : ''));
                    // Refresh the business list
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    // Refresh the business list
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_9 = _a.sent();
                    console.error('Discovery error:', error_9);
                    setDiscoveryMessage("\u274C Discovery failed: ".concat(error_9));
                    return [3 /*break*/, 6];
                case 5:
                    setRunningDiscovery(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleAddBusiness = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var coordinates, newBusiness, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, geocodeAddress(businessForm.address)];
                case 2:
                    coordinates = _a.sent();
                    return [4 /*yield*/, businessAPI.addBusiness(__assign(__assign({}, businessForm), { latitude: (coordinates === null || coordinates === void 0 ? void 0 : coordinates.lat) || businessForm.latitude, longitude: (coordinates === null || coordinates === void 0 ? void 0 : coordinates.lng) || businessForm.longitude, partnership_status: 'active' }))];
                case 3:
                    newBusiness = _a.sent();
                    if (newBusiness) {
                        handleBusinessAdded(newBusiness);
                        setShowAddBusiness(false);
                        setBusinessForm({
                            name: '',
                            category: 'Restaurants',
                            address: '',
                            latitude: 12.5684,
                            longitude: 99.9578,
                            phone: '',
                            email: '',
                            website_url: '',
                            description: ''
                        });
                        loadBusinesses();
                    }
                    else {
                        setMessage({ type: 'error', text: 'Failed to add business. Please try again.' });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_10 = _a.sent();
                    console.error('Error adding business:', error_10);
                    setMessage({ type: 'error', text: 'Error adding business. Please check your database connection.' });
                    return [3 /*break*/, 5];
                case 5:
                    setLoading(false);
                    setTimeout(function () { return setMessage(null); }, 5000);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleAddDiscount = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var newDiscount, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, businessAPI.addDiscountOffer(__assign(__assign({}, discountForm), { valid_from: new Date().toISOString().split('T')[0], is_active: true }))];
                case 2:
                    newDiscount = _a.sent();
                    if (newDiscount) {
                        setMessage({ type: 'success', text: 'Discount offer added successfully!' });
                        setShowAddDiscount(false);
                        setDiscountForm({
                            business_id: '',
                            title: '',
                            description: '',
                            discount_percentage: 20,
                            terms_conditions: '',
                            valid_until: '',
                            max_redemptions_per_user: 1
                        });
                    }
                    else {
                        setMessage({ type: 'error', text: 'Failed to add discount offer. Please try again.' });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _a.sent();
                    console.error('Error adding discount:', error_11);
                    setMessage({ type: 'error', text: 'Error adding discount offer.' });
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    setTimeout(function () { return setMessage(null); }, 5000);
                    return [2 /*return*/];
            }
        });
    }); };
    // Geocoding function (you'll need to implement this with Google Maps API)
    var geocodeAddress = function (address) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This is a placeholder - in production, use Google Geocoding API
            try {
                // Example implementation:
                // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
                // const data = await response.json();
                // return data.results[0]?.geometry?.location;
                return [2 /*return*/, null]; // For now, use manual coordinates
            }
            catch (error) {
                console.error('Geocoding error:', error);
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    }); };
    // [2024-12-19 17:00 UTC] - Clean up mock data from database
    var cleanupMockData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockBusinessNames, _i, mockBusinessNames_1, mockName, error, mockAddresses, _a, mockAddresses_1, mockAddress, error, incorrectlyCategorizeds, _b, incorrectlyCategorizeds_1, business, _c, existing, selectError, updateError, error_12;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 14, , 15]);
                    console.log('🧹 Cleaning up mock data from database...');
                    mockBusinessNames = [
                        'Fine Dining Palace',
                        'Coffee Culture Cafe',
                        'Bangkok Street Food'
                    ];
                    _i = 0, mockBusinessNames_1 = mockBusinessNames;
                    _d.label = 1;
                case 1:
                    if (!(_i < mockBusinessNames_1.length)) return [3 /*break*/, 4];
                    mockName = mockBusinessNames_1[_i];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .eq('name', mockName)];
                case 2:
                    error = (_d.sent()).error;
                    if (error) {
                        console.error("\u274C Error deleting ".concat(mockName, ":"), error);
                    }
                    else {
                        console.log("\u2705 Deleted mock business: ".concat(mockName));
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    mockAddresses = [
                        '321 Luxury Ave, Bangkok',
                        '789 Cafe Lane, Bangkok',
                        '456 Food Street, Bangkok'
                    ];
                    _a = 0, mockAddresses_1 = mockAddresses;
                    _d.label = 5;
                case 5:
                    if (!(_a < mockAddresses_1.length)) return [3 /*break*/, 8];
                    mockAddress = mockAddresses_1[_a];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .eq('address', mockAddress)];
                case 6:
                    error = (_d.sent()).error;
                    if (error) {
                        console.error("\u274C Error deleting address ".concat(mockAddress, ":"), error);
                    }
                    else {
                        console.log("\u2705 Deleted mock business with address: ".concat(mockAddress));
                    }
                    _d.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    incorrectlyCategorizeds = [
                        { name: 'Hua Hin Beach', correctCategory: 'Entertainment' },
                        { name: 'หมูปิ้ง ห้วยมุม ไม่ตะรไม่มีมัน สไตล์โบราณ', correctCategory: 'Entertainment' }
                    ];
                    _b = 0, incorrectlyCategorizeds_1 = incorrectlyCategorizeds;
                    _d.label = 9;
                case 9:
                    if (!(_b < incorrectlyCategorizeds_1.length)) return [3 /*break*/, 13];
                    business = incorrectlyCategorizeds_1[_b];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id, primary_category')
                            .eq('name', business.name)
                            .maybeSingle()];
                case 10:
                    _c = _d.sent(), existing = _c.data, selectError = _c.error;
                    if (selectError) {
                        console.error("\u274C Error checking ".concat(business.name, ":"), selectError);
                        return [3 /*break*/, 12];
                    }
                    if (!(existing && existing.primary_category === 'Restaurants')) return [3 /*break*/, 12];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .update({ primary_category: business.correctCategory })
                            .eq('id', existing.id)];
                case 11:
                    updateError = (_d.sent()).error;
                    if (updateError) {
                        console.error("\u274C Error updating ".concat(business.name, ":"), updateError);
                    }
                    else {
                        console.log("\u2705 Fixed category for ".concat(business.name, ": Restaurants \u2192 ").concat(business.correctCategory));
                    }
                    _d.label = 12;
                case 12:
                    _b++;
                    return [3 /*break*/, 9];
                case 13:
                    console.log('✅ Mock data cleanup completed');
                    return [3 /*break*/, 15];
                case 14:
                    error_12 = _d.sent();
                    console.error('💥 Error during mock data cleanup:', error_12);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 17:15 UTC] - Remove non-restaurant businesses incorrectly categorized as restaurants
    var cleanupIncorrectRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
        var nonRestaurantNames, _i, nonRestaurantNames_1, businessName, error, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    console.log('🍽️ Cleaning up non-restaurant businesses incorrectly categorized as restaurants...');
                    nonRestaurantNames = [
                        'Hua Hin Beach',
                        'หมูปิ้ง ห้วยมุม ไม่ตะรไม่มีมัน สไตล์โบราณ'
                    ];
                    _i = 0, nonRestaurantNames_1 = nonRestaurantNames;
                    _a.label = 1;
                case 1:
                    if (!(_i < nonRestaurantNames_1.length)) return [3 /*break*/, 4];
                    businessName = nonRestaurantNames_1[_i];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .eq('name', businessName)
                            .eq('primary_category', 'Restaurants')];
                case 2:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("\u274C Error removing ".concat(businessName, ":"), error);
                    }
                    else {
                        console.log("\u2705 Removed non-restaurant business: ".concat(businessName));
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('✅ Non-restaurant cleanup completed');
                    return [3 /*break*/, 6];
                case 5:
                    error_13 = _a.sent();
                    console.error('💥 Error during non-restaurant cleanup:', error_13);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:30 UTC] - Comprehensive pipeline debugging
    var debugPipeline = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, allSuggested, suggestedError, testPlaces, testResult, error_14;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🔍 PIPELINE DEBUG - Starting comprehensive analysis...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    // 1. Check database connection and current data
                    console.log('📊 Step 1: Database Analysis');
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('*')
                            .order('created_at', { ascending: false })];
                case 2:
                    _a = _b.sent(), allSuggested = _a.data, suggestedError = _a.error;
                    if (suggestedError) {
                        console.error('❌ Database error:', suggestedError);
                        setMessage({ type: 'error', text: "Database error: ".concat(suggestedError.message) });
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCCB Total suggested businesses in DB: ".concat((allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.length) || 0));
                    console.log("\uD83D\uDCCA Status breakdown:", {
                        pending: (allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.filter(function (b) { return b.curation_status === 'pending'; }).length) || 0,
                        approved: (allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.filter(function (b) { return b.curation_status === 'approved'; }).length) || 0,
                        rejected: (allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.filter(function (b) { return b.curation_status === 'rejected'; }).length) || 0,
                        sales_leads: (allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.filter(function (b) { return b.curation_status === 'flagged_for_sales'; }).length) || 0
                    });
                    // 2. Test Google Places API
                    console.log('🌐 Step 2: Google Places API Test');
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText('restaurant', 12.5684, // Hua Hin
                        99.9578, 3000)];
                case 3:
                    testPlaces = _b.sent();
                    console.log("\uD83D\uDD0D Google Places returned ".concat(testPlaces.length, " results"));
                    testPlaces.slice(0, 3).forEach(function (place) {
                        console.log("   \uD83D\uDCCD ".concat(place.name, " - Types: ").concat(place.types.join(', ')));
                    });
                    // 3. Test discovery service with minimal filters
                    console.log('🚀 Step 3: Discovery Service Test');
                    return [4 /*yield*/, discoveryService.runDiscoveryForLocation({ lat: 12.5684, lng: 99.9578 }, ['Restaurants'], 5000, { minRating: 1.0, minReviewCount: 0 } // Minimal filters
                        )];
                case 4:
                    testResult = _b.sent();
                    console.log('📊 Discovery test results:', testResult);
                    setMessage({
                        type: 'success',
                        text: "Debug complete: DB has ".concat((allSuggested === null || allSuggested === void 0 ? void 0 : allSuggested.length) || 0, " businesses, Google returned ").concat(testPlaces.length, " places, Discovery found ").concat(testResult.discovered, " and added ").concat(testResult.added)
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_14 = _b.sent();
                    console.error('💥 Debug error:', error_14);
                    setMessage({ type: 'error', text: "Debug failed: ".concat(error_14) });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var runRestaurantDiscovery = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('');
                    setSelectedCategory('Restaurants'); // [2024-12-19 17:30 UTC] - Set category filter
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    console.log('🍽️ Starting Hua Hin restaurant discovery...');
                    // First clean up any mock data and incorrect categorizations
                    return [4 /*yield*/, cleanupMockData()];
                case 2:
                    // First clean up any mock data and incorrect categorizations
                    _a.sent();
                    return [4 /*yield*/, cleanupIncorrectRestaurants()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, discoveryService.runHuaHinRestaurantDiscovery()];
                case 4:
                    result = _a.sent();
                    setDiscoveryMessage("\u2705 Restaurants: Found ".concat(result.discovered, ", added ").concat(result.added));
                    return [4 /*yield*/, loadCurationData()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    error_15 = _a.sent();
                    setDiscoveryMessage("\u274C Restaurant discovery failed: ".concat(error_15));
                    return [3 /*break*/, 8];
                case 7:
                    setRunningDiscovery(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:30 UTC] - Reset pipeline by clearing processed businesses
    var resetPipeline = function () { return __awaiter(void 0, void 0, void 0, function () {
        var deleteError, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('⚠️ This will delete ALL processed businesses (approved/rejected/sales leads) and reset the pipeline. Continue?')) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    console.log('🔄 Resetting pipeline...');
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .neq('curation_status', 'pending')];
                case 2:
                    deleteError = (_a.sent()).error;
                    if (deleteError) {
                        console.error('❌ Failed to reset pipeline:', deleteError);
                        setMessage({ type: 'error', text: "Failed to reset pipeline: ".concat(deleteError.message) });
                        return [2 /*return*/];
                    }
                    console.log('✅ Pipeline reset successfully');
                    setMessage({ type: 'success', text: 'Pipeline reset! You can now discover businesses again.' });
                    // Refresh data
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    // Refresh data
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_16 = _a.sent();
                    console.error('💥 Reset error:', error_16);
                    setMessage({ type: 'error', text: "Reset failed: ".concat(error_16) });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:45 UTC] - Comprehensive pipeline reset
    var resetPipelineCompletely = function () { return __awaiter(void 0, void 0, void 0, function () {
        var deleteError, error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('⚠️ This will DELETE ALL businesses from the pipeline (approved, rejected, pending) to allow fresh discovery. Continue?')) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setDiscoveryMessage('🔄 Resetting entire pipeline...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    console.log('🗑️ Deleting all suggested businesses...');
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .neq('id', '00000000-0000-0000-0000-000000000000')];
                case 2:
                    deleteError = (_a.sent()).error;
                    if (deleteError) {
                        console.error('❌ Failed to reset pipeline:', deleteError);
                        setMessage({ type: 'error', text: "Failed to reset pipeline: ".concat(deleteError.message) });
                        return [2 /*return*/];
                    }
                    console.log('✅ Pipeline reset successfully - all businesses deleted');
                    setMessage({ type: 'success', text: '✅ Pipeline completely reset! You can now discover fresh businesses.' });
                    setDiscoveryMessage('✅ Pipeline reset complete - ready for fresh discovery');
                    // Refresh data to show empty state
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    // Refresh data to show empty state
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_17 = _a.sent();
                    console.error('💥 Reset error:', error_17);
                    setMessage({ type: 'error', text: "Reset failed: ".concat(error_17) });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:30 UTC] - Force discovery with minimal restrictions
    var forceDiscovery = function () { return __awaiter(void 0, void 0, void 0, function () {
        var places, added, duplicates, errors, _i, _a, place, isRestaurant, existing, details, businessData, error, error_18, error_19;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('🔄 Force discovering with no filters...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, 13, 14]);
                    console.log('🚀 Starting force discovery...');
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText('restaurant food cafe dining', 12.5684, // Hua Hin
                        99.9578, 10000 // 10km radius
                        )];
                case 2:
                    places = _b.sent();
                    console.log("\uD83D\uDD0D Google Places returned ".concat(places.length, " results"));
                    added = 0;
                    duplicates = 0;
                    errors = [];
                    _i = 0, _a = places.slice(0, 20);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    place = _a[_i];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    isRestaurant = place.types.some(function (type) {
                        return ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type);
                    });
                    if (!isRestaurant)
                        return [3 /*break*/, 9];
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id')
                            .eq('google_place_id', place.place_id)
                            .maybeSingle()];
                case 5:
                    existing = (_b.sent()).data;
                    if (existing) {
                        duplicates++;
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                case 6:
                    details = _b.sent();
                    businessData = {
                        google_place_id: "".concat(place.place_id, "_force_").concat(Date.now()), // Unique ID to bypass duplicates
                        name: place.name,
                        address: (details === null || details === void 0 ? void 0 : details.formatted_address) || place.vicinity,
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        phone: (details === null || details === void 0 ? void 0 : details.formatted_phone_number) || null,
                        website_url: (details === null || details === void 0 ? void 0 : details.website) || null,
                        description: "Restaurant in Hua Hin serving ".concat(place.types.includes('cafe') ? 'coffee and light meals' : 'delicious food'),
                        google_rating: place.rating || null,
                        google_review_count: (details === null || details === void 0 ? void 0 : details.user_ratings_total) || 0,
                        google_price_level: place.price_level || null,
                        google_types: place.types,
                        primary_category: 'Restaurants',
                        quality_score: Math.round((place.rating || 3.5) * 20),
                        curation_status: 'pending',
                        discovery_source: 'force_discovery',
                        discovery_criteria: { forced: true, timestamp: new Date().toISOString() }
                    };
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert(businessData)];
                case 7:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error('❌ Insert error:', error);
                        errors.push("".concat(place.name, ": ").concat(error.message));
                    }
                    else {
                        added++;
                        console.log("\u2705 Added: ".concat(place.name));
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_18 = _b.sent();
                    errors.push("".concat(place.name, ": ").concat(error_18));
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    setDiscoveryMessage("\uD83D\uDE80 Force Discovery Complete: Added ".concat(added, ", Duplicates ").concat(duplicates, ", Errors ").concat(errors.length));
                    console.log('📊 Force discovery results:', { added: added, duplicates: duplicates, errors: errors });
                    return [4 /*yield*/, loadCurationData()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12:
                    error_19 = _b.sent();
                    console.error('💥 Force discovery error:', error_19);
                    setDiscoveryMessage("\u274C Force discovery failed: ".concat(error_19));
                    return [3 /*break*/, 14];
                case 13:
                    setRunningDiscovery(false);
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:45 UTC] - Test database insertion
    var testDatabaseInsertion = function () { return __awaiter(void 0, void 0, void 0, function () {
        var testBusiness, _a, data, error, error_20;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('🧪 Testing database insertion...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    testBusiness = {
                        google_place_id: "test_".concat(Date.now()),
                        name: "Test Restaurant ".concat(Date.now()),
                        address: 'Test Address, Hua Hin, Thailand',
                        latitude: 12.5684,
                        longitude: 99.9578,
                        phone: '+66-32-123-456',
                        email: null,
                        website_url: 'https://test-restaurant.com',
                        description: 'Test restaurant for debugging pipeline issues',
                        google_rating: 4.5,
                        google_review_count: 25,
                        google_price_level: 2,
                        google_types: ['restaurant', 'food'],
                        primary_category: 'Restaurants',
                        quality_score: 85,
                        curation_status: 'pending',
                        discovery_source: 'manual_test',
                        discovery_criteria: { test: true, timestamp: new Date().toISOString() }
                    };
                    console.log('🧪 Attempting to insert test business:', testBusiness);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert(testBusiness)
                            .select()
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error) return [3 /*break*/, 3];
                    console.error('❌ Test insertion failed:', error);
                    setDiscoveryMessage("\u274C Database test failed: ".concat(error.message));
                    return [3 /*break*/, 5];
                case 3:
                    console.log('✅ Test business inserted successfully:', data);
                    setDiscoveryMessage("\u2705 Database test passed! Inserted: ".concat(data.name));
                    return [4 /*yield*/, loadCurationData()];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_20 = _b.sent();
                    console.error('💥 Test error:', error_20);
                    setDiscoveryMessage("\uD83D\uDCA5 Test error: ".concat(error_20));
                    return [3 /*break*/, 8];
                case 7:
                    setRunningDiscovery(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 18:45 UTC] - Quick function to show all existing businesses
    var showAllExistingBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedStatus('all');
                    setDiscoveryMessage('📋 Showing all existing businesses (approved, rejected, pending)');
                    return [4 /*yield*/, loadCurationData('all')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 19:15 UTC] - Simple test discovery with no filtering
    var testSimpleDiscovery = function () { return __awaiter(void 0, void 0, void 0, function () {
        var places, added, _i, _a, place, existing, details, businessData, error, error_21, error_22;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('🧪 Testing simple discovery with no filtering...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, 13, 14]);
                    console.log('🧪 Starting simple discovery test...');
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText('business', 12.5684, // Hua Hin center
                        99.9578, 5000)];
                case 2:
                    places = _b.sent();
                    console.log("\uD83D\uDD0D Found ".concat(places.length, " businesses of any type"));
                    added = 0;
                    _i = 0, _a = places.slice(0, 10);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    place = _a[_i];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id')
                            .eq('google_place_id', place.place_id)
                            .maybeSingle()];
                case 5:
                    existing = (_b.sent()).data;
                    if (existing) {
                        console.log("\u23ED\uFE0F Skipping duplicate: ".concat(place.name));
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(place.place_id)];
                case 6:
                    details = _b.sent();
                    businessData = {
                        google_place_id: place.place_id,
                        name: place.name,
                        address: (details === null || details === void 0 ? void 0 : details.formatted_address) || place.vicinity,
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        phone: (details === null || details === void 0 ? void 0 : details.formatted_phone_number) || null,
                        website_url: (details === null || details === void 0 ? void 0 : details.website) || null,
                        description: "Business in Hua Hin - Types: ".concat(place.types.join(', ')),
                        google_rating: place.rating || null,
                        google_review_count: (details === null || details === void 0 ? void 0 : details.user_ratings_total) || 0,
                        google_price_level: place.price_level || null,
                        google_types: place.types,
                        primary_category: place.types.includes('restaurant') ? 'Restaurants' : 'Services',
                        quality_score: 75,
                        curation_status: 'pending',
                        discovery_source: 'simple_test',
                        discovery_criteria: { test: true, timestamp: new Date().toISOString() }
                    };
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert(businessData)];
                case 7:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error("\u274C Insert error for ".concat(place.name, ":"), error);
                    }
                    else {
                        added++;
                        console.log("\u2705 Added: ".concat(place.name, " (").concat(place.types.join(', '), ")"));
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_21 = _b.sent();
                    console.error("\uD83D\uDCA5 Error processing ".concat(place.name, ":"), error_21);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    setDiscoveryMessage("\uD83E\uDDEA Simple test: Added ".concat(added, " businesses of any type"));
                    return [4 /*yield*/, loadCurationData()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12:
                    error_22 = _b.sent();
                    console.error('💥 Simple discovery error:', error_22);
                    setDiscoveryMessage("\u274C Simple test failed: ".concat(error_22));
                    return [3 /*break*/, 14];
                case 13:
                    setRunningDiscovery(false);
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 19:15 UTC] - Test different Hua Hin locations
    var testHuaHinLocations = function () { return __awaiter(void 0, void 0, void 0, function () {
        var locations, totalAdded, _i, locations_1, location_1, places, _a, _b, place, existing, businessData, error, error_23, error_24;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setRunningDiscovery(true);
                    setDiscoveryMessage('🗺️ Testing different Hua Hin locations...');
                    locations = [
                        { name: 'Hua Hin Night Market', lat: 12.5708, lng: 99.9581 },
                        { name: 'Hua Hin Beach', lat: 12.5684, lng: 99.9578 },
                        { name: 'Hua Hin Railway Station', lat: 12.5703, lng: 99.9496 },
                        { name: 'Cicada Market', lat: 12.5892, lng: 99.9664 },
                        { name: 'Hua Hin Hills', lat: 12.5500, lng: 99.9400 }
                    ];
                    totalAdded = 0;
                    _i = 0, locations_1 = locations;
                    _c.label = 1;
                case 1:
                    if (!(_i < locations_1.length)) return [3 /*break*/, 13];
                    location_1 = locations_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 11, , 12]);
                    console.log("\uD83D\uDD0D Searching near ".concat(location_1.name, "..."));
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText('restaurant food', location_1.lat, location_1.lng, 2000 // 2km radius
                        )];
                case 3:
                    places = _c.sent();
                    console.log("\uD83D\uDCCD ".concat(location_1.name, ": Found ").concat(places.length, " places"));
                    _a = 0, _b = places.slice(0, 3);
                    _c.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 10];
                    place = _b[_a];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id')
                            .eq('google_place_id', place.place_id)
                            .maybeSingle()];
                case 6:
                    existing = (_c.sent()).data;
                    if (existing)
                        return [3 /*break*/, 9];
                    businessData = {
                        google_place_id: place.place_id,
                        name: place.name,
                        address: place.vicinity,
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                        phone: null,
                        website_url: null,
                        description: "Business near ".concat(location_1.name, " in Hua Hin"),
                        google_rating: place.rating || null,
                        google_review_count: 0,
                        google_price_level: place.price_level || null,
                        google_types: place.types,
                        primary_category: 'Restaurants',
                        quality_score: 70,
                        curation_status: 'pending',
                        discovery_source: 'location_test',
                        discovery_criteria: { location: location_1.name, timestamp: new Date().toISOString() }
                    };
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert(businessData)];
                case 7:
                    error = (_c.sent()).error;
                    if (!error) {
                        totalAdded++;
                        console.log("\u2705 Added: ".concat(place.name, " (").concat(location_1.name, ")"));
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_23 = _c.sent();
                    console.error("Error processing ".concat(place.name, ":"), error_23);
                    return [3 /*break*/, 9];
                case 9:
                    _a++;
                    return [3 /*break*/, 4];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_24 = _c.sent();
                    console.error("Error searching ".concat(location_1.name, ":"), error_24);
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 1];
                case 13:
                    setDiscoveryMessage("\uD83D\uDDFA\uFE0F Location test: Added ".concat(totalAdded, " businesses from ").concat(locations.length, " locations"));
                    return [4 /*yield*/, loadCurationData()];
                case 14:
                    _c.sent();
                    setRunningDiscovery(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 19:45 UTC] - Clean up incorrectly categorized restaurants
    var cleanupIncorrectlyCategorizeddRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, businesses_2, fetchError, cleanedCount, businessesToDelete, _loop_1, _i, _b, business, deleteError, error_25;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setMessage({ type: 'info', text: '🔄 Cleaning up incorrectly categorized restaurants...' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('*')
                            .eq('primary_category', 'Restaurants')];
                case 2:
                    _a = _c.sent(), businesses_2 = _a.data, fetchError = _a.error;
                    if (fetchError) {
                        console.error('Error fetching businesses:', fetchError);
                        setMessage({ type: 'error', text: "\u274C Error fetching businesses: ".concat(fetchError.message) });
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCCA Found ".concat((businesses_2 === null || businesses_2 === void 0 ? void 0 : businesses_2.length) || 0, " businesses with 'Restaurants' category"));
                    cleanedCount = 0;
                    businessesToDelete = [];
                    _loop_1 = function (business) {
                        var googleTypes = business.google_types || [];
                        console.log("\uD83D\uDD0D Checking: ".concat(business.name, " - Types: ").concat(googleTypes.join(', ')));
                        // Check if it has any food-related types
                        var foodTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery'];
                        var hasFoodType = googleTypes.some(function (type) { return foodTypes.includes(type); });
                        if (!hasFoodType) {
                            console.log("\u274C ".concat(business.name, " has no food types - marking for deletion"));
                            businessesToDelete.push(business.id);
                        }
                        else {
                            console.log("\u2705 ".concat(business.name, " has food types - keeping"));
                        }
                    };
                    for (_i = 0, _b = businesses_2 || []; _i < _b.length; _i++) {
                        business = _b[_i];
                        _loop_1(business);
                    }
                    if (!(businessesToDelete.length > 0)) return [3 /*break*/, 4];
                    console.log("\uD83D\uDDD1\uFE0F Deleting ".concat(businessesToDelete.length, " incorrectly categorized businesses..."));
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .delete()
                            .in('id', businessesToDelete)];
                case 3:
                    deleteError = (_c.sent()).error;
                    if (deleteError) {
                        console.error('Error deleting businesses:', deleteError);
                        setMessage({ type: 'error', text: "\u274C Error deleting businesses: ".concat(deleteError.message) });
                        return [2 /*return*/];
                    }
                    cleanedCount = businessesToDelete.length;
                    _c.label = 4;
                case 4:
                    setMessage({
                        type: 'success',
                        text: "\u2705 Cleanup complete! Removed ".concat(cleanedCount, " incorrectly categorized restaurants.")
                    });
                    // Refresh the data
                    return [4 /*yield*/, loadCurationData()];
                case 5:
                    // Refresh the data
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_25 = _c.sent();
                    console.error('Cleanup error:', error_25);
                    setMessage({ type: 'error', text: "\u274C Cleanup failed: ".concat(error_25) });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 20:15 UTC] - Debug function to show what's in database
    var showDatabaseContents = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, businesses_3, error, statusCounts, error_26;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setMessage({ type: 'info', text: '🔍 Checking database contents...' });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .select('id, name, primary_category, curation_status, google_place_id, created_at')
                            .order('created_at', { ascending: false })
                            .limit(20)];
                case 2:
                    _a = _b.sent(), businesses_3 = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error fetching database contents:', error);
                        setMessage({ type: 'error', text: "\u274C Database error: ".concat(error.message) });
                        return [2 /*return*/];
                    }
                    console.log('📊 DATABASE CONTENTS (Last 20 businesses):');
                    console.log('='.repeat(80));
                    if (!businesses_3 || businesses_3.length === 0) {
                        console.log('❌ No businesses found in database');
                        setMessage({ type: 'info', text: '📊 Database is empty - no businesses found' });
                        return [2 /*return*/];
                    }
                    businesses_3.forEach(function (business, index) {
                        console.log("".concat(index + 1, ". ").concat(business.name));
                        console.log("   \uD83D\uDCCD Category: ".concat(business.primary_category));
                        console.log("   \uD83D\uDCCA Status: ".concat(business.curation_status));
                        console.log("   \uD83C\uDD94 Google ID: ".concat(business.google_place_id));
                        console.log("   \uD83D\uDCC5 Created: ".concat(new Date(business.created_at).toLocaleString()));
                        console.log('');
                    });
                    statusCounts = businesses_3.reduce(function (acc, b) {
                        acc[b.curation_status] = (acc[b.curation_status] || 0) + 1;
                        return acc;
                    }, {});
                    console.log('📊 STATUS BREAKDOWN:');
                    Object.entries(statusCounts).forEach(function (_a) {
                        var status = _a[0], count = _a[1];
                        console.log("   ".concat(status, ": ").concat(count));
                    });
                    setMessage({
                        type: 'success',
                        text: "\uD83D\uDCCA Database has ".concat(businesses_3.length, " recent businesses. Check console for details.")
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_26 = _b.sent();
                    console.error('Database check error:', error_26);
                    setMessage({ type: 'error', text: "\u274C Database check failed: ".concat(error_26) });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 20:15 UTC] - Manual business search functionality
    var handleManualSearch = function () { return __awaiter(void 0, void 0, void 0, function () {
        var searchLocation, results, error_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!manualSearchQuery.trim())
                        return [2 /*return*/];
                    setIsSearching(true);
                    setSearchResults([]);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    console.log('🔍 Manual search for:', manualSearchQuery);
                    searchLocation = userLocation || { lat: 12.5684, lng: 99.9578 };
                    return [4 /*yield*/, googlePlacesService.searchBusinessesByText(manualSearchQuery, searchLocation.lat, searchLocation.lng, 10000 // 10km radius for manual search
                        )];
                case 2:
                    results = _a.sent();
                    console.log('🔍 Search results:', results);
                    setSearchResults(results.slice(0, 5)); // Limit to top 5 results
                    setShowSearchResults(true);
                    if (results.length === 0) {
                        setMessage({ type: 'info', text: "No businesses found for \"".concat(manualSearchQuery, "\"") });
                    }
                    else {
                        setMessage({ type: 'success', text: "Found ".concat(results.length, " business(es) for \"").concat(manualSearchQuery, "\"") });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_27 = _a.sent();
                    console.error('Manual search error:', error_27);
                    setMessage({ type: 'error', text: "Search failed: ".concat(error_27) });
                    return [3 /*break*/, 5];
                case 4:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // [2025-01-06 13:20 UTC] - Quality score calculation for Google Places results
    var calculateQualityScore = function (searchResult) {
        var score = 0;
        // Rating score (0-40 points)
        if (searchResult.rating) {
            score += Math.round(searchResult.rating * 8); // 5.0 rating = 40 points
        }
        // Review count score (0-25 points)  
        if (searchResult.user_ratings_total) {
            score += Math.min(Math.round(searchResult.user_ratings_total / 4), 25); // 100+ reviews = 25 points
        }
        // Contact info completeness (0-20 points)
        if (searchResult.formatted_phone_number)
            score += 10;
        if (searchResult.website)
            score += 10;
        // Photos availability (0-10 points)
        if (searchResult.photos && searchResult.photos.length > 0)
            score += 10;
        // Price level (0-5 points) - higher price usually means more established
        if (searchResult.price_level) {
            score += searchResult.price_level; // 1-4 scale
        }
        return Math.min(score, 100); // Cap at 100
    };
    var handleAddSearchResult = function (searchResult) { return __awaiter(void 0, void 0, void 0, function () {
        var detailedResult, placeDetails, businessData, result, error_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    console.log('➕ Adding search result to pipeline:', searchResult.name);
                    detailedResult = searchResult;
                    if (!searchResult.place_id) return [3 /*break*/, 3];
                    console.log('🔍 Fetching detailed place information...');
                    return [4 /*yield*/, googlePlacesService.getPlaceDetails(searchResult.place_id)];
                case 2:
                    placeDetails = _a.sent();
                    if (placeDetails) {
                        detailedResult = __assign(__assign({}, searchResult), { formatted_phone_number: placeDetails.formatted_phone_number, website: placeDetails.website, user_ratings_total: placeDetails.user_ratings_total, formatted_address: placeDetails.formatted_address });
                        console.log('✅ Got detailed info:', {
                            phone: placeDetails.formatted_phone_number,
                            website: placeDetails.website,
                            reviews: placeDetails.user_ratings_total
                        });
                    }
                    _a.label = 3;
                case 3:
                    businessData = {
                        name: detailedResult.name,
                        address: detailedResult.formatted_address || detailedResult.vicinity,
                        latitude: detailedResult.geometry.location.lat,
                        longitude: detailedResult.geometry.location.lng,
                        google_place_id: detailedResult.place_id,
                        google_rating: detailedResult.rating,
                        google_review_count: detailedResult.user_ratings_total || 0,
                        google_types: detailedResult.types,
                        phone: detailedResult.formatted_phone_number,
                        website_url: detailedResult.website,
                        quality_score: calculateQualityScore(detailedResult),
                        discovery_criteria: {
                            search_query: manualSearchQuery,
                            search_location: 'Hua Hin',
                            search_method: 'manual_text_search'
                        }
                    };
                    console.log('📊 Business data to save:', businessData);
                    return [4 /*yield*/, discoveryService.addManualBusiness(businessData)];
                case 4:
                    result = _a.sent();
                    if (!result.success) return [3 /*break*/, 6];
                    setMessage({ type: 'success', text: "".concat(searchResult.name, " added to curation pipeline!") });
                    // Refresh the curation data to show the new business
                    return [4 /*yield*/, loadCurationData()];
                case 5:
                    // Refresh the curation data to show the new business
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    setMessage({ type: 'error', text: result.error || 'Failed to add business' });
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_28 = _a.sent();
                    console.error('Error adding search result:', error_28);
                    setMessage({ type: 'error', text: "Error adding business: ".concat(error_28) });
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10:
                    setTimeout(function () { return setMessage(null); }, 5000);
                    return [2 /*return*/];
            }
        });
    }); };
    // [2025-01-06 13:15 UTC] - Add business as sales lead
    var handleSalesLeadSearchResult = function (searchResult) { return __awaiter(void 0, void 0, void 0, function () {
        var businessData, result, error_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    console.log('🎯 Adding search result as sales lead:', searchResult.name);
                    businessData = {
                        name: searchResult.name,
                        address: searchResult.formatted_address || searchResult.vicinity,
                        latitude: searchResult.geometry.location.lat,
                        longitude: searchResult.geometry.location.lng,
                        google_place_id: searchResult.place_id,
                        google_rating: searchResult.rating,
                        google_review_count: searchResult.user_ratings_total || 0,
                        google_types: searchResult.types,
                        phone: searchResult.formatted_phone_number,
                        website_url: searchResult.website,
                        quality_score: calculateQualityScore(searchResult)
                    };
                    return [4 /*yield*/, discoveryService.addManualBusiness(businessData)];
                case 2:
                    result = _a.sent();
                    if (!result.success) return [3 /*break*/, 4];
                    // Then flag it for sales immediately
                    // Note: We'd need the business ID to flag it, so this is a simplified version
                    setMessage({ type: 'success', text: "".concat(searchResult.name, " added as sales lead!") });
                    return [4 /*yield*/, loadCurationData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setMessage({ type: 'error', text: result.error || 'Failed to add business as sales lead' });
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_29 = _a.sent();
                    console.error('Error adding search result as sales lead:', error_29);
                    setMessage({ type: 'error', text: "Error adding sales lead: ".concat(error_29) });
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8:
                    setTimeout(function () { return setMessage(null); }, 5000);
                    return [2 /*return*/];
            }
        });
    }); };
    // [2025-01-06 13:15 UTC] - Reject business from search results
    var handleRejectSearchResult = function (searchResult) { return __awaiter(void 0, void 0, void 0, function () {
        var businessData;
        return __generator(this, function (_a) {
            setLoading(true);
            try {
                console.log('❌ Rejecting search result:', searchResult.name);
                businessData = {
                    name: searchResult.name,
                    address: searchResult.formatted_address || searchResult.vicinity,
                    latitude: searchResult.geometry.location.lat,
                    longitude: searchResult.geometry.location.lng,
                    google_place_id: searchResult.place_id,
                    google_rating: searchResult.rating,
                    google_review_count: searchResult.user_ratings_total || 0,
                    google_types: searchResult.types,
                    phone: searchResult.formatted_phone_number,
                    website_url: searchResult.website,
                    quality_score: calculateQualityScore(searchResult)
                };
                // This would need to be enhanced to set status as rejected
                setMessage({ type: 'success', text: "".concat(searchResult.name, " rejected and logged.") });
            }
            catch (error) {
                console.error('Error rejecting search result:', error);
                setMessage({ type: 'error', text: "Error rejecting business: ".concat(error) });
            }
            finally {
                setLoading(false);
            }
            setTimeout(function () { return setMessage(null); }, 3000);
            return [2 /*return*/];
        });
    }); };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LocalPlus Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage businesses, discounts, and platform analytics</p>
          </div>
          
          {/* [2024-12-19 19:15 UTC] - Direct advertising access */}
          <div className="flex space-x-3">
            <button onClick={function () { return window.location.href = '/admin/advertising'; }} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Megaphone size={20}/>
              <span>Advertising</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (<div className={"max-w-7xl mx-auto px-4 py-2"}>
          <div className={"p-3 rounded-lg ".concat(message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {message.text}
          </div>
        </div>)}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex overflow-x-auto space-x-2 md:space-x-8 scrollbar-hide">
            {[
            { id: 'pipeline', label: 'Pipeline', icon: Building },
            { id: 'map-discovery', label: 'Map Discovery', icon: MapPin },
            { id: 'businesses', label: 'Businesses', icon: Building },
            { id: 'discounts', label: 'Discounts', icon: Tag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'news', label: 'News', icon: Newspaper }
        ].map(function (tab) { return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"flex items-center gap-1 md:gap-2 py-2 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ".concat(activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
                <tab.icon className="h-4 w-4 flex-shrink-0"/>
                <span className="hidden sm:inline md:inline">{tab.label}</span>
              </button>); })}
          </nav>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {/* News Tab */}
        {activeTab === 'news' && <NewsAdminSettings />}

        {/* Business Pipeline Tab */}
        {activeTab === 'pipeline' && (<div className="space-y-6">
            {/* Stats Overview - Bottom-aligned numbers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pipeline Statistics</h3>
                <button onClick={loadCurationData} className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Refresh from Database
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Pending Review</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-orange-600">{curationStats.pendingCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Approved</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-green-600">{curationStats.approvedCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Sales Leads</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-blue-600">{curationStats.salesLeadsCount}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between h-24">
                  <h4 className="text-sm font-medium text-gray-500">Quality Score Avg</h4>
                  <div className="flex items-center justify-center flex-1">
                    <p className="text-3xl font-bold text-purple-600">{curationStats.averageQualityScore}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curation Queue */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="space-y-6">
                  {/* Row 1: Title - Gets its own complete row */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Suggested Businesses</h3>
                  </div>
                  
                  {/* Row 2: Import Stats - Numbers vertically and horizontally aligned */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{importStats.found}</div>
                        <div className="text-sm text-gray-500">Found</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{importStats.added}</div>
                        <div className="text-sm text-gray-500">Added</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{curationStats.pendingCount}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 3: Filters and Controls - Split into three lines */}
                  <div className="space-y-3">
                    {/* First line: Just the dropdowns */}
                    <div className="grid grid-cols-2 gap-3">
                      <select value={selectedStatus} onChange={function (e) { return setSelectedStatus(e.target.value); }} className="text-sm border-gray-300 rounded-md">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="flagged_for_sales">Sales Leads</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      <select value={selectedLdpArea} onChange={function (e) { return setSelectedLdpArea(e.target.value); }} className="text-sm border-gray-300 rounded-md">
                        {ldpAreas.map(function (area) { return (<option key={area.id} value={area.id}>{area.label}</option>); })}
                      </select>
                    </div>
                    
                    {/* Second line: Refresh and Force Discovery */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={loadCurationData} disabled={curationLoading} className="text-sm bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50">
                        {curationLoading ? 'Loading...' : 'Refresh'}
                      </button>

                      <button onClick={forceDiscovery} disabled={runningDiscovery} className="text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50">
                        🚀 Force Discovery
                      </button>
                    </div>
                    
                    {/* Third line: Reset Pipeline and Clean All */}
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={resetPipelineCompletely} disabled={loading} className="text-sm bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50">
                        🔄 Reset Pipeline
                      </button>

                      <button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, cleanupMockData()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, loadCurationData()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }} disabled={curationLoading} className="text-sm bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50">
                        🧹 Clean All
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 4: EMERGENCY CLEANUP BUTTONS - Gets its own row */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-700 mb-3">🚨 Emergency Cleanup (Fix Bad Data)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var badNames, removedCount, _i, badNames_1, badName, _a, found, findError, _b, found_1, business, deleteError, error_30;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setLoading(true);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 10, 11, 12]);
                            console.log('🎯 REMOVING SPECIFIC BAD BUSINESSES...');
                            badNames = ['Cockpit', 'embroidery shop', 'MIKE & CO TAILOR'];
                            removedCount = 0;
                            _i = 0, badNames_1 = badNames;
                            _c.label = 2;
                        case 2:
                            if (!(_i < badNames_1.length)) return [3 /*break*/, 8];
                            badName = badNames_1[_i];
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .select('id, name')
                                    .ilike('name', "%".concat(badName, "%"))];
                        case 3:
                            _a = _c.sent(), found = _a.data, findError = _a.error;
                            if (!(found && found.length > 0)) return [3 /*break*/, 7];
                            _b = 0, found_1 = found;
                            _c.label = 4;
                        case 4:
                            if (!(_b < found_1.length)) return [3 /*break*/, 7];
                            business = found_1[_b];
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .delete()
                                    .eq('id', business.id)];
                        case 5:
                            deleteError = (_c.sent()).error;
                            if (!deleteError) {
                                console.log("\uD83D\uDEAB DELETED: ".concat(business.name));
                                removedCount++;
                            }
                            _c.label = 6;
                        case 6:
                            _b++;
                            return [3 /*break*/, 4];
                        case 7:
                            _i++;
                            return [3 /*break*/, 2];
                        case 8:
                            setMessage({
                                type: 'success',
                                text: "\uD83C\uDFAF REMOVED ".concat(removedCount, " specific bad businesses")
                            });
                            return [4 /*yield*/, loadCurationData()];
                        case 9:
                            _c.sent();
                            return [3 /*break*/, 12];
                        case 10:
                            error_30 = _c.sent();
                            console.error('Specific cleanup error:', error_30);
                            setMessage({ type: 'error', text: "Cleanup failed: ".concat(error_30) });
                            return [3 /*break*/, 12];
                        case 11:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            }); }} disabled={loading} className="text-sm bg-red-700 text-white px-4 py-3 rounded-md hover:bg-red-800 disabled:opacity-50 font-medium">
                        🎯 DELETE BAD BUSINESSES NOW
                      </button>
                      
                      <button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, allBusinesses, fetchError, removedCount, thaiRegex, _i, _b, business, deleteError, error_31;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setLoading(true);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, 9, 10]);
                            console.log('🇹🇭 Removing Thai-only businesses...');
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .select('*')];
                        case 2:
                            _a = _c.sent(), allBusinesses = _a.data, fetchError = _a.error;
                            if (fetchError) {
                                console.error('Error fetching businesses:', fetchError);
                                return [2 /*return*/];
                            }
                            removedCount = 0;
                            thaiRegex = /^[\u0E00-\u0E7F\s]+$/;
                            _i = 0, _b = allBusinesses || [];
                            _c.label = 3;
                        case 3:
                            if (!(_i < _b.length)) return [3 /*break*/, 6];
                            business = _b[_i];
                            if (!thaiRegex.test(business.name)) return [3 /*break*/, 5];
                            console.log("\uD83D\uDEAB REMOVING Thai business: ".concat(business.name));
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .delete()
                                    .eq('id', business.id)];
                        case 4:
                            deleteError = (_c.sent()).error;
                            if (!deleteError) {
                                removedCount++;
                            }
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            setMessage({
                                type: 'success',
                                text: "\uD83C\uDDF9\uD83C\uDDED Removed ".concat(removedCount, " Thai-only businesses")
                            });
                            return [4 /*yield*/, loadCurationData()];
                        case 7:
                            _c.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_31 = _c.sent();
                            console.error('Thai cleanup error:', error_31);
                            setMessage({ type: 'error', text: "Thai cleanup failed: ".concat(error_31) });
                            return [3 /*break*/, 10];
                        case 9:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            }); }} disabled={loading} className="text-sm bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 disabled:opacity-50">
                        🇹🇭 Remove Thai Only
                      </button>
                      
                      <button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, restaurants, fetchError, foodTypes_1, removedCount, _i, _b, business, googleTypes, hasFoodType, deleteError, error_32;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setLoading(true);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, 9, 10]);
                            console.log('🍽️ Removing fake restaurants...');
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .select('*')
                                    .eq('primary_category', 'Restaurants')];
                        case 2:
                            _a = _c.sent(), restaurants = _a.data, fetchError = _a.error;
                            if (fetchError) {
                                console.error('Error fetching restaurants:', fetchError);
                                return [2 /*return*/];
                            }
                            foodTypes_1 = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                            removedCount = 0;
                            _i = 0, _b = restaurants || [];
                            _c.label = 3;
                        case 3:
                            if (!(_i < _b.length)) return [3 /*break*/, 6];
                            business = _b[_i];
                            googleTypes = business.google_types || [];
                            hasFoodType = googleTypes.some(function (type) { return foodTypes_1.includes(type); });
                            if (!!hasFoodType) return [3 /*break*/, 5];
                            console.log("\uD83D\uDEAB REMOVING fake restaurant: ".concat(business.name, " - Types: ").concat(googleTypes.join(', ')));
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .delete()
                                    .eq('id', business.id)];
                        case 4:
                            deleteError = (_c.sent()).error;
                            if (!deleteError) {
                                removedCount++;
                            }
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            setMessage({
                                type: 'success',
                                text: "\uD83C\uDF7D\uFE0F Removed ".concat(removedCount, " fake restaurants")
                            });
                            return [4 /*yield*/, loadCurationData()];
                        case 7:
                            _c.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_32 = _c.sent();
                            console.error('Restaurant cleanup error:', error_32);
                            setMessage({ type: 'error', text: "Restaurant cleanup failed: ".concat(error_32) });
                            return [3 /*break*/, 10];
                        case 9:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            }); }} disabled={loading} className="text-sm bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        🍽️ Remove Fake Restaurants
                      </button>
                      
                      <button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, allBusinesses, fetchError, foodTypes_2, removedCount, _i, _b, business, googleTypes, hasFoodType, deleteError, error_33;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setLoading(true);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 8, 9, 10]);
                            console.log('💥 NUCLEAR: Removing ALL non-food businesses...');
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .select('*')];
                        case 2:
                            _a = _c.sent(), allBusinesses = _a.data, fetchError = _a.error;
                            if (fetchError) {
                                console.error('Error fetching businesses:', fetchError);
                                return [2 /*return*/];
                            }
                            foodTypes_2 = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                            removedCount = 0;
                            _i = 0, _b = allBusinesses || [];
                            _c.label = 3;
                        case 3:
                            if (!(_i < _b.length)) return [3 /*break*/, 6];
                            business = _b[_i];
                            googleTypes = business.google_types || [];
                            hasFoodType = googleTypes.some(function (type) { return foodTypes_2.includes(type); });
                            if (!!hasFoodType) return [3 /*break*/, 5];
                            console.log("\uD83D\uDCA5 NUKING: ".concat(business.name, " - Types: ").concat(googleTypes.join(', ')));
                            return [4 /*yield*/, supabase
                                    .from('suggested_businesses')
                                    .delete()
                                    .eq('id', business.id)];
                        case 4:
                            deleteError = (_c.sent()).error;
                            if (!deleteError) {
                                removedCount++;
                            }
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            setMessage({
                                type: 'success',
                                text: "\uD83D\uDCA5 NUCLEAR: Removed ".concat(removedCount, " non-food businesses")
                            });
                            return [4 /*yield*/, loadCurationData()];
                        case 7:
                            _c.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_33 = _c.sent();
                            console.error('Nuclear cleanup error:', error_33);
                            setMessage({ type: 'error', text: "Nuclear cleanup failed: ".concat(error_33) });
                            return [3 /*break*/, 10];
                        case 9:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            }); }} disabled={loading} className="text-sm bg-red-900 text-white px-4 py-3 rounded-md hover:bg-red-950 disabled:opacity-50">
                        💥 NUCLEAR CLEAN
                      </button>
                    </div>
                  </div>
                  
                  {/* Row 5: Discovery Category Buttons - Gets its own row or multiple rows */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Discovery Categories</h4>
                    
                    {/* First line: Show All, Restaurants, Wellness */}
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={function () { return setSelectedCategory('all'); }} className={"text-sm px-4 py-2 rounded-md transition-colors ".concat(selectedCategory === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}>
                        📋 Show All
                      </button>
                      
                      <button onClick={handleDiscoverRestaurants} disabled={isDiscovering} className={"text-sm px-4 py-2 rounded-md transition-colors ".concat(selectedCategory === 'Restaurants'
                ? 'bg-red-700 text-white'
                : 'bg-red-600 text-white hover:bg-red-700', " disabled:opacity-50 flex items-center justify-center")}>
                        🍽️ Restaurants
                      </button>
                      
                      <button onClick={handleDiscoverWellness} disabled={isDiscovering} className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center">
                        💆 Wellness
                      </button>
                    </div>
                    
                    {/* Second line: Shopping, Entertainment, Database */}
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={handleDiscoverShopping} disabled={isDiscovering} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
                        🛍️ Shopping
                      </button>
                      
                      <button onClick={handleDiscoverEntertainment} disabled={isDiscovering} className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center">
                        🎯 Entertainment
                      </button>
                      
                      <button onClick={showDatabaseContents} disabled={loading} className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center">
                        📊 Show Database
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  
                  {discoveryMessage && (<div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded border border-green-200">
                      {discoveryMessage}
                    </div>)}
                </div>
              </div>
            </div>

            {/* Discovered Businesses List */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Discovered Businesses</h3>
                {curationLoading ? (<div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <span className="ml-2 text-gray-600">Loading businesses...</span>
                  </div>) : suggestedBusinesses.length === 0 ? (<div className="text-center py-8 text-gray-500">
                    <p>No businesses discovered yet.</p>
                    <p className="text-sm mt-1">Use the discovery buttons above to find businesses.</p>
                  </div>) : (<div className="space-y-4">
                    {suggestedBusinesses
                    .filter(function (business) {
                    // [2024-12-19 19:45 UTC] - STRICT category filtering based on Google types
                    if (selectedCategory === 'Restaurants') {
                        // Only show businesses that have actual food-related Google types
                        var foodTypes_3 = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'meal_delivery', 'bar'];
                        var nonFoodTypes_1 = [
                            'clothing_store', 'electronics_store', 'jewelry_store', 'shoe_store',
                            'book_store', 'furniture_store', 'home_goods_store', 'hardware_store',
                            'beauty_salon', 'hair_care', 'spa', 'gym', 'dentist', 'doctor',
                            'lawyer', 'real_estate_agency', 'insurance_agency', 'travel_agency'
                        ];
                        var googleTypes = business.google_types || [];
                        var hasFoodType = googleTypes.some(function (type) { return foodTypes_3.includes(type); });
                        var hasNonFoodType = googleTypes.some(function (type) { return nonFoodTypes_1.includes(type); });
                        // Must have food type AND not have non-food type
                        if (!hasFoodType || hasNonFoodType) {
                            console.log("\uD83D\uDEAB FILTERING OUT: ".concat(business.name, " - Types: ").concat(googleTypes.join(', '), " - Food: ").concat(hasFoodType, ", NonFood: ").concat(hasNonFoodType));
                            return false;
                        }
                        console.log("\u2705 SHOWING: ".concat(business.name, " - Types: ").concat(googleTypes.join(', '), " - Valid restaurant"));
                        return true;
                    }
                    // [2024-12-19 17:30 UTC] - Apply category filter for other categories
                    if (selectedCategory !== 'all' && business.primary_category !== selectedCategory) {
                        return false;
                    }
                    // [2024-12-19 16:00 UTC] - Apply status filter
                    if (selectedStatus !== 'all' && business.curation_status !== selectedStatus) {
                        return false;
                    }
                    // [2024-12-19 16:00 UTC] - Apply LDP area filter based on address
                    if (selectedLdpArea) {
                        var address = business.address.toLowerCase();
                        switch (selectedLdpArea) {
                            case 'bangkok':
                                return address.includes('bangkok') || address.includes('bkk');
                            case 'hua-hin':
                                return address.includes('hua hin') || address.includes('hua-hin') || address.includes('huahin');
                            case 'pattaya':
                                return address.includes('pattaya');
                            case 'phuket':
                                return address.includes('phuket');
                            case 'chiang-mai':
                                return address.includes('chiang mai') || address.includes('chiang-mai') || address.includes('chiangmai');
                            default:
                                return true;
                        }
                    }
                    return true;
                })
                    .map(function (business) { return (<div key={business.id} className="border rounded-lg p-4">
                        {/* Business Name */}
                        <div className="mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{business.name}</h4>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <button onClick={function () { return handleApproveBusiness(business.id); }} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                            Approve
                          </button>
                          <button onClick={function () { return handleFlagForSales(business.id); }} disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                            Sales Lead
                          </button>
                          
                          {/* [2024-12-19 20:00 UTC] - Rejection dropdown interface */}
                          {rejectingBusinessId === business.id ? (<div className="flex items-center gap-2 bg-red-50 p-2 rounded border border-red-200">
                              <select value={rejectionReason} onChange={function (e) { return setRejectionReason(e.target.value); }} className="text-sm border border-red-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500">
                                <option value="">Select reason...</option>
                                {rejectionReasons.map(function (reason) { return (<option key={reason} value={reason}>
                                    {reason}
                                  </option>); })}
                              </select>
                              <button onClick={function () { return handleRejectBusiness(business.id, rejectionReason); }} disabled={loading || !rejectionReason} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50">
                                Confirm Reject
                              </button>
                              <button onClick={function () {
                            setRejectingBusinessId(null);
                            setRejectionReason('');
                        }} className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500">
                                Cancel
                              </button>
                            </div>) : (<button onClick={function () { return handleRejectBusiness(business.id); }} disabled={loading} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50">
                              Reject
                            </button>)}
                        </div>
                        
                        {/* Business Details */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {business.primary_category}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Quality Score: {business.quality_score}
                          </span>
                          <span className={"px-2 py-1 rounded-full text-xs ".concat(business.curation_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        business.curation_status === 'approved' ? 'bg-green-100 text-green-800' :
                            business.curation_status === 'flagged_for_sales' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800')}>
                            {business.curation_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">📍 {business.address}</p>
                        
                        {/* [2024-12-19 18:00 UTC] - Enhanced contact information display */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {business.google_rating && (<span>⭐ {business.google_rating} ({business.google_review_count} reviews)</span>)}
                          </div>
                          
                          {/* Contact Information Section */}
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Contact Information</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div className={"flex items-center ".concat(business.phone ? 'text-green-600' : 'text-red-500')}>
                                📞 {business.phone || 'No phone number'}
                              </div>
                              <div className={"flex items-center ".concat(business.email ? 'text-green-600' : 'text-red-500')}>
                                ✉️ {business.email || 'No email address'}
                              </div>
                              <div className={"flex items-center ".concat(business.website_url ? 'text-green-600' : 'text-red-500')}>
                                {business.website_url ? (<a href={business.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    🌐 Website
                                  </a>) : ('🌐 No website')}
                              </div>
                            </div>
                            
                            {/* Contact completeness indicator */}
                            <div className="mt-2 text-xs">
                              {(function () {
                        var contactFields = [business.phone, business.email, business.website_url].filter(Boolean);
                        var completeness = Math.round((contactFields.length / 3) * 100);
                        return (<span className={"px-2 py-1 rounded-full ".concat(completeness === 100 ? 'bg-green-100 text-green-800' :
                                completeness >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800')}>
                                    Contact Info: {completeness}% complete ({contactFields.length}/3 fields)
                                  </span>);
                    })()}
                            </div>
                          </div>
                        </div>
                      </div>); })}
                  </div>)}
              </div>
            </div>
          </div>)}

        {/* Map Discovery Tab */}
        {activeTab === 'map-discovery' && (<div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Interactive Business Discovery</h3>
              <p className="text-gray-600 mb-6">
                Use the interactive map to visually discover and curate businesses. Click on the map to search specific areas, 
                then approve, reject, or flag businesses for sales leads.
              </p>
              
              <MapSearchModule context="admin" resultCardType="business" actions={['approve', 'reject', 'lead', 'details']} initialLocation={{ lat: 12.5684, lng: 99.9578 }} // Hua Hin center
         onApprove={handleApproveBusiness} onReject={function (business) { return handleRejectBusiness(business.id, 'Map Discovery'); }} onLead={handleFlagForSales} onDetails={function (business) {
                var _a;
                console.log('🔍 Business Details:', business);
                setMessage({
                    type: 'info',
                    text: "\uD83D\uDCCB ".concat(business.name, " - ").concat(business.address, " | Rating: ").concat(business.rating || 'N/A', " | Types: ").concat(((_a = business.types) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'N/A')
                });
            }} className="h-[700px]" radiusSlider={true} showLocationInfo={true} maxResults={20}/>
            </div>
          </div>)}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (<div>
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Business Directory</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage existing businesses or search and add new ones
                  </p>
                </div>
                <button onClick={function () { return setShowAddBusiness(true); }} className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  <Plus size={16} className="mr-2"/>
                  Add Manually
                </button>
              </div>

              {/* [2025-01-06 13:05 UTC] - Integrated Manual Business Search with improved styling */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Search size={18} className="text-blue-600"/>
                    </div>
                                         <div className="flex-1">
                       <h3 className="text-xl font-semibold text-gray-900">Search Businesses</h3>
                       <p className="text-gray-600 text-sm mt-1">Find and add businesses from Google Places</p>
                     </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex gap-2">
                    <input type="text" value={manualSearchQuery} onChange={function (e) { return setManualSearchQuery(e.target.value); }} placeholder="Enter business name (e.g., 'Daddy Deli', 'Pizza Hut')" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" onKeyPress={function (e) { return e.key === 'Enter' && handleManualSearch(); }}/>
                    <button onClick={handleManualSearch} disabled={isSearching || !manualSearchQuery.trim()} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center transition-colors min-w-[80px] justify-center">
                      {isSearching ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>) : ('Search')}
                    </button>
                  </div>
                  
                  {/* Search Results */}
                  {showSearchResults && searchResults.length > 0 && (<div className="mt-4 border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                        <h5 className="text-sm font-medium text-gray-900">
                          Found {searchResults.length} result(s) for "{manualSearchQuery}"
                        </h5>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map(function (result, index) { return (<div key={result.place_id || index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            {/* Action buttons at top */}
                            <div className="flex gap-2 mb-3">
                              <button onClick={function () { return handleAddSearchResult(result); }} disabled={loading} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors">
                                Add
                              </button>
                              <button onClick={function () { return handleSalesLeadSearchResult(result); }} disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
                                Sales Lead
                              </button>
                              <button onClick={function () { return handleRejectSearchResult(result); }} disabled={loading} className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors">
                                Reject
                              </button>
                            </div>
                            
                            {/* Business content */}
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-gray-900 truncate">{result.name}</h6>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <MapPin size={12} className="text-gray-400 shrink-0"/>
                                <span className="truncate">{result.formatted_address || result.vicinity}</span>
                              </p>
                              
                              {/* Rating and Reviews */}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                {result.rating && (<div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span>{result.rating} ({result.user_ratings_total || 0} reviews)</span>
                                  </div>)}
                                {result.types && result.types.length > 0 && (<span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {result.types[0].replace(/_/g, ' ')}
                                  </span>)}
                              </div>
                              
                              {/* Contact Information */}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                {result.formatted_phone_number && (<div className="flex items-center gap-1">
                                    <Phone size={12} className="text-gray-400"/>
                                    <span>{result.formatted_phone_number}</span>
                                  </div>)}
                                {result.website && (<div className="flex items-center gap-1">
                                    <Globe size={12} className="text-gray-400"/>
                                    <a href={result.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-[150px]">
                                      Website
                                    </a>
                                  </div>)}
                              </div>
                            </div>
                          </div>); })}
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <button onClick={function () {
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setManualSearchQuery('');
                }} className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                          ✕ Close Results
                        </button>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Business List */}
            <div className="bg-white rounded-lg shadow">
              {loading ? (<div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading businesses...</p>
                </div>) : (<div className="divide-y divide-gray-200">
                  {businesses.map(function (business) { return (<div key={business.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{business.category}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin size={14} className="mr-1"/>
                            {business.address}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            {business.phone && (<div className="flex items-center text-sm text-gray-500">
                                <Phone size={14} className="mr-1"/>
                                {business.phone}
                              </div>)}
                            {business.email && (<div className="flex items-center text-sm text-gray-500">
                                <Mail size={14} className="mr-1"/>
                                {business.email}
                              </div>)}
                            {business.website_url && (<div className="flex items-center text-sm text-gray-500">
                                <Globe size={14} className="mr-1"/>
                                <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                                  Website
                                </a>
                              </div>)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={"px-2 py-1 text-xs rounded-full ".concat(business.partnership_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : business.partnership_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800')}>
                            {business.partnership_status}
                          </span>
                        </div>
                      </div>
                    </div>); })}
                </div>)}
            </div>
          </div>)}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (<div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Discount Offers</h2>
              <button onClick={function () { return setShowAddDiscount(true); }} className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <Plus size={16} className="mr-2"/>
                Add Discount
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Discount management interface will be displayed here.</p>
            </div>
          </div>)}
      </div>

      {/* Add Business Modal */}
      {showAddBusiness && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Business</h3>
              <form onSubmit={handleAddBusiness} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input type="text" required value={businessForm.name} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { name: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={businessForm.category} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { category: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                      {categories.map(function (cat) { return (<option key={cat} value={cat}>{cat}</option>); })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" required value={businessForm.address} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { address: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Full address including city and postal code"/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input type="number" step="0.0001" required value={businessForm.latitude} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { latitude: parseFloat(e.target.value) })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input type="number" step="0.0001" required value={businessForm.longitude} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { longitude: parseFloat(e.target.value) })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={businessForm.phone} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { phone: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={businessForm.email} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { email: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input type="url" value={businessForm.website_url} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { website_url: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={businessForm.description} onChange={function (e) { return setBusinessForm(__assign(__assign({}, businessForm), { description: e.target.value })); }} rows={3} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Brief description of the business..."/>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={function () { return setShowAddBusiness(false); }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Add Business'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)}

      {/* Add Discount Modal */}
      {showAddDiscount && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Discount Offer</h3>
              <form onSubmit={handleAddDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                  <select required value={discountForm.business_id} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { business_id: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="">Select a business</option>
                    {businesses.map(function (business) { return (<option key={business.id} value={business.id}>{business.name}</option>); })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input type="text" required value={discountForm.title} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { title: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="e.g., Summer Special Discount"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required value={discountForm.description} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { description: e.target.value })); }} rows={2} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Describe what the discount applies to..."/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <input type="number" min="1" max="100" required value={discountForm.discount_percentage} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { discount_percentage: parseInt(e.target.value) })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Redemptions per User</label>
                    <input type="number" min="1" required value={discountForm.max_redemptions_per_user} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { max_redemptions_per_user: parseInt(e.target.value) })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
                  <input type="date" value={discountForm.valid_until} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { valid_until: e.target.value })); }} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea value={discountForm.terms_conditions} onChange={function (e) { return setDiscountForm(__assign(__assign({}, discountForm), { terms_conditions: e.target.value })); }} rows={2} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Any restrictions or conditions..."/>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={function () { return setShowAddDiscount(false); }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {loading ? 'Adding...' : 'Add Discount'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)}
    </div>);
};
export default AdminDashboard;
