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
var supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
// Generic Express-style handler
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, _a, user_id, loyalty_program_id, _b, userStamp, fetchError, newStamps, isCompleted, updateError, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (req.method !== 'POST') {
                        return [2 /*return*/, res.status(405).json({ error: 'Method not allowed' })];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    payload = req.body;
                    _a = typeof payload === 'string' ? JSON.parse(payload) : payload, user_id = _a.user_id, loyalty_program_id = _a.loyalty_program_id;
                    if (!user_id || !loyalty_program_id) {
                        return [2 /*return*/, res.status(400).json({ error: 'Missing user_id or loyalty_program_id' })];
                    }
                    return [4 /*yield*/, supabase
                            .from('user_loyalty_stamps')
                            .select('*')
                            .eq('user_id', user_id)
                            .eq('loyalty_program_id', loyalty_program_id)
                            .single()];
                case 2:
                    _b = _c.sent(), userStamp = _b.data, fetchError = _b.error;
                    if (fetchError) {
                        return [2 /*return*/, res.status(404).json({ error: 'Loyalty card not found' })];
                    }
                    newStamps = (userStamp.stamps_collected || 0) + 1;
                    isCompleted = newStamps >= userStamp.stamps_required;
                    return [4 /*yield*/, supabase
                            .from('user_loyalty_stamps')
                            .update({
                            stamps_collected: newStamps,
                            last_stamp_at: new Date().toISOString(),
                            is_completed: isCompleted,
                            completed_at: isCompleted && !userStamp.completed_at ? new Date().toISOString() : userStamp.completed_at
                        })
                            .eq('id', userStamp.id)];
                case 3:
                    updateError = (_c.sent()).error;
                    if (updateError) {
                        return [2 /*return*/, res.status(500).json({ error: 'Failed to update stamps' })];
                    }
                    // TODO: Log stamp transaction in stamp_transactions table
                    return [2 /*return*/, res.status(200).json({ success: true, newStamps: newStamps, isCompleted: isCompleted })];
                case 4:
                    err_1 = _c.sent();
                    return [2 /*return*/, res.status(500).json({ error: err_1.message || 'Internal server error' })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
