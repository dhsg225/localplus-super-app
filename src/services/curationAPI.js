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
// Curation API for Admin Dashboard
import { supabase } from '../lib/supabase';
export var curationAPI = {
    // Get all suggested businesses
    getSuggestedBusinesses: function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, filterStatus, _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🔍 Fetching suggested businesses from database...');
                        query = supabase
                            .from('suggested_businesses')
                            .select('*')
                            .order('created_at', { ascending: false });
                        filterStatus = status || 'pending';
                        if (filterStatus !== 'all') {
                            query = query.eq('curation_status', filterStatus);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Database error fetching suggested businesses:', error);
                            // [2024-12-19 16:30 UTC] - Return empty array instead of demo data for production
                            return [2 /*return*/, []];
                        }
                        console.log("\uD83D\uDCCA Database returned ".concat((data === null || data === void 0 ? void 0 : data.length) || 0, " ").concat(filterStatus, " businesses"));
                        console.log('🏢 Businesses:', data);
                        return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.map(function (business) { return ({
                                id: business.id,
                                google_place_id: business.google_place_id,
                                name: business.name,
                                address: business.address,
                                latitude: business.latitude,
                                longitude: business.longitude,
                                phone: business.phone,
                                email: business.email,
                                website_url: business.website_url,
                                google_rating: business.google_rating,
                                google_review_count: business.google_review_count,
                                google_price_level: business.google_price_level,
                                google_types: business.google_types,
                                primary_category: business.primary_category,
                                quality_score: business.quality_score,
                                curation_status: business.curation_status,
                                discovery_source: business.discovery_source,
                                discovery_criteria: business.discovery_criteria,
                                created_at: business.created_at,
                                updated_at: business.updated_at
                            }); })) || []];
                    case 2:
                        error_1 = _b.sent();
                        console.error('💥 Error fetching suggested businesses:', error_1);
                        // [2024-12-19 16:30 UTC] - Return empty array instead of demo data for production
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Get discovery campaigns
    getDiscoveryCampaigns: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('discovery_campaigns')
                                .select('*')
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching discovery campaigns:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error in getDiscoveryCampaigns:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Get curation statistics
    getCurationStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, suggestedBusinesses, suggestedError, _b, mainBusinesses, mainError, stats, qualityScores, activeBusinesses, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        console.log('📊 Fetching curation stats from database...');
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('curation_status, quality_score, created_at')];
                    case 1:
                        _a = _c.sent(), suggestedBusinesses = _a.data, suggestedError = _a.error;
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('partnership_status, created_at')];
                    case 2:
                        _b = _c.sent(), mainBusinesses = _b.data, mainError = _b.error;
                        console.log('📊 Suggested businesses data:', (suggestedBusinesses === null || suggestedBusinesses === void 0 ? void 0 : suggestedBusinesses.length) || 0, 'records');
                        console.log('📊 Main businesses data:', (mainBusinesses === null || mainBusinesses === void 0 ? void 0 : mainBusinesses.length) || 0, 'records');
                        stats = {
                            pendingCount: 0,
                            approvedCount: 0,
                            rejectedCount: 0,
                            salesLeadsCount: 0,
                            averageQualityScore: 0
                        };
                        // Calculate stats from suggested_businesses table
                        if (suggestedBusinesses && suggestedBusinesses.length > 0) {
                            stats.pendingCount = suggestedBusinesses.filter(function (b) { return b.curation_status === 'pending'; }).length;
                            stats.approvedCount = suggestedBusinesses.filter(function (b) { return b.curation_status === 'approved'; }).length;
                            stats.rejectedCount = suggestedBusinesses.filter(function (b) { return b.curation_status === 'rejected'; }).length;
                            stats.salesLeadsCount = suggestedBusinesses.filter(function (b) { return b.curation_status === 'flagged_for_sales'; }).length;
                            qualityScores = suggestedBusinesses
                                .map(function (b) { return b.quality_score; })
                                .filter(function (score) { return score && score > 0; });
                            if (qualityScores.length > 0) {
                                stats.averageQualityScore = Math.round(qualityScores.reduce(function (sum, score) { return sum + score; }, 0) / qualityScores.length);
                            }
                        }
                        // Add approved businesses from main businesses table to approved count
                        if (mainBusinesses && mainBusinesses.length > 0) {
                            activeBusinesses = mainBusinesses.filter(function (b) { return b.partnership_status === 'active'; }).length;
                            stats.approvedCount += activeBusinesses;
                        }
                        // [2024-12-19 16:30 UTC] - Always use real database stats for production
                        console.log('✅ Using real database stats:', stats);
                        return [2 /*return*/, stats];
                    case 3:
                        error_3 = _c.sent();
                        console.error('Error in getCurationStats:', error_3);
                        // [2024-12-19 16:30 UTC] - Return zeros for production instead of demo data
                        return [2 /*return*/, {
                                pendingCount: 0,
                                approvedCount: 0,
                                rejectedCount: 0,
                                salesLeadsCount: 0,
                                averageQualityScore: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Approve a suggested business
    approveBusiness: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                curation_status: 'approved',
                                curated_at: new Date().toISOString()
                            })
                                .eq('id', businessId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error approving business:', error);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error in approveBusiness:', error_4);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Flag business for sales
    flagForSales: function (businessId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                curation_status: 'flagged_for_sales',
                                curated_at: new Date().toISOString()
                            })
                                .eq('id', businessId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error flagging business for sales:', error);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error in flagForSales:', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Reject a suggested business
    rejectBusiness: function (businessId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                curation_status: 'rejected',
                                rejection_reason: reason,
                                curated_at: new Date().toISOString()
                            })
                                .eq('id', businessId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error rejecting business:', error);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error in rejectBusiness:', error_6);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Approve a suggested business and create a default loyalty program
    approveBusinessAndCreateLoyalty: function (suggestedBusinessId, curatorId) {
        return __awaiter(this, void 0, void 0, function () {
            var validCuratorId, _a, suggestedBusiness, fetchError, _b, existingBusiness, duplicateError, updateError, _c, newBusinessId, error, loyaltyError, error_7;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        validCuratorId = curatorId;
                        if (!curatorId || curatorId.trim() === '' || curatorId.length < 10) {
                            console.warn('⚠️ Invalid curator ID provided, using system default');
                            // Generate a system UUID for cases where user authentication fails
                            validCuratorId = '00000000-0000-0000-0000-000000000000'; // System default UUID
                        }
                        // [2024-12-19 17:45 UTC] - Check for duplicates before approval
                        console.log('🔍 Checking for duplicates before approving business:', suggestedBusinessId);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .select('google_place_id, name')
                                .eq('id', suggestedBusinessId)
                                .single()];
                    case 1:
                        _a = _d.sent(), suggestedBusiness = _a.data, fetchError = _a.error;
                        if (fetchError) {
                            console.error('❌ Error fetching suggested business:', fetchError);
                            throw new Error("Failed to fetch business details: ".concat(fetchError.message));
                        }
                        if (!suggestedBusiness) {
                            throw new Error('Suggested business not found');
                        }
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('id, name')
                                .eq('google_place_id', suggestedBusiness.google_place_id)
                                .maybeSingle()];
                    case 2:
                        _b = _d.sent(), existingBusiness = _b.data, duplicateError = _b.error;
                        if (duplicateError) {
                            console.error('❌ Error checking for duplicates:', duplicateError);
                            throw new Error("Duplicate check failed: ".concat(duplicateError.message));
                        }
                        if (!existingBusiness) return [3 /*break*/, 4];
                        console.log('⚠️ Business already exists in main table:', existingBusiness.name);
                        return [4 /*yield*/, supabase
                                .from('suggested_businesses')
                                .update({
                                curation_status: 'approved',
                                curated_at: new Date().toISOString()
                            })
                                .eq('id', suggestedBusinessId)];
                    case 3:
                        updateError = (_d.sent()).error;
                        if (updateError) {
                            console.error('❌ Error updating suggested business status:', updateError);
                            throw new Error("Failed to update status: ".concat(updateError.message));
                        }
                        console.log('✅ Marked as approved, returning existing business ID:', existingBusiness.id);
                        return [2 /*return*/, existingBusiness.id];
                    case 4:
                        // 1. Approve and move to businesses table (no duplicate found)
                        console.log('✅ No duplicate found, proceeding with approval...');
                        return [4 /*yield*/, supabase
                                .rpc('approve_suggested_business', {
                                suggested_business_uuid: suggestedBusinessId,
                                curator_uuid: validCuratorId
                            })];
                    case 5:
                        _c = _d.sent(), newBusinessId = _c.data, error = _c.error;
                        if (error) {
                            console.error('❌ RPC approval error:', error);
                            throw new Error("Approval failed: ".concat(error.message));
                        }
                        console.log('✅ Business approved, new ID:', newBusinessId);
                        return [4 /*yield*/, supabase
                                .from('loyalty_programs')
                                .insert([{
                                    business_id: newBusinessId,
                                    title: 'Default Loyalty Program',
                                    stamps_required: 10,
                                    prize_description: 'Free reward after 10 stamps',
                                    terms_conditions: 'One stamp per visit. Not valid with other offers.'
                                }])];
                    case 6:
                        loyaltyError = (_d.sent()).error;
                        if (loyaltyError) {
                            console.error('❌ Loyalty program creation error:', loyaltyError);
                            // Don't throw here - business is already approved
                            console.log('⚠️ Business approved but loyalty program creation failed');
                        }
                        else {
                            console.log('✅ Loyalty program created successfully');
                        }
                        return [2 /*return*/, newBusinessId];
                    case 7:
                        error_7 = _d.sent();
                        console.error('💥 Error in approveBusinessAndCreateLoyalty:', error_7);
                        throw error_7;
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
};
