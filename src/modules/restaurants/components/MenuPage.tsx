import React, { useState } from 'react';
import { ArrowLeft, Search, Star, Clock, DollarSign } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuPageProps {
  restaurantName: string;
  categories: MenuCategory[];
  onBack?: () => void;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

// Mock menu data
const mockMenuData: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    items: [
      {
        id: '1',
        name: 'Som Tam (Papaya Salad)',
        description: 'Fresh green papaya salad with tomatoes, green beans, and peanuts',
        price: 120,
        category: 'appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300',
        isAvailable: true,
        isSpicy: true,
        isVegetarian: true
      },
      {
        id: '2',
        name: 'Satay Chicken',
        description: 'Grilled chicken skewers with peanut sauce and cucumber relish',
        price: 180,
        category: 'appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: false
      }
    ]
  },
  {
    id: 'mains',
    name: 'Main Courses',
    items: [
      {
        id: '3',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with tofu, bean sprouts, and tamarind sauce',
        price: 280,
        category: 'mains',
        imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657feb5c?w=300',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: true
      },
      {
        id: '4',
        name: 'Green Curry',
        description: 'Traditional green curry with chicken, eggplant, and Thai basil',
        price: 320,
        category: 'mains',
        imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300',
        isAvailable: true,
        isSpicy: true,
        isVegetarian: false
      },
      {
        id: '5',
        name: 'Massaman Beef',
        description: 'Slow-cooked beef in rich massaman curry with potatoes',
        price: 380,
        category: 'mains',
        imageUrl: 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=300',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: false
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      {
        id: '6',
        name: 'Mango Sticky Rice',
        description: 'Sweet sticky rice with fresh mango and coconut milk',
        price: 150,
        category: 'desserts',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300',
        isAvailable: true,
        isSpicy: false,
        isVegetarian: true
      }
    ]
  }
];

const MenuPage: React.FC<MenuPageProps> = ({
  restaurantName = "The Spice Merchant",
  categories = mockMenuData,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = categories
    .find(cat => cat.id === selectedCategory)
    ?.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const formatPrice = (price: number) => `฿${price}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">Menu</h1>
          <div className="w-8" />
        </div>
        
        <p className="text-center text-gray-600 text-sm mb-3">{restaurantName}</p>
        
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-20 z-10">
        <div className="flex space-x-1 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex">
                  {/* Item Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex items-center space-x-2">
                      {item.isSpicy && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          🌶️ Spicy
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          🌱 Vegetarian
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors">
          <Clock size={24} />
        </button>
      </div>
    </div>
  );
};

export default MenuPage; 