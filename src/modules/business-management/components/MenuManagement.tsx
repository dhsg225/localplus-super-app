import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Camera, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { mockRestaurantProfile } from '../data/mockData';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockRestaurantProfile.menu);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
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

  const categories = ['Appetizer', 'Soup', 'Main Course', 'Dessert', 'Beverage'];

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: `menu-${Date.now()}`,
        name: newItem.name,
        description: newItem.description || '',
        price: newItem.price,
        category: newItem.category || 'Main Course',
        isAvailable: newItem.isAvailable ?? true,
        isSpicy: newItem.isSpicy ?? false,
        isVegetarian: newItem.isVegetarian ?? false,
        isVegan: newItem.isVegan ?? false,
        allergens: newItem.allergens || []
      };
      
      setMenuItems(prev => [...prev, item]);
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

  const handleDeleteItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const formatPrice = (price: number) => {
    return `฿${price.toLocaleString()}`;
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/business')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Menu Management</h1>
                <p className="text-sm text-gray-600">{menuItems.length} items • {Object.keys(groupedItems).length} categories</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add New Item Modal */}
        {isAddingItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsAddingItem(false)} />
              
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Add New Menu Item</h3>
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Describe the dish"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (฿)</label>
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Dietary Information</label>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newItem.isSpicy}
                          onChange={(e) => setNewItem(prev => ({ ...prev, isSpicy: e.target.checked }))}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Spicy 🌶️</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newItem.isVegetarian}
                          onChange={(e) => setNewItem(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vegetarian 🥬</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newItem.isVegan}
                          onChange={(e) => setNewItem(prev => ({ ...prev, isVegan: e.target.checked }))}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vegan 🌱</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingItem(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.name || !newItem.price}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
              <p className="text-sm text-gray-600">{items.length} items</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Camera size={24} className="text-gray-400" />
                    )}
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
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <AlertCircle size={12} className="text-orange-500" />
                            <span className="text-xs text-orange-600">
                              Contains: {item.allergens.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => handleToggleAvailability(item.id)}
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              item.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {menuItems.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-4">Start building your menu by adding your first item</p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Add First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement; 