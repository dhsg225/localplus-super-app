// [2024-05-10 17:30 UTC] - Advertisement Analytics Service

import { AdAnalytics } from '../types';

// In-memory storage for demo (in production, this would go to a database)
let analyticsData: AdAnalytics[] = [];

export const trackAdInteraction = (
  adId: string,
  action: 'impression' | 'click' | 'conversion',
  placement: string,
  userId?: string,
  metadata?: Record<string, any>
): void => {
  const analyticsEntry: AdAnalytics = {
    adId,
    userId,
    action,
    timestamp: new Date(),
    placement: placement as any,
    metadata
  };

  analyticsData.push(analyticsEntry);
  
  // Log for debugging (remove in production)
  console.log(`Ad Analytics: ${action} for ad ${adId} at ${placement}`, analyticsEntry);
  
  // In production, send to analytics service
  // sendToAnalyticsService(analyticsEntry);
};

export const getAdMetrics = (adId: string) => {
  const adData = analyticsData.filter(entry => entry.adId === adId);
  
  const impressions = adData.filter(entry => entry.action === 'impression').length;
  const clicks = adData.filter(entry => entry.action === 'click').length;
  const conversions = adData.filter(entry => entry.action === 'conversion').length;
  
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

  return {
    impressions,
    clicks,
    conversions,
    ctr: Math.round(ctr * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
    lastUpdated: new Date()
  };
};

export const getPlacementMetrics = (placement: string) => {
  const placementData = analyticsData.filter(entry => entry.placement === placement);
  
  const adIds = [...new Set(placementData.map(entry => entry.adId))];
  
  return adIds.map(adId => ({
    adId,
    ...getAdMetrics(adId)
  }));
};

export const getAllAnalytics = () => {
  return analyticsData;
};

export const clearAnalytics = () => {
  analyticsData = [];
};

// Simulated conversion tracking (call this when user completes desired action)
export const trackConversion = (adId: string, placement: string, userId?: string) => {
  trackAdInteraction(adId, 'conversion', placement, userId);
}; 