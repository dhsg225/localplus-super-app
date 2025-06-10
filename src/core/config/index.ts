// Core application configuration

export const APP_CONFIG = {
  name: "LocalPlus Super App",
  version: "1.0.0",
  domain: "localplus.city",
  defaultLocation: "bangkok",
  
  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || "https://api.localplus.city",
    timeout: 10000,
  },
  
  // External API Keys (should be in environment variables)
  keys: {
    gemini: process.env.VITE_GEMINI_API_KEY,
    googleMaps: process.env.VITE_GOOGLE_MAPS_API_KEY,
  },
  
  // EventON Integration
  eventon: {
    baseUrl: process.env.VITE_EVENTON_BASE_URL,
    apiKey: process.env.VITE_EVENTON_API_KEY,
  },
  
  // WordPress Integration
  wordpress: {
    baseUrl: process.env.VITE_WORDPRESS_BASE_URL,
    apiKey: process.env.VITE_WORDPRESS_API_KEY,
  },
  
  // Feature Flags
  features: {
    aiAssistant: true,
    pushNotifications: false,
    socialFeatures: false,
    paymentIntegration: false,
  },
  
  // UI Configuration
  ui: {
    defaultTheme: "light",
    animationDuration: 300,
    cardImageAspectRatio: "16:9",
  },
};