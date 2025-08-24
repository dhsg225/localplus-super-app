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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { mockRestaurantProfile } from '../data/mockData';
var BusinessProfileEditor = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var _j = _a.mode, mode = _j === void 0 ? 'edit' : _j, _k = _a.initialData, initialData = _k === void 0 ? mockRestaurantProfile : _k;
    var navigate = useNavigate();
    var _l = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        website: initialData.website || '',
        address: {
            street: ((_b = initialData.address) === null || _b === void 0 ? void 0 : _b.street) || '',
            city: ((_c = initialData.address) === null || _c === void 0 ? void 0 : _c.city) || '',
            district: ((_d = initialData.address) === null || _d === void 0 ? void 0 : _d.district) || '',
            postalCode: ((_e = initialData.address) === null || _e === void 0 ? void 0 : _e.postalCode) || ''
        },
        socialMedia: {
            facebook: ((_f = initialData.socialMedia) === null || _f === void 0 ? void 0 : _f.facebook) || '',
            instagram: ((_g = initialData.socialMedia) === null || _g === void 0 ? void 0 : _g.instagram) || '',
            line: ((_h = initialData.socialMedia) === null || _h === void 0 ? void 0 : _h.line) || ''
        }
    }), formData = _l[0], setFormData = _l[1];
    var _m = useState(false), isSaving = _m[0], setIsSaving = _m[1];
    var handleInputChange = function (field, value) {
        if (field.includes('.')) {
            var _a = field.split('.'), parent_1 = _a[0], child_1 = _a[1];
            setFormData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[parent_1] = __assign(__assign({}, prev[parent_1]), (_b = {}, _b[child_1] = value, _b)), _a)));
            });
        }
        else {
            setFormData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
            });
        }
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Simulate API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Simulate API call
                    _a.sent();
                    console.log('Saving business profile:', formData);
                    navigate('/business');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error saving profile:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={function () { return navigate('/business'); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} className="text-gray-600"/>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Create Business Profile' : 'Edit Business Profile'}
                </h1>
                <p className="text-sm text-gray-600">Update your business information and contact details</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16}/>
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input type="text" value={formData.name} onChange={function (e) { return handleInputChange('name', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter your business name"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea value={formData.description} onChange={function (e) { return handleInputChange('description', e.target.value); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Describe your business"/>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16}/>
                  <span>Email Address</span>
                </div>
              </label>
              <input type="email" value={formData.email} onChange={function (e) { return handleInputChange('email', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="business@example.com"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone size={16}/>
                  <span>Phone Number</span>
                </div>
              </label>
              <input type="tel" value={formData.phone} onChange={function (e) { return handleInputChange('phone', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="+66-X-XXX-XXXX"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Globe size={16}/>
                  <span>Website (Optional)</span>
                </div>
              </label>
              <input type="url" value={formData.website} onChange={function (e) { return handleInputChange('website', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="https://yourwebsite.com"/>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              <div className="flex items-center space-x-2">
                <MapPin size={20}/>
                <span>Address</span>
              </div>
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input type="text" value={formData.address.street} onChange={function (e) { return handleInputChange('address.street', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="123 Street Name"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input type="text" value={formData.address.city} onChange={function (e) { return handleInputChange('address.city', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Bangkok"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input type="text" value={formData.address.district} onChange={function (e) { return handleInputChange('address.district', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Watthana"/>
              </div>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input type="text" value={formData.address.postalCode} onChange={function (e) { return handleInputChange('address.postalCode', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="10110"/>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Social Media (Optional)</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Page
              </label>
              <input type="url" value={formData.socialMedia.facebook} onChange={function (e) { return handleInputChange('socialMedia.facebook', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="https://facebook.com/yourbusiness"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input type="url" value={formData.socialMedia.instagram} onChange={function (e) { return handleInputChange('socialMedia.instagram', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="https://instagram.com/yourbusiness"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LINE Official Account
              </label>
              <input type="text" value={formData.socialMedia.line} onChange={function (e) { return handleInputChange('socialMedia.line', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="@yourbusiness"/>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default BusinessProfileEditor;
