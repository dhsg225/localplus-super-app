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
import { BarChart3, MapPin, Star, Shield, Activity, LogOut, XCircle, TrendingUp } from 'lucide-react';
import AzureMapComponent from './components/AzureMapComponent';
import { AdminLogin } from './components/AdminLogin';
import { AnalyticsCharts, generateSampleAnalyticsData } from './components/AnalyticsCharts';
import { RealCostTracker } from './components/RealCostTracker';
// [2024-12-19 22:40] - Migrated to unified authentication
import { authService } from '@shared/services/authService';
import { realTimeService } from './lib/websocket';
import { supabase } from './lib/supabase';
import 'azure-maps-control/dist/atlas.min.css';
function App() {
    var _this = this;
    // [2024-12-19 22:40] - Updated to use unified authentication
    var _a = useState(null), currentUser = _a[0], setCurrentUser = _a[1];
    var _b = useState(true), isAuthenticating = _b[0], setIsAuthenticating = _b[1];
    var _c = useState(false), realTimeConnected = _c[0], setRealTimeConnected = _c[1];
    var _d = useState(generateSampleAnalyticsData()), analyticsData = _d[0], setAnalyticsData = _d[1];
    var _e = useState('overview'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = useState({
        discoveryLeads: 0,
        pendingReview: 0,
        approved: 0,
        salesLeads: 0,
        monthlyCost: 0
    }), stats = _f[0], setStats = _f[1];
    var _g = useState([]), discoveryLeads = _g[0], setDiscoveryLeads = _g[1];
    var _h = useState([]), businessLocations = _h[0], setBusinessLocations = _h[1];
    var _j = useState(0), selectedCount = _j[0], setSelectedCount = _j[1];
    var _k = useState(true), loading = _k[0], setLoading = _k[1];
    var _l = useState(false), dbConnected = _l[0], setDbConnected = _l[1];
    var _m = useState(null), dbError = _m[0], setDbError = _m[1];
    var _o = useState(''), bulkAction = _o[0], setBulkAction = _o[1];
    var _p = useState('csv'), exportFormat = _p[0], setExportFormat = _p[1];
    var _q = useState(''), searchTerm = _q[0], setSearchTerm = _q[1];
    var _r = useState('all'), statusFilter = _r[0], setStatusFilter = _r[1];
    var _s = useState('all'), categoryFilter = _s[0], setCategoryFilter = _s[1];
    var costPerCall = 0.017; // $0.017 per Google Places API call
    var _t = useState(false), galleryModalOpen = _t[0], setGalleryModalOpen = _t[1];
    var _u = useState(null), selectedBusinessForGallery = _u[0], setSelectedBusinessForGallery = _u[1];
    // [2025-01-22 17:00] - Add approval management functions
    var handleApproveBusiness = function (lead) { return __awaiter(_this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .update({ partnership_status: 'active' })
                            .eq('id', lead.id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    // Update local state
                    setDiscoveryLeads(function (leads) {
                        return leads.map(function (l) { return l.id === lead.id ? __assign(__assign({}, l), { status: 'approved', partnership_status: 'active' }) : l; });
                    });
                    alert("\u2705 \"".concat(lead.name, "\" has been approved and will now appear in the main app."));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Approval error:', error_1);
                    alert("Failed to approve business: ".concat(error_1.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleRejectBusiness = function (lead) { return __awaiter(_this, void 0, void 0, function () {
        var error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .update({ partnership_status: 'suspended' })
                            .eq('id', lead.id)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    // Update local state
                    setDiscoveryLeads(function (leads) {
                        return leads.map(function (l) { return l.id === lead.id ? __assign(__assign({}, l), { status: 'rejected', partnership_status: 'suspended' }) : l; });
                    });
                    alert("\u274C \"".concat(lead.name, "\" has been rejected and will not appear in the main app."));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Rejection error:', error_2);
                    alert("Failed to reject business: ".concat(error_2.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // [2025-01-22 17:00] - Add photo removal function
    var handleRemovePhoto = function (photoUrl) { return __awaiter(_this, void 0, void 0, function () {
        var updatedPhotos_1, error, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!selectedBusinessForGallery)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    updatedPhotos_1 = ((_a = selectedBusinessForGallery.photo_gallery) === null || _a === void 0 ? void 0 : _a.filter(function (photo) { return photo.url !== photoUrl; })) || [];
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .update({ photo_gallery: updatedPhotos_1 })
                            .eq('id', selectedBusinessForGallery.id)];
                case 2:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    // Update local state
                    setSelectedBusinessForGallery(function (prev) { return prev ? __assign(__assign({}, prev), { photo_gallery: updatedPhotos_1 }) : null; });
                    setDiscoveryLeads(function (leads) {
                        return leads.map(function (l) { return l.id === selectedBusinessForGallery.id ? __assign(__assign({}, l), { photo_gallery: updatedPhotos_1 }) : l; });
                    });
                    console.log("\uD83D\uDCF8 Photo removed from ".concat(selectedBusinessForGallery.name));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error('Photo removal error:', error_3);
                    alert("Failed to remove photo: ".concat(error_3.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-19 22:40] - Updated authentication initialization
    useEffect(function () {
        initializeApp();
    }, []);
    var initializeApp = function () { return __awaiter(_this, void 0, void 0, function () {
        var existingUser, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, 6, 7]);
                    return [4 /*yield*/, authService.getCurrentUser()];
                case 1:
                    existingUser = _c.sent();
                    if (!existingUser) return [3 /*break*/, 4];
                    if (!(((_a = existingUser.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) || ((_b = existingUser.roles) === null || _b === void 0 ? void 0 : _b.includes('super_admin')))) return [3 /*break*/, 3];
                    setCurrentUser(existingUser);
                    return [4 /*yield*/, initializeRealTimeServices()];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.warn('User does not have admin privileges');
                    _c.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_4 = _c.sent();
                    console.error('Error initializing app:', error_4);
                    return [3 /*break*/, 7];
                case 6:
                    setIsAuthenticating(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var initializeRealTimeServices = function () { return __awaiter(_this, void 0, void 0, function () {
        var unsubscribeUpdates, unsubscribeStats, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // [2024-12-15 23:55] - Connect with graceful fallback
                    return [4 /*yield*/, realTimeService.connect()];
                case 1:
                    // [2024-12-15 23:55] - Connect with graceful fallback
                    _a.sent();
                    setRealTimeConnected(realTimeService.getConnectionStatus());
                    unsubscribeUpdates = realTimeService.onUpdate(function (update) {
                        console.log('📡 Real-time update received:', update);
                        if (update.type === 'business_approved' || update.type === 'business_added') {
                            // Debounced refresh to prevent spam
                            setTimeout(function () { return fetchRealData(); }, 1000);
                        }
                    });
                    unsubscribeStats = realTimeService.onStatsUpdate(function (newStats) {
                        console.log('📊 Stats update received:', newStats);
                        setStats({
                            discoveryLeads: newStats.discoveryLeads,
                            pendingReview: newStats.pendingReview,
                            approved: newStats.approved,
                            salesLeads: newStats.salesLeads,
                            monthlyCost: newStats.monthlyCost
                        });
                    });
                    // Load initial data once
                    fetchRealData();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.log('⚠️ Real-time services unavailable, running in offline mode');
                    setRealTimeConnected(false);
                    fetchRealData(); // Still load initial data
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLogin = function (user) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCurrentUser(user);
                    return [4 /*yield*/, initializeRealTimeServices()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authService.signOut()];
                case 1:
                    _a.sent();
                    setCurrentUser(null);
                    realTimeService.disconnect();
                    setRealTimeConnected(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchRealData = function () { return __awaiter(_this, void 0, void 0, function () {
        var savedEnrichedData, enrichedDataMap_1, parsedData, _a, businesses, businessError, allBusinesses, totalLeads, pending, approved, leads, locations, error_6;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🔄 Attempting to connect to Supabase database...');
                    setLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    console.log('📡 Testing database connection...');
                    savedEnrichedData = localStorage.getItem('enrichedBusinessData');
                    enrichedDataMap_1 = new Map();
                    if (savedEnrichedData) {
                        try {
                            parsedData = JSON.parse(savedEnrichedData);
                            parsedData.forEach(function (business) {
                                if (business.enriched) {
                                    enrichedDataMap_1.set(business.id, business);
                                }
                            });
                            console.log("\uD83D\uDCF8 Loaded ".concat(enrichedDataMap_1.size, " enriched businesses from localStorage"));
                        }
                        catch (error) {
                            console.error('Failed to parse saved enriched data:', error);
                        }
                    }
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .limit(200)];
                case 2:
                    _a = _d.sent(), businesses = _a.data, businessError = _a.error;
                    if (businessError) {
                        throw new Error("Database query failed: ".concat(businessError.message));
                    }
                    setDbConnected(true);
                    console.log('✅ REAL database connection successful!');
                    console.log("\uD83D\uDCCA Found ".concat((businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0, " businesses"));
                    allBusinesses = (businesses || []).map(function (b) { return ({
                        id: b.id,
                        name: b.name || b.business_name,
                        category: b.category || b.business_type || 'Business',
                        address: b.address || b.location,
                        rating: b.rating || b.google_rating || (3.5 + Math.random() * 1.5),
                        approved: b.partnership_status === 'active',
                        partnership_status: b.partnership_status,
                        googlePlaceId: b.google_place_id,
                        latitude: b.latitude || b.lat,
                        longitude: b.longitude || b.lng,
                        photo_gallery: b.photo_gallery
                    }); });
                    // Only proceed with REAL data - never use demo data
                    if (allBusinesses.length === 0) {
                        throw new Error('No businesses found in database tables - check database configuration');
                    }
                    totalLeads = allBusinesses.length;
                    pending = allBusinesses.filter(function (b) { return !b.approved; }).length;
                    approved = allBusinesses.filter(function (b) { return b.approved; }).length;
                    setStats({
                        discoveryLeads: totalLeads,
                        pendingReview: pending,
                        approved: approved,
                        salesLeads: Math.floor(approved * 0.3), // Estimate 30% conversion
                        monthlyCost: totalLeads * costPerCall
                    });
                    leads = allBusinesses.slice(0, 20).map(function (business, index) {
                        // [2025-01-22 17:00] - Fix photo URL handling for both old and new formats
                        var photoUrl = undefined;
                        var photoReference = undefined;
                        if (business.photo_gallery && Array.isArray(business.photo_gallery) && business.photo_gallery.length > 0) {
                            var firstPhoto = business.photo_gallery[0];
                            if (typeof firstPhoto === 'string') {
                                // New format: direct URL strings
                                photoUrl = firstPhoto;
                            }
                            else if (firstPhoto.url) {
                                // New format: objects with url property
                                photoUrl = firstPhoto.url;
                            }
                            else if (firstPhoto.photo_reference) {
                                // Old format: photo_reference that needs proxy
                                photoReference = firstPhoto.photo_reference;
                                photoUrl = "http://localhost:3004/api/places/photo?photo_reference=".concat(photoReference);
                            }
                        }
                        var baseData = {
                            id: String(business.id || "lead-".concat(index)),
                            name: business.name || "Business ".concat(index + 1),
                            category: business.category || 'Restaurant',
                            address: business.address || 'Address not available',
                            rating: Number(business.rating) || (3.5 + Math.random() * 1.5),
                            status: business.approved ? 'approved' : 'pending',
                            selected: false,
                            photo_gallery: business.photo_gallery,
                            photoUrl: photoUrl,
                            photoReference: photoReference,
                            partnership_status: business.partnership_status || (business.approved ? 'active' : 'pending'),
                            googlePlaceId: business.googlePlaceId || '',
                            latitude: business.latitude,
                            longitude: business.longitude
                        };
                        // [2025-01-21 06:05] - Merge with enriched data from localStorage
                        var enrichedData = enrichedDataMap_1.get(baseData.id);
                        if (enrichedData) {
                            console.log("\uD83D\uDCF8 Merging enriched data for: ".concat(baseData.name));
                            return __assign(__assign(__assign({}, baseData), enrichedData), { selected: false });
                        }
                        return baseData;
                    });
                    setDiscoveryLeads(leads);
                    locations = allBusinesses
                        .filter(function (business) { return business.latitude && business.longitude; })
                        .map(function (business) { return ({
                        id: String(business.id || "location-".concat(Math.random())),
                        name: business.name || 'Unknown Business',
                        latitude: Number(business.latitude),
                        longitude: Number(business.longitude),
                        category: business.category || 'Restaurant',
                        address: business.address || 'Address not available'
                    }); });
                    setBusinessLocations(locations);
                    return [3 /*break*/, 5];
                case 3:
                    error_6 = _d.sent();
                    console.log('⚠️ Database connection failed, but dashboard will continue with limited functionality');
                    setDbConnected(false);
                    // [2024-12-15 23:55] - Improved error handling with specific DNS guidance
                    if (((_b = error_6.message) === null || _b === void 0 ? void 0 : _b.includes('Failed to fetch')) || ((_c = error_6.message) === null || _c === void 0 ? void 0 : _c.includes('ERR_NAME_NOT_RESOLVED'))) {
                        setDbError('Network connectivity issue detected. The dashboard will operate in offline mode. Check your internet connection or DNS settings.');
                    }
                    else {
                        setDbError("Database unavailable: ".concat(error_6 instanceof Error ? error_6.message : 'Unknown error', ". Operating in limited mode."));
                    }
                    // Set minimal stats for offline mode
                    setStats({
                        discoveryLeads: 0,
                        pendingReview: 0,
                        approved: 0,
                        salesLeads: 0,
                        monthlyCost: 0.00
                    });
                    setDiscoveryLeads([]);
                    setBusinessLocations([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        var count = discoveryLeads.filter(function (lead) { return lead.selected; }).length;
        setSelectedCount(count);
    }, [discoveryLeads]);
    var handleSelectLead = function (id) {
        setDiscoveryLeads(function (leads) {
            return leads.map(function (lead) {
                return lead.id === id ? __assign(__assign({}, lead), { selected: !lead.selected }) : lead;
            });
        });
    };
    var handleSelectAll = function () {
        var allSelected = discoveryLeads.every(function (lead) { return lead.selected; });
        setDiscoveryLeads(function (leads) {
            return leads.map(function (lead) { return (__assign(__assign({}, lead), { selected: !allSelected })); });
        });
    };
    var handleEnrichWithGooglePlaces = function () { return __awaiter(_this, void 0, void 0, function () {
        var selectedLeads, updatedLeads, _loop_1, _i, selectedLeads_1, lead;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedLeads = discoveryLeads.filter(function (lead) { return lead.selected; });
                    if (selectedLeads.length === 0) {
                        alert('Please select at least one business to enrich.');
                        return [2 /*return*/];
                    }
                    console.log("Enriching ".concat(selectedLeads.length, " selected businesses..."));
                    setLoading(true);
                    updatedLeads = __spreadArray([], discoveryLeads, true);
                    _loop_1 = function (lead) {
                        var leadIndex, placeId, searchResponse, searchData, photosResponse, photosData, supabasePhotoUrls, _b, _c, photo, downloadUrl, imageResponse, imageBlob, safePhotoReference, fileName, _d, uploadData, uploadError, publicUrlData, uploadError_1, updateError, error_7;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    leadIndex = updatedLeads.findIndex(function (l) { return l.id === lead.id; });
                                    if (leadIndex === -1)
                                        return [2 /*return*/, "continue"];
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 18, , 19]);
                                    placeId = lead.googlePlaceId;
                                    if (!!placeId) return [3 /*break*/, 6];
                                    console.log("\uD83D\uDD0D No Place ID for ".concat(lead.name, ". Searching..."));
                                    return [4 /*yield*/, fetch("http://localhost:3004/api/places/search?query=".concat(encodeURIComponent(lead.name + ' ' + lead.address)))];
                                case 2:
                                    searchResponse = _e.sent();
                                    return [4 /*yield*/, searchResponse.json()];
                                case 3:
                                    searchData = _e.sent();
                                    if (!(searchData.candidates && searchData.candidates.length > 0)) return [3 /*break*/, 5];
                                    placeId = searchData.candidates[0].place_id;
                                    console.log("   \u2705 Found Place ID: ".concat(placeId));
                                    return [4 /*yield*/, supabase.from('businesses').update({ google_place_id: placeId }).eq('id', lead.id)];
                                case 4:
                                    _e.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    console.warn("   \u274C Could not find a Google Place ID for ".concat(lead.name, "."));
                                    return [2 /*return*/, "continue"];
                                case 6:
                                    // Step 2: Fetch photo references
                                    console.log("\uD83D\uDCF8 Fetching photo references for ".concat(lead.name, " (Place ID: ").concat(placeId, ")"));
                                    return [4 /*yield*/, fetch("http://localhost:3004/api/places/photos/".concat(placeId))];
                                case 7:
                                    photosResponse = _e.sent();
                                    return [4 /*yield*/, photosResponse.json()];
                                case 8:
                                    photosData = _e.sent();
                                    if (!photosData.success || photosData.photos.length === 0) {
                                        console.log("   \u2139\uFE0F No photos found for ".concat(lead.name, "."));
                                        return [2 /*return*/, "continue"];
                                    }
                                    console.log("   Found ".concat(photosData.photos.length, " photo references. Starting download and upload process..."));
                                    supabasePhotoUrls = [];
                                    _b = 0, _c = photosData.photos;
                                    _e.label = 9;
                                case 9:
                                    if (!(_b < _c.length)) return [3 /*break*/, 16];
                                    photo = _c[_b];
                                    _e.label = 10;
                                case 10:
                                    _e.trys.push([10, 14, , 15]);
                                    downloadUrl = "http://localhost:3004/api/places/photo/download?photo_reference=".concat(photo.photo_reference);
                                    return [4 /*yield*/, fetch(downloadUrl)];
                                case 11:
                                    imageResponse = _e.sent();
                                    if (!imageResponse.ok)
                                        return [3 /*break*/, 15];
                                    return [4 /*yield*/, imageResponse.blob()];
                                case 12:
                                    imageBlob = _e.sent();
                                    safePhotoReference = photo.photo_reference.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
                                    fileName = "".concat(lead.id, "_").concat(safePhotoReference, ".jpg");
                                    return [4 /*yield*/, supabase.storage
                                            .from('business-photos')
                                            .upload(fileName, imageBlob, {
                                            cacheControl: '3600',
                                            upsert: true, // Overwrite if exists
                                        })];
                                case 13:
                                    _d = _e.sent(), uploadData = _d.data, uploadError = _d.error;
                                    if (uploadError)
                                        throw uploadError;
                                    publicUrlData = supabase.storage
                                        .from('business-photos')
                                        .getPublicUrl(uploadData.path).data;
                                    supabasePhotoUrls.push(publicUrlData.publicUrl);
                                    console.log("     \u2705 Uploaded ".concat(fileName, " to Supabase."));
                                    return [3 /*break*/, 15];
                                case 14:
                                    uploadError_1 = _e.sent();
                                    console.error("     \u274C Failed to upload photo ".concat(photo.photo_reference.substring(0, 40), "...:"), uploadError_1.message || uploadError_1);
                                    return [3 /*break*/, 15];
                                case 15:
                                    _b++;
                                    return [3 /*break*/, 9];
                                case 16:
                                    if (supabasePhotoUrls.length === 0) {
                                        console.warn("   All photo uploads failed for ".concat(lead.name, "."));
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, supabase
                                            .from('businesses')
                                            .update({ photo_gallery: supabasePhotoUrls })
                                            .eq('id', lead.id)];
                                case 17:
                                    updateError = (_e.sent()).error;
                                    if (updateError)
                                        throw updateError;
                                    // Step 5: Update the UI state
                                    updatedLeads[leadIndex] = __assign(__assign({}, updatedLeads[leadIndex]), { enriched: true, photoUrl: supabasePhotoUrls[0], photoReference: undefined, googlePlaceId: placeId, photo_gallery: supabasePhotoUrls });
                                    console.log("   \u2705 Successfully enriched ".concat(lead.name, " with ").concat(supabasePhotoUrls.length, " photos."));
                                    return [3 /*break*/, 19];
                                case 18:
                                    error_7 = _e.sent();
                                    console.error("Failed to enrich ".concat(lead.name, ":"), error_7);
                                    return [3 /*break*/, 19];
                                case 19: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, selectedLeads_1 = selectedLeads;
                    _a.label = 1;
                case 1:
                    if (!(_i < selectedLeads_1.length)) return [3 /*break*/, 4];
                    lead = selectedLeads_1[_i];
                    return [5 /*yield**/, _loop_1(lead)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    setDiscoveryLeads(updatedLeads);
                    setLoading(false);
                    console.log('Enrichment process completed.');
                    return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-15 23:10] - Advanced Admin Features
    var handleBulkApproval = function (action) {
        if (selectedCount === 0) {
            alert('Please select businesses to approve/reject.');
            return;
        }
        var actionText = action === 'approve' ? 'approve' : 'reject';
        var confirmed = confirm("".concat(actionText.charAt(0).toUpperCase() + actionText.slice(1), " ").concat(selectedCount, " selected businesses?"));
        if (confirmed) {
            setDiscoveryLeads(function (leads) {
                return leads.map(function (lead) {
                    return lead.selected
                        ? __assign(__assign({}, lead), { status: action === 'approve' ? 'approved' : 'pending', selected: false }) : lead;
                });
            });
            // Update stats
            var newApproved_1 = discoveryLeads.filter(function (l) { return l.selected; }).length;
            setStats(function (prev) { return (__assign(__assign({}, prev), { approved: action === 'approve' ? prev.approved + newApproved_1 : prev.approved - newApproved_1, pendingReview: action === 'approve' ? prev.pendingReview - newApproved_1 : prev.pendingReview + newApproved_1, salesLeads: Math.floor((action === 'approve' ? prev.approved + newApproved_1 : prev.approved - newApproved_1) * 0.3) })); });
            alert("\u2705 Successfully ".concat(actionText, "ed ").concat(selectedCount, " businesses!"));
        }
    };
    var handleExportData = function () {
        var selectedBusinesses = discoveryLeads.filter(function (lead) { return lead.selected; });
        var dataToExport = selectedBusinesses.length > 0 ? selectedBusinesses : discoveryLeads;
        if (exportFormat === 'csv') {
            var csvHeaders = 'ID,Name,Category,Address,Rating,Status\n';
            var csvData = dataToExport.map(function (lead) {
                return "".concat(lead.id, ",\"").concat(lead.name, "\",\"").concat(lead.category, "\",\"").concat(lead.address, "\",").concat(lead.rating, ",").concat(lead.status);
            }).join('\n');
            var blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "localplus-businesses-".concat(new Date().toISOString().split('T')[0], ".csv");
            a.click();
            URL.revokeObjectURL(url);
        }
        else {
            var jsonData = JSON.stringify(dataToExport, null, 2);
            var blob = new Blob([jsonData], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "localplus-businesses-".concat(new Date().toISOString().split('T')[0], ".json");
            a.click();
            URL.revokeObjectURL(url);
        }
        alert("\u2705 Exported ".concat(dataToExport.length, " businesses as ").concat(exportFormat.toUpperCase(), "!"));
    };
    var handleBulkAction = function () {
        if (selectedCount === 0) {
            alert('Please select businesses first.');
            return;
        }
        switch (bulkAction) {
            case 'approve':
                handleBulkApproval('approve');
                break;
            case 'reject':
                handleBulkApproval('reject');
                break;
            case 'enrich':
                handleEnrichWithGooglePlaces();
                break;
            case 'export':
                handleExportData();
                break;
            default:
                alert('Please select a bulk action.');
        }
        setBulkAction('');
    };
    // Filter businesses based on search and filters
    var filteredLeads = discoveryLeads.filter(function (lead) {
        var matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.address.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        var matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });
    // Get unique categories for filter
    var uniqueCategories = __spreadArray([], new Set(discoveryLeads.map(function (lead) { return lead.category; })), true);
    // [2025-01-21 01:15] - Test photo functionality
    var addTestPhotoData = function () {
        setDiscoveryLeads(function (leads) {
            return leads.map(function (lead, index) {
                if (index === 0) { // Add photo to first business
                    return __assign(__assign({}, lead), { enriched: true, photoUrl: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AXCi2Q4xWQEyGJN8h8K7J0r8lVZ2aQ9DexampleRef&key=AIzaSyCEMtUfl8yJzVZIcTaaEajKRtqEJZZ_G2Y", phoneNumber: "032 709 000", website: "https://example.com", businessType: "restaurant", rating: 4.7, reviewCount: 36, isOpenNow: true });
                }
                return lead;
            });
        });
    };
    // [2025-01-21 06:15] - Debug enrichment for specific business
    var debugEnrichLetsSeaDirectly = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, result, place_1, photo_1, photoUrl_1, error_8;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🔍 DEBUG: Starting Let\'s Sea enrichment test...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:3004/api/places/search", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: "Let's Sea Hua Hin Al Fresco Resort 83, 188 ซอย หัวถนน 23, Tambon Nong Kae, Amphoe Hua Hin",
                                fields: 'place_id,name,rating,formatted_address,geometry,photos,formatted_phone_number,website,types,price_level,opening_hours,user_ratings_total,reviews'
                            })
                        })];
                case 2:
                    response = _d.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _d.sent();
                    console.log('🔍 DEBUG: API Response:', result);
                    if (result.success && result.data && result.data.status === 'OK' && result.data.result) {
                        place_1 = result.data.result;
                        console.log('🔍 DEBUG: Place data:', place_1);
                        console.log('🔍 DEBUG: Photos available:', ((_a = place_1.photos) === null || _a === void 0 ? void 0 : _a.length) || 0);
                        if (place_1.photos && place_1.photos.length > 0) {
                            photo_1 = place_1.photos[0];
                            photoUrl_1 = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=".concat(photo_1.photo_reference, "&key=").concat(result.apiKey);
                            console.log('🔍 DEBUG: Generated photo URL:', photoUrl_1);
                            // Find Let's Sea in the current data and update it
                            setDiscoveryLeads(function (leads) {
                                var updatedLeads = leads.map(function (lead) {
                                    var _a;
                                    if (lead.name.includes("Let's Sea") || lead.name.includes("Lets Sea")) {
                                        console.log('🔍 DEBUG: Updating Let\'s Sea with photo:', photoUrl_1);
                                        return __assign(__assign({}, lead), { enriched: true, photoUrl: photoUrl_1, photoReference: photo_1.photo_reference, enhancedRating: place_1.rating, phoneNumber: place_1.formatted_phone_number, website: place_1.website, businessType: (_a = place_1.types) === null || _a === void 0 ? void 0 : _a[0], reviewCount: place_1.user_ratings_total });
                                    }
                                    return lead;
                                });
                                // Save to localStorage
                                localStorage.setItem('enrichedBusinessData', JSON.stringify(updatedLeads));
                                console.log('🔍 DEBUG: Saved enriched data to localStorage');
                                return updatedLeads;
                            });
                            alert("\u2705 DEBUG SUCCESS!\n\nLet's Sea enriched with:\n\u2022 Photo: ".concat(photoUrl_1.substring(0, 50), "...\n\u2022 Rating: ").concat(place_1.rating, "/5\n\u2022 Phone: ").concat(place_1.formatted_phone_number, "\n\u2022 Reviews: ").concat(place_1.user_ratings_total, "\n\nCheck Business Curation tab now!"));
                        }
                        else {
                            alert('❌ No photos found for Let\'s Sea');
                        }
                    }
                    else {
                        alert('❌ API call failed: ' + (((_c = (_b = result.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || 'Unknown error'));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_8 = _d.sent();
                    console.error('🔍 DEBUG: Error:', error_8);
                    alert('❌ Network error: ' + (error_8 instanceof Error ? error_8.message : 'Unknown error'));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // [2024-12-15 23:45] - Authentication Guard
    if (isAuthenticating) {
        return (<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Initializing LocalPlus Admin...</p>
        </div>
      </div>);
    }
    if (!currentUser) {
        return <AdminLogin onLogin={handleLogin}/>;
    }
    // [2025-01-21 07:45] - Database Management action handlers
    var handleEditBusiness = function (lead) {
        // Open edit modal/form
        alert("\uD83D\uDEE0\uFE0F Edit Business: ".concat(lead.name, "\n\nThis would open an edit form with:\n\u2022 Business name: ").concat(lead.name, "\n\u2022 Address: ").concat(lead.address, "\n\u2022 Phone: ").concat(lead.phoneNumber || 'Not set', "\n\u2022 Status: ").concat(lead.status));
    };
    var handleViewBusinessDetails = function (lead) {
        // Show detailed view
        var details = "\uD83D\uDCCB ".concat(lead.name, " - Complete Details\n\n") +
            "\uD83D\uDCCD Address: ".concat(lead.address, "\n") +
            "\u2B50 Rating: ".concat(lead.enhancedRating || lead.rating, "/5\n") +
            "\uD83D\uDCDE Phone: ".concat(lead.phoneNumber || 'Not available', "\n") +
            "\uD83C\uDF10 Website: ".concat(lead.website || 'Not available', "\n") +
            "\uD83C\uDFF7\uFE0F Type: ".concat(lead.businessType || lead.category, "\n") +
            "\uD83D\uDCCA Status: ".concat(lead.status, "\n") +
            "\u2705 Enriched: ".concat(lead.enriched ? 'Yes' : 'No', "\n") +
            "\uD83D\uDCF8 Has Photo: ".concat(lead.photoUrl ? 'Yes' : 'No', "\n") +
            "\uD83D\uDCDD Reviews: ".concat(lead.reviewCount || 'Unknown', " reviews");
        alert(details);
    };
    var handleDeleteBusiness = function (lead) {
        if (confirm("\uD83D\uDDD1\uFE0F Delete Business?\n\nAre you sure you want to delete \"".concat(lead.name, "\"?\n\nThis action cannot be undone."))) {
            setDiscoveryLeads(function (leads) { return leads.filter(function (l) { return l.id !== lead.id; }); });
            alert("\u2705 \"".concat(lead.name, "\" has been deleted from the database."));
        }
    };
    var handleViewPhotoGallery = function (lead) {
        if (lead.photo_gallery && lead.photo_gallery.length > 0) {
            setSelectedBusinessForGallery(lead);
            setGalleryModalOpen(true);
        }
        else {
            alert("\uD83D\uDCF8 No Photos Available\n\n\"".concat(lead.name, "\" doesn't have any photos stored.\n\nUse the enrichment feature to add photos from Google Places."));
        }
    };
    // [2025-01-21 11:50] - Debug function to analyze photo data
    var debugPhotoData = function () {
        var photosData = discoveryLeads
            .filter(function (lead) { return lead.photoUrl; })
            .map(function (lead) { return ({
            name: lead.name,
            photoUrl: lead.photoUrl,
            photoReference: lead.photoReference,
            urlType: lead.photoUrl.includes('googleapis.com') ? 'Google API' :
                lead.photoUrl.includes('localhost:3004') ? 'Backend Proxy' :
                    lead.photoUrl.includes('supabase') ? 'Supabase Storage' : 'Other'
        }); });
        console.log('📸 Photo Data Analysis:');
        console.table(photosData);
        alert("\uD83D\uDCF8 Photo Data Analysis:\n\n".concat(photosData.length, " businesses have photos\n\nBreakdown:\n- Google API URLs: ").concat(photosData.filter(function (p) { return p.urlType === 'Google API'; }).length, "\n- Backend Proxy URLs: ").concat(photosData.filter(function (p) { return p.urlType === 'Backend Proxy'; }).length, "\n- Supabase Storage URLs: ").concat(photosData.filter(function (p) { return p.urlType === 'Supabase Storage'; }).length, "\n- Other URLs: ").concat(photosData.filter(function (p) { return p.urlType === 'Other'; }).length, "\n\nCheck browser console for detailed table."));
    };
    return (<div>
      {/* Gallery Modal */}
      {galleryModalOpen && selectedBusinessForGallery && (<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Photo Gallery: {selectedBusinessForGallery.name}</h2>
              <button onClick={function () { return setGalleryModalOpen(false); }} className="text-gray-500 hover:text-gray-800">
                <XCircle size={28}/>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
              {selectedBusinessForGallery.photo_gallery.map(function (photo, index) {
                // Handle both string URLs and object formats
                var photoUrl = typeof photo === 'string' ? photo : (photo.url || photo.photo_reference);
                var displayUrl = photo.photo_reference && !photo.url ?
                    "http://localhost:3004/api/places/photo?photo_reference=".concat(photo.photo_reference) :
                    photoUrl;
                return (<div key={index} className="relative aspect-w-1 aspect-h-1">
                    <img src={displayUrl} alt={"".concat(selectedBusinessForGallery.name, " photo ").concat(index + 1)} className="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"/>
                    <button onClick={function () { return handleRemovePhoto(displayUrl); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors" title="Remove photo">
                      🗑️
                    </button>
                  </div>);
            })}
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              Displaying {selectedBusinessForGallery.photo_gallery.length} photos.
            </div>
          </div>
        </div>)}

      {/* ADMIN HEADER WITH USER INFO */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Shield size={32} className="text-white"/>
            <div>
              <h1 className="text-xl font-bold">LocalPlus Admin Dashboard</h1>
              <p className="text-purple-100 text-sm">Business Discovery & Analytics Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={"w-3 h-3 rounded-full ".concat(realTimeConnected ? 'bg-green-400' : 'bg-red-400')}></div>
              <span className="text-sm">{realTimeConnected ? 'WebSocket Live' : 'WebSocket Offline'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'} alt={currentUser.firstName} className="w-8 h-8 rounded-full"/>
              <div className="text-sm">
                <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-purple-200">{currentUser.role}</div>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Logout">
                <LogOut size={20}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BANNER */}
      {!loading && (<div className={"px-4 py-3 text-center text-sm font-medium ".concat(dbConnected
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200', " border-b")}>
          {dbConnected ? (<>🟢 Supabase Database Connected - Data Access Active</>) : (<>⚠️ Database Offline - Cannot access Supabase data • {dbError}</>)}
        </div>)}
      
      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-container">
          <h1>LocalPlus Admin Dashboard</h1>
          <p>Business Discovery & Analytics Platform</p>
          <p className="subtitle">Real-time data from Hua Hin, Thailand</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex space-x-0 px-6 bg-white">
          <button onClick={function () { return setActiveTab('overview'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'overview'
            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            📊 Pipeline Overview
          </button>
          <button onClick={function () { return setActiveTab('discovery'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'discovery'
            ? 'border-purple-500 text-purple-600 bg-purple-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            🔍 Data Discovery
          </button>
          <button onClick={function () { return setActiveTab('cost'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'cost'
            ? 'border-green-500 text-green-600 bg-green-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            💰 Cost Management
          </button>
          <button onClick={function () { return setActiveTab('curation'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'curation'
            ? 'border-orange-500 text-orange-600 bg-orange-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            🎯 Business Curation
          </button>
          <button onClick={function () { return setActiveTab('map'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'map'
            ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            🗺️ Discovery Map
          </button>
          <button onClick={function () { return setActiveTab('analytics'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'analytics'
            ? 'border-pink-500 text-pink-600 bg-pink-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            📈 Analytics
          </button>
          <button onClick={function () { return setActiveTab('database'); }} className={"px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ".concat(activeTab === 'database'
            ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50')}>
            🗄️ Database Management
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ background: 'white', minHeight: '80vh', padding: '32px 24px', margin: '0 24px', borderRadius: '0 0 16px 16px', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)' }}>
        {activeTab === 'overview' && (<div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem' }}>📊 Pipeline Overview</h2>
            
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-label">Discovery Leads</div>
                <div className="stat-value">{loading ? '...' : stats.discoveryLeads.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>📊</span>
                  <span>Live database active</span>
                </div>
              </div>
              
              <div className="stat-card orange">
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">{loading ? '...' : stats.pendingReview.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>⏰</span>
                  <span>Needs attention</span>
                </div>
              </div>
              
              <div className="stat-card green">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{loading ? '...' : stats.approved.toLocaleString()}</div>
                <div className="stat-meta">
                  <span>🚀</span>
                  <span>Ready for platform</span>
                </div>
              </div>
              
              <div className="stat-card purple">
                <div className="stat-label">Monthly API Cost</div>
                <div className="stat-value">${stats.monthlyCost.toFixed(2)}</div>
                <div className="stat-meta">
                  <span>📍</span>
                  <span>Google Places API</span>
                </div>
              </div>
            </div>

            {/* Modern Activity Feed */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">🔔 Recent Activity</h3>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Live
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 animate-pulse"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">12 new businesses discovered</span>
                    <span className="text-blue-600 ml-1">in Hua Hin area</span>
                    <div className="text-xs text-slate-500 mt-1">📍 Lat: 12.5659, Lng: 99.9596</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">2 min ago</span>
                </div>
                <div className="flex items-center p-4 bg-green-50/50 rounded-xl border border-green-100/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">5 businesses approved</span>
                    <span className="text-green-600 ml-1">for platform</span>
                    <div className="text-xs text-slate-500 mt-1">💰 Est. revenue: $2,340/month</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">15 min ago</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Google Places enrichment completed</span>
                    <span className="text-purple-600 ml-1">for 8 businesses</span>
                    <div className="text-xs text-slate-500 mt-1">💸 Cost: $0.136 USD</div>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>)}

        {activeTab === 'discovery' && (<div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Data Discovery</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Discovery Leads</h3>
                <div className="flex space-x-3">
                  <button onClick={handleSelectAll} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    {discoveryLeads.every(function (lead) { return lead.selected; }) ? 'Deselect All' : 'Select All'}
                  </button>
                  <button onClick={handleEnrichWithGooglePlaces} disabled={selectedCount === 0} className={"px-4 py-2 text-sm rounded-lg font-medium ".concat(selectedCount > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed')}>
                    Enrich with Google Places ({selectedCount})
                  </button>
                  <button onClick={addTestPhotoData} className="px-4 py-2 text-sm rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 ml-2">
                    🖼️ Test Photo Display
                  </button>
                  <button onClick={debugEnrichLetsSeaDirectly} className="px-4 py-2 text-sm rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 ml-2">
                    🔍 DEBUG: Enrich Let's Sea
                  </button>
                </div>
              </div>
            </div>

            {selectedCount > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">💰 Cost Calculator</h4>
                <p className="text-sm text-blue-700">
                  Selected: {selectedCount} businesses
                </p>
                <p className="text-sm text-blue-700">
                  Estimated cost: <span className="font-bold">${(selectedCount * costPerCall).toFixed(3)} USD</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ({selectedCount} calls × ${costPerCall} per call)
                </p>
              </div>)}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (<tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600">Loading real data from Supabase...</span>
                        </div>
                      </td>
                    </tr>) : discoveryLeads.length === 0 ? (<tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No businesses found in database
                      </td>
                    </tr>) : (discoveryLeads.map(function (lead) { return (<tr key={lead.id} className={lead.selected ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" checked={lead.selected} onChange={function () { return handleSelectLead(lead.id); }} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.photoUrl ? (<div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                              <img src={lead.photoUrl} alt={"".concat(lead.name, " photo")} className="w-full h-full object-cover hover:scale-110 transition-transform duration-200 cursor-pointer" onClick={function () { return window.open(lead.photoUrl, '_blank'); }} onError={function (e) {
                        var target = e.target;
                        target.style.display = 'none';
                        target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>';
                    }}/>
                            </div>) : (<div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {lead.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current"/>
                            <span className="ml-1 text-sm text-gray-900">{lead.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800')}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>); }))}
                </tbody>
              </table>
            </div>
          </div>)}

        {activeTab === 'cost' && (<RealCostTracker />)}

        {activeTab === 'curation' && (<div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Curation & Management</h2>
            
            {/* Search and Filter Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-slate-800 mb-4">🔍 Search & Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input type="text" placeholder="Search businesses..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={statusFilter} onChange={function (e) { return setStatusFilter(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={categoryFilter} onChange={function (e) { return setCategoryFilter(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(function (category) { return (<option key={category} value={category}>{category}</option>); })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                  <select value={exportFormat} onChange={function (e) { return setExportFormat(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Bulk Actions</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select value={bulkAction} onChange={function (e) { return setBulkAction(e.target.value); }} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Action</option>
                    <option value="approve">✅ Approve Selected</option>
                    <option value="reject">❌ Reject Selected</option>
                    <option value="enrich">🔍 Enrich with Google Places</option>
                    <option value="export">📊 Export Data</option>
                  </select>
                </div>
                <button onClick={handleBulkAction} disabled={selectedCount === 0 || !bulkAction} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                  Execute Action ({selectedCount} selected)
                </button>
                <button onClick={handleExportData} className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 font-medium">
                  📄 Export {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Business List with Advanced Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">
                    📋 Business Management ({filteredLeads.length} businesses)
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={handleSelectAll} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      {discoveryLeads.every(function (lead) { return lead.selected; }) ? 'Deselect All' : 'Select All'}
                    </button>
                    <button onClick={function () { return handleBulkApproval('approve'); }} disabled={selectedCount === 0} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50">
                      ✅ Quick Approve
                    </button>
                    <button onClick={function () { return handleBulkApproval('reject'); }} disabled={selectedCount === 0} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50">
                      ❌ Quick Reject
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" checked={filteredLeads.length > 0 && filteredLeads.every(function (lead) { return lead.selected; })} onChange={handleSelectAll} className="rounded border-gray-300"/>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map(function (lead) { return (<tr key={lead.id} className={"hover:bg-gray-50 ".concat(lead.selected ? 'bg-blue-50' : '')}>
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={lead.selected} onChange={function () { return handleSelectLead(lead.id); }} className="rounded border-gray-300"/>
                        </td>
                        <td className="px-6 py-4">
                          {lead.photoUrl ? (<div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100">
                              <img src={lead.photoUrl} alt={"".concat(lead.name, " photo")} className="w-full h-full object-cover hover:scale-110 transition-transform duration-200 cursor-pointer" onClick={function () { return window.open(lead.photoUrl, '_blank'); }} onError={function (e) {
                        var target = e.target;
                        target.style.display = 'none';
                        target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>';
                    }}/>
                            </div>) : (<div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Photo</span>
                            </div>)}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{lead.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1"/>
                            <span className="text-sm text-gray-900">{lead.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(lead.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800')}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {(lead.partnership_status === 'pending' || lead.status === 'pending') ? (<>
                              <button onClick={function () { return handleApproveBusiness(lead); }} className="text-green-600 hover:text-green-900 font-medium">
                                ✅ Approve
                              </button>
                              <button onClick={function () { return handleRejectBusiness(lead); }} className="text-red-600 hover:text-red-900 font-medium">
                                ❌ Reject
                              </button>
                            </>) : (<button onClick={function () {
                        setDiscoveryLeads(function (leads) {
                            return leads.map(function (l) { return l.id === lead.id ? __assign(__assign({}, l), { status: 'pending', partnership_status: 'pending' }) : l; });
                        });
                    }} className="text-blue-600 hover:text-blue-900 font-medium">
                              🔄 Reset
                            </button>)}
                        </td>
                      </tr>); })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>)}

        {activeTab === 'map' && (<div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">🗺️ Discovery Map</h2>
                <p className="text-slate-600 mt-1">Real-time business discovery locations with Azure Maps</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={function () { return setActiveTab('discovery'); }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                  <MapPin className="w-4 h-4"/>
                  Add Businesses
                </button>
                <button onClick={fetchRealData} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                  <Activity className="w-4 h-4"/>
                  Refresh Map
                </button>
                <button className="bg-white hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors border border-gray-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4"/>
                  Export Data
                </button>
              </div>
            </div>

            {/* Real Azure Maps Integration */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">📍 Business Locations</h3>
                  <p className="text-sm text-slate-600">
                    {loading ? 'Loading...' : "".concat(businessLocations.length, " businesses mapped")}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  🔴 Live Map
                </div>
              </div>
              
              {loading ? (<div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading map data from database...</p>
                  </div>
                </div>) : businessLocations.length > 0 ? (<AzureMapComponent businesses={businessLocations} height="400px"/>) : (<div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4"/>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Locations Found</h3>
                    <p className="text-slate-600 mb-4">No businesses with coordinates in database</p>
                  </div>
                </div>)}
            </div>

            {/* Real Map Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : businessLocations.length}
                </div>
                <div className="text-sm text-slate-600">Locations Mapped</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-green-600">
                  {loading ? '...' : stats.discoveryLeads > 0 ? Math.round((businessLocations.length / stats.discoveryLeads) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-600">Coverage Rate</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-purple-600">Hua Hin</div>
                <div className="text-sm text-slate-600">Primary Area</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : businessLocations.filter(function (b) { return b.category === 'Restaurant'; }).length}
                </div>
                <div className="text-sm text-slate-600">Restaurants</div>
              </div>
            </div>
          </div>)}

        {activeTab === 'analytics' && (<div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">📈 Analytics Dashboard</h2>
                <p className="text-slate-600 mt-1">Real-time business discovery analytics and insights</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={function () { return setAnalyticsData(generateSampleAnalyticsData()); }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors">
                  🔄 Refresh Data
                </button>
                <button className="bg-white/70 hover:bg-white text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors border border-white/20">
                  📊 Export Report
                </button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              {!dbConnected ? (<div className="text-center py-12">
                  <div className="text-yellow-600 mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Offline</h3>
                  <p className="text-gray-600 mb-4">Charts require database connection for real-time data.</p>
                  <button onClick={fetchRealData} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    🔄 Retry Connection
                  </button>
                </div>) : (<AnalyticsCharts data={analyticsData} loading={loading}/>)}
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">🔔 Real-time Activity</h3>
                <div className={"px-3 py-1 rounded-full text-xs font-semibold ".concat(realTimeConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800')}>
                  {realTimeConnected ? '🟢 Live Connection' : '🔴 Offline'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <Activity size={20} className="text-blue-500 mr-3"/>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Analytics dashboard initialized</span>
                    <div className="text-xs text-slate-500 mt-1">Chart.js components loaded successfully</div>
                  </div>
                  <span className="text-slate-400 text-sm">Just now</span>
                </div>
                {currentUser && (<div className="flex items-center p-3 bg-green-50/50 rounded-lg border border-green-100/50">
                    <Shield size={20} className="text-green-500 mr-3"/>
                    <div className="flex-1">
                      <span className="text-slate-700 font-medium">{currentUser.firstName} {currentUser.lastName} logged in</span>
                      <div className="text-xs text-slate-500 mt-1">Role: {currentUser.role} | Session active</div>
                    </div>
                    <span className="text-slate-400 text-sm">Session start</span>
                  </div>)}
                <div className="flex items-center p-3 bg-purple-50/50 rounded-lg border border-purple-100/50">
                  <TrendingUp size={20} className="text-purple-500 mr-3"/>
                  <div className="flex-1">
                    <span className="text-slate-700 font-medium">Real-time WebSocket service {realTimeConnected ? 'connected' : 'disconnected'}</span>
                    <div className="text-xs text-slate-500 mt-1">Monitoring database changes for live updates</div>
                  </div>
                  <span className="text-slate-400 text-sm">Service status</span>
                </div>
              </div>
            </div>
          </div>)}

        {activeTab === 'database' && (<div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">🗄️ Database Management</h2>
                <p className="text-slate-600 mt-1">Direct database access - Pure Supabase data only</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={fetchRealData} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                  🔄 Refresh Database
                </button>
                <button onClick={handleEnrichWithGooglePlaces} disabled={selectedCount === 0} className={"px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap ".concat(selectedCount > 0
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed')}>
                  ✨ Enrich Selected ({selectedCount})
                </button>
                <button onClick={handleExportData} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                  📁 Export Data
                </button>
                <button onClick={function () { return alert('Cleanup feature coming soon!'); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                  🧹 Cleanup
                </button>
                <button onClick={debugPhotoData} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                  🔍 Debug Photos
                </button>
              </div>
            </div>

            {/* Selection Info Banner */}
            {selectedCount > 0 && (<div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-purple-900">✨ Ready to Enrich</h4>
                    <p className="text-sm text-purple-700">
                      {selectedCount} businesses selected • Est. cost: ${(selectedCount * 0.017).toFixed(3)} USD
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSelectAll} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                      {discoveryLeads.every(function (lead) { return lead.selected; }) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </div>)}

            {/* Database Stats - Better Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.length}
                </div>
                <div className="text-sm opacity-90">Total Records</div>
                <div className="text-xs opacity-75 mt-1">From Supabase DB</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(function (lead) { return lead.enriched; }).length}
                </div>
                <div className="text-sm opacity-90">Enriched</div>
                <div className="text-xs opacity-75 mt-1">With Google data</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(function (lead) { return lead.photoUrl; }).length}
                </div>
                <div className="text-sm opacity-90">With Photos</div>
                <div className="text-xs opacity-75 mt-1">Stored images</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">
                  {loading ? '...' : discoveryLeads.filter(function (lead) { return lead.phoneNumber; }).length}
                </div>
                <div className="text-sm opacity-90">Phone Numbers</div>
                <div className="text-xs opacity-75 mt-1">Contact verified</div>
              </div>
            </div>

            {/* Database Table with Checkbox Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">📋 Business Database Records</h3>
                    <p className="text-sm text-slate-600 mt-1">Pure database data - no API calls</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={discoveryLeads.length > 0 && discoveryLeads.every(function (lead) { return lead.selected; })} onChange={handleSelectAll} className="rounded border-gray-300"/>
                      Select All
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact & Business Info</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ratings</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (<tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading database records...</span>
                          </div>
                        </td>
                      </tr>) : discoveryLeads.length === 0 ? (<tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No database records found
                        </td>
                      </tr>) : (discoveryLeads.map(function (lead) { return (<tr key={lead.id} className="hover:bg-gray-50">
                          {/* Selection Checkbox */}
                          <td className="px-4 py-4">
                            <input type="checkbox" checked={lead.selected} onChange={function () { return handleSelectLead(lead.id); }} className="rounded border-gray-300"/>
                          </td>

                          {/* Business Name & Basic Info */}
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500">{lead.category}</div>
                              {lead.enriched && (<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                                  ✅ Enriched
                                </span>)}
                            </div>
                          </td>

                          {/* Photos - Real Database Images */}
                          <td className="px-4 py-4">
                            {lead.photoUrl ? (<div className="flex items-center space-x-2">
                                <img src={lead.photoUrl.includes('googleapis.com') && lead.photoReference ?
                        "http://localhost:3004/api/places/photo?photo_reference=".concat(lead.photoReference, "&maxwidth=400&maxheight=400") :
                        lead.photoUrl} alt={lead.name} className="w-16 h-16 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer" onClick={function () { return handleViewPhotoGallery(lead); }} onError={function (e) {
                        // Fallback for broken images
                        var target = e.target;
                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23e5e7eb"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24">📷</text></svg>';
                    }}/>
                                <div className="text-xs text-gray-500">
                                  <div className="text-green-600 font-medium">✅ Has Photo</div>
                                  <button onClick={function () { return handleViewPhotoGallery(lead); }} className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800">
                                    View Gallery
                                  </button>
                                </div>
                              </div>) : (<div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                                <span className="text-gray-400 text-xs">No Photo</span>
                              </div>)}
                          </td>

                          {/* Contact Info & Business Details */}
                          <td className="px-4 py-4">
                            <div className="text-sm space-y-1">
                              {lead.phoneNumber ? (<div className="flex items-center text-green-600 text-xs">
                                  📞 {lead.phoneNumber}
                                </div>) : (<div className="text-gray-400 text-xs">No phone</div>)}
                              {lead.website ? (<div className="flex items-center text-blue-600 text-xs">
                                  🌐 <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Website
                                  </a>
                                </div>) : (<div className="text-gray-400 text-xs">No website</div>)}
                              {/* Business Type & Category */}
                              <div className="border-t border-gray-100 pt-1 mt-1">
                                {lead.businessType && (<div className="text-purple-600 text-xs font-medium">
                                    🏷️ {lead.businessType}
                                  </div>)}
                                {lead.category && lead.category !== lead.businessType && (<div className="text-orange-600 text-xs">
                                    🍽️ {lead.category}
                                  </div>)}
                                {lead.priceLevel && (<div className="text-green-600 text-xs">
                                    💰 {'$'.repeat(lead.priceLevel)} Price Level
                                  </div>)}
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              <div className="truncate max-w-48">{lead.address}</div>
                              {lead.latitude && lead.longitude ? (<div className="text-xs text-green-600 mt-1">
                                  📍 {lead.latitude.toFixed(4)}, {lead.longitude.toFixed(4)}
                                </div>) : (<div className="text-xs text-gray-400 mt-1">No coordinates</div>)}
                            </div>
                          </td>

                          {/* Ratings */}
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <div className="flex items-center">
                                ⭐ {lead.enhancedRating || lead.rating}/5
                              </div>
                              {lead.reviewCount ? (<div className="text-xs text-green-600 mt-1">
                                  {lead.reviewCount} reviews
                                </div>) : (<div className="text-xs text-gray-400 mt-1">No reviews</div>)}
                            </div>
                          </td>

                          {/* Platform Status */}
                          <td className="px-4 py-4">
                            <div>
                              <span className={"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ".concat(lead.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : lead.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800')}>
                                {lead.status === 'approved' ? '✅ Approved' :
                    lead.status === 'rejected' ? '❌ Rejected' :
                        '⏳ Pending Review'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {lead.status === 'approved' ? 'Ready for platform' :
                    lead.status === 'rejected' ? 'Not suitable' :
                        'Awaiting review'}
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-1">
                              {/* Approval Actions */}
                                                             {(lead.partnership_status === 'pending' || lead.status === 'pending') ? (<>
                                  <button onClick={function () { return handleApproveBusiness(lead); }} className="text-green-600 hover:text-green-900 text-xs font-medium px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors">
                                    ✅ Approve
                                  </button>
                                  <button onClick={function () { return handleRejectBusiness(lead); }} className="text-red-600 hover:text-red-900 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors">
                                    ❌ Reject
                                  </button>
                                </>) : (<button onClick={function () {
                        setDiscoveryLeads(function (leads) {
                            return leads.map(function (l) { return l.id === lead.id ? __assign(__assign({}, l), { status: 'pending', partnership_status: 'pending' }) : l; });
                        });
                    }} className="text-blue-600 hover:text-blue-900 text-xs font-medium px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                                  🔄 Reset
                                </button>)}
                              
                              {/* Other Actions */}
                              <button onClick={function () { return handleEditBusiness(lead); }} className="text-purple-600 hover:text-purple-900 text-xs font-medium px-2 py-1 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                                ✏️ Edit
                              </button>
                              <button onClick={function () { return handleViewBusinessDetails(lead); }} className="text-indigo-600 hover:text-indigo-900 text-xs font-medium px-2 py-1 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors">
                                📋 View
                              </button>
                              <button onClick={function () { return handleDeleteBusiness(lead); }} className="text-red-600 hover:text-red-900 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors">
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>); }))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Database Health & Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Health */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4">🔧 Database Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Connection Status</span>
                    <span className={"px-2 py-1 rounded text-xs font-medium ".concat(dbConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                      {dbConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time Updates</span>
                    <span className={"px-2 py-1 rounded text-xs font-medium ".concat(realTimeConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                      {realTimeConnected ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Integrity</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      🟢 Healthy
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Operations */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-slate-800 mb-4">⚡ Quick Operations</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors">
                    🔍 Find Duplicate Records
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-sm font-medium text-yellow-700 transition-colors">
                    📋 Validate Phone Numbers
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 transition-colors">
                    🖼️ Check Missing Photos
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-medium text-purple-700 transition-colors">
                    📊 Generate Data Report
                  </button>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
export default App;
