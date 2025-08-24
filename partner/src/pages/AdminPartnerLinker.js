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
import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/services/supabase';
import { Button } from '../../shared/components';
var AdminPartnerLinker = function () {
    var _a = useState([]), users = _a[0], setUsers = _a[1];
    var _b = useState([]), businesses = _b[0], setBusinesses = _b[1];
    var _c = useState(''), selectedUser = _c[0], setSelectedUser = _c[1];
    var _d = useState(''), selectedBusiness = _d[0], setSelectedBusiness = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var _f = useState(''), message = _f[0], setMessage = _f[1];
    useEffect(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var usersData, businessesData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, supabase.from('users').select('id, email')];
                    case 2:
                        usersData = (_a.sent()).data;
                        return [4 /*yield*/, supabase.from('businesses').select('id, name')];
                    case 3:
                        businessesData = (_a.sent()).data;
                        setUsers(usersData || []);
                        setBusinesses(businessesData || []);
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        setMessage('Failed to load users or businesses');
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, []);
    var handleLink = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedUser || !selectedBusiness) {
                        setMessage('Please select both a user and a business');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setMessage('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabase.from('partners').insert({
                            user_id: selectedUser,
                            business_id: selectedBusiness,
                            role: 'owner',
                            is_active: true,
                            accepted_at: new Date().toISOString()
                        })];
                case 2:
                    _a.sent();
                    setMessage('✅ User linked to business!');
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setMessage('Error linking user: ' + (err_2.message || err_2));
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Link User to Business</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select User</label>
        <select className="w-full border rounded p-2" value={selectedUser} onChange={function (e) { return setSelectedUser(e.target.value); }}>
          <option value="">-- Select User --</option>
          {users.map(function (user) { return (<option key={user.id} value={user.id}>{user.email} ({user.id})</option>); })}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Business</label>
        <select className="w-full border rounded p-2" value={selectedBusiness} onChange={function (e) { return setSelectedBusiness(e.target.value); }}>
          <option value="">-- Select Business --</option>
          {businesses.map(function (biz) { return (<option key={biz.id} value={biz.id}>{biz.name} ({biz.id})</option>); })}
        </select>
      </div>
      <Button onClick={handleLink} isLoading={loading} theme="blue">
        Link User to Business
      </Button>
      {message && <div className="mt-4 text-sm text-blue-700">{message}</div>}
    </div>);
};
export default AdminPartnerLinker;
