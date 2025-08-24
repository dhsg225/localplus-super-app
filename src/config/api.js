// [2025-01-06 14:20 UTC] - Environment-aware API configuration for dev/production compatibility
var isDevelopment = import.meta.env.DEV;
var isProduction = import.meta.env.PROD;
// API base URLs based on environment
export var API_BASE_URL = isDevelopment
    ? 'http://localhost:3004'
    : '';
// API endpoints
export var API_ENDPOINTS = {
    news: function (city) { return "".concat(API_BASE_URL, "/api/news/").concat(city); },
    categories: function (city) { return "".concat(API_BASE_URL, "/api/news/").concat(city, "/categories"); },
    places: function () { return "".concat(API_BASE_URL, "/api/places"); },
    health: function () { return "".concat(API_BASE_URL, "/api/health"); }
};
// Helper function to build URLs with query parameters
export var buildApiUrl = function (endpoint, params) {
    if (!params)
        return endpoint;
    var url = new URL(endpoint, window.location.origin);
    Object.entries(params).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        url.searchParams.append(key, String(value));
    });
    return url.toString();
};
// Development check helper
export var isDev = isDevelopment;
export var isProd = isProduction;
console.log("\uD83D\uDD27 API Config: ".concat(isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION', " mode"));
console.log("\uD83D\uDCE1 API Base URL: ".concat(API_BASE_URL || 'relative paths'));
