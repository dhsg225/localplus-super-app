// [2024-05-10 17:30 UTC] - Advertisement Management Hook
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useEffect, useMemo } from 'react';
import { mockAdvertisements } from '../data/mockAds';
export var useAds = function (options) {
    var _a = useState([]), ads = _a[0], setAds = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var filteredAds = useMemo(function () {
        try {
            var filtered = mockAdvertisements.filter(function (ad) {
                // Check if ad is active
                if (!ad.isActive)
                    return false;
                // Check placement
                if (!ad.placement.includes(options.placement))
                    return false;
                // Check date range
                var now = new Date();
                if (ad.startDate && ad.startDate > now)
                    return false;
                if (ad.endDate && ad.endDate < now)
                    return false;
                // Check type filters
                if (options.showOnlyInternal && ad.type !== 'internal')
                    return false;
                if (options.showOnlyExternal && ad.type !== 'external')
                    return false;
                // Check category filter
                if (options.categoryFilter && !options.categoryFilter.includes(ad.category))
                    return false;
                // Check priority threshold
                if (options.priorityThreshold && ad.priority < options.priorityThreshold)
                    return false;
                return true;
            });
            // Sort by priority (highest first)
            filtered.sort(function (a, b) { return b.priority - a.priority; });
            // Limit results
            if (options.maxAds) {
                filtered = filtered.slice(0, options.maxAds);
            }
            return filtered;
        }
        catch (err) {
            console.error('Error filtering ads:', err);
            return [];
        }
    }, [options]);
    useEffect(function () {
        setLoading(true);
        // Simulate API call delay
        var timer = setTimeout(function () {
            setAds(filteredAds);
            setLoading(false);
            setError(null);
        }, 100);
        return function () { return clearTimeout(timer); };
    }, [filteredAds]);
    var refreshAds = function () {
        setLoading(true);
        // In a real app, this would refetch from the API
        setTimeout(function () {
            setAds(__spreadArray([], filteredAds, true));
            setLoading(false);
        }, 100);
    };
    return {
        ads: ads,
        loading: loading,
        error: error,
        refreshAds: refreshAds,
        hasAds: ads.length > 0
    };
};
export default useAds;
