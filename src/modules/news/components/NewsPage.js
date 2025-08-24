var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Search, ChevronDown, ChevronRight, MapPin, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { newsCacheService } from '../services/newsCacheService';
import { API_ENDPOINTS, buildApiUrl } from '../../../config/api';
// [2025-01-06 13:40 UTC] - NO MORE MOCK DATA IN PRODUCTION! Show errors instead.
var NewsPage = function () {
    var navigate = useNavigate();
    var _a = useState([]), articles = _a[0], setArticles = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = useState(false), showFilters = _e[0], setShowFilters = _e[1];
    var _f = useState([]), selectedCategories = _f[0], setSelectedCategories = _f[1];
    var _g = useState([]), categoryHierarchy = _g[0], setCategoryHierarchy = _g[1];
    var _h = useState([]), expandedCategories = _h[0], setExpandedCategories = _h[1];
    var _j = useState('hua-hin'), currentCity = _j[0], setCurrentCity = _j[1];
    var _k = useState('Hua Hin'), userLocation = _k[0], setUserLocation = _k[1];
    // Get user's current location
    useEffect(function () {
        var locationData = localStorage.getItem('localplus-current-location');
        if (locationData) {
            try {
                var location_1 = JSON.parse(locationData);
                var cityMap = {
                    'bangkok': { api: 'bangkok', display: 'Bangkok' },
                    'hua hin': { api: 'hua-hin', display: 'Hua Hin' },
                    'pattaya': { api: 'pattaya', display: 'Pattaya' },
                    'phuket': { api: 'phuket', display: 'Phuket' },
                    'chiang mai': { api: 'chiang-mai', display: 'Chiang Mai' },
                    'koh samui': { api: 'koh-samui', display: 'Koh Samui' }
                };
                var cityKey = location_1.city.toLowerCase();
                var cityInfo = cityMap[cityKey] || { api: 'hua-hin', display: 'Hua Hin' };
                setCurrentCity(cityInfo.api);
                setUserLocation(cityInfo.display);
            }
            catch (error) {
                console.error('Error parsing location data:', error);
                // Use defaults if parsing fails
                setCurrentCity('hua-hin');
                setUserLocation('Hua Hin');
            }
        }
    }, []);
    // Load category hierarchy from admin settings
    useEffect(function () {
        var loadCategoryHierarchy = function () {
            var adminSettings = localStorage.getItem('ldp_news_admin_categories');
            if (adminSettings) {
                try {
                    var settings = JSON.parse(adminSettings);
                    var citySettings = settings[currentCity];
                    if (citySettings && citySettings.hierarchy) {
                        setCategoryHierarchy(citySettings.hierarchy);
                        return;
                    }
                }
                catch (error) {
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
    useEffect(function () {
        var fetchArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
            var cached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = newsCacheService.get(currentCity);
                        if (cached && !searchTerm && selectedCategories.length === 0) {
                            console.log('📰 Loading from cache');
                            setArticles(cached.articles);
                            setLoading(false);
                            // Still check if we need to refresh in background
                            if (newsCacheService.needsRefresh(currentCity)) {
                                console.log('🔄 Cache needs refresh, fetching in background...');
                                fetchFromAPI(true); // Background fetch
                            }
                            return [2 /*return*/];
                        }
                        // If no cache or search/filter active, fetch from API
                        return [4 /*yield*/, fetchFromAPI(false)];
                    case 1:
                        // If no cache or search/filter active, fetch from API
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        var fetchFromAPI = function () {
            var args_1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args_1[_i] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (isBackground) {
                var params, wpCategoryIds, url, response, data, categoriesResponse, categories, _a, error_1, error_2;
                if (isBackground === void 0) { isBackground = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!isBackground) {
                                setLoading(true);
                                setError(null);
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 11, 12, 13]);
                            params = {};
                            if (searchTerm) {
                                params.search = searchTerm;
                            }
                            if (selectedCategories.length > 0) {
                                wpCategoryIds = getWpCategoryIds(selectedCategories);
                                if (wpCategoryIds.length > 0) {
                                    params.categories = wpCategoryIds.join(',');
                                }
                            }
                            url = buildApiUrl(API_ENDPOINTS.news(currentCity), params);
                            return [4 /*yield*/, fetch(url)];
                        case 2:
                            response = _b.sent();
                            if (!response.ok) {
                                throw new Error("HTTP error! status: ".concat(response.status));
                            }
                            return [4 /*yield*/, response.json()];
                        case 3:
                            data = _b.sent();
                            setArticles(data);
                            if (!(!searchTerm && selectedCategories.length === 0)) return [3 /*break*/, 10];
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 9, , 10]);
                            return [4 /*yield*/, fetch(API_ENDPOINTS.categories(currentCity))];
                        case 5:
                            categoriesResponse = _b.sent();
                            if (!categoriesResponse.ok) return [3 /*break*/, 7];
                            return [4 /*yield*/, categoriesResponse.json()];
                        case 6:
                            _a = _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _a = [];
                            _b.label = 8;
                        case 8:
                            categories = _a;
                            newsCacheService.store(currentCity, data, categories);
                            return [3 /*break*/, 10];
                        case 9:
                            error_1 = _b.sent();
                            console.warn('Failed to cache categories:', error_1);
                            newsCacheService.store(currentCity, data, []);
                            return [3 /*break*/, 10];
                        case 10: return [3 /*break*/, 13];
                        case 11:
                            error_2 = _b.sent();
                            console.error('Error fetching articles:', error_2);
                            if (!isBackground) {
                                setError('Failed to load news articles. Please try again.');
                            }
                            return [3 /*break*/, 13];
                        case 12:
                            if (!isBackground) {
                                setLoading(false);
                            }
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        fetchArticles();
    }, [currentCity, searchTerm, selectedCategories]);
    // Get WordPress category IDs from selected category hierarchy IDs
    var getWpCategoryIds = function (categoryIds) {
        var wpIds = [];
        var collectWpIds = function (categories) {
            categories.forEach(function (category) {
                if (categoryIds.includes(category.id)) {
                    wpIds.push.apply(wpIds, category.wpCategories);
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
    var handleCategoryToggle = function (categoryId) {
        setSelectedCategories(function (prev) {
            return prev.includes(categoryId)
                ? prev.filter(function (id) { return id !== categoryId; })
                : __spreadArray(__spreadArray([], prev, true), [categoryId], false);
        });
    };
    // Handle category expansion
    var handleCategoryExpand = function (categoryId) {
        setExpandedCategories(function (prev) {
            return prev.includes(categoryId)
                ? prev.filter(function (id) { return id !== categoryId; })
                : __spreadArray(__spreadArray([], prev, true), [categoryId], false);
        });
    };
    // Render category hierarchy
    var renderCategoryHierarchy = function (categories, level) {
        if (level === void 0) { level = 0; }
        return categories.map(function (category) { return (<div key={category.id} style={{ marginLeft: level * 16 }}>
        <div className="flex items-center py-2">
          {category.children && category.children.length > 0 && (<button onClick={function () { return handleCategoryExpand(category.id); }} className="mr-2 p-1">
              {expandedCategories.includes(category.id) ?
                    <ChevronDown className="w-4 h-4"/> :
                    <ChevronRight className="w-4 h-4"/>}
            </button>)}
          <label className="flex items-center cursor-pointer flex-1">
            <input type="checkbox" checked={selectedCategories.includes(category.id)} onChange={function () { return handleCategoryToggle(category.id); }} className="mr-2"/>
            <span className={level === 0 ? 'font-medium' : 'text-gray-600'}>
              {category.name}
            </span>
          </label>
        </div>
        
        {category.children &&
                category.children.length > 0 &&
                expandedCategories.includes(category.id) && (<div>
            {renderCategoryHierarchy(category.children, level + 1)}
          </div>)}
      </div>); });
    };
    // Manual refresh handler
    var handleManualRefresh = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, newsCacheService.manualRefresh(currentCity)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        setArticles(result.articles);
                    }
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Get cache status for display
    var _l = useState(''), cacheStatus = _l[0], setCacheStatus = _l[1];
    useEffect(function () {
        var updateCacheStatus = function () {
            var stats = newsCacheService.getCacheStats();
            if (stats && stats.city === currentCity) {
                var minutes = Math.floor(stats.age / 60);
                setCacheStatus(minutes < 1 ? 'Just updated' : "".concat(minutes, "m ago"));
            }
            else {
                setCacheStatus('');
            }
        };
        updateCacheStatus();
        var interval = setInterval(updateCacheStatus, 30000); // Update every 30s
        return function () { return clearInterval(interval); };
    }, [currentCity, articles]);
    var stripHtml = function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };
    // Get category name from category ID
    var getCategoryName = function (categoryId) {
        var categoryNames = {
            62: 'Local',
            297: 'National',
            796: 'Featured',
            60: 'Business',
            1: 'General'
        };
        return categoryNames[categoryId] || 'News';
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button onClick={function () { return navigate(-1); }} className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📰</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Local News</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1"/>
                  {userLocation}
                  {cacheStatus && (<span className="ml-2 text-xs text-blue-600">• {cacheStatus}</span>)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleManualRefresh} disabled={loading} className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50" title="Refresh news">
              <RefreshCw className={"w-5 h-5 ".concat(loading ? 'animate-spin' : '')}/>
            </button>
            <button onClick={function () { return navigate('/usersettings'); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Settings className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
          <input type="text" placeholder="Search news..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <button onClick={function () { return setShowFilters(!showFilters); }} className="w-full p-4 flex items-center justify-between text-left">
          <span className="font-medium">Filters</span>
          <ChevronDown className={"w-5 h-5 transition-transform ".concat(showFilters ? 'rotate-180' : '')}/>
        </button>
        
        {showFilters && (<div className="p-4 border-t bg-gray-50">
            <div className="space-y-2">
              {renderCategoryHierarchy(categoryHierarchy)}
            </div>
            
            {selectedCategories.length > 0 && (<div className="mt-4 pt-4 border-t">
                <button onClick={function () { return setSelectedCategories([]); }} className="text-blue-600 text-sm">
                  Clear all filters
                </button>
              </div>)}
          </div>)}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (<div className="space-y-4">
            {[1, 2, 3].map(function (i) { return (<div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>); })}
          </div>) : error ? (<div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600">{error}</p>
          </div>) : articles.length === 0 ? (<div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">No articles found</p>
          </div>) : (<div className="space-y-4">
            {articles.map(function (article) { return (<div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Featured Image */}
                    {article.featured_image_url && (<div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={article.featured_image_url} alt="" className="w-full h-full object-cover" onError={function (e) {
                        var target = e.target;
                        target.style.display = 'none';
                    }}/>
                      </div>)}
                    
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
                        {article.categories && article.categories.length > 0 && (<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {getCategoryName(article.categories[0])}
                          </span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>); })}
          </div>)}
      </div>
    </div>);
};
export default NewsPage;
