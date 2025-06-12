import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Search, ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewsArticle {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  featured_media: number;
  categories: number[];
  date: string;
  featured_image_url?: string;
}

interface CategoryHierarchy {
  id: string;
  name: string;
  wpCategories: number[];
  children?: CategoryHierarchy[];
  parent?: string;
}

const NewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryHierarchy[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState<string>('hua-hin');
  const [userLocation, setUserLocation] = useState<string>('Hua Hin');

  // Get user's current location
  useEffect(() => {
    const location = localStorage.getItem('ldp_user_location');
    if (location) {
      const cityMap: { [key: string]: { api: string, display: string } } = {
        'bangkok': { api: 'bangkok', display: 'Bangkok' },
        'hua-hin': { api: 'hua-hin', display: 'Hua Hin' },
        'pattaya': { api: 'pattaya', display: 'Pattaya' },
        'phuket': { api: 'phuket', display: 'Phuket' },
        'chiang-mai': { api: 'chiang-mai', display: 'Chiang Mai' },
        'koh-samui': { api: 'koh-samui', display: 'Koh Samui' }
      };
      
      const cityKey = location.toLowerCase().replace(/\s+/g, '-');
      const cityInfo = cityMap[cityKey] || { api: 'hua-hin', display: 'Hua Hin' };
      
      setCurrentCity(cityInfo.api);
      setUserLocation(cityInfo.display);
    }
  }, []);

  // Load category hierarchy from admin settings
  useEffect(() => {
    const loadCategoryHierarchy = () => {
      const adminSettings = localStorage.getItem('ldp_news_admin_categories');
      if (adminSettings) {
        try {
          const settings = JSON.parse(adminSettings);
          const citySettings = settings[currentCity];
          if (citySettings && citySettings.hierarchy) {
            setCategoryHierarchy(citySettings.hierarchy);
            return;
          }
        } catch (error) {
          console.error('Error loading admin category settings:', error);
        }
      }
      
      // Default hierarchy if no admin settings
      setCategoryHierarchy([
        {
          id: 'local',
          name: 'Local News',
          wpCategories: [1], // Default category IDs
          children: []
        },
        {
          id: 'lifestyle',
          name: 'Lifestyle',
          wpCategories: [],
          children: [
            { id: 'food', name: 'Food & Dining', wpCategories: [2], parent: 'lifestyle' },
            { id: 'culture', name: 'Culture & Arts', wpCategories: [3], parent: 'lifestyle' },
            { id: 'entertainment', name: 'Entertainment', wpCategories: [4], parent: 'lifestyle' }
          ]
        },
        {
          id: 'business',
          name: 'Business',
          wpCategories: [5],
          children: [
            { id: 'economy', name: 'Economy', wpCategories: [6], parent: 'business' },
            { id: 'development', name: 'Development', wpCategories: [7], parent: 'business' }
          ]
        }
      ]);
    };

    loadCategoryHierarchy();
  }, [currentCity]);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = `http://localhost:3003/api/news/${currentCity}?`;
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (selectedCategories.length > 0) {
          // Get all WordPress category IDs for selected categories
          const wpCategoryIds = getWpCategoryIds(selectedCategories);
          if (wpCategoryIds.length > 0) {
            params.append('categories', wpCategoryIds.join(','));
          }
        }
        
        url += params.toString();
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load news articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentCity, searchTerm, selectedCategories]);

  // Get WordPress category IDs from selected category hierarchy IDs
  const getWpCategoryIds = (categoryIds: string[]): number[] => {
    const wpIds: number[] = [];
    
    const collectWpIds = (categories: CategoryHierarchy[]) => {
      categories.forEach(category => {
        if (categoryIds.includes(category.id)) {
          wpIds.push(...category.wpCategories);
        }
        if (category.children) {
          collectWpIds(category.children);
        }
      });
    };
    
    collectWpIds(categoryHierarchy);
    return wpIds;
  };

  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle category expansion
  const handleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Render category hierarchy
  const renderCategoryHierarchy = (categories: CategoryHierarchy[], level = 0) => {
    return categories.map(category => (
      <div key={category.id} style={{ marginLeft: level * 16 }}>
        <div className="flex items-center py-2">
          {category.children && category.children.length > 0 && (
            <button
              onClick={() => handleCategoryExpand(category.id)}
              className="mr-2 p-1"
            >
              {expandedCategories.includes(category.id) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          )}
          <label className="flex items-center cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryToggle(category.id)}
              className="mr-2"
            />
            <span className={level === 0 ? 'font-medium' : 'text-gray-600'}>
              {category.name}
            </span>
          </label>
        </div>
        
        {category.children && 
         category.children.length > 0 && 
         expandedCategories.includes(category.id) && (
          <div>
            {renderCategoryHierarchy(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📰</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Local News</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {userLocation}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/usersettings')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <span className="font-medium">Filters</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {showFilters && (
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              {renderCategoryHierarchy(categoryHierarchy)}
            </div>
            
            {selectedCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-blue-600 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map(article => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {article.featured_image_url && (
                  <img
                    src={article.featured_image_url}
                    alt={stripHtml(article.title.rendered)}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                    {stripHtml(article.title.rendered)}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {stripHtml(article.excerpt.rendered)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage; 