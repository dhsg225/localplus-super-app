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
function verifyColumns() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, businesses, businessesError, sample_1, _b, viewData, viewError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🔍 Verifying Database Schema...\n');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    // Try to select all columns from businesses table to see what exists
                    console.log('📋 Checking businesses table structure:');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('*')
                            .limit(1)];
                case 2:
                    _a = _c.sent(), businesses = _a.data, businessesError = _a.error;
                    if (businessesError) {
                        console.log('❌ Error querying businesses:', businessesError.message);
                        return [2 /*return*/];
                    }
                    if (businesses && businesses.length > 0) {
                        sample_1 = businesses[0];
                        console.log('✅ Sample business record found');
                        console.log('📊 Available columns:');
                        Object.keys(sample_1).forEach(function (key) {
                            console.log("   - ".concat(key, ": ").concat(typeof sample_1[key], " ").concat(sample_1[key] !== null ? '(has value)' : '(null)'));
                        });
                        // Check specifically for geographic columns
                        console.log('\n🗺️  Geographic columns status:');
                        console.log("   province_id: ".concat(sample_1.hasOwnProperty('province_id') ? '✅ EXISTS' : '❌ MISSING'));
                        console.log("   district_id: ".concat(sample_1.hasOwnProperty('district_id') ? '✅ EXISTS' : '❌ MISSING'));
                        console.log("   sub_district_id: ".concat(sample_1.hasOwnProperty('sub_district_id') ? '✅ EXISTS' : '❌ MISSING'));
                        console.log("   address_line: ".concat(sample_1.hasOwnProperty('address_line') ? '✅ EXISTS' : '❌ MISSING'));
                        console.log("   postal_code: ".concat(sample_1.hasOwnProperty('postal_code') ? '✅ EXISTS' : '❌ MISSING'));
                        // If columns exist, show their values
                        if (sample_1.hasOwnProperty('province_id')) {
                            console.log('\n📍 Geographic data values:');
                            console.log("   province_id: ".concat(sample_1.province_id || 'NULL'));
                            console.log("   district_id: ".concat(sample_1.district_id || 'NULL'));
                            console.log("   sub_district_id: ".concat(sample_1.sub_district_id || 'NULL'));
                            console.log("   address_line: ".concat(sample_1.address_line || 'NULL'));
                            console.log("   postal_code: ".concat(sample_1.postal_code || 'NULL'));
                        }
                    }
                    // Also test the business_locations view
                    console.log('\n🔗 Testing business_locations view:');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, full_address, province_name, district_name')
                            .limit(1)];
                case 3:
                    _b = _c.sent(), viewData = _b.data, viewError = _b.error;
                    if (viewError) {
                        console.log('❌ View error:', viewError.message);
                    }
                    else if (viewData && viewData.length > 0) {
                        console.log('✅ View working:');
                        console.log("   Business: ".concat(viewData[0].name));
                        console.log("   Full address: ".concat(viewData[0].full_address));
                        console.log("   Province: ".concat(viewData[0].province_name || 'NULL'));
                        console.log("   District: ".concat(viewData[0].district_name || 'NULL'));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error('💥 Verification failed:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Run the verification
verifyColumns();
