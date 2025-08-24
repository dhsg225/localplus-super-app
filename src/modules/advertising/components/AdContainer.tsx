// [2024-05-10 17:30 UTC] - Advertisement Container Component
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
import { getAdsByPlacement } from '../data/mockAds';
import AdCard from './AdCard';
import AdBanner from './AdBanner';
var AdContainer = function (_a) {
    var placement = _a.placement, _b = _a.displayType, displayType = _b === void 0 ? 'banner' : _b, _c = _a.maxAds, maxAds = _c === void 0 ? 2 : _c, _d = _a.showOnlyInternal, showOnlyInternal = _d === void 0 ? false : _d, _e = _a.showOnlyExternal, showOnlyExternal = _e === void 0 ? false : _e, categoryFilter = _a.categoryFilter, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.size, size = _g === void 0 ? 'medium' : _g, _h = _a.rotationInterval, rotationInterval = _h === void 0 ? 8000 : _h, _j = _a.showImage, showImage = _j === void 0 ? true : _j, _k = _a.filterType, filterType = _k === void 0 ? 'all' : _k;
    var _l = useState(0), currentAdIndex = _l[0], setCurrentAdIndex = _l[1];
    var _m = useState([]), dismissedAds = _m[0], setDismissedAds = _m[1];
    // Get and filter ads
    var allAds = getAdsByPlacement(placement);
    var filteredAds = allAds.filter(function (ad) {
        // Filter by type using filterType prop
        if (filterType === 'internal' && ad.type !== 'internal')
            return false;
        if (filterType === 'external' && ad.type !== 'external')
            return false;
        // Legacy filter support
        if (showOnlyInternal && ad.type !== 'internal')
            return false;
        if (showOnlyExternal && ad.type !== 'external')
            return false;
        // Filter by category
        if (categoryFilter && !categoryFilter.includes(ad.category))
            return false;
        // Filter out dismissed ads
        if (dismissedAds.includes(ad.id))
            return false;
        // Only show active ads
        if (ad.status !== 'active')
            return false;
        return true;
    }).slice(0, maxAds);
    // Auto-rotation for ads
    useEffect(function () {
        if (filteredAds.length <= 1 || rotationInterval <= 0)
            return;
        var interval = setInterval(function () {
            setCurrentAdIndex(function (prev) { return (prev + 1) % filteredAds.length; });
        }, rotationInterval);
        return function () { return clearInterval(interval); };
    }, [filteredAds.length, rotationInterval]);
    // Reset index if it's out of bounds
    useEffect(function () {
        if (currentAdIndex >= filteredAds.length && filteredAds.length > 0) {
            setCurrentAdIndex(0);
        }
    }, [filteredAds.length, currentAdIndex]);
    var handleDismiss = function (adId) {
        setDismissedAds(function (prev) { return __spreadArray(__spreadArray([], prev, true), [adId], false); });
    };
    if (filteredAds.length === 0) {
        return null;
    }
    // Single ad display with rotation
    if (maxAds === 1) {
        var ad_1 = filteredAds[currentAdIndex] || filteredAds[0];
        return (<div className={"transition-opacity duration-500 ".concat(className)}>
        {displayType === 'banner' ? (<AdBanner ad={ad_1} placement={placement} dismissible={ad_1.type === 'external'} onDismiss={function () { return handleDismiss(ad_1.id); }}/>) : (<AdCard ad={ad_1} placement={placement} size={size} showImage={showImage}/>)}
        
        {/* Rotation indicator */}
        {filteredAds.length > 1 && (<div className="flex justify-center mt-2 space-x-1">
            {filteredAds.map(function (_, index) { return (<div key={index} className={"w-2 h-2 rounded-full transition-colors ".concat(index === currentAdIndex ? 'bg-blue-600' : 'bg-gray-300')}/>); })}
          </div>)}
      </div>);
    }
    // Multiple ads display
    return (<div className={"space-y-4 ".concat(className)}>
      {filteredAds.map(function (ad, index) { return (<div key={ad.id}>
          {displayType === 'banner' ? (<AdBanner ad={ad} placement={placement} dismissible={ad.type === 'external'} onDismiss={function () { return handleDismiss(ad.id); }}/>) : (<AdCard ad={ad} placement={placement} size={size} showImage={showImage}/>)}
        </div>); })}
    </div>);
};
export default AdContainer;
