import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Filter, Search, ExternalLink, Tag } from 'lucide-react';

interface NewsPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  author: number;
  featured_media: number;
  categories: number[];
  link: string;
  yoast_head_json?: {
    og_image?: Array<{ url: string; width: number; height: number }>;
    description?: string;
  };
}

interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const NewsModuleTest: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('hua-hin');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const availableCities = {
    'hua-hin': 'Hua Hin',
    'pattaya': 'Pattaya'
  };

  // Fetch news posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/news/${selectedCity}?per_page=10`;
      if (selectedCategory !== 'all') {
        url += `&categories=${selectedCategory}`;
      }
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/news/${selectedCity}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const popularCategories = data.filter((cat: NewsCategory) => cat.count > 0).slice(0, 8);
      setCategories(popularCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCity, selectedCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() || searchTerm === '') {
        fetchPosts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (post: NewsPost) => {
    const excerpt = stripHtml(post.excerpt.rendered);
    return excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt;
  };

  const getFeaturedImage = (post: NewsPost) => {
    if (post.yoast_head_json?.og_image?.[0]?.url) {
      return post.yoast_head_json.og_image[0].url;
    }
    return null;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📰 Local News</h2>
          <div className="flex items-center space-x-2 text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{availableCities[selectedCity as keyof typeof availableCities]}</span>
          </div>
        </div>

        {/* City Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(availableCities).map(([cityKey, cityName]) => (
            <button
              key={cityKey}
              onClick={() => setSelectedCity(cityKey)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCity === cityKey
                  ? 'bg-white text-blue-600 font-medium'
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {cityName}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <button
              onClick={fetchPosts}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No news articles found for your current search.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Featured Image */}
                  {getFeaturedImage(post) && (
                    <div className="md:w-48 flex-shrink-0">
                      <img
                        src={getFeaturedImage(post)!}
                        alt={stripHtml(post.title.rendered)}
                        className="w-full h-32 md:h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {stripHtml(post.title.rendered)}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {getExcerpt(post)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        {post.categories.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>{post.categories.length} categories</span>
                          </div>
                        )}
                      </div>

                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <span>Read More</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {posts.length} articles from {availableCities[selectedCity as keyof typeof availableCities]} • Powered by WordPress API
        </div>
      </div>
    </div>
  );
};

export default NewsModuleTest; 