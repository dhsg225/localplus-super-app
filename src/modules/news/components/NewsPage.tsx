import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Search, ChevronDown, ChevronRight, MapPin, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { newsCacheService } from '../services/newsCacheService';
import { API_ENDPOINTS, buildApiUrl } from '../../../config/api';

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

// [2025-01-06 13:40 UTC] - NO MORE MOCK DATA IN PRODUCTION! Show errors instead.

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
    const locationData = localStorage.getItem('localplus-current-location');
    if (locationData) {
      try {
        const location = JSON.parse(locationData);
        const cityMap: { [key: string]: { api: string, display: string } } = {
          'bangkok': { api: 'bangkok', display: 'Bangkok' },
          'hua hin': { api: 'hua-hin', display: 'Hua Hin' },
          'pattaya': { api: 'pattaya', display: 'Pattaya' },
          'phuket': { api: 'phuket', display: 'Phuket' },
          'chiang mai': { api: 'chiang-mai', display: 'Chiang Mai' },
          'koh samui': { api: 'koh-samui', display: 'Koh Samui' }
        };
        
        const cityKey = location.city.toLowerCase();
        const cityInfo = cityMap[cityKey] || { api: 'hua-hin', display: 'Hua Hin' };
        
        setCurrentCity(cityInfo.api);
        setUserLocation(cityInfo.display);
      } catch (error) {
        console.error('Error parsing location data:', error);
        // Use defaults if parsing fails
        setCurrentCity('hua-hin');
        setUserLocation('Hua Hin');
      }
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

  // Fetch articles with caching
  useEffect(() => {
    const fetchArticles = async () => {
      // First, try to load from cache for instant display
      const cached = newsCacheService.get(currentCity);
      if (cached && !searchTerm && selectedCategories.length === 0) {
        console.log('📰 Loading from cache');
        setArticles(cached.articles);
        setLoading(false);
        
        // Still check if we need to refresh in background
        if (newsCacheService.needsRefresh(currentCity)) {
          console.log('🔄 Cache needs refresh, fetching in background...');
          fetchFromAPI(true); // Background fetch
        }
        return;
      }
      
      // If no cache or search/filter active, fetch from API
      await fetchFromAPI(false);
    };

    const fetchFromAPI = async (isBackground = false) => {
      if (!isBackground) {
        setLoading(true);
        setError(null);
      }
      
      try {
        const params: Record<string, string> = {};
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (selectedCategories.length > 0) {
          // Get all WordPress category IDs for selected categories
          const wpCategoryIds = getWpCategoryIds(selectedCategories);
          if (wpCategoryIds.length > 0) {
            params.categories = wpCategoryIds.join(',');
          }
        }
        
        const url = buildApiUrl(API_ENDPOINTS.news(currentCity), params);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setArticles(data);
        
        // Cache the results (only if no search/filter)
        if (!searchTerm && selectedCategories.length === 0) {
          // Get categories for caching
          try {
            const categoriesResponse = await fetch(API_ENDPOINTS.categories(currentCity));
            const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
            newsCacheService.store(currentCity, data, categories);
          } catch (error) {
            console.warn('Failed to cache categories:', error);
            newsCacheService.store(currentCity, data, []);
          }
        }
        
      } catch (error) {
        console.error('Error fetching articles:', error);
        if (!isBackground) {
          setError('Failed to load news articles. Please try again.');
        }
      } finally {
        if (!isBackground) {
          setLoading(false);
        }
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

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setLoading(true);
    const result = await newsCacheService.manualRefresh(currentCity);
    if (result) {
      setArticles(result.articles);
    }
    setLoading(false);
  };

  // Get cache status for display
  const [cacheStatus, setCacheStatus] = useState<string>('');
  
  useEffect(() => {
    const updateCacheStatus = () => {
      const stats = newsCacheService.getCacheStats();
      if (stats && stats.city === currentCity) {
        const minutes = Math.floor(stats.age / 60);
        setCacheStatus(minutes < 1 ? 'Just updated' : `${minutes}m ago`);
      } else {
        setCacheStatus('');
      }
    };
    
    updateCacheStatus();
    const interval = setInterval(updateCacheStatus, 30000); // Update every 30s
    
    return () => clearInterval(interval);
  }, [currentCity, articles]);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Get category name from category ID
  const getCategoryName = (categoryId: number): string => {
    const categoryNames: { [key: number]: string } = {
      62: 'Local',
      297: 'National', 
      796: 'Featured',
      60: 'Business',
      1: 'General'
    };
    return categoryNames[categoryId] || 'News';
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
                  {cacheStatus && (
                    <span className="ml-2 text-xs text-blue-600">• {cacheStatus}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Refresh news"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/usersettings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
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
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Featured Image */}
                    {article.featured_image_url && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={article.featured_image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                        {stripHtml(article.title.rendered)}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {stripHtml(article.excerpt.rendered)}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(article.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {article.categories && article.categories.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {getCategoryName(article.categories[0])}
                          </span>
                        )}
                      </div>
                    </div>
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