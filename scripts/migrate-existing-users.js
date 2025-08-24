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
// [2024-12-19 23:15] - Migrate existing users to unified authentication system
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4ODQ3MDQsImV4cCI6MjA0ODQ2MDcwNH0.VYITvmhZYzqRLnNTwxnqtJjZjNOLSuiILGfZBfOKSh8';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function migrateExistingUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, authUsers, authError, _b, existingUnifiedUsers, unifiedError, existingIds, migratedCount, _i, _c, authUser, userError, userRole, roleError, adminError, consumerError, error_1, _d, finalCount, countError, error_2;
        var _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    console.log('🔄 Starting user migration to unified authentication system...');
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, 16, , 17]);
                    // Step 1: Get all existing users from auth.users
                    console.log('📋 Fetching existing users from auth.users...');
                    return [4 /*yield*/, supabase.auth.admin.listUsers()];
                case 2:
                    _a = _o.sent(), authUsers = _a.data, authError = _a.error;
                    if (authError) {
                        console.error('❌ Error fetching auth users:', authError);
                        return [2 /*return*/];
                    }
                    console.log("\uD83D\uDCCA Found ".concat(authUsers.users.length, " users in auth.users"));
                    return [4 /*yield*/, supabase
                            .from('users')
                            .select('id, email')];
                case 3:
                    _b = _o.sent(), existingUnifiedUsers = _b.data, unifiedError = _b.error;
                    if (unifiedError) {
                        console.error('❌ Error fetching unified users:', unifiedError);
                        return [2 /*return*/];
                    }
                    existingIds = new Set((existingUnifiedUsers === null || existingUnifiedUsers === void 0 ? void 0 : existingUnifiedUsers.map(function (u) { return u.id; })) || []);
                    console.log("\uD83D\uDCCA Found ".concat((existingUnifiedUsers === null || existingUnifiedUsers === void 0 ? void 0 : existingUnifiedUsers.length) || 0, " users already in unified system"));
                    migratedCount = 0;
                    _i = 0, _c = authUsers.users;
                    _o.label = 4;
                case 4:
                    if (!(_i < _c.length)) return [3 /*break*/, 14];
                    authUser = _c[_i];
                    if (existingIds.has(authUser.id)) {
                        console.log("\u23ED\uFE0F  Skipping ".concat(authUser.email, " - already in unified system"));
                        return [3 /*break*/, 13];
                    }
                    console.log("\uD83D\uDD04 Migrating user: ".concat(authUser.email));
                    _o.label = 5;
                case 5:
                    _o.trys.push([5, 12, , 13]);
                    return [4 /*yield*/, supabase
                            .from('users')
                            .insert({
                            id: authUser.id,
                            email: authUser.email,
                            first_name: ((_e = authUser.user_metadata) === null || _e === void 0 ? void 0 : _e.firstName) || ((_f = authUser.user_metadata) === null || _f === void 0 ? void 0 : _f.first_name) || '',
                            last_name: ((_g = authUser.user_metadata) === null || _g === void 0 ? void 0 : _g.lastName) || ((_h = authUser.user_metadata) === null || _h === void 0 ? void 0 : _h.last_name) || '',
                            phone: ((_j = authUser.user_metadata) === null || _j === void 0 ? void 0 : _j.phone) || authUser.phone || '',
                            avatar_url: ((_k = authUser.user_metadata) === null || _k === void 0 ? void 0 : _k.avatar_url) || '',
                            is_active: true,
                            created_at: authUser.created_at,
                            updated_at: new Date().toISOString()
                        })];
                case 6:
                    userError = (_o.sent()).error;
                    if (userError) {
                        console.error("\u274C Error inserting user ".concat(authUser.email, ":"), userError);
                        return [3 /*break*/, 13];
                    }
                    userRole = 'consumer';
                    if (authUser.email.includes('admin') || ((_l = authUser.user_metadata) === null || _l === void 0 ? void 0 : _l.role) === 'admin') {
                        userRole = 'admin';
                    }
                    else if (((_m = authUser.user_metadata) === null || _m === void 0 ? void 0 : _m.role) === 'partner') {
                        userRole = 'partner';
                    }
                    return [4 /*yield*/, supabase
                            .from('user_roles')
                            .insert({
                            user_id: authUser.id,
                            role: userRole
                        })];
                case 7:
                    roleError = (_o.sent()).error;
                    if (roleError) {
                        console.error("\u274C Error inserting role for ".concat(authUser.email, ":"), roleError);
                    }
                    if (!(userRole === 'admin')) return [3 /*break*/, 9];
                    return [4 /*yield*/, supabase
                            .from('admin_profiles')
                            .insert({
                            user_id: authUser.id,
                            permissions: ['view_dashboard', 'manage_businesses'],
                            department: 'operations'
                        })];
                case 8:
                    adminError = (_o.sent()).error;
                    if (adminError) {
                        console.error("\u274C Error creating admin profile for ".concat(authUser.email, ":"), adminError);
                    }
                    return [3 /*break*/, 11];
                case 9:
                    if (!(userRole === 'consumer')) return [3 /*break*/, 11];
                    return [4 /*yield*/, supabase
                            .from('consumer_profiles')
                            .insert({
                            user_id: authUser.id,
                            preferences: {
                                language: 'en',
                                currency: 'THB',
                                notifications: {
                                    email: true,
                                    push: true,
                                    sms: false,
                                    deals: true,
                                    events: true,
                                    reminders: true
                                },
                                dietary: {
                                    vegetarian: false,
                                    vegan: false,
                                    halal: false,
                                    glutenFree: false,
                                    allergies: []
                                },
                                cuisinePreferences: [],
                                priceRange: { min: 100, max: 1000 },
                                favoriteDistricts: []
                            }
                        })];
                case 10:
                    consumerError = (_o.sent()).error;
                    if (consumerError) {
                        console.error("\u274C Error creating consumer profile for ".concat(authUser.email, ":"), consumerError);
                    }
                    _o.label = 11;
                case 11:
                    migratedCount++;
                    console.log("\u2705 Successfully migrated ".concat(authUser.email, " as ").concat(userRole));
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _o.sent();
                    console.error("\u274C Error migrating user ".concat(authUser.email, ":"), error_1);
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 4];
                case 14:
                    console.log("\uD83C\uDF89 Migration completed! Migrated ".concat(migratedCount, " users to unified system"));
                    return [4 /*yield*/, supabase
                            .from('users')
                            .select('id', { count: 'exact' })];
                case 15:
                    _d = _o.sent(), finalCount = _d.data, countError = _d.error;
                    if (!countError) {
                        console.log("\uD83D\uDCCA Total users in unified system: ".concat((finalCount === null || finalCount === void 0 ? void 0 : finalCount.length) || 0));
                    }
                    return [3 /*break*/, 17];
                case 16:
                    error_2 = _o.sent();
                    console.error('❌ Migration failed:', error_2);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// Run migration if called directly
if (require.main === module) {
    migrateExistingUsers()
        .then(function () {
        console.log('✅ Migration script completed');
        process.exit(0);
    })
        .catch(function (error) {
        console.error('❌ Migration script failed:', error);
        process.exit(1);
    });
}
export { migrateExistingUsers };
