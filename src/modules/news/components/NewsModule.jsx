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
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Filter, Search, ExternalLink, Tag } from 'lucide-react';
var NewsModule = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState([]), posts = _c[0], setPosts = _c[1];
    var _d = useState([]), categories = _d[0], setCategories = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var _g = useState('hua-hin'), selectedCity = _g[0], setSelectedCity = _g[1];
    var _h = useState('all'), selectedCategory = _h[0], setSelectedCategory = _h[1];
    var _j = useState(''), searchTerm = _j[0], setSearchTerm = _j[1];
    var _k = useState(false), showFilters = _k[0], setShowFilters = _k[1];
    // Location detection and mapping
    var cityMapping = {
        'Bangkok': 'bangkok',
        'Hua Hin': 'hua-hin',
        'Pattaya': 'pattaya',
        'Phuket': 'phuket',
        'Chiang Mai': 'chiang-mai'
    };
    var availableCities = {
        'hua-hin': 'Hua Hin',
        'pattaya': 'Pattaya'
    };
    // Detect current location from localStorage or default to Hua Hin
    useEffect(function () {
        var detectLocation = function () {
            try {
                var savedLocation = localStorage.getItem('ldp_user_location');
                if (savedLocation) {
                    var locationData = JSON.parse(savedLocation);
                    var detectedCity = cityMapping[locationData.city] || 'hua-hin';
                    // Only set if we have news for this city
                    if (availableCities[detectedCity]) {
                        setSelectedCity(detectedCity);
                    }
                }
            }
            catch (error) {
                console.error('Error detecting location:', error);
                setSelectedCity('hua-hin'); // Fallback
            }
        };
        detectLocation();
    }, []);
    // Fetch news posts
    var fetchPosts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    url = "/api/news/".concat(selectedCity, "?per_page=20");
                    if (selectedCategory !== 'all') {
                        url += "&categories=".concat(selectedCategory);
                    }
                    if (searchTerm.trim()) {
                        url += "&search=".concat(encodeURIComponent(searchTerm.trim()));
                    }
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setPosts(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('Error fetching posts:', err_1);
                    setError('Failed to load news. Please try again later.');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Fetch categories
    var fetchCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, popularCategories, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/news/".concat(selectedCity, "/categories"))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    popularCategories = data.filter(function (cat) { return cat.count > 0; }).slice(0, 10);
                    setCategories(popularCategories);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error('Error fetching categories:', err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchPosts();
        fetchCategories();
    }, [selectedCity, selectedCategory]);
    useEffect(function () {
        var timeoutId = setTimeout(function () {
            if (searchTerm.trim() || searchTerm === '') {
                fetchPosts();
            }
        }, 500);
        return function () { return clearTimeout(timeoutId); };
    }, [searchTerm]);
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var stripHtml = function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };
    var getExcerpt = function (post) {
        var excerpt = stripHtml(post.excerpt.rendered);
        return excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt;
    };
    var getFeaturedImage = function (post) {
        var _a, _b, _c;
        if ((_c = (_b = (_a = post.yoast_head_json) === null || _a === void 0 ? void 0 : _a.og_image) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.url) {
            return post.yoast_head_json.og_image[0].url;
        }
        return null;
    };
    if (loading && posts.length === 0) {
        return (<div className={"bg-white rounded-lg shadow-lg p-6 ".concat(className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(function (i) { return (<div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>); })}
          </div>
        </div>
      </div>);
    }
    return (<div className={"bg-white rounded-lg shadow-lg ".concat(className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Local News</h2>
          <div className="flex items-center space-x-2 text-blue-100">
            <MapPin className="w-4 h-4"/>
            <span>{availableCities[selectedCity]}</span>
          </div>
        </div>

        {/* City Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(availableCities).map(function (_a) {
            var cityKey = _a[0], cityName = _a[1];
            return (<button key={cityKey} onClick={function () { return setSelectedCity(cityKey); }} className={"px-3 py-1 rounded-full text-sm transition-colors ".concat(selectedCity === cityKey
                    ? 'bg-white text-blue-600 font-medium'
                    : 'bg-blue-500 hover:bg-blue-400 text-white')}>
              {cityName}
            </button>);
        })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
          <input type="text" placeholder="Search news..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
        </div>

        {/* Filter Toggle */}
        <button onClick={function () { return setShowFilters(!showFilters); }} className="mt-3 flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
          <Filter className="w-4 h-4"/>
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (<div className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <button onClick={function () { return setSelectedCategory('all'); }} className={"px-3 py-1 rounded-full text-sm transition-colors ".concat(selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100')}>
              All Categories
            </button>
            {categories.map(function (category) { return (<button key={category.id} onClick={function () { return setSelectedCategory(category.id.toString()); }} className={"px-3 py-1 rounded-full text-sm transition-colors ".concat(selectedCategory === category.id.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100')}>
                {category.name} ({category.count})
              </button>); })}
          </div>
        </div>)}

      {/* Content */}
      <div className="p-6">
        {error ? (<div className="text-center py-8">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <button onClick={fetchPosts} className="text-blue-600 hover:text-blue-800 font-medium">
              Try again
            </button>
          </div>) : posts.length === 0 ? (<div className="text-center py-8 text-gray-500">
            No news articles found for your current search.
          </div>) : (<div className="space-y-6">
            {posts.map(function (post) { return (<article key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Featured Image */}
                  {getFeaturedImage(post) && (<div className="md:w-48 flex-shrink-0">
                      <img src={getFeaturedImage(post)} alt={stripHtml(post.title.rendered)} className="w-full h-32 md:h-24 object-cover rounded-lg" onError={function (e) {
                        e.target.style.display = 'none';
                    }}/>
                    </div>)}

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
                          <Clock className="w-4 h-4"/>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        {post.categories.length > 0 && (<div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4"/>
                            <span>{post.categories.length} categories</span>
                          </div>)}
                      </div>

                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
                        <span>Read More</span>
                        <ExternalLink className="w-4 h-4"/>
                      </a>
                    </div>
                  </div>
                </div>
              </article>); })}
          </div>)}

        {/* Load More */}
        {posts.length > 0 && !loading && (<div className="text-center mt-8">
            <button onClick={function () {
                // Implement pagination here
                console.log('Load more posts...');
            }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Load More News
            </button>
          </div>)}
      </div>
    </div>);
};
export default NewsModule;
