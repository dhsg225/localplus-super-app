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
// Import the existing supabase client from the app
import { supabase } from '../src/lib/supabase';
function checkDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, provinces, provincesError, _b, districts, districtsError, _c, subDistricts, subDistrictsError, _d, businesses, businessesError, sample, _e, businessLocations, viewError, tablesExist, businessesUpdated, viewExists, error_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log('🔍 Checking LocalPlus Database Status...\n');
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 7, , 8]);
                    // Check if geographic hierarchy tables exist
                    console.log('📍 Checking Geographic Hierarchy Tables:');
                    return [4 /*yield*/, supabase
                            .from('provinces')
                            .select('*')
                            .limit(5)];
                case 2:
                    _a = _f.sent(), provinces = _a.data, provincesError = _a.error;
                    if (provincesError) {
                        console.log('❌ provinces table: NOT FOUND');
                        console.log('   Error:', provincesError.message);
                    }
                    else {
                        console.log('✅ provinces table: EXISTS');
                        console.log("   Records: ".concat((provinces === null || provinces === void 0 ? void 0 : provinces.length) || 0));
                        if (provinces && provinces.length > 0) {
                            console.log('   Sample:', provinces[0].name_en);
                        }
                    }
                    return [4 /*yield*/, supabase
                            .from('districts')
                            .select('*')
                            .limit(5)];
                case 3:
                    _b = _f.sent(), districts = _b.data, districtsError = _b.error;
                    if (districtsError) {
                        console.log('❌ districts table: NOT FOUND');
                        console.log('   Error:', districtsError.message);
                    }
                    else {
                        console.log('✅ districts table: EXISTS');
                        console.log("   Records: ".concat((districts === null || districts === void 0 ? void 0 : districts.length) || 0));
                        if (districts && districts.length > 0) {
                            console.log('   Sample:', districts[0].name_en);
                        }
                    }
                    return [4 /*yield*/, supabase
                            .from('sub_districts')
                            .select('*')
                            .limit(5)];
                case 4:
                    _c = _f.sent(), subDistricts = _c.data, subDistrictsError = _c.error;
                    if (subDistrictsError) {
                        console.log('❌ sub_districts table: NOT FOUND');
                        console.log('   Error:', subDistrictsError.message);
                    }
                    else {
                        console.log('✅ sub_districts table: EXISTS');
                        console.log("   Records: ".concat((subDistricts === null || subDistricts === void 0 ? void 0 : subDistricts.length) || 0));
                        if (subDistricts && subDistricts.length > 0) {
                            console.log('   Sample:', subDistricts[0].name_en);
                        }
                    }
                    console.log('\n🏢 Checking Businesses Table:');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('id, name, address, province_id, district_id, sub_district_id, address_line, postal_code')
                            .limit(3)];
                case 5:
                    _d = _f.sent(), businesses = _d.data, businessesError = _d.error;
                    if (businessesError) {
                        console.log('❌ businesses table: ERROR');
                        console.log('   Error:', businessesError.message);
                    }
                    else {
                        console.log('✅ businesses table: EXISTS');
                        console.log("   Records: ".concat((businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0));
                        // Check if geographic columns exist
                        if (businesses && businesses.length > 0) {
                            sample = businesses[0];
                            console.log('   Geographic columns:');
                            console.log("     province_id: ".concat(sample.province_id ? '✅ EXISTS' : '❌ MISSING'));
                            console.log("     district_id: ".concat(sample.district_id ? '✅ EXISTS' : '❌ MISSING'));
                            console.log("     sub_district_id: ".concat(sample.sub_district_id ? '✅ EXISTS' : '❌ MISSING'));
                            console.log("     address_line: ".concat(sample.address_line ? '✅ EXISTS' : '❌ MISSING'));
                            console.log("     postal_code: ".concat(sample.postal_code ? '✅ EXISTS' : '❌ MISSING'));
                        }
                    }
                    console.log('\n🔗 Checking Business Locations View:');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('*')
                            .limit(3)];
                case 6:
                    _e = _f.sent(), businessLocations = _e.data, viewError = _e.error;
                    if (viewError) {
                        console.log('❌ business_locations view: NOT FOUND');
                        console.log('   Error:', viewError.message);
                    }
                    else {
                        console.log('✅ business_locations view: EXISTS');
                        console.log("   Records: ".concat((businessLocations === null || businessLocations === void 0 ? void 0 : businessLocations.length) || 0));
                        if (businessLocations && businessLocations.length > 0) {
                            console.log('   Sample business:', businessLocations[0].name);
                            console.log('   Full address:', businessLocations[0].full_address);
                        }
                    }
                    console.log('\n📊 Summary:');
                    tablesExist = !provincesError && !districtsError && !subDistrictsError;
                    businessesUpdated = !businessesError && businesses && businesses.length > 0 && businesses[0].province_id;
                    viewExists = !viewError;
                    if (tablesExist && businessesUpdated && viewExists) {
                        console.log('🎉 SUCCESS: Geographic hierarchy is fully implemented!');
                    }
                    else if (tablesExist) {
                        console.log('⚠️  PARTIAL: Tables exist but migration may be incomplete');
                    }
                    else {
                        console.log('❌ FAILED: Geographic hierarchy tables not found');
                        console.log('   Please run the SQL migration script in Supabase');
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _f.sent();
                    console.error('💥 Database check failed:', error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the check
checkDatabase();
