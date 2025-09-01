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
import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { geographyService } from '@/services/geographyService';
export var GeoLocationSelector = function (_a) {
    var _b, _c, _d;
    var onLocationChange = _a.onLocationChange, initialValues = _a.initialValues, _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.showLabels, showLabels = _f === void 0 ? true : _f, _g = _a.required, required = _g === void 0 ? false : _g;
    var _h = useState([]), provinces = _h[0], setProvinces = _h[1];
    var _j = useState([]), districts = _j[0], setDistricts = _j[1];
    var _k = useState([]), subDistricts = _k[0], setSubDistricts = _k[1];
    var _l = useState((initialValues === null || initialValues === void 0 ? void 0 : initialValues.province_id) || ''), selectedProvince = _l[0], setSelectedProvince = _l[1];
    var _m = useState((initialValues === null || initialValues === void 0 ? void 0 : initialValues.district_id) || ''), selectedDistrict = _m[0], setSelectedDistrict = _m[1];
    var _o = useState((initialValues === null || initialValues === void 0 ? void 0 : initialValues.sub_district_id) || ''), selectedSubDistrict = _o[0], setSelectedSubDistrict = _o[1];
    var _p = useState(false), isLoading = _p[0], setIsLoading = _p[1];
    // Load provinces on mount
    useEffect(function () {
        var loadProvinces = function () { return __awaiter(void 0, void 0, void 0, function () {
            var provincesData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, geographyService.getProvinces()];
                    case 2:
                        provincesData = _a.sent();
                        setProvinces(provincesData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error loading provinces:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadProvinces();
    }, []);
    // Load districts when province changes
    useEffect(function () {
        var loadDistricts = function () { return __awaiter(void 0, void 0, void 0, function () {
            var districtsData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedProvince) {
                            setDistricts([]);
                            setSelectedDistrict('');
                            setSelectedSubDistrict('');
                            return [2 /*return*/];
                        }
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, geographyService.getDistrictsByProvince(selectedProvince)];
                    case 2:
                        districtsData = _a.sent();
                        setDistricts(districtsData);
                        // Reset dependent selections
                        if (selectedDistrict && !districtsData.find(function (d) { return d.id === selectedDistrict; })) {
                            setSelectedDistrict('');
                            setSelectedSubDistrict('');
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error loading districts:', error_2);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadDistricts();
    }, [selectedProvince]);
    // Load sub-districts when district changes
    useEffect(function () {
        var loadSubDistricts = function () { return __awaiter(void 0, void 0, void 0, function () {
            var subDistrictsData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedDistrict) {
                            setSubDistricts([]);
                            setSelectedSubDistrict('');
                            return [2 /*return*/];
                        }
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, geographyService.getSubDistrictsByDistrict(selectedDistrict)];
                    case 2:
                        subDistrictsData = _a.sent();
                        setSubDistricts(subDistrictsData);
                        // Reset sub-district if it's no longer valid
                        if (selectedSubDistrict && !subDistrictsData.find(function (s) { return s.id === selectedSubDistrict; })) {
                            setSelectedSubDistrict('');
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error loading sub-districts:', error_3);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadSubDistricts();
    }, [selectedDistrict]);
    // Notify parent of changes
    useEffect(function () {
        onLocationChange({
            province_id: selectedProvince || undefined,
            district_id: selectedDistrict || undefined,
            sub_district_id: selectedSubDistrict || undefined
        });
    }, [selectedProvince, selectedDistrict, selectedSubDistrict, onLocationChange]);
    var handleProvinceChange = function (provinceId) {
        setSelectedProvince(provinceId);
        setSelectedDistrict('');
        setSelectedSubDistrict('');
    };
    var handleDistrictChange = function (districtId) {
        setSelectedDistrict(districtId);
        setSelectedSubDistrict('');
    };
    var handleSubDistrictChange = function (subDistrictId) {
        setSelectedSubDistrict(subDistrictId);
    };
    var selectClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white";
    var labelClass = "block text-sm font-medium text-gray-700 mb-2";
    return (<div className={"space-y-4 ".concat(className)}>
      {showLabels && (<div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <MapPin size={20} className="text-blue-600"/>
          <span>Location</span>
          {required && <span className="text-red-500">*</span>}
        </div>)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province Selector */}
        <div>
          {showLabels && (<label className={labelClass}>
              Province {required && <span className="text-red-500">*</span>}
            </label>)}
          <div className="relative">
            <select value={selectedProvince} onChange={function (e) { return handleProvinceChange(e.target.value); }} className={selectClass} disabled={isLoading || provinces.length === 0} required={required}>
              <option value="">Select Province</option>
              {provinces.map(function (province) { return (<option key={province.id} value={province.id}>
                  {province.name_en} ({province.name_th})
                </option>); })}
            </select>
            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
          </div>
        </div>

        {/* District Selector */}
        <div>
          {showLabels && (<label className={labelClass}>
              District {required && <span className="text-red-500">*</span>}
            </label>)}
          <div className="relative">
            <select value={selectedDistrict} onChange={function (e) { return handleDistrictChange(e.target.value); }} className={selectClass} disabled={isLoading || !selectedProvince || districts.length === 0} required={required}>
              <option value="">Select District</option>
              {districts.map(function (district) { return (<option key={district.id} value={district.id}>
                  {district.name_en} ({district.name_th})
                </option>); })}
            </select>
            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
          </div>
        </div>

        {/* Sub-District Selector */}
        <div>
          {showLabels && (<label className={labelClass}>
              Sub-District
            </label>)}
          <div className="relative">
            <select value={selectedSubDistrict} onChange={function (e) { return handleSubDistrictChange(e.target.value); }} className={selectClass} disabled={isLoading || !selectedDistrict || subDistricts.length === 0}>
              <option value="">Select Sub-District</option>
              {subDistricts.map(function (subDistrict) { return (<option key={subDistrict.id} value={subDistrict.id}>
                  {subDistrict.name_en} ({subDistrict.name_th})
                </option>); })}
            </select>
            <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (<div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Loading geographic data...</span>
        </div>)}

      {/* Selected location display */}
      {(selectedProvince || selectedDistrict || selectedSubDistrict) && (<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <MapPin size={16}/>
            <span className="font-medium">Selected Location:</span>
          </div>
          <div className="mt-1 text-sm text-blue-700">
            {[
                (_b = subDistricts.find(function (s) { return s.id === selectedSubDistrict; })) === null || _b === void 0 ? void 0 : _b.name_en,
                (_c = districts.find(function (d) { return d.id === selectedDistrict; })) === null || _c === void 0 ? void 0 : _c.name_en,
                (_d = provinces.find(function (p) { return p.id === selectedProvince; })) === null || _d === void 0 ? void 0 : _d.name_en
            ].filter(Boolean).join(', ')}
          </div>
        </div>)}
    </div>);
};
