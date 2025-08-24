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
// Script to add test data for curation pipeline
import { createClient } from '@supabase/supabase-js';
// Use the environment that's working in the app
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWt1bnByYWhnZGh2ZGh6bXV3bCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMzODg5MTM4LCJleHAiOjIwNDk0NjUxMzh9.Nb0-3QGFcM-xC2YzctGKmKT_QbYK8W_v5BwDPHEhb4E';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var testBusinesses = [
    {
        google_place_id: 'test_place_1',
        name: 'Bangkok Rooftop Bar',
        address: 'Sukhumvit Road, Bangkok 10110',
        latitude: 13.7563,
        longitude: 100.5018,
        phone: '+66-2-123-4567',
        website_url: 'https://bangkokrooftop.com',
        google_rating: 4.3,
        google_review_count: 156,
        google_price_level: 3,
        google_types: ['bar', 'establishment', 'point_of_interest'],
        primary_category: 'Entertainment',
        quality_score: 85,
        curation_status: 'pending',
        discovery_source: 'Bangkok Entertainment Campaign'
    },
    {
        google_place_id: 'test_place_2',
        name: 'Organic Health Cafe',
        address: 'Thonglor District, Bangkok 10110',
        latitude: 13.7307,
        longitude: 100.5418,
        phone: '+66-2-987-6543',
        google_rating: 4.1,
        google_review_count: 89,
        google_price_level: 2,
        google_types: ['cafe', 'restaurant', 'food'],
        primary_category: 'Restaurants',
        quality_score: 72,
        curation_status: 'pending',
        discovery_source: 'Healthy Restaurants Campaign'
    },
    {
        google_place_id: 'test_place_3',
        name: 'Luxury Spa Retreat',
        address: 'Silom Road, Bangkok 10500',
        latitude: 13.7244,
        longitude: 100.5347,
        website_url: 'https://luxuryspa.com',
        google_rating: 4.7,
        google_review_count: 234,
        google_price_level: 4,
        google_types: ['spa', 'beauty_salon', 'health'],
        primary_category: 'Wellness',
        quality_score: 92,
        curation_status: 'pending',
        discovery_source: 'Bangkok Wellness Campaign'
    }
];
function addTestData() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Adding test data for curation pipeline...\n');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase
                            .from('suggested_businesses')
                            .insert(testBusinesses)
                            .select()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('❌ Error adding test businesses:', error.message);
                        return [2 /*return*/];
                    }
                    console.log("\u2705 Added ".concat((data === null || data === void 0 ? void 0 : data.length) || 0, " test businesses"));
                    // Show what was added
                    data === null || data === void 0 ? void 0 : data.forEach(function (business, index) {
                        console.log("   ".concat(index + 1, ". ").concat(business.name, " (Quality: ").concat(business.quality_score, ")"));
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('💥 Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
addTestData().then(function () {
    console.log('\n🎉 Test data setup complete!');
}).catch(console.error);
