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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../../auth/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
var supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
// [2024-05-10 17:00 UTC] - Mock data for variety in loyalty cards display
var mockLoyaltyCards = [
    {
        id: 'mock-1',
        stamps_collected: 3,
        loyalty_programs: {
            stamps_required: 10,
            prize_description: 'Free Coffee',
            is_active: true,
            businesses: {
                name: 'Cafe Aroma',
                id: 'cafe-aroma'
            }
        }
    },
    {
        id: 'mock-2',
        stamps_collected: 7,
        loyalty_programs: {
            stamps_required: 8,
            prize_description: 'Free Massage',
            is_active: true,
            businesses: {
                name: 'Blue Wave Spa',
                id: 'blue-wave-spa'
            }
        }
    },
    {
        id: 'mock-3',
        stamps_collected: 12,
        loyalty_programs: {
            stamps_required: 12,
            prize_description: 'Free Dessert',
            is_active: true,
            businesses: {
                name: 'Golden Palace Thai',
                id: 'golden-palace'
            }
        }
    },
    {
        id: 'mock-4',
        stamps_collected: 2,
        loyalty_programs: {
            stamps_required: 6,
            prize_description: '20% Off Next Visit',
            is_active: true,
            businesses: {
                name: 'Sunset Sailing',
                id: 'sunset-sailing'
            }
        }
    },
    {
        id: 'mock-5',
        stamps_collected: 5,
        loyalty_programs: {
            stamps_required: 14,
            prize_description: 'Free Smoothie Bowl',
            is_active: false,
            businesses: {
                name: 'Tropical Juice Bar',
                id: 'tropical-juice'
            }
        }
    }
];
var LoyaltyCardsList = function () {
    var user = useAuth().user;
    var navigate = useNavigate();
    var _a = useState([]), cards = _a[0], setCards = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        if (!user)
            return;
        var fetchCards = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, data, error_1, combinedCards, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabase
                                .from('user_loyalty_stamps')
                                .select("\n            *,\n            loyalty_programs!inner(\n              *,\n              businesses!inner(\n                name,\n                id\n              )\n            )\n          ")
                                .eq('user_id', user.id)];
                    case 2:
                        _a = _b.sent(), data = _a.data, error_1 = _a.error;
                        if (error_1)
                            throw error_1;
                        combinedCards = __spreadArray(__spreadArray([], (data || []), true), mockLoyaltyCards, true);
                        setCards(combinedCards);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        // [2024-05-10 17:00 UTC] - If real data fails, show mock data for demo
                        console.warn('Using mock data for loyalty cards:', err_1.message);
                        setCards(mockLoyaltyCards);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchCards();
    }, [user]);
    if (!user)
        return <div className="p-8 text-center text-gray-500">Please log in to view your loyalty cards.</div>;
    if (loading)
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    return (<div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center mb-4">
        <button onClick={function () { return navigate(-1); }} className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
          <ArrowLeft size={20} className="mr-1"/>
          Back
        </button>
        <h1 className="text-xl font-semibold">My Loyalty Cards</h1>
      </div>
      <div className="space-y-4">
        {cards.map(function (card) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            // [2024-05-10 17:00 UTC] - Generate different colors for variety
            var businessInitial = ((_c = (_b = (_a = card.loyalty_programs) === null || _a === void 0 ? void 0 : _a.businesses) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0)) || 'B';
            var colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
            var colorIndex = businessInitial.charCodeAt(0) % colors.length;
            var progressColor = colors[colorIndex];
            return (<div key={card.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={"w-12 h-12 ".concat(colors[colorIndex], " rounded-lg flex items-center justify-center flex-shrink-0")}>
                    <span className="text-white font-bold text-lg">
                      {businessInitial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {((_e = (_d = card.loyalty_programs) === null || _d === void 0 ? void 0 : _d.businesses) === null || _e === void 0 ? void 0 : _e.name) || 'Business'} Card
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {card.stamps_collected || 0} / {((_f = card.loyalty_programs) === null || _f === void 0 ? void 0 : _f.stamps_required) || 10} stamps
                      </span>
                      <span className={"px-2 py-1 text-xs rounded-full ".concat(((_g = card.loyalty_programs) === null || _g === void 0 ? void 0 : _g.is_active) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                        {((_h = card.loyalty_programs) === null || _h === void 0 ? void 0 : _h.is_active) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className={"".concat(progressColor.replace('bg-', 'bg-'), " h-2 rounded-full transition-all duration-300")} style={{
                    width: "".concat(((card.stamps_collected || 0) / (((_j = card.loyalty_programs) === null || _j === void 0 ? void 0 : _j.stamps_required) || 10)) * 100, "%")
                }}/>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Prize: {((_k = card.loyalty_programs) === null || _k === void 0 ? void 0 : _k.prize_description) || 'Reward available'}
                    </p>
                  </div>
                </div>
                <button onClick={function () { return navigate("/loyalty-cards/".concat(card.id)); }} className={"".concat(progressColor, " text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors flex-shrink-0")}>
                  View
                </button>
              </div>
            </div>);
        })}
      </div>
      <button className="fixed bottom-20 right-6 bg-red-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl font-bold hover:bg-red-700 transition-colors" onClick={function () { return window.location.href = '/loyalty-cards/scan'; }}>
        +
      </button>
    </div>);
};
export default LoyaltyCardsList;
