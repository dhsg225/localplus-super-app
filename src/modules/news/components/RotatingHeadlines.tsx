import React, { useState, useEffect } from 'react';
import { newsCacheService } from '../services/newsCacheService';
import { API_ENDPOINTS, buildApiUrl } from '../../../config/api';

// [2025-01-06 13:45 UTC] - NO MORE MOCK DATA! News server must be running.

interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

interface RotatingHeadlinesProps {
  currentCity: string;
  transitionStyle: 'slide' | 'fade' | 'crossdissolve';
  intervalMs?: number;
  maxHeadlines?: number;
}

const RotatingHeadlines: React.FC<RotatingHeadlinesProps> = ({
  currentCity,
  transitionStyle,
  intervalMs = 5000,
  maxHeadlines = 5
}) => {
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Category color mapping
  const categoryColors: { [key: string]: string } = {
    'local-news': '#10B981', // Green
    'national-news': '#3B82F6', // Blue
    'business': '#F59E0B', // Amber
    'sports': '#EF4444', // Red
    'entertainment': '#8B5CF6', // Purple
    'technology': '#06B6D4', // Cyan
    'health': '#EC4899', // Pink
    'default': '#6B7280' // Gray
  };

  const getCategoryInfo = (article: any): CategoryInfo => {
    // Simple category detection based on WordPress categories
    const categories = article.categories || [];
    
    if (categories.includes(62)) return { id: 'local-news', name: 'Local', color: categoryColors['local-news'] };
    if (categories.includes(297)) return { id: 'national-news', name: 'National', color: categoryColors['national-news'] };
    if (categories.includes(60)) return { id: 'business', name: 'Business', color: categoryColors['business'] };
    
    return { id: 'default', name: 'News', color: categoryColors['default'] };
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const fetchHeadlines = async () => {
    try {
      setIsLoading(true);
      const cached = newsCacheService.get(currentCity);
      
      if (cached && cached.articles && cached.articles.length > 0) {
        const topHeadlines = cached.articles.slice(0, maxHeadlines);
        setHeadlines(topHeadlines);
      } else {
        // Try direct API call
        try {
          const newsUrl = buildApiUrl(API_ENDPOINTS.news(currentCity), { per_page: String(maxHeadlines) });
          const response = await fetch(newsUrl);
          if (response.ok) {
            const articles = await response.json();
            if (articles && articles.length > 0) {
              setHeadlines(articles);
            } else {
              console.error('❌ No news articles available from server');
              setHeadlines([]);
            }
          } else {
            console.error('❌ News server not responding (status:', response.status, ')');
            setHeadlines([]);
          }
        } catch (apiError) {
          console.error('❌ News API failed:', apiError);
          setHeadlines([]);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch headlines:', error);
      setHeadlines([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadlines();
  }, [currentCity, maxHeadlines]);

  useEffect(() => {
    if (headlines.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [headlines.length, intervalMs]);

  if (isLoading) {
    return (
      <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (headlines.length === 0) {
    return null;
  }

  const currentArticle = headlines[currentIndex];
  const categoryInfo = getCategoryInfo(currentArticle);

  const getTransitionClasses = () => {
    switch (transitionStyle) {
      case 'slide':
        return 'transform transition-transform duration-500 ease-in-out';
      case 'fade':
        return 'transition-opacity duration-500 ease-in-out';
      case 'crossdissolve':
        return 'transition-all duration-700 ease-in-out';
      default:
        return 'transition-opacity duration-500 ease-in-out';
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="flex items-center p-4">
        {/* Category Tile */}
        <div 
          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0"
          style={{ backgroundColor: categoryInfo.color }}
        >
          {categoryInfo.name.charAt(0).toUpperCase()}
        </div>

        {/* Headline Content */}
        <div className="flex-1 min-w-0 relative">
          <div className={`${getTransitionClasses()} flex items-start space-x-3`}>
            {/* Featured Image */}
            {currentArticle.featured_image_url && (
              <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={currentArticle.featured_image_url}
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
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {stripHtml(currentArticle.title.rendered)}
              </h3>
              {headlines.length > 1 && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{categoryInfo.name}</span>
                  <span className="mx-1">•</span>
                  <span>
                    {currentIndex + 1} of {headlines.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dots (if multiple headlines) */}
        {headlines.length > 1 && (
          <div className="flex space-x-1 ml-3">
            {headlines.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {headlines.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-blue-500 transition-all ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / headlines.length) * 100}%`,
              transitionDuration: `${intervalMs}ms`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RotatingHeadlines; 