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
function populateGeographicData() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, businesses, businessesError, huaHinBusinesses, _i, huaHinBusinesses_1, business, updateError, updateAllError, _b, updatedBusinesses, verifyError, _c, viewData, viewError, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🔍 Checking current business addresses...\n');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('id, name, address, province_id')
                            .order('name')];
                case 2:
                    _a = _d.sent(), businesses = _a.data, businessesError = _a.error;
                    if (businessesError) {
                        console.log('❌ Error querying businesses:', businessesError.message);
                        return [2 /*return*/];
                    }
                    console.log('📋 Current businesses:');
                    businesses === null || businesses === void 0 ? void 0 : businesses.forEach(function (business, index) {
                        console.log("".concat(index + 1, ". ").concat(business.name));
                        console.log("   Address: \"".concat(business.address, "\""));
                        console.log("   Province ID: ".concat(business.province_id || 'NULL'));
                        console.log('');
                    });
                    huaHinBusinesses = businesses === null || businesses === void 0 ? void 0 : businesses.filter(function (b) {
                        return b.address.toLowerCase().includes('hua hin');
                    });
                    console.log("\uD83C\uDFD6\uFE0F  Businesses containing \"hua hin\": ".concat((huaHinBusinesses === null || huaHinBusinesses === void 0 ? void 0 : huaHinBusinesses.length) || 0));
                    if (!(huaHinBusinesses && huaHinBusinesses.length > 0)) return [3 /*break*/, 7];
                    console.log('Found Hua Hin businesses - updating them...');
                    _i = 0, huaHinBusinesses_1 = huaHinBusinesses;
                    _d.label = 3;
                case 3:
                    if (!(_i < huaHinBusinesses_1.length)) return [3 /*break*/, 6];
                    business = huaHinBusinesses_1[_i];
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .update({
                            province_id: '11111111-1111-1111-1111-111111111111', // Prachuap Khiri Khan
                            district_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Hua Hin District
                            sub_district_id: '11111111-aaaa-aaaa-aaaa-111111111111', // Hua Hin Sub-district
                            address_line: business.address.replace(/hua hin.*/i, '').trim(),
                            postal_code: '77110'
                        })
                            .eq('id', business.id)];
                case 4:
                    updateError = (_d.sent()).error;
                    if (updateError) {
                        console.log("\u274C Error updating ".concat(business.name, ":"), updateError.message);
                    }
                    else {
                        console.log("\u2705 Updated ".concat(business.name));
                    }
                    _d.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    // If no "hua hin" matches, let's try a broader approach
                    console.log('🔄 No "hua hin" matches found. Trying broader search...');
                    // Let's update all businesses to have some geographic data for testing
                    // We'll assign them all to Hua Hin for now since that's our test area
                    console.log('📍 Assigning all businesses to Hua Hin for testing...');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .update({
                            province_id: '11111111-1111-1111-1111-111111111111', // Prachuap Khiri Khan
                            district_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Hua Hin District
                            sub_district_id: '11111111-aaaa-aaaa-aaaa-111111111111', // Hua Hin Sub-district
                            postal_code: '77110'
                        })
                            .is('province_id', null)];
                case 8:
                    updateAllError = (_d.sent()).error;
                    if (updateAllError) {
                        console.log('❌ Error updating businesses:', updateAllError.message);
                    }
                    else {
                        console.log('✅ Updated all businesses with geographic data');
                    }
                    _d.label = 9;
                case 9:
                    // Verify the update worked
                    console.log('\n🔍 Verifying updates...');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('name, province_id, district_id, sub_district_id, postal_code')
                            .limit(3)];
                case 10:
                    _b = _d.sent(), updatedBusinesses = _b.data, verifyError = _b.error;
                    if (verifyError) {
                        console.log('❌ Error verifying:', verifyError.message);
                    }
                    else {
                        console.log('📊 Updated businesses:');
                        updatedBusinesses === null || updatedBusinesses === void 0 ? void 0 : updatedBusinesses.forEach(function (business) {
                            console.log("   ".concat(business.name, ":"));
                            console.log("     Province: ".concat(business.province_id ? '✅' : '❌'));
                            console.log("     District: ".concat(business.district_id ? '✅' : '❌'));
                            console.log("     Sub-district: ".concat(business.sub_district_id ? '✅' : '❌'));
                            console.log("     Postal code: ".concat(business.postal_code || 'NULL'));
                        });
                    }
                    // Test the view
                    console.log('\n🔗 Testing business_locations view:');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, full_address, province_name, district_name')
                            .limit(2)];
                case 11:
                    _c = _d.sent(), viewData = _c.data, viewError = _c.error;
                    if (viewError) {
                        console.log('❌ View error:', viewError.message);
                    }
                    else {
                        console.log('✅ View results:');
                        viewData === null || viewData === void 0 ? void 0 : viewData.forEach(function (business) {
                            console.log("   ".concat(business.name, ": ").concat(business.full_address));
                            console.log("     Province: ".concat(business.province_name || 'NULL'));
                            console.log("     District: ".concat(business.district_name || 'NULL'));
                        });
                    }
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _d.sent();
                    console.error('💥 Population failed:', error_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// Run the population
populateGeographicData();
