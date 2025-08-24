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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Settings } from 'lucide-react';
var NewsAdminSettings = function () {
    var _a, _b;
    var cities = useState(['hua-hin', 'pattaya'])[0];
    var _c = useState('hua-hin'), selectedCity = _c[0], setSelectedCity = _c[1];
    var _d = useState({}), settings = _d[0], setSettings = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), editingCategory = _f[0], setEditingCategory = _f[1];
    var _g = useState(''), newCategoryName = _g[0], setNewCategoryName = _g[1];
    var _h = useState(['']), expandedCategories = _h[0], setExpandedCategories = _h[1];
    // Load existing settings and WordPress categories
    useEffect(function () {
        loadSettings();
        loadWordPressCategories();
    }, [selectedCity]);
    var loadSettings = function () {
        var savedSettings = localStorage.getItem('ldp_news_admin_categories');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            }
            catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    };
    var loadWordPressCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, wpCategories_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, fetch("/api/news/".concat(selectedCity, "/categories"))];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    wpCategories_1 = _a.sent();
                    setSettings(function (prev) {
                        var _a;
                        var _b;
                        return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { availableWpCategories: wpCategories_1, hierarchy: ((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || getDefaultHierarchy(), lastUpdated: new Date().toISOString() }), _a)));
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error loading WordPress categories:', error_1);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getDefaultHierarchy = function () { return [
        {
            id: 'local',
            name: 'Local News',
            wpCategories: [],
            children: []
        },
        {
            id: 'lifestyle',
            name: 'Lifestyle',
            wpCategories: [],
            children: [
                { id: 'food', name: 'Food & Dining', wpCategories: [], parent: 'lifestyle' },
                { id: 'culture', name: 'Culture & Arts', wpCategories: [], parent: 'lifestyle' },
                { id: 'entertainment', name: 'Entertainment', wpCategories: [], parent: 'lifestyle' }
            ]
        },
        {
            id: 'business',
            name: 'Business',
            wpCategories: [],
            children: [
                { id: 'economy', name: 'Economy', wpCategories: [], parent: 'business' },
                { id: 'development', name: 'Development', wpCategories: [], parent: 'business' }
            ]
        }
    ]; };
    var saveSettings = function () {
        localStorage.setItem('ldp_news_admin_categories', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };
    var updateCategoryName = function (categoryId, newName) {
        var updateInHierarchy = function (categories) {
            return categories.map(function (cat) { return (__assign(__assign({}, cat), { name: cat.id === categoryId ? newName : cat.name, children: cat.children ? updateInHierarchy(cat.children) : undefined })); });
        };
        setSettings(function (prev) {
            var _a;
            var _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { hierarchy: updateInHierarchy(((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || []) }), _a)));
        });
    };
    var toggleWpCategoryMapping = function (categoryId, wpCategoryId) {
        var updateMappingInHierarchy = function (categories) {
            return categories.map(function (cat) {
                if (cat.id === categoryId) {
                    var currentWpCategories = cat.wpCategories || [];
                    var newWpCategories = currentWpCategories.includes(wpCategoryId)
                        ? currentWpCategories.filter(function (id) { return id !== wpCategoryId; })
                        : __spreadArray(__spreadArray([], currentWpCategories, true), [wpCategoryId], false);
                    return __assign(__assign({}, cat), { wpCategories: newWpCategories });
                }
                return __assign(__assign({}, cat), { children: cat.children ? updateMappingInHierarchy(cat.children) : undefined });
            });
        };
        setSettings(function (prev) {
            var _a;
            var _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { hierarchy: updateMappingInHierarchy(((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || []) }), _a)));
        });
    };
    var addNewCategory = function (parentId) {
        var newId = "custom_".concat(Date.now());
        var newCategory = {
            id: newId,
            name: newCategoryName || 'New Category',
            wpCategories: [],
            parent: parentId
        };
        if (!parentId) {
            // Add as top-level category
            setSettings(function (prev) {
                var _a;
                var _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { hierarchy: __spreadArray(__spreadArray([], (((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || []), true), [newCategory], false) }), _a)));
            });
        }
        else {
            // Add as child category
            var addToParent_1 = function (categories) {
                return categories.map(function (cat) {
                    if (cat.id === parentId) {
                        return __assign(__assign({}, cat), { children: __spreadArray(__spreadArray([], (cat.children || []), true), [newCategory], false) });
                    }
                    return __assign(__assign({}, cat), { children: cat.children ? addToParent_1(cat.children) : undefined });
                });
            };
            setSettings(function (prev) {
                var _a;
                var _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { hierarchy: addToParent_1(((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || []) }), _a)));
            });
        }
        setNewCategoryName('');
    };
    var deleteCategory = function (categoryId) {
        if (!confirm('Are you sure you want to delete this category?'))
            return;
        var removeFromHierarchy = function (categories) {
            return categories
                .filter(function (cat) { return cat.id !== categoryId; })
                .map(function (cat) { return (__assign(__assign({}, cat), { children: cat.children ? removeFromHierarchy(cat.children) : undefined })); });
        };
        setSettings(function (prev) {
            var _a;
            var _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[selectedCity] = __assign(__assign({}, prev[selectedCity]), { hierarchy: removeFromHierarchy(((_b = prev[selectedCity]) === null || _b === void 0 ? void 0 : _b.hierarchy) || []) }), _a)));
        });
    };
    var renderCategoryEditor = function (categories, level) {
        if (level === void 0) { level = 0; }
        return categories.map(function (category) {
            var _a, _b, _c;
            return (<div key={category.id} className="border rounded-lg bg-white mb-4">
        <div className="p-4" style={{ marginLeft: level * 20 }}>
          {/* Category Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {category.children && category.children.length > 0 && (<button onClick={function () { return setExpandedCategories(function (prev) {
                        return prev.includes(category.id)
                            ? prev.filter(function (id) { return id !== category.id; })
                            : __spreadArray(__spreadArray([], prev, true), [category.id], false);
                    }); }} className="p-1">
                  {expandedCategories.includes(category.id) ?
                        <ChevronDown className="w-4 h-4"/> :
                        <ChevronRight className="w-4 h-4"/>}
                </button>)}
              
              {editingCategory === category.id ? (<div className="flex items-center space-x-2">
                  <input type="text" value={newCategoryName} onChange={function (e) { return setNewCategoryName(e.target.value); }} className="border rounded px-2 py-1 text-sm" placeholder="Category name"/>
                  <button onClick={function () {
                        updateCategoryName(category.id, newCategoryName);
                        setEditingCategory(null);
                        setNewCategoryName('');
                    }} className="text-green-600 hover:text-green-800">
                    <Save className="w-4 h-4"/>
                  </button>
                  <button onClick={function () {
                        setEditingCategory(null);
                        setNewCategoryName('');
                    }} className="text-gray-600 hover:text-gray-800">
                    <X className="w-4 h-4"/>
                  </button>
                </div>) : (<div className="flex items-center space-x-2">
                  <h3 className={"font-medium ".concat(level === 0 ? 'text-lg' : 'text-base')}>
                    {category.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    ({((_a = category.wpCategories) === null || _a === void 0 ? void 0 : _a.length) || 0} mapped)
                  </span>
                </div>)}
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={function () {
                    setEditingCategory(category.id);
                    setNewCategoryName(category.name);
                }} className="text-blue-600 hover:text-blue-800">
                <Edit2 className="w-4 h-4"/>
              </button>
              <button onClick={function () { return deleteCategory(category.id); }} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* WordPress Category Mapping */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {(_c = (_b = settings[selectedCity]) === null || _b === void 0 ? void 0 : _b.availableWpCategories) === null || _c === void 0 ? void 0 : _c.map(function (wpCat) {
                    var _a;
                    return (<label key={wpCat.id} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={((_a = category.wpCategories) === null || _a === void 0 ? void 0 : _a.includes(wpCat.id)) || false} onChange={function () { return toggleWpCategoryMapping(category.id, wpCat.id); }} className="rounded"/>
                <span className="truncate">
                  {wpCat.name} ({wpCat.count})
                </span>
              </label>);
                })}
          </div>

          {/* Add Child Category */}
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="New subcategory name" value={newCategoryName} onChange={function (e) { return setNewCategoryName(e.target.value); }} className="border rounded px-2 py-1 text-sm flex-1"/>
              <button onClick={function () { return addNewCategory(category.id); }} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                <Plus className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {category.children &&
                    category.children.length > 0 &&
                    expandedCategories.includes(category.id) && (<div className="border-t bg-gray-50">
            {renderCategoryEditor(category.children, level + 1)}
          </div>)}
      </div>);
        });
    };
    var currentSettings = settings[selectedCity];
    return (<div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600"/>
              </div>
              <div>
                <h1 className="text-xl font-semibold">News Category Management</h1>
                <p className="text-gray-600 text-sm">Configure news categories and WordPress mappings</p>
              </div>
            </div>
            
            <button onClick={saveSettings} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Save className="w-4 h-4"/>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* City Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select City
            </label>
            <div className="flex space-x-2">
              {cities.map(function (city) { return (<button key={city} onClick={function () { return setSelectedCity(city); }} className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors ".concat(selectedCity === city
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                  {city === 'hua-hin' ? 'Hua Hin' : 'Pattaya'}
                </button>); })}
            </div>
          </div>

          {/* Add Top-Level Category */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Add New Top-Level Category</h3>
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="Category name" value={newCategoryName} onChange={function (e) { return setNewCategoryName(e.target.value); }} className="border rounded px-3 py-2 flex-1"/>
              <button onClick={function () { return addNewCategory(); }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2">
                <Plus className="w-4 h-4"/>
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Category Hierarchy Editor */}
          {loading ? (<div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading WordPress categories...</p>
            </div>) : (<div>
              <h3 className="font-medium mb-4">Category Hierarchy</h3>
              {(currentSettings === null || currentSettings === void 0 ? void 0 : currentSettings.hierarchy) && currentSettings.hierarchy.length > 0 ? (<div className="space-y-4">
                  {renderCategoryEditor(currentSettings.hierarchy)}
                </div>) : (<div className="text-center py-8 text-gray-500">
                  <p>No categories configured for this city.</p>
                  <p className="text-sm">Add a new category above to get started.</p>
                </div>)}
            </div>)}

          {/* Statistics */}
          {currentSettings && (<div className="mt-8 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium mb-2">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">WordPress Categories:</span>
                  <span className="ml-2">{((_a = currentSettings.availableWpCategories) === null || _a === void 0 ? void 0 : _a.length) || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Custom Categories:</span>
                  <span className="ml-2">{((_b = currentSettings.hierarchy) === null || _b === void 0 ? void 0 : _b.length) || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <span className="ml-2">
                    {currentSettings.lastUpdated
                ? new Date(currentSettings.lastUpdated).toLocaleDateString()
                : 'Never'}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
export default NewsAdminSettings;
