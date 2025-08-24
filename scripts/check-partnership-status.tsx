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
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function checkPartnershipStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, businesses, error, statusCounts_1, _b, allViewData, allError, _c, statusData, statusError, viewStatuses, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('🔍 Checking partnership status values...\n');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('name, partnership_status, province_id')
                            .not('province_id', 'is', null)
                            .limit(10)];
                case 2:
                    _a = _d.sent(), businesses = _a.data, error = _a.error;
                    if (error) {
                        console.log('❌ Error:', error.message);
                        return [2 /*return*/];
                    }
                    console.log('📊 Businesses with geographic data and their partnership status:');
                    statusCounts_1 = {};
                    businesses === null || businesses === void 0 ? void 0 : businesses.forEach(function (business, index) {
                        console.log("".concat(index + 1, ". ").concat(business.name));
                        console.log("   Partnership Status: \"".concat(business.partnership_status, "\""));
                        console.log('');
                        statusCounts_1[business.partnership_status] = (statusCounts_1[business.partnership_status] || 0) + 1;
                    });
                    console.log('📈 Partnership Status Summary:');
                    Object.entries(statusCounts_1).forEach(function (_a) {
                        var status = _a[0], count = _a[1];
                        console.log("   \"".concat(status, "\": ").concat(count, " businesses"));
                    });
                    // Test the view with different filters
                    console.log('\n🔗 Testing business_locations view with different filters:');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, partnership_status, province_name')
                            .limit(5)];
                case 3:
                    _b = _d.sent(), allViewData = _b.data, allError = _b.error;
                    if (allError) {
                        console.log('❌ All view error:', allError.message);
                    }
                    else {
                        console.log("\u2705 All businesses in view: ".concat((allViewData === null || allViewData === void 0 ? void 0 : allViewData.length) || 0));
                        allViewData === null || allViewData === void 0 ? void 0 : allViewData.forEach(function (business) {
                            console.log("   ".concat(business.name, " (").concat(business.partnership_status, ") - Province: ").concat(business.province_name || 'NULL'));
                        });
                    }
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('partnership_status')
                            .not('province_name', 'is', null)];
                case 4:
                    _c = _d.sent(), statusData = _c.data, statusError = _c.error;
                    if (statusError) {
                        console.log('❌ Status check error:', statusError.message);
                    }
                    else {
                        console.log("\n\uD83D\uDCCB Partnership statuses in view: ".concat((statusData === null || statusData === void 0 ? void 0 : statusData.length) || 0, " records"));
                        viewStatuses = Array.from(new Set(statusData === null || statusData === void 0 ? void 0 : statusData.map(function (d) { return d.partnership_status; })));
                        viewStatuses.forEach(function (status) {
                            console.log("   \"".concat(status, "\""));
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    console.error('💥 Check failed:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the check
checkPartnershipStatus();
