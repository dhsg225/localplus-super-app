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
import { supabase } from '@/config/database';
import { LDP_PRIORITY_AREAS } from '@/types/geography';
var GeographyService = /** @class */ (function () {
    function GeographyService() {
    }
    GeographyService.getInstance = function () {
        if (!GeographyService.instance) {
            GeographyService.instance = new GeographyService();
        }
        return GeographyService.instance;
    };
    // Get all provinces
    GeographyService.prototype.getProvinces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('provinces')
                                .select('*')
                                .order('name_en')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || this.getFallbackProvinces()];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error fetching provinces:', error_1);
                        return [2 /*return*/, this.getFallbackProvinces()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get districts by province
    GeographyService.prototype.getDistrictsByProvince = function (provinceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('districts')
                                .select('*')
                                .eq('province_id', provinceId)
                                .order('name_en')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || this.getFallbackDistricts(provinceId)];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error fetching districts:', error_2);
                        return [2 /*return*/, this.getFallbackDistricts(provinceId)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get sub-districts by district
    GeographyService.prototype.getSubDistrictsByDistrict = function (districtId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('sub_districts')
                                .select('*')
                                .eq('district_id', districtId)
                                .order('name_en')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || this.getFallbackSubDistricts(districtId)];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error fetching sub-districts:', error_3);
                        return [2 /*return*/, this.getFallbackSubDistricts(districtId)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get cascading data for dropdowns
    GeographyService.prototype.getCascadingGeoData = function (provinceId, districtId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, provinces, districts, subDistricts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getProvinces(),
                            provinceId ? this.getDistrictsByProvince(provinceId) : Promise.resolve([]),
                            districtId ? this.getSubDistrictsByDistrict(districtId) : Promise.resolve([])
                        ])];
                    case 1:
                        _a = _b.sent(), provinces = _a[0], districts = _a[1], subDistricts = _a[2];
                        return [2 /*return*/, {
                                provinces: provinces,
                                districts: districts,
                                subDistricts: subDistricts
                            }];
                }
            });
        });
    };
    // Parse Google Places address components to geographic IDs
    GeographyService.prototype.parseAddressComponents = function (components) {
        return __awaiter(this, void 0, void 0, function () {
            var provinces, province, districts, district, subDistricts, subDistrict, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getProvinces()];
                    case 1:
                        provinces = _a.sent();
                        province = provinces.find(function (p) {
                            var _a;
                            return p.name_en.toLowerCase() === ((_a = components.administrative_area_level_1) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ||
                                p.name_th === components.administrative_area_level_1;
                        });
                        if (!province)
                            return [2 /*return*/, {}];
                        return [4 /*yield*/, this.getDistrictsByProvince(province.id)];
                    case 2:
                        districts = _a.sent();
                        district = districts.find(function (d) {
                            var _a;
                            return d.name_en.toLowerCase() === ((_a = components.locality) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ||
                                d.name_th === components.locality;
                        });
                        if (!district)
                            return [2 /*return*/, { province_id: province.id }];
                        return [4 /*yield*/, this.getSubDistrictsByDistrict(district.id)];
                    case 3:
                        subDistricts = _a.sent();
                        subDistrict = subDistricts.find(function (s) {
                            var _a;
                            return s.name_en.toLowerCase() === ((_a = components.sublocality_level_1) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ||
                                s.name_th === components.sublocality_level_1;
                        });
                        return [2 /*return*/, {
                                province_id: province.id,
                                district_id: district.id,
                                sub_district_id: subDistrict === null || subDistrict === void 0 ? void 0 : subDistrict.id
                            }];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error parsing address components:', error_4);
                        return [2 /*return*/, {}];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Get LDP priority areas
    GeographyService.prototype.getLDPAreas = function () {
        return LDP_PRIORITY_AREAS.filter(function (area) { return area.is_active; });
    };
    // Get businesses within geographic hierarchy
    GeographyService.prototype.getBusinessesByGeoFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = supabase
                            .from('businesses')
                            .select("\n          *,\n          provinces!province_id (name_en, name_th),\n          districts!district_id (name_en, name_th),\n          sub_districts!sub_district_id (name_en, name_th)\n        ")
                            .eq('partnership_status', 'active');
                        if (filter.province_id) {
                            query = query.eq('province_id', filter.province_id);
                        }
                        if (filter.district_id) {
                            query = query.eq('district_id', filter.district_id);
                        }
                        if (filter.sub_district_id) {
                            query = query.eq('sub_district_id', filter.sub_district_id);
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data || []];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Error fetching businesses by geo filter:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get full address string from geographic IDs
    GeographyService.prototype.getFullAddress = function (provinceId, districtId, subDistrictId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, provinces, districts, subDistricts, province, district, subDistrict, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.getProvinces(),
                                this.getDistrictsByProvince(provinceId),
                                this.getSubDistrictsByDistrict(districtId)
                            ])];
                    case 1:
                        _a = _b.sent(), provinces = _a[0], districts = _a[1], subDistricts = _a[2];
                        province = provinces.find(function (p) { return p.id === provinceId; });
                        district = districts.find(function (d) { return d.id === districtId; });
                        subDistrict = subDistricts.find(function (s) { return s.id === subDistrictId; });
                        return [2 /*return*/, [subDistrict === null || subDistrict === void 0 ? void 0 : subDistrict.name_en, district === null || district === void 0 ? void 0 : district.name_en, province === null || province === void 0 ? void 0 : province.name_en]
                                .filter(Boolean)
                                .join(', ')];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Error building full address:', error_6);
                        return [2 /*return*/, ''];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Fallback data for LDP areas when database is unavailable
    GeographyService.prototype.getFallbackProvinces = function () {
        return [
            {
                id: 'prachuap-khiri-khan',
                code: '77',
                name_en: 'Prachuap Khiri Khan',
                name_th: 'ประจวบคีรีขันธ์',
                region: 'southern',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'chonburi',
                code: '20',
                name_en: 'Chonburi',
                name_th: 'ชลบุรี',
                region: 'eastern',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'phuket',
                code: '83',
                name_en: 'Phuket',
                name_th: 'ภูเก็ต',
                region: 'southern',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'chiang-mai',
                code: '50',
                name_en: 'Chiang Mai',
                name_th: 'เชียงใหม่',
                region: 'northern',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
            }
        ];
    };
    GeographyService.prototype.getFallbackDistricts = function (provinceId) {
        var districtMap = {
            'prachuap-khiri-khan': [
                {
                    id: 'hua-hin-district',
                    code: '7703',
                    province_id: 'prachuap-khiri-khan',
                    name_en: 'Hua Hin',
                    name_th: 'หัวหิน',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                }
            ],
            'chonburi': [
                {
                    id: 'bang-lamung-district',
                    code: '2007',
                    province_id: 'chonburi',
                    name_en: 'Bang Lamung',
                    name_th: 'บางละมุง',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                }
            ]
        };
        return districtMap[provinceId] || [];
    };
    GeographyService.prototype.getFallbackSubDistricts = function (districtId) {
        var subDistrictMap = {
            'hua-hin-district': [
                {
                    id: 'hua-hin-subdistrict',
                    code: '770301',
                    district_id: 'hua-hin-district',
                    name_en: 'Hua Hin',
                    name_th: 'หัวหิน',
                    postal_codes: ['77110'],
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                },
                {
                    id: 'nong-kae-subdistrict',
                    code: '770302',
                    district_id: 'hua-hin-district',
                    name_en: 'Nong Kae',
                    name_th: 'หนองแก',
                    postal_codes: ['77110'],
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                }
            ],
            'bang-lamung-district': [
                {
                    id: 'pattaya-subdistrict',
                    code: '200704',
                    district_id: 'bang-lamung-district',
                    name_en: 'Pattaya',
                    name_th: 'พัทยา',
                    postal_codes: ['20150'],
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                }
            ]
        };
        return subDistrictMap[districtId] || [];
    };
    return GeographyService;
}());
export { GeographyService };
export var geographyService = GeographyService.getInstance();
