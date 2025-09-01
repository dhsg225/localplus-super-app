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
import { newsCacheService } from '../services/newsCacheService';
import { API_ENDPOINTS, buildApiUrl } from '../../../config/api';
var RotatingHeadlines = function (_a) {
    var currentCity = _a.currentCity, transitionStyle = _a.transitionStyle, _b = _a.intervalMs, intervalMs = _b === void 0 ? 5000 : _b, _c = _a.maxHeadlines, maxHeadlines = _c === void 0 ? 5 : _c;
    var _d = useState([]), headlines = _d[0], setHeadlines = _d[1];
    var _e = useState(0), currentIndex = _e[0], setCurrentIndex = _e[1];
    var _f = useState(true), isLoading = _f[0], setIsLoading = _f[1];
    // Category color mapping
    var categoryColors = {
        'local-news': '#10B981', // Green
        'national-news': '#3B82F6', // Blue
        'business': '#F59E0B', // Amber
        'sports': '#EF4444', // Red
        'entertainment': '#8B5CF6', // Purple
        'technology': '#06B6D4', // Cyan
        'health': '#EC4899', // Pink
        'default': '#6B7280' // Gray
    };
    var getCategoryInfo = function (article) {
        // Simple category detection based on WordPress categories
        var categories = article.categories || [];
        if (categories.includes(62))
            return { id: 'local-news', name: 'Local', color: categoryColors['local-news'] };
        if (categories.includes(297))
            return { id: 'national-news', name: 'National', color: categoryColors['national-news'] };
        if (categories.includes(60))
            return { id: 'business', name: 'Business', color: categoryColors['business'] };
        return { id: 'default', name: 'News', color: categoryColors['default'] };
    };
    var stripHtml = function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };
    var fetchHeadlines = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cached, topHeadlines, newsUrl, response, articles, apiError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 10]);
                    setIsLoading(true);
                    cached = newsCacheService.get(currentCity);
                    if (!(cached && cached.articles && cached.articles.length > 0)) return [3 /*break*/, 1];
                    topHeadlines = cached.articles.slice(0, maxHeadlines);
                    setHeadlines(topHeadlines);
                    return [3 /*break*/, 7];
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    newsUrl = buildApiUrl(API_ENDPOINTS.news(currentCity), { per_page: String(maxHeadlines) });
                    return [4 /*yield*/, fetch(newsUrl)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    articles = _a.sent();
                    if (articles && articles.length > 0) {
                        setHeadlines(articles);
                    }
                    else {
                        console.error('❌ No news articles available from server');
                        setHeadlines([]);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    console.error('❌ News server not responding (status:', response.status, ')');
                    setHeadlines([]);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    apiError_1 = _a.sent();
                    console.error('❌ News API failed:', apiError_1);
                    setHeadlines([]);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('❌ Failed to fetch headlines:', error_1);
                    setHeadlines([]);
                    return [3 /*break*/, 10];
                case 9:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchHeadlines();
    }, [currentCity, maxHeadlines]);
    useEffect(function () {
        if (headlines.length <= 1)
            return;
        var interval = setInterval(function () {
            setCurrentIndex(function (prev) { return (prev + 1) % headlines.length; });
        }, intervalMs);
        return function () { return clearInterval(interval); };
    }, [headlines.length, intervalMs]);
    if (isLoading) {
        return (<div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>);
    }
    if (headlines.length === 0) {
        return null;
    }
    var currentArticle = headlines[currentIndex];
    var categoryInfo = getCategoryInfo(currentArticle);
    var getTransitionClasses = function () {
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
    return (<div className="relative overflow-hidden bg-white rounded-lg shadow-sm">
      <div className="flex items-center p-4">
        {/* Category Tile */}
        <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0" style={{ backgroundColor: categoryInfo.color }}>
          {categoryInfo.name.charAt(0).toUpperCase()}
        </div>

        {/* Headline Content */}
        <div className="flex-1 min-w-0 relative">
          <div className={"".concat(getTransitionClasses(), " flex items-start space-x-3")}>
            {/* Featured Image */}
            {currentArticle.featured_image_url && (<div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                <img src={currentArticle.featured_image_url} alt="" className="w-full h-full object-cover" onError={function (e) {
                var target = e.target;
                target.style.display = 'none';
            }}/>
              </div>)}
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {stripHtml(currentArticle.title.rendered)}
              </h3>
              {headlines.length > 1 && (<div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{categoryInfo.name}</span>
                  <span className="mx-1">•</span>
                  <span>
                    {currentIndex + 1} of {headlines.length}
                  </span>
                </div>)}
            </div>
          </div>
        </div>

        {/* Navigation Dots (if multiple headlines) */}
        {headlines.length > 1 && (<div className="flex space-x-1 ml-3">
            {headlines.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentIndex(index); }} className={"w-2 h-2 rounded-full transition-colors ".concat(index === currentIndex ? 'bg-blue-500' : 'bg-gray-300')}/>); })}
          </div>)}
      </div>

      {/* Progress Bar */}
      {headlines.length > 1 && (<div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div className="h-full bg-blue-500 transition-all ease-linear" style={{
                width: "".concat(((currentIndex + 1) / headlines.length) * 100, "%"),
                transitionDuration: "".concat(intervalMs, "ms")
            }}/>
        </div>)}
    </div>);
};
export default RotatingHeadlines;
