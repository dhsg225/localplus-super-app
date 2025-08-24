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
// [2024-12-15 23:30] - Real-time WebSocket Service for Admin Dashboard
import { supabase } from './supabase';
var RealTimeService = /** @class */ (function () {
    function RealTimeService() {
        this.updateCallbacks = [];
        this.statsCallbacks = [];
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 2;
        this.reconnectDelay = 1000;
        this.channel = null;
        this.hasInitialized = false;
    }
    RealTimeService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connectionPromise, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // [2024-12-15 23:50] - Prevent multiple connection attempts
                        if (this.hasInitialized || this.isConnected || this.reconnectAttempts >= this.maxReconnectAttempts) {
                            if (this.hasInitialized || this.isConnected) {
                                console.log('⚠️ Real-time service already initialized');
                            }
                            else {
                                console.log('⚠️ Maximum reconnection attempts reached, staying offline');
                            }
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('🔌 Connecting to real-time database updates...');
                        connectionPromise = new Promise(function (resolve, reject) {
                            try {
                                _this.channel = supabase
                                    .channel('business-changes-admin')
                                    .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, function (payload) {
                                    console.log('📡 Business table update:', payload);
                                    _this.handleBusinessUpdate(payload);
                                })
                                    .subscribe(function (status) {
                                    if (status === 'SUBSCRIBED') {
                                        resolve();
                                    }
                                    else if (status === 'CLOSED') {
                                        reject(new Error('Connection closed'));
                                    }
                                });
                            }
                            catch (error) {
                                reject(error);
                            }
                        });
                        // Add timeout for connection
                        return [4 /*yield*/, Promise.race([
                                connectionPromise,
                                new Promise(function (_, reject) {
                                    return setTimeout(function () { return reject(new Error('Connection timeout')); }, 10000);
                                })
                            ])];
                    case 2:
                        // Add timeout for connection
                        _a.sent();
                        this.isConnected = true;
                        this.hasInitialized = true;
                        this.reconnectAttempts = 0;
                        console.log('✅ Real-time connection established');
                        this.startStatsMonitoring();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('⚠️ Real-time connection failed, running in offline mode:', error_1);
                        this.isConnected = false;
                        this.startStatsMonitoring(); // Still start stats monitoring
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RealTimeService.prototype.disconnect = function () {
        console.log('🔌 Disconnecting real-time service...');
        if (this.channel) {
            supabase.removeChannel(this.channel);
            this.channel = null;
        }
        this.isConnected = false;
        this.hasInitialized = false;
    };
    RealTimeService.prototype.onUpdate = function (callback) {
        var _this = this;
        this.updateCallbacks.push(callback);
        return function () { _this.updateCallbacks = _this.updateCallbacks.filter(function (cb) { return cb !== callback; }); };
    };
    RealTimeService.prototype.onStatsUpdate = function (callback) {
        var _this = this;
        this.statsCallbacks.push(callback);
        return function () { _this.statsCallbacks = _this.statsCallbacks.filter(function (cb) { return cb !== callback; }); };
    };
    RealTimeService.prototype.emitUpdate = function (update) {
        this.updateCallbacks.forEach(function (callback) {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error in update callback:', error);
            }
        });
    };
    RealTimeService.prototype.emitStatsUpdate = function (stats) {
        this.statsCallbacks.forEach(function (callback) {
            try {
                callback(stats);
            }
            catch (error) {
                console.error('Error in stats callback:', error);
            }
        });
    };
    RealTimeService.prototype.handleBusinessUpdate = function (payload) {
        var eventType = payload.eventType, newRecord = payload.new, oldRecord = payload.old;
        var updateType;
        var message = '';
        switch (eventType) {
            case 'INSERT':
                updateType = 'business_added';
                message = "New business added: ".concat(newRecord.name || 'Unknown');
                break;
            case 'UPDATE':
                if (newRecord.approved !== oldRecord.approved) {
                    updateType = newRecord.approved ? 'business_approved' : 'business_rejected';
                    message = "Business ".concat(newRecord.approved ? 'approved' : 'rejected', ": ").concat(newRecord.name);
                }
                else {
                    updateType = 'business_updated';
                    message = "Business updated: ".concat(newRecord.name || 'Unknown');
                }
                break;
            default:
                updateType = 'business_updated';
                message = "Business modified: ".concat((newRecord === null || newRecord === void 0 ? void 0 : newRecord.name) || (oldRecord === null || oldRecord === void 0 ? void 0 : oldRecord.name) || 'Unknown');
        }
        this.emitUpdate({ type: updateType, data: newRecord || oldRecord, timestamp: new Date() });
        this.refreshStats();
    };
    RealTimeService.prototype.startStatsMonitoring = function () {
        var _this = this;
        this.refreshStats();
        setInterval(function () { _this.refreshStats(); }, 30000);
    };
    RealTimeService.prototype.refreshStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, businesses, error, allBusinesses, pending, approved, totalLeads, recentActivity, stats, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase.from('businesses').select('*')];
                    case 1:
                        _a = _b.sent(), businesses = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Failed to fetch stats from businesses table:', error);
                            return [2 /*return*/];
                        }
                        allBusinesses = businesses || [];
                        pending = allBusinesses.filter(function (b) { return !b.approved; }).length;
                        approved = allBusinesses.filter(function (b) { return b.approved; }).length;
                        totalLeads = allBusinesses.length;
                        recentActivity = [
                            { id: 'activity-1', type: 'approval', message: 'Business approved by admin', timestamp: new Date(Date.now() - 300000), adminName: 'LocalPlus Admin' },
                            { id: 'activity-2', type: 'new_business', message: 'New business discovery added', timestamp: new Date(Date.now() - 900000) },
                            { id: 'activity-3', type: 'bulk_action', message: 'Bulk enrichment completed (12 businesses)', timestamp: new Date(Date.now() - 1800000), adminName: 'Business Curator' }
                        ];
                        stats = {
                            discoveryLeads: totalLeads,
                            pendingReview: pending,
                            approved: approved,
                            salesLeads: Math.floor(approved * 0.3),
                            monthlyCost: totalLeads * 0.017,
                            recentActivity: recentActivity
                        };
                        this.emitStatsUpdate(stats);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('❌ Failed to refresh stats:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RealTimeService.prototype.handleConnectionError = function () {
        var _this = this;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log("\uD83D\uDD04 Attempting to reconnect... (".concat(this.reconnectAttempts, "/").concat(this.maxReconnectAttempts, ")"));
            setTimeout(function () { _this.connect(); }, this.reconnectDelay * this.reconnectAttempts);
        }
        else {
            console.error('❌ Max reconnection attempts reached');
        }
    };
    RealTimeService.prototype.simulateBusinessApproval = function (businessId, businessName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.emitUpdate({
                            type: 'business_approved',
                            data: { id: businessId, name: businessName, approved: true },
                            timestamp: new Date(),
                            adminId: 'current-admin'
                        });
                        return [4 /*yield*/, this.refreshStats()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RealTimeService.prototype.simulateBusinessRejection = function (businessId, businessName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.emitUpdate({
                            type: 'business_rejected',
                            data: { id: businessId, name: businessName, approved: false },
                            timestamp: new Date(),
                            adminId: 'current-admin'
                        });
                        return [4 /*yield*/, this.refreshStats()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RealTimeService.prototype.getConnectionStatus = function () {
        return this.isConnected;
    };
    return RealTimeService;
}());
export var realTimeService = new RealTimeService();
