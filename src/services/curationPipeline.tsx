// Curated Business Pipeline Service
// Handles automated discovery, quality filtering, and curation workflow
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
import { supabase } from '../lib/supabase';
import { googlePlacesService } from './googlePlaces';
var CurationPipelineService = /** @class */ (function () {
    function CurationPipelineService() {
        this.googlePlaces = googlePlacesService;
    }
    // ====================
    // DISCOVERY CAMPAIGNS
    // ====================
    CurationPipelineService.prototype.createDiscoveryCampaign = function (campaign) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('discovery_campaigns')
                            .insert([{
                                name: campaign.name,
                                description: campaign.description,
                                target_location: campaign.targetLocation,
                                center_latitude: campaign.centerLatitude,
                                center_longitude: campaign.centerLongitude,
                                search_radius: campaign.searchRadius,
                                target_categories: campaign.targetCategories,
                                quality_filters: campaign.qualityFilters,
                                run_frequency: campaign.runFrequency,
                                next_run_at: (_b = campaign.nextRunAt) === null || _b === void 0 ? void 0 : _b.toISOString()
                            }])
                            .select()
                            .single()];
                    case 1:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, this.mapDiscoveryCampaign(data)];
                }
            });
        });
    };
    CurationPipelineService.prototype.getDiscoveryCampaigns = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('discovery_campaigns')
                            .select('*')
                            .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data.map(this.mapDiscoveryCampaign)];
                }
            });
        });
    };
    CurationPipelineService.prototype.runDiscoveryCampaign = function (campaignId) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign, results, _i, _a, category, placeType, places, _b, places_1, place, exists, error_1, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getDiscoveryCampaignById(campaignId)];
                    case 1:
                        campaign = _c.sent();
                        if (!campaign)
                            throw new Error('Campaign not found');
                        results = {
                            discovered: 0,
                            added: 0,
                            duplicates: 0,
                            errors: []
                        };
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 14, , 15]);
                        _i = 0, _a = campaign.targetCategories;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        category = _a[_i];
                        placeType = this.mapCategoryToGoogleType(category);
                        return [4 /*yield*/, this.googlePlaces.discoverBusinessesNearby(campaign.centerLatitude, campaign.centerLongitude, campaign.searchRadius, placeType)];
                    case 4:
                        places = _c.sent();
                        results.discovered += places.length;
                        _b = 0, places_1 = places;
                        _c.label = 5;
                    case 5:
                        if (!(_b < places_1.length)) return [3 /*break*/, 11];
                        place = places_1[_b];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 9, , 10]);
                        // Apply quality filters
                        if (!this.passesQualityFilters(place, campaign.qualityFilters)) {
                            return [3 /*break*/, 10];
                        }
                        return [4 /*yield*/, this.checkBusinessExists(place.place_id)];
                    case 7:
                        exists = _c.sent();
                        if (exists) {
                            results.duplicates++;
                            return [3 /*break*/, 10];
                        }
                        // Add to suggested businesses queue
                        return [4 /*yield*/, this.addSuggestedBusiness({
                                googlePlaceId: place.place_id,
                                name: place.name,
                                address: place.vicinity || '',
                                latitude: place.geometry.location.lat,
                                longitude: place.geometry.location.lng,
                                googleRating: place.rating,
                                googleReviewCount: 0, // Will be populated from details if needed
                                googlePriceLevel: place.price_level,
                                googleTypes: place.types,
                                primaryCategory: category,
                                qualityScore: this.calculateQualityScore(place),
                                curationStatus: 'pending',
                                discoverySource: 'automated_campaign',
                                discoveryCriteria: {
                                    campaignId: campaignId,
                                    campaignName: campaign.name,
                                    searchCategory: category,
                                    filters: campaign.qualityFilters
                                }
                            })];
                    case 8:
                        // Add to suggested businesses queue
                        _c.sent();
                        results.added++;
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _c.sent();
                        results.errors.push("Error processing ".concat(place.name, ": ").concat(error_1));
                        return [3 /*break*/, 10];
                    case 10:
                        _b++;
                        return [3 /*break*/, 5];
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12: 
                    // Update campaign statistics
                    return [4 /*yield*/, supabase
                            .from('discovery_campaigns')
                            .update({
                            businesses_discovered: campaign.businessesDiscovered + results.discovered,
                            last_run_at: new Date().toISOString(),
                            next_run_at: this.calculateNextRun(campaign.runFrequency)
                        })
                            .eq('id', campaignId)];
                    case 13:
                        // Update campaign statistics
                        _c.sent();
                        return [3 /*break*/, 15];
                    case 14:
                        error_2 = _c.sent();
                        results.errors.push("Campaign execution error: ".concat(error_2));
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/, results];
                }
            });
        });
    };
    // ====================
    // SUGGESTED BUSINESSES
    // ====================
    CurationPipelineService.prototype.getSuggestedBusinesses = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase
                            .from('suggested_businesses')
                            .select('*')
                            .order('quality_score', { ascending: false });
                        if (status) {
                            query = query.eq('curation_status', status);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data.map(this.mapSuggestedBusiness)];
                }
            });
        });
    };
    CurationPipelineService.prototype.addSuggestedBusiness = function (business) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert([{
                                google_place_id: business.googlePlaceId,
                                name: business.name,
                                address: business.address,
                                latitude: business.latitude,
                                longitude: business.longitude,
                                phone: business.phone,
                                website_url: business.websiteUrl,
                                google_rating: business.googleRating,
                                google_review_count: business.googleReviewCount,
                                google_price_level: business.googlePriceLevel,
                                google_types: business.googleTypes,
                                primary_category: business.primaryCategory,
                                google_photos: business.googlePhotos,
                                business_hours: business.businessHours,
                                quality_score: business.qualityScore,
                                curation_status: business.curationStatus,
                                discovery_source: business.discoverySource,
                                discovery_criteria: business.discoveryCriteria
                            }])
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, this.mapSuggestedBusiness(data)];
                }
            });
        });
    };
    CurationPipelineService.prototype.approveSuggestedBusiness = function (suggestedBusinessId, curatorId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .rpc('approve_suggested_business', {
                            suggested_business_uuid: suggestedBusinessId,
                            curator_uuid: curatorId
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data]; // Returns new business ID
                }
            });
        });
    };
    CurationPipelineService.prototype.rejectSuggestedBusiness = function (suggestedBusinessId, curatorId, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .update({
                            curation_status: 'rejected',
                            curated_by: curatorId,
                            curated_at: new Date().toISOString(),
                            rejection_reason: reason
                        })
                            .eq('id', suggestedBusinessId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        // Log activity
                        return [4 /*yield*/, this.logCurationActivity(curatorId, 'rejected', 'suggested_business', suggestedBusinessId, reason)];
                    case 2:
                        // Log activity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CurationPipelineService.prototype.flagForSalesOutreach = function (suggestedBusinessId_1, curatorId_1) {
        return __awaiter(this, arguments, void 0, function (suggestedBusinessId, curatorId, priorityLevel, estimatedValue) {
            var _a, data, error;
            if (priorityLevel === void 0) { priorityLevel = 3; }
            if (estimatedValue === void 0) { estimatedValue = 500; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .rpc('flag_for_sales_outreach', {
                            suggested_business_uuid: suggestedBusinessId,
                            curator_uuid: curatorId,
                            priority_level: priorityLevel,
                            estimated_value: estimatedValue
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data]; // Returns sales lead ID
                }
            });
        });
    };
    // ====================
    // SALES LEADS
    // ====================
    CurationPipelineService.prototype.getSalesLeads = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('sales_leads')
                            .select("\n        *,\n        suggested_businesses(name, address, phone, google_rating),\n        businesses(name, address, phone)\n      ")
                            .order('priority_level', { ascending: false })
                            .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data.map(this.mapSalesLead)];
                }
            });
        });
    };
    CurationPipelineService.prototype.updateSalesLeadStatus = function (leadId, status, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, currentLead, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = {
                            outreach_status: status,
                            updated_at: new Date().toISOString()
                        };
                        if (notes)
                            updates.notes = notes;
                        if (!(status === 'contacted' || status === 'interested')) return [3 /*break*/, 2];
                        updates.last_contact_date = new Date().toISOString().split('T')[0];
                        if (!(status === 'contacted')) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase
                                .from('sales_leads')
                                .select('contact_attempts')
                                .eq('id', leadId)
                                .single()];
                    case 1:
                        currentLead = (_a.sent()).data;
                        if (currentLead) {
                            updates.contact_attempts = (currentLead.contact_attempts || 0) + 1;
                        }
                        _a.label = 2;
                    case 2:
                        if (status === 'converted') {
                            updates.conversion_date = new Date().toISOString().split('T')[0];
                        }
                        return [4 /*yield*/, supabase
                                .from('sales_leads')
                                .update(updates)
                                .eq('id', leadId)];
                    case 3:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        });
    };
    // ====================
    // UTILITY METHODS
    // ====================
    CurationPipelineService.prototype.checkBusinessExists = function (googlePlaceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, businessCheck, suggestedCheck;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            supabase.from('businesses').select('id').eq('google_place_id', googlePlaceId).single(),
                            supabase.from('suggested_businesses').select('id').eq('google_place_id', googlePlaceId).single()
                        ])];
                    case 1:
                        _a = _b.sent(), businessCheck = _a[0], suggestedCheck = _a[1];
                        return [2 /*return*/, !businessCheck.error || !suggestedCheck.error];
                }
            });
        });
    };
    CurationPipelineService.prototype.passesQualityFilters = function (place, filters) {
        if (filters.minRating && (!place.rating || place.rating < filters.minRating)) {
            return false;
        }
        if (filters.minReviewCount && (!place.user_ratings_total || place.user_ratings_total < filters.minReviewCount)) {
            return false;
        }
        if (filters.priceLevel && place.price_level && !filters.priceLevel.includes(place.price_level)) {
            return false;
        }
        if (filters.excludedTypes && place.types) {
            var hasExcludedType = place.types.some(function (type) {
                return filters.excludedTypes.includes(type);
            });
            if (hasExcludedType)
                return false;
        }
        if (filters.requiredTypes && place.types) {
            var hasRequiredType = filters.requiredTypes.some(function (type) {
                return place.types.includes(type);
            });
            if (!hasRequiredType)
                return false;
        }
        return true;
    };
    CurationPipelineService.prototype.calculateQualityScore = function (place) {
        return Math.min(100, Math.floor((place.rating || 0) * 15 +
            Math.min((place.user_ratings_total || 0) / 10, 25) +
            (place.price_level ? 10 : 0) +
            (place.formatted_phone_number ? 10 : 0) +
            (place.website ? 10 : 0) +
            (place.photos && place.photos.length > 0 ? 15 : 0) +
            (place.opening_hours ? 10 : 0) +
            (place.types && place.types.length > 0 ? 5 : 0)));
    };
    CurationPipelineService.prototype.mapCategoryToGoogleType = function (category) {
        var mapping = {
            'Restaurants': 'restaurant',
            'Wellness': 'spa',
            'Shopping': 'store',
            'Services': 'establishment',
            'Entertainment': 'amusement_park',
            'Travel': 'travel_agency'
        };
        return mapping[category] || 'establishment';
    };
    CurationPipelineService.prototype.calculateNextRun = function (frequency) {
        var now = new Date();
        switch (frequency) {
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            case 'monthly':
                return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
            default:
                return now.toISOString();
        }
    };
    CurationPipelineService.prototype.logCurationActivity = function (curatorId, action, targetType, targetId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase.from('curation_activities').insert([{
                                curator_id: curatorId,
                                action: action,
                                target_type: targetType,
                                target_id: targetId,
                                notes: notes
                            }])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Mapping functions
    CurationPipelineService.prototype.mapDiscoveryCampaign = function (data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            targetLocation: data.target_location,
            centerLatitude: data.center_latitude,
            centerLongitude: data.center_longitude,
            searchRadius: data.search_radius,
            targetCategories: data.target_categories,
            qualityFilters: data.quality_filters,
            runFrequency: data.run_frequency,
            nextRunAt: data.next_run_at ? new Date(data.next_run_at) : undefined,
            businessesDiscovered: data.businesses_discovered || 0
        };
    };
    CurationPipelineService.prototype.mapSuggestedBusiness = function (data) {
        return {
            id: data.id,
            googlePlaceId: data.google_place_id,
            name: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            phone: data.phone,
            websiteUrl: data.website_url,
            googleRating: data.google_rating,
            googleReviewCount: data.google_review_count,
            googlePriceLevel: data.google_price_level,
            googleTypes: data.google_types,
            primaryCategory: data.primary_category,
            googlePhotos: data.google_photos,
            businessHours: data.business_hours,
            qualityScore: data.quality_score,
            curationStatus: data.curation_status,
            discoverySource: data.discovery_source,
            discoveryCriteria: data.discovery_criteria
        };
    };
    CurationPipelineService.prototype.mapSalesLead = function (data) {
        return {
            id: data.id,
            businessId: data.business_id,
            suggestedBusinessId: data.suggested_business_id,
            leadSource: data.lead_source,
            priorityLevel: data.priority_level,
            estimatedPartnershipValue: data.estimated_partnership_value,
            outreachStatus: data.outreach_status,
            assignedTo: data.assigned_to,
            notes: data.notes,
            partnershipTier: data.partnership_tier
        };
    };
    CurationPipelineService.prototype.getDiscoveryCampaignById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from('discovery_campaigns')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.mapDiscoveryCampaign(data)];
                }
            });
        });
    };
    return CurationPipelineService;
}());
export { CurationPipelineService };
