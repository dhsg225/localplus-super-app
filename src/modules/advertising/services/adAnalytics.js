// [2024-05-10 17:30 UTC] - Advertisement Analytics Service
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
// In-memory storage for demo (in production, this would go to a database)
var analyticsData = [];
export var trackAdInteraction = function (adId, action, placement, userId, metadata) {
    var analyticsEntry = {
        adId: adId,
        userId: userId,
        action: action,
        timestamp: new Date(),
        placement: placement,
        metadata: metadata
    };
    analyticsData.push(analyticsEntry);
    // Log for debugging (remove in production)
    console.log("Ad Analytics: ".concat(action, " for ad ").concat(adId, " at ").concat(placement), analyticsEntry);
    // In production, send to analytics service
    // sendToAnalyticsService(analyticsEntry);
};
export var getAdMetrics = function (adId) {
    var adData = analyticsData.filter(function (entry) { return entry.adId === adId; });
    var impressions = adData.filter(function (entry) { return entry.action === 'impression'; }).length;
    var clicks = adData.filter(function (entry) { return entry.action === 'click'; }).length;
    var conversions = adData.filter(function (entry) { return entry.action === 'conversion'; }).length;
    var ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    var conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    return {
        impressions: impressions,
        clicks: clicks,
        conversions: conversions,
        ctr: Math.round(ctr * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        lastUpdated: new Date()
    };
};
export var getPlacementMetrics = function (placement) {
    var placementData = analyticsData.filter(function (entry) { return entry.placement === placement; });
    var adIds = __spreadArray([], new Set(placementData.map(function (entry) { return entry.adId; })), true);
    return adIds.map(function (adId) { return (__assign({ adId: adId }, getAdMetrics(adId))); });
};
export var getAllAnalytics = function () {
    return analyticsData;
};
export var clearAnalytics = function () {
    analyticsData = [];
};
// Simulated conversion tracking (call this when user completes desired action)
export var trackConversion = function (adId, placement, userId) {
    trackAdInteraction(adId, 'conversion', placement, userId);
};
