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
function checkViewIssue() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, geoBusinesses, geoError, statuses, _b, allViewData, allViewError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🔍 Diagnosing business_locations view issue...\n');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    // First check businesses with geographic data and their partnership status
                    console.log('📊 Checking businesses with geographic data:');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('name, partnership_status, province_id')
                            .not('province_id', 'is', null)
                            .limit(5)];
                case 2:
                    _a = _c.sent(), geoBusinesses = _a.data, geoError = _a.error;
                    if (geoError) {
                        console.log('❌ Error:', geoError.message);
                        return [2 /*return*/];
                    }
                    console.log("Found ".concat((geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.length) || 0, " businesses with geographic data:"));
                    geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.forEach(function (business, index) {
                        console.log("".concat(index + 1, ". ").concat(business.name, " - Status: \"").concat(business.partnership_status, "\""));
                    });
                    statuses = Array.from(new Set((geoBusinesses === null || geoBusinesses === void 0 ? void 0 : geoBusinesses.map(function (b) { return b.partnership_status; })) || []));
                    console.log("\nPartnership statuses found: ".concat(statuses.join(', ')));
                    // Test the view without any WHERE clause to see all records
                    console.log('\n🔗 Testing business_locations view (all records):');
                    return [4 /*yield*/, supabase
                            .from('business_locations')
                            .select('name, partnership_status, province_name')
                            .limit(10)];
                case 3:
                    _b = _c.sent(), allViewData = _b.data, allViewError = _b.error;
                    if (allViewError) {
                        console.log('❌ View error:', allViewError.message);
                    }
                    else {
                        console.log("\u2705 View returned ".concat((allViewData === null || allViewData === void 0 ? void 0 : allViewData.length) || 0, " records"));
                        allViewData === null || allViewData === void 0 ? void 0 : allViewData.forEach(function (business, index) {
                            console.log("".concat(index + 1, ". ").concat(business.name, " (").concat(business.partnership_status, ") - Province: ").concat(business.province_name || 'NULL'));
                        });
                    }
                    // Check if the issue is the 'active' filter
                    console.log('\n🎯 The issue is likely the partnership_status filter in the view.');
                    console.log('The view filters for partnership_status = \'active\' but your businesses might have different statuses.');
                    if (statuses.length > 0 && !statuses.includes('active')) {
                        console.log("\n\uD83D\uDCA1 SOLUTION: Update businesses to have 'active' status or modify the view.");
                        console.log("Current statuses: ".concat(statuses.join(', ')));
                        console.log("Expected status: 'active'");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error('💥 Check failed:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Run the check
checkViewIssue();
