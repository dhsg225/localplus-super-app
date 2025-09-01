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
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Camera, AlertCircle } from 'lucide-react';
import { mockRestaurantProfile } from '../data/mockData';
var MenuManagement = function () {
    var navigate = useNavigate();
    var _a = useState(mockRestaurantProfile.menu), menuItems = _a[0], setMenuItems = _a[1];
    var _b = useState(false), isAddingItem = _b[0], setIsAddingItem = _b[1];
    var _c = useState(null), editingItem = _c[0], setEditingItem = _c[1];
    var _d = useState({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: false,
        isVegan: false,
        allergens: []
    }), newItem = _d[0], setNewItem = _d[1];
    var categories = ['Appetizer', 'Soup', 'Main Course', 'Dessert', 'Beverage'];
    var commonAllergens = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Soy', 'Eggs'];
    var handleAddItem = function () {
        var _a, _b, _c, _d;
        if (newItem.name && newItem.price) {
            var item_1 = {
                id: "menu-".concat(Date.now()),
                name: newItem.name,
                description: newItem.description || '',
                price: newItem.price,
                category: newItem.category || 'Main Course',
                isAvailable: (_a = newItem.isAvailable) !== null && _a !== void 0 ? _a : true,
                isSpicy: (_b = newItem.isSpicy) !== null && _b !== void 0 ? _b : false,
                isVegetarian: (_c = newItem.isVegetarian) !== null && _c !== void 0 ? _c : false,
                isVegan: (_d = newItem.isVegan) !== null && _d !== void 0 ? _d : false,
                allergens: newItem.allergens || []
            };
            setMenuItems(function (prev) { return __spreadArray(__spreadArray([], prev, true), [item_1], false); });
            setNewItem({
                name: '',
                description: '',
                price: 0,
                category: 'Main Course',
                isAvailable: true,
                isSpicy: false,
                isVegetarian: false,
                isVegan: false,
                allergens: []
            });
            setIsAddingItem(false);
        }
    };
    var handleDeleteItem = function (id) {
        setMenuItems(function (prev) { return prev.filter(function (item) { return item.id !== id; }); });
    };
    var handleToggleAvailability = function (id) {
        setMenuItems(function (prev) { return prev.map(function (item) {
            return item.id === id ? __assign(__assign({}, item), { isAvailable: !item.isAvailable }) : item;
        }); });
    };
    var formatPrice = function (price) {
        return "\u0E3F".concat(price.toLocaleString());
    };
    var groupedItems = menuItems.reduce(function (acc, item) {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
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
                <h1 className="text-xl font-semibold text-gray-900">Menu Management</h1>
                <p className="text-sm text-gray-600">{menuItems.length} items • {Object.keys(groupedItems).length} categories</p>
              </div>
            </div>
            <button onClick={function () { return setIsAddingItem(true); }} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Plus size={16}/>
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add New Item Modal */}
        {isAddingItem && (<div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={function () { return setIsAddingItem(false); }}/>
              
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Add New Menu Item</h3>
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input type="text" value={newItem.name} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter item name"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea value={newItem.description} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Describe the dish"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (฿)</label>
                      <input type="number" value={newItem.price} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { price: Number(e.target.value) })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="0"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select value={newItem.category} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { category: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                        {categories.map(function (category) { return (<option key={category} value={category}>{category}</option>); })}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Dietary Information</label>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked={newItem.isSpicy} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { isSpicy: e.target.checked })); }); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <span className="ml-2 text-sm text-gray-700">Spicy 🌶️</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={newItem.isVegetarian} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { isVegetarian: e.target.checked })); }); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <span className="ml-2 text-sm text-gray-700">Vegetarian 🥬</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked={newItem.isVegan} onChange={function (e) { return setNewItem(function (prev) { return (__assign(__assign({}, prev), { isVegan: e.target.checked })); }); }} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <span className="ml-2 text-sm text-gray-700">Vegan 🌱</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                  <button onClick={function () { return setIsAddingItem(false); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleAddItem} disabled={!newItem.name || !newItem.price} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>)}

        {/* Menu Items by Category */}
        {Object.entries(groupedItems).map(function (_a) {
            var category = _a[0], items = _a[1];
            return (<div key={category} className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
              <p className="text-sm text-gray-600">{items.length} items</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {items.map(function (item) { return (<div key={item.id} className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.imageUrl ? (<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg"/>) : (<Camera size={24} className="text-gray-400"/>)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.isSpicy && <span>🌶️</span>}
                          {item.isVegetarian && <span>🥬</span>}
                          {item.isVegan && <span>🌱</span>}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        {item.allergens && item.allergens.length > 0 && (<div className="flex items-center space-x-1 mt-1">
                            <AlertCircle size={12} className="text-orange-500"/>
                            <span className="text-xs text-orange-600">
                              Contains: {item.allergens.join(', ')}
                            </span>
                          </div>)}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={function () { return handleToggleAvailability(item.id); }} className={"px-2 py-1 text-xs font-medium rounded ".concat(item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800')}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </button>
                          <button onClick={function () { return setEditingItem(item); }} className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit size={14}/>
                          </button>
                          <button onClick={function () { return handleDeleteItem(item.id); }} className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>); })}
            </div>
          </div>);
        })}

        {menuItems.length === 0 && (<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Camera size={48} className="mx-auto text-gray-400 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-4">Start building your menu by adding your first item</p>
            <button onClick={function () { return setIsAddingItem(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Add First Item
            </button>
          </div>)}
      </div>
    </div>);
};
export default MenuManagement;
