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
// [2024-12-19 22:55] - Check existing users in unified authentication system
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function checkExistingUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var currentUser, _a, users, usersError, _b, adminProfiles, adminError, _c, partnerProfiles, partnerError, _d, consumerProfiles, consumerError, testCredentials, _i, testCredentials_1, cred, error, err_1, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('🔍 Checking existing users in unified auth system...\n');
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 2:
                    currentUser = (_e.sent()).data.user;
                    console.log('Current authenticated user:', (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) || 'None');
                    return [4 /*yield*/, supabase
                            .from('users')
                            .select('*')];
                case 3:
                    _a = _e.sent(), users = _a.data, usersError = _a.error;
                    if (usersError) {
                        console.log('❌ Users table error:', usersError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((users === null || users === void 0 ? void 0 : users.length) || 0, " users in users table"));
                        users === null || users === void 0 ? void 0 : users.forEach(function (user) {
                            console.log("   \uD83D\uDCE7 ".concat(user.email, " - ").concat(user.first_name, " ").concat(user.last_name));
                        });
                    }
                    return [4 /*yield*/, supabase
                            .from('admin_profiles')
                            .select('*')];
                case 4:
                    _b = _e.sent(), adminProfiles = _b.data, adminError = _b.error;
                    if (adminError) {
                        console.log('❌ Admin profiles error:', adminError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((adminProfiles === null || adminProfiles === void 0 ? void 0 : adminProfiles.length) || 0, " admin profiles"));
                    }
                    return [4 /*yield*/, supabase
                            .from('partners')
                            .select('*')];
                case 5:
                    _c = _e.sent(), partnerProfiles = _c.data, partnerError = _c.error;
                    if (partnerError) {
                        console.log('❌ Partner profiles error:', partnerError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((partnerProfiles === null || partnerProfiles === void 0 ? void 0 : partnerProfiles.length) || 0, " partner profiles"));
                    }
                    return [4 /*yield*/, supabase
                            .from('consumer_profiles')
                            .select('*')];
                case 6:
                    _d = _e.sent(), consumerProfiles = _d.data, consumerError = _d.error;
                    if (consumerError) {
                        console.log('❌ Consumer profiles error:', consumerError.message);
                    }
                    else {
                        console.log("\u2705 Found ".concat((consumerProfiles === null || consumerProfiles === void 0 ? void 0 : consumerProfiles.length) || 0, " consumer profiles"));
                    }
                    // Test specific user logins
                    console.log('\n🧪 Testing user logins...');
                    testCredentials = [
                        { email: 'admin@localplus.com', password: 'admin123' },
                        { email: 'shannon@localplus.com', password: 'testpass123' },
                        { email: 'consumer@localplus.com', password: 'consumer123' }
                    ];
                    _i = 0, testCredentials_1 = testCredentials;
                    _e.label = 7;
                case 7:
                    if (!(_i < testCredentials_1.length)) return [3 /*break*/, 15];
                    cred = testCredentials_1[_i];
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 13, , 14]);
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: cred.email,
                            password: cred.password
                        })];
                case 9:
                    error = (_e.sent()).error;
                    if (!error) return [3 /*break*/, 10];
                    console.log("\u274C ".concat(cred.email, ": ").concat(error.message));
                    return [3 /*break*/, 12];
                case 10:
                    console.log("\u2705 ".concat(cred.email, ": Login successful"));
                    // Sign out immediately
                    return [4 /*yield*/, supabase.auth.signOut()];
                case 11:
                    // Sign out immediately
                    _e.sent();
                    _e.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_1 = _e.sent();
                    console.log("\u274C ".concat(cred.email, ": ").concat(err_1));
                    return [3 /*break*/, 14];
                case 14:
                    _i++;
                    return [3 /*break*/, 7];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_1 = _e.sent();
                    console.error('Error checking users:', error_1);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
checkExistingUsers().catch(console.error);
