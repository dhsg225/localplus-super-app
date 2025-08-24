var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { bookingService } from '../../../shared/services/bookingService';
import { authService } from '../../shared/services/authService';
import { Button } from '../../shared/components';
var StaffManagement = function () {
    var _a = useState([]), restaurants = _a[0], setRestaurants = _a[1];
    var _b = useState(''), selectedRestaurant = _b[0], setSelectedRestaurant = _b[1];
    var _c = useState([]), staff = _c[0], setStaff = _c[1];
    var _d = useState({}), userProfiles = _d[0], setUserProfiles = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    var _g = useState(''), role = _g[0], setRole = _g[1]; // Current user's role (for permissions)
    var _h = useState(false), profilesLoading = _h[0], setProfilesLoading = _h[1];
    var _j = useState(false), inviteOpen = _j[0], setInviteOpen = _j[1];
    var _k = useState(''), inviteEmail = _k[0], setInviteEmail = _k[1];
    var _l = useState('staff'), inviteRole = _l[0], setInviteRole = _l[1];
    var _m = useState(false), inviteLoading = _m[0], setInviteLoading = _m[1];
    var _o = useState(''), inviteError = _o[0], setInviteError = _o[1];
    var _p = useState(''), inviteSuccess = _p[0], setInviteSuccess = _p[1];
    var _q = useState(''), actionLoading = _q[0], setActionLoading = _q[1];
    var _r = useState(''), actionError = _r[0], setActionError = _r[1];
    var _s = useState(''), actionSuccess = _s[0], setActionSuccess = _s[1];
    useEffect(function () {
        var loadRestaurants = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, bookingService.getPartnerRestaurants()];
                    case 1:
                        data = _a.sent();
                        setRestaurants(data);
                        if (data.length > 0) {
                            setSelectedRestaurant(data[0].id);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError('Failed to load restaurants');
                        console.error('Error loading restaurants:', err_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadRestaurants();
    }, []);
    useEffect(function () {
        var loadStaff = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, currentUserId_1, current, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selectedRestaurant)
                            return [2 /*return*/];
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, bookingService.getPartners(selectedRestaurant)];
                    case 2:
                        data = _a.sent();
                        setStaff(data);
                        currentUserId_1 = null;
                        if (currentUserId_1) {
                            current = data.find(function (p) { return p.user_id === currentUserId_1; });
                            setRole(current ? current.role : 'staff');
                        }
                        else {
                            setRole('owner'); // Default for now
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _a.sent();
                        setError('Failed to load staff');
                        setStaff([]);
                        console.error('Error loading staff:', err_2);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadStaff();
    }, [selectedRestaurant]);
    useEffect(function () {
        var fetchProfiles = function () { return __awaiter(void 0, void 0, void 0, function () {
            var newProfiles, _i, staff_1, member, profile, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (staff.length === 0)
                            return [2 /*return*/];
                        setProfilesLoading(true);
                        newProfiles = __assign({}, userProfiles);
                        _i = 0, staff_1 = staff;
                        _a.label = 1;
                    case 1:
                        if (!(_i < staff_1.length)) return [3 /*break*/, 6];
                        member = staff_1[_i];
                        if (!!newProfiles[member.user_id]) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, authService.getUserById(member.user_id)];
                    case 3:
                        profile = _a.sent();
                        newProfiles[member.user_id] = profile;
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        newProfiles[member.user_id] = {
                            id: member.user_id,
                            email: '(unknown)',
                            firstName: '',
                            lastName: ''
                        };
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        setUserProfiles(newProfiles);
                        setProfilesLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staff]);
    var handleInvite = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setInviteLoading(true);
                    setInviteError('');
                    setInviteSuccess('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    // For demo: create a new partner with a fake user_id (in real app, lookup or invite user by email)
                    // You may want to implement a real invite flow with email sending and user creation
                    return [4 /*yield*/, bookingService.addPartner(selectedRestaurant, inviteEmail, inviteRole, [])];
                case 2:
                    // For demo: create a new partner with a fake user_id (in real app, lookup or invite user by email)
                    // You may want to implement a real invite flow with email sending and user creation
                    _a.sent();
                    setInviteSuccess('Invitation sent!');
                    setInviteEmail('');
                    setInviteRole('staff');
                    setInviteOpen(false);
                    return [4 /*yield*/, bookingService.getPartners(selectedRestaurant)];
                case 3:
                    data = _a.sent();
                    setStaff(data);
                    return [3 /*break*/, 6];
                case 4:
                    err_4 = _a.sent();
                    setInviteError(err_4.message || 'Failed to invite staff');
                    return [3 /*break*/, 6];
                case 5:
                    setInviteLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // TODO: Replace with actual user ID from auth context
    var currentUserId = null; // <-- Replace with real user ID
    var handleRoleChange = function (partnerId, newRole) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setActionLoading(partnerId);
                    setActionError('');
                    setActionSuccess('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, bookingService.updatePartner(partnerId, { role: newRole })];
                case 2:
                    _a.sent();
                    setActionSuccess('Role updated!');
                    return [4 /*yield*/, bookingService.getPartners(selectedRestaurant)];
                case 3:
                    data = _a.sent();
                    setStaff(data);
                    return [3 /*break*/, 6];
                case 4:
                    err_5 = _a.sent();
                    setActionError(err_5.message || 'Failed to update role');
                    return [3 /*break*/, 6];
                case 5:
                    setActionLoading('');
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleRemove = function (partnerId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setActionLoading(partnerId);
                    setActionError('');
                    setActionSuccess('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, bookingService.removePartner(partnerId)];
                case 2:
                    _a.sent();
                    setActionSuccess('Staff removed!');
                    return [4 /*yield*/, bookingService.getPartners(selectedRestaurant)];
                case 3:
                    data = _a.sent();
                    setStaff(data);
                    return [3 /*break*/, 6];
                case 4:
                    err_6 = _a.sent();
                    setActionError(err_6.message || 'Failed to remove staff');
                    return [3 /*break*/, 6];
                case 5:
                    setActionLoading('');
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (<div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-center text-gray-600">Loading staff...</p>
      </div>);
    }
    if (error) {
        return (<div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>);
    }
    return (<div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
        <p className="text-gray-600">View and manage your restaurant's staff and permissions</p>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Restaurant</h2>
          <select value={selectedRestaurant} onChange={function (e) { return setSelectedRestaurant(e.target.value); }} className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {restaurants.map(function (restaurant) { return (<option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>); })}
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Staff</h2>
          {role === 'owner' && (<>
              <Button theme="blue" size="sm" onClick={function () { return setInviteOpen(true); }}>
                + Invite Staff
              </Button>
              {inviteOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Invite Staff</h3>
                    <form onSubmit={handleInvite} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={inviteEmail} onChange={function (e) { return setInviteEmail(e.target.value); }} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={inviteRole} onChange={function (e) { return setInviteRole(e.target.value); }} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                      </div>
                      {inviteError && <div className="text-red-600 text-sm">{inviteError}</div>}
                      {inviteSuccess && <div className="text-green-600 text-sm">{inviteSuccess}</div>}
                      <div className="flex justify-end gap-2">
                        <Button type="button" theme="gray" size="sm" onClick={function () { return setInviteOpen(false); }} disabled={inviteLoading}>Cancel</Button>
                        <Button type="submit" theme="blue" size="sm" isLoading={inviteLoading} disabled={inviteLoading}>Send Invite</Button>
                      </div>
                    </form>
                  </div>
                </div>)}
            </>)}
        </div>
        {actionError && <div className="text-red-600 text-sm px-6 pt-2">{actionError}</div>}
        {actionSuccess && <div className="text-green-600 text-sm px-6 pt-2">{actionSuccess}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {role === 'owner' && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map(function (member) {
            var profile = userProfiles[member.user_id];
            var isSelf = member.user_id === currentUserId;
            return (<tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profilesLoading && !profile ? (<span className="text-gray-400">Loading...</span>) : (profile ? "".concat(profile.firstName, " ").concat(profile.lastName).trim() || '(No Name)' : member.user_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profilesLoading && !profile ? (<span className="text-gray-400">Loading...</span>) : (profile ? profile.email : '(unknown)')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role === 'owner' && !isSelf ? (<select value={member.role} onChange={function (e) { return handleRoleChange(member.id, e.target.value); }} disabled={actionLoading === member.id} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>) : (member.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.is_active ? 'Active' : 'Inactive'}</td>
                    {role === 'owner' && (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {!isSelf ? (<Button theme="red" size="sm" isLoading={actionLoading === member.id} disabled={actionLoading === member.id} onClick={function () { return handleRemove(member.id); }}>
                            Remove
                          </Button>) : (<span className="text-gray-400 text-xs">(You)</span>)}
                      </td>)}
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
export default StaffManagement;
