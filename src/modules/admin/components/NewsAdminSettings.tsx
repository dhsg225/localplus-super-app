import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Settings } from 'lucide-react';

interface WordPressCat {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface CategoryHierarchy {
  id: string;
  name: string;
  wpCategories: number[];
  children?: CategoryHierarchy[];
  parent?: string;
}

interface CitySettings {
  [cityKey: string]: {
    hierarchy: CategoryHierarchy[];
    availableWpCategories: WordPressCat[];
    lastUpdated: string;
  };
}

const NewsAdminSettings: React.FC = () => {
  const [cities] = useState(['hua-hin', 'pattaya']);
  const [selectedCity, setSelectedCity] = useState('hua-hin');
  const [settings, setSettings] = useState<CitySettings>({});
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['']);

  // Load existing settings and WordPress categories
  useEffect(() => {
    loadSettings();
    loadWordPressCategories();
  }, [selectedCity]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('ldp_news_admin_categories');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const loadWordPressCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3003/api/news/${selectedCity}/categories`);
      if (response.ok) {
        const wpCategories = await response.json();
        
        setSettings(prev => ({
          ...prev,
          [selectedCity]: {
            ...prev[selectedCity],
            availableWpCategories: wpCategories,
            hierarchy: prev[selectedCity]?.hierarchy || getDefaultHierarchy(),
            lastUpdated: new Date().toISOString()
          }
        }));
      }
    } catch (error) {
      console.error('Error loading WordPress categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultHierarchy = (): CategoryHierarchy[] => [
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
  ];

  const saveSettings = () => {
    localStorage.setItem('ldp_news_admin_categories', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const updateCategoryName = (categoryId: string, newName: string) => {
    const updateInHierarchy = (categories: CategoryHierarchy[]): CategoryHierarchy[] => {
      return categories.map(cat => ({
        ...cat,
        name: cat.id === categoryId ? newName : cat.name,
        children: cat.children ? updateInHierarchy(cat.children) : undefined
      }));
    };

    setSettings(prev => ({
      ...prev,
      [selectedCity]: {
        ...prev[selectedCity],
        hierarchy: updateInHierarchy(prev[selectedCity]?.hierarchy || [])
      }
    }));
  };

  const toggleWpCategoryMapping = (categoryId: string, wpCategoryId: number) => {
    const updateMappingInHierarchy = (categories: CategoryHierarchy[]): CategoryHierarchy[] => {
      return categories.map(cat => {
        if (cat.id === categoryId) {
          const currentWpCategories = cat.wpCategories || [];
          const newWpCategories = currentWpCategories.includes(wpCategoryId)
            ? currentWpCategories.filter(id => id !== wpCategoryId)
            : [...currentWpCategories, wpCategoryId];
          
          return { ...cat, wpCategories: newWpCategories };
        }
        
        return {
          ...cat,
          children: cat.children ? updateMappingInHierarchy(cat.children) : undefined
        };
      });
    };

    setSettings(prev => ({
      ...prev,
      [selectedCity]: {
        ...prev[selectedCity],
        hierarchy: updateMappingInHierarchy(prev[selectedCity]?.hierarchy || [])
      }
    }));
  };

  const addNewCategory = (parentId?: string) => {
    const newId = `custom_${Date.now()}`;
    const newCategory: CategoryHierarchy = {
      id: newId,
      name: newCategoryName || 'New Category',
      wpCategories: [],
      parent: parentId
    };

    if (!parentId) {
      // Add as top-level category
      setSettings(prev => ({
        ...prev,
        [selectedCity]: {
          ...prev[selectedCity],
          hierarchy: [...(prev[selectedCity]?.hierarchy || []), newCategory]
        }
      }));
    } else {
      // Add as child category
      const addToParent = (categories: CategoryHierarchy[]): CategoryHierarchy[] => {
        return categories.map(cat => {
          if (cat.id === parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCategory]
            };
          }
          return {
            ...cat,
            children: cat.children ? addToParent(cat.children) : undefined
          };
        });
      };

      setSettings(prev => ({
        ...prev,
        [selectedCity]: {
          ...prev[selectedCity],
          hierarchy: addToParent(prev[selectedCity]?.hierarchy || [])
        }
      }));
    }

    setNewCategoryName('');
  };

  const deleteCategory = (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const removeFromHierarchy = (categories: CategoryHierarchy[]): CategoryHierarchy[] => {
      return categories
        .filter(cat => cat.id !== categoryId)
        .map(cat => ({
          ...cat,
          children: cat.children ? removeFromHierarchy(cat.children) : undefined
        }));
    };

    setSettings(prev => ({
      ...prev,
      [selectedCity]: {
        ...prev[selectedCity],
        hierarchy: removeFromHierarchy(prev[selectedCity]?.hierarchy || [])
      }
    }));
  };

  const renderCategoryEditor = (categories: CategoryHierarchy[], level = 0) => {
    return categories.map(category => (
      <div key={category.id} className="border rounded-lg bg-white mb-4">
        <div className="p-4" style={{ marginLeft: level * 20 }}>
          {/* Category Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {category.children && category.children.length > 0 && (
                <button
                  onClick={() => setExpandedCategories(prev => 
                    prev.includes(category.id) 
                      ? prev.filter(id => id !== category.id)
                      : [...prev, category.id]
                  )}
                  className="p-1"
                >
                  {expandedCategories.includes(category.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </button>
              )}
              
              {editingCategory === category.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Category name"
                  />
                  <button
                    onClick={() => {
                      updateCategoryName(category.id, newCategoryName);
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${level === 0 ? 'text-lg' : 'text-base'}`}>
                    {category.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    ({category.wpCategories?.length || 0} mapped)
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setEditingCategory(category.id);
                  setNewCategoryName(category.name);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WordPress Category Mapping */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {settings[selectedCity]?.availableWpCategories?.map(wpCat => (
              <label key={wpCat.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={category.wpCategories?.includes(wpCat.id) || false}
                  onChange={() => toggleWpCategoryMapping(category.id, wpCat.id)}
                  className="rounded"
                />
                <span className="truncate">
                  {wpCat.name} ({wpCat.count})
                </span>
              </label>
            ))}
          </div>

          {/* Add Child Category */}
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="New subcategory name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border rounded px-2 py-1 text-sm flex-1"
              />
              <button
                onClick={() => addNewCategory(category.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {category.children && 
         category.children.length > 0 && 
         expandedCategories.includes(category.id) && (
          <div className="border-t bg-gray-50">
            {renderCategoryEditor(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const currentSettings = settings[selectedCity];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">News Category Management</h1>
                <p className="text-gray-600 text-sm">Configure news categories and WordPress mappings</p>
              </div>
            </div>
            
            <button
              onClick={saveSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
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
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city === 'hua-hin' ? 'Hua Hin' : 'Pattaya'}
                </button>
              ))}
            </div>
          </div>

          {/* Add Top-Level Category */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Add New Top-Level Category</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                onClick={() => addNewCategory()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Category Hierarchy Editor */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading WordPress categories...</p>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-4">Category Hierarchy</h3>
              {currentSettings?.hierarchy && currentSettings.hierarchy.length > 0 ? (
                <div className="space-y-4">
                  {renderCategoryEditor(currentSettings.hierarchy)}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No categories configured for this city.</p>
                  <p className="text-sm">Add a new category above to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          {currentSettings && (
            <div className="mt-8 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium mb-2">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">WordPress Categories:</span>
                  <span className="ml-2">{currentSettings.availableWpCategories?.length || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Custom Categories:</span>
                  <span className="ml-2">{currentSettings.hierarchy?.length || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <span className="ml-2">
                    {currentSettings.lastUpdated 
                      ? new Date(currentSettings.lastUpdated).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAdminSettings; 