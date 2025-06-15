// [2025-01-06 14:20 UTC] - Environment-aware API configuration for dev/production compatibility

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API base URLs based on environment
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3004' 
  : '';

// API endpoints
export const API_ENDPOINTS = {
  news: (city: string) => `${API_BASE_URL}/api/news/${city}`,
  categories: (city: string) => `${API_BASE_URL}/api/news/${city}/categories`,
  places: () => `${API_BASE_URL}/api/places`,
  health: () => `${API_BASE_URL}/api/health`
};

// Helper function to build URLs with query parameters
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>) => {
  if (!params) return endpoint;
  
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  return url.toString();
};

// Development check helper
export const isDev = isDevelopment;
export const isProd = isProduction;

console.log(`🔧 API Config: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
console.log(`📡 API Base URL: ${API_BASE_URL || 'relative paths'}`); 