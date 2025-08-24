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
// [2024-12-19] - Business service for signup and partner operations
import { createClient } from '@supabase/supabase-js';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
// Regular client for authenticated operations
var supabase = createClient(supabaseUrl, anonKey);
// [2024-12-19] - Vercel API routes URL (production-ready)
var API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://localplus-v2.vercel.app' // Your Vercel domain
    : 'http://localhost:3014'; // Partner app port for development
export var businessService = {
    // Get businesses for signup (uses Vercel API routes)
    getBusinessesForSignup: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, businesses, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('🔒 Fetching businesses via Vercel API routes...');
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/businesses"))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("API request failed: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        businesses = (_a.sent()).businesses;
                        console.log("\u2705 Successfully fetched ".concat((businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0, " businesses via Vercel API"));
                        return [2 /*return*/, businesses || []];
                    case 3:
                        err_1 = _a.sent();
                        console.error('❌ Error fetching businesses via Vercel API:', err_1);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Get businesses for authenticated users (uses regular client)
    getBusinessesForUser: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('id, name, partnership_status')
                                .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Error fetching businesses for user:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        err_2 = _b.sent();
                        console.error('❌ Unexpected error fetching user businesses:', err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Get active businesses only
    getActiveBusinesses: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase
                                .from('businesses')
                                .select('id, name, partnership_status')
                                .eq('partnership_status', 'active')
                                .order('name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('❌ Error fetching active businesses:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        err_3 = _b.sent();
                        console.error('❌ Unexpected error fetching active businesses:', err_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Link user to business (uses Vercel API routes)
    linkUserToBusiness: function (userId_1, businessId_1) {
        return __awaiter(this, arguments, void 0, function (userId, businessId, role) {
            var response, result, err_4;
            if (role === void 0) { role = 'owner'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/api/link-user-business"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    businessId: businessId,
                                    role: role
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Link request failed: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        if (result.success) {
                            console.log('✅ User linked to business successfully via Vercel API');
                            return [2 /*return*/, true];
                        }
                        else {
                            console.error('❌ Failed to link user to business:', result.error);
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.error('❌ Unexpected error linking user to business:', err_4);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
