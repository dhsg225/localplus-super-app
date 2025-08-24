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
// [2024-12-19 22:25] - Check existing authentication tables before migration
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function checkAuthTables() {
    return __awaiter(this, void 0, void 0, function () {
        var tablesToCheck, _i, tablesToCheck_1, table, _a, data, error, err_1, user, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🔍 Checking existing authentication tables...\n');
                    tablesToCheck = [
                        'users',
                        'consumer_profiles',
                        'admin_profiles',
                        'user_roles',
                        'partners'
                    ];
                    _i = 0, tablesToCheck_1 = tablesToCheck;
                    _b.label = 1;
                case 1:
                    if (!(_i < tablesToCheck_1.length)) return [3 /*break*/, 6];
                    table = tablesToCheck_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, supabase
                            .from(table)
                            .select('*')
                            .limit(1)];
                case 3:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        if (error.code === '42P01') { // Table does not exist
                            console.log("\u274C Table '".concat(table, "' does not exist"));
                        }
                        else {
                            console.log("\u26A0\uFE0F  Table '".concat(table, "' exists but error: ").concat(error.message));
                        }
                    }
                    else {
                        console.log("\u2705 Table '".concat(table, "' exists (").concat((data === null || data === void 0 ? void 0 : data.length) || 0, " sample records)"));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log("\u274C Error checking table '".concat(table, "':"), err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log('\n🔍 Checking auth.users table...');
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 8:
                    user = (_b.sent()).data.user;
                    console.log("\u2705 Auth system accessible, current user: ".concat((user === null || user === void 0 ? void 0 : user.email) || 'none'));
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _b.sent();
                    console.log('❌ Error accessing auth system:', err_2);
                    return [3 /*break*/, 10];
                case 10:
                    console.log('\n📋 Migration Plan:');
                    console.log('1. Deploy unified-auth-schema.sql');
                    console.log('2. Migrate existing partner data');
                    console.log('3. Update apps to use unified auth service');
                    console.log('4. Test cross-app authentication');
                    return [2 /*return*/];
            }
        });
    });
}
checkAuthTables().catch(console.error);
