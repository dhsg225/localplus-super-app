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
// [2024-12-19 22:25] - Deploy unified authentication schema
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
var supabaseUrl = 'https://joknprahhqdhvdhzmuwl.supabase.co';
var supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTI3MTAsImV4cCI6MjA2NTIyODcxMH0.YYkEkYFWgd_4-OtgG47xj6b5MX_fu7zNQxrW9ymR8Xk';
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function deployUnifiedAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var schemaPath, schema, _a, businesses, bizError, _b, partners, partnerError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🚀 Deploying Unified Authentication Schema...\n');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    schemaPath = join(process.cwd(), 'shared', 'database', 'unified-auth-schema.sql');
                    schema = readFileSync(schemaPath, 'utf-8');
                    console.log('📄 Schema file loaded successfully');
                    console.log("\uD83D\uDCCF Schema size: ".concat(schema.length, " characters\n"));
                    // Note: We can't execute raw SQL directly with the anon key
                    // This would need to be done via Supabase Dashboard or with service role key
                    console.log('⚠️  IMPORTANT: Raw SQL execution requires admin access');
                    console.log('📋 Manual deployment steps:');
                    console.log('1. Go to Supabase Dashboard → SQL Editor');
                    console.log('2. Copy the contents of shared/database/unified-auth-schema.sql');
                    console.log('3. Paste and execute the SQL');
                    console.log('4. Verify tables are created\n');
                    // Instead, let's try to verify what we can access
                    console.log('🔍 Testing current database access...');
                    return [4 /*yield*/, supabase
                            .from('businesses')
                            .select('id, name')
                            .limit(3)];
                case 2:
                    _a = _c.sent(), businesses = _a.data, bizError = _a.error;
                    if (bizError) {
                        console.log('❌ Cannot access businesses table:', bizError.message);
                    }
                    else {
                        console.log("\u2705 Can access businesses table (".concat((businesses === null || businesses === void 0 ? void 0 : businesses.length) || 0, " records)"));
                    }
                    return [4 /*yield*/, supabase
                            .from('partners')
                            .select('*')
                            .limit(1)];
                case 3:
                    _b = _c.sent(), partners = _b.data, partnerError = _b.error;
                    if (partnerError) {
                        console.log('❌ Cannot access partners table:', partnerError.message);
                    }
                    else {
                        console.log("\u2705 Can access partners table (".concat((partners === null || partners === void 0 ? void 0 : partners.length) || 0, " records)"));
                    }
                    console.log('\n🎯 Next Steps:');
                    console.log('1. Manually deploy the schema via Supabase Dashboard');
                    console.log('2. Run: npx tsx scripts/verify-unified-auth.ts');
                    console.log('3. Update partner app to use unified auth');
                    console.log('4. Test authentication flow');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error('❌ Error during deployment:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
deployUnifiedAuth().catch(console.error);
