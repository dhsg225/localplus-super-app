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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from 'react';
import { Plus, X, Upload, Camera } from 'lucide-react';
import FormInput from '@/ui-components/forms/FormInput';
import FormSelect from '@/ui-components/forms/FormSelect';
var defaultCategories = [
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'soups', name: 'Soups' },
    { id: 'salads', name: 'Salads' },
    { id: 'mains', name: 'Main Courses' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
];
var MenuSubmissionStep = function (_a) {
    var _b, _c;
    var onNext = _a.onNext, onBack = _a.onBack;
    var _d = useState(defaultCategories), categories = _d[0], setCategories = _d[1];
    var _e = useState([]), items = _e[0], setItems = _e[1];
    var _f = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        isSpicy: false,
        isVegetarian: false,
        isAvailable: true
    }), currentItem = _f[0], setCurrentItem = _f[1];
    var _g = useState(false), showAddItem = _g[0], setShowAddItem = _g[1];
    var _h = useState(''), newCategoryName = _h[0], setNewCategoryName = _h[1];
    var _j = useState(false), showAddCategory = _j[0], setShowAddCategory = _j[1];
    var addCategory = function () {
        if (newCategoryName.trim()) {
            var newCategory = {
                id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
                name: newCategoryName.trim()
            };
            setCategories(__spreadArray(__spreadArray([], categories, true), [newCategory], false));
            setNewCategoryName('');
            setShowAddCategory(false);
        }
    };
    var addMenuItem = function () {
        var _a;
        if (currentItem.name && currentItem.price && currentItem.category) {
            var newItem = {
                id: Date.now().toString(),
                name: currentItem.name,
                description: currentItem.description || '',
                price: currentItem.price,
                category: currentItem.category,
                imageUrl: currentItem.imageUrl,
                isSpicy: currentItem.isSpicy || false,
                isVegetarian: currentItem.isVegetarian || false,
                isAvailable: (_a = currentItem.isAvailable) !== null && _a !== void 0 ? _a : true
            };
            setItems(__spreadArray(__spreadArray([], items, true), [newItem], false));
            setCurrentItem({
                name: '',
                description: '',
                price: 0,
                category: '',
                isSpicy: false,
                isVegetarian: false,
                isAvailable: true
            });
            setShowAddItem(false);
        }
    };
    var removeMenuItem = function (itemId) {
        setItems(items.filter(function (item) { return item.id !== itemId; }));
    };
    var getCategoryName = function (categoryId) {
        var _a;
        return ((_a = categories.find(function (cat) { return cat.id === categoryId; })) === null || _a === void 0 ? void 0 : _a.name) || categoryId;
    };
    var groupedItems = items.reduce(function (acc, item) {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    return (<div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Setup</h2>
        <p className="text-gray-600">Add your menu items to help customers discover your offerings</p>
      </div>

      {/* Categories Management */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900">Menu Categories</h3>
          <button onClick={function () { return setShowAddCategory(true); }} className="text-red-600 text-sm font-medium hover:text-red-700">
            + Add Category
          </button>
        </div>
        
        {showAddCategory && (<div className="flex gap-2 mb-3">
            <input type="text" value={newCategoryName} onChange={function (e) { return setNewCategoryName(e.target.value); }} placeholder="Category name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
            <button onClick={addCategory} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Add
            </button>
            <button onClick={function () { return setShowAddCategory(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>)}
        
        <div className="flex flex-wrap gap-2">
          {categories.map(function (category) { return (<span key={category.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-200">
              {category.name}
            </span>); })}
        </div>
      </div>

      {/* Add Menu Item */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!showAddItem ? (<div className="text-center">
            <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Menu Items</h3>
            <p className="text-gray-500 mb-4">Start building your menu by adding your first item</p>
            <button onClick={function () { return setShowAddItem(true); }} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2"/>
              Add Item
            </button>
          </div>) : (<div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add Menu Item</h3>
              <button onClick={function () { return setShowAddItem(false); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Item Name" value={currentItem.name || ''} onChange={function (value) { return setCurrentItem(__assign(__assign({}, currentItem), { name: value })); }} placeholder="e.g., Pad Thai" required/>
              
              <FormInput label="Price (฿)" type="number" value={((_b = currentItem.price) === null || _b === void 0 ? void 0 : _b.toString()) || ''} onChange={function (value) { return setCurrentItem(__assign(__assign({}, currentItem), { price: parseFloat(value) || 0 })); }} placeholder="0" required/>
            </div>

            <FormInput label="Description" value={currentItem.description || ''} onChange={function (value) { return setCurrentItem(__assign(__assign({}, currentItem), { description: value })); }} placeholder="Brief description of the dish..." multiline/>

            <FormSelect label="Category" value={currentItem.category || ''} onChange={function (value) { return setCurrentItem(__assign(__assign({}, currentItem), { category: value })); }} options={categories.map(function (cat) { return ({ value: cat.id, label: cat.name }); })} placeholder="Select category" required/>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2"/>
                  <p className="text-sm text-gray-500">Upload item photo (optional)</p>
                  <button className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-1"/>
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* Item Options */}
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center">
                <input type="checkbox" checked={currentItem.isSpicy || false} onChange={function (e) { return setCurrentItem(__assign(__assign({}, currentItem), { isSpicy: e.target.checked })); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                <span className="ml-2 text-sm text-gray-700">🌶️ Spicy</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" checked={currentItem.isVegetarian || false} onChange={function (e) { return setCurrentItem(__assign(__assign({}, currentItem), { isVegetarian: e.target.checked })); }} className="rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                <span className="ml-2 text-sm text-gray-700">🌱 Vegetarian</span>
              </label>
              
              <label className="flex items-center">
                <input type="checkbox" checked={(_c = currentItem.isAvailable) !== null && _c !== void 0 ? _c : true} onChange={function (e) { return setCurrentItem(__assign(__assign({}, currentItem), { isAvailable: e.target.checked })); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <span className="ml-2 text-sm text-gray-700">Available</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={addMenuItem} disabled={!currentItem.name || !currentItem.price || !currentItem.category} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Add Item
              </button>
              <button onClick={function () { return setShowAddItem(false); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>)}
      </div>

      {/* Menu Preview */}
      {items.length > 0 && (<div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Preview ({items.length} items)</h3>
          <div className="space-y-6">
            {Object.entries(groupedItems).map(function (_a) {
                var categoryId = _a[0], categoryItems = _a[1];
                return (<div key={categoryId} className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{getCategoryName(categoryId)}</h4>
                <div className="space-y-3">
                  {categoryItems.map(function (item) { return (<div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <span className="text-lg font-semibold text-red-600">฿{item.price}</span>
                        </div>
                        {item.description && (<p className="text-sm text-gray-600 mt-1">{item.description}</p>)}
                        <div className="flex items-center space-x-2 mt-2">
                          {item.isSpicy && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">🌶️ Spicy</span>}
                          {item.isVegetarian && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">🌱 Vegetarian</span>}
                          {!item.isAvailable && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Unavailable</span>}
                        </div>
                      </div>
                      <button onClick={function () { return removeMenuItem(item.id); }} className="ml-3 text-red-600 hover:text-red-800">
                        <X className="w-4 h-4"/>
                      </button>
                    </div>); })}
                </div>
              </div>);
            })}
          </div>
        </div>)}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Back
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Continue
        </button>
      </div>
    </div>);
};
export default MenuSubmissionStep;
