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
import { createClient } from '@supabase/supabase-js';
// Use the correct credentials from .env file
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function finalVerification() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, geoBusinesses, geoError, statuses, _b, viewData, viewError, _c, huaHinBusinesses, filterError, hasGeoData, viewWorking, filteringWorks, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🎯 Final Geographic Hierarchy Verification\n');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    // Check businesses with geographic data
                    console.log('📍 Checking businesses with geographic data:');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('name, address, province_id, district_id, sub_district_id, postal_code, partnership_status')
                            .not('province_id', 'is', null)
                            .limit(5)];
                case 2:
                    _a = _d.sent(), geoBusinesses = _a.data, geoError = _a.error;
                    if (geoError) {
                        console.log('❌ Error:', geoError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.length) || 0, " businesses with geographic data"));
                        geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.forEach(function (business, index) {
                            console.log("".concat(index + 1, ". ").concat(business.name));
                            console.log("   Province ID: ".concat(business.province_id));
                            console.log("   District ID: ".concat(business.district_id));
                            console.log("   Sub-district ID: ".concat(business.sub_district_id));
                            console.log("   Postal Code: ".concat(business.postal_code));
                            console.log("   Partnership Status: \"".concat(business.partnership_status, "\""));
                            console.log('');
                        });
                        statuses = Array.from(new Set((geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.map(function (b) { return b.partnership_status; })) || []));
                        console.log("\uD83D\uDD0D Partnership statuses found: ".concat(statuses.join(', ')));
                        console.log("\uD83D\uDCA1 Note: The view filters for 'active' status only");
                    }
                    // Test the business_locations view with geographic data
                    console.log('🔗 Testing business_locations view:');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, full_address, province_name, district_name, sub_district_name')
                            .not('province_name', 'is', null)
                            .limit(5)];
                case 3:
                    _b = _d.sent(), viewData = _b.data, viewError = _b.error;
                    if (viewError) {
                        console.log('❌ View error:', viewError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((viewData === null || viewData === void 0 ? void 0 : viewData.length) || 0, " businesses in view with geographic data"));
                        viewData === null || viewData === void 0 ? void 0 : viewData.forEach(function (business, index) {
                            console.log("".concat(index + 1, ". ").concat(business.name));
                            console.log("   Province: ".concat(business.province_name));
                            console.log("   District: ".concat(business.district_name));
                            console.log("   Sub-district: ".concat(business.sub_district_name));
                            console.log("   Full Address: ".concat(business.full_address));
                            console.log('');
                        });
                    }
                    // Test geographic filtering
                    console.log('🏖️  Testing geographic filtering (Hua Hin District):');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, district_name, province_name')
                            .eq('district_name', 'Hua Hin')
                            .limit(10)];
                case 4:
                    _c = _d.sent(), huaHinBusinesses = _c.data, filterError = _c.error;
                    if (filterError) {
                        console.log('❌ Filter error:', filterError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((huaHinBusinesses === null || huaHinBusinesses === void 0 ? void 0 : huaHinBusinesses.length) || 0, " businesses in Hua Hin District"));
                        huaHinBusinesses === null || huaHinBusinesses === void 0 ? void 0 : huaHinBusinesses.forEach(function (business, index) {
                            console.log("".concat(index + 1, ". ").concat(business.name, " (").concat(business.district_name, ", ").concat(business.province_name, ")"));
                        });
                    }
                    // Summary
                    console.log('\n📊 FINAL SUMMARY:');
                    hasGeoData = geoBusinesses && geoBusinesses.length > 0;
                    viewWorking = viewData && viewData.length > 0;
                    filteringWorks = huaHinBusinesses && huaHinBusinesses.length > 0;
                    if (hasGeoData && viewWorking && filteringWorks) {
                        console.log('🎉 SUCCESS: Geographic hierarchy is FULLY IMPLEMENTED and WORKING!');
                        console.log('✅ Tables created');
                        console.log('✅ Columns added to businesses table');
                        console.log('✅ Data populated for Hua Hin businesses');
                        console.log('✅ Business locations view working');
                        console.log('✅ Geographic filtering functional');
                        console.log('\n🚀 Ready for production use!');
                    }
                    else {
                        console.log('⚠️  Issues found:');
                        if (!hasGeoData)
                            console.log('❌ No businesses have geographic data');
                        if (!viewWorking)
                            console.log('❌ Business locations view not working');
                        if (!filteringWorks)
                            console.log('❌ Geographic filtering not working');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    console.error('💥 Verification failed:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the verification
finalVerification();
