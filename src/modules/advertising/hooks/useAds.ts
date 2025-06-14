// [2024-05-10 17:30 UTC] - Advertisement Management Hook

import { useState, useEffect, useMemo } from 'react';
import { Advertisement, AdDisplayOptions } from '../types';
import { mockAdvertisements } from '../data/mockAds';

export const useAds = (options: AdDisplayOptions) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredAds = useMemo(() => {
    try {
      let filtered = mockAdvertisements.filter(ad => {
        // Check if ad is active
        if (!ad.isActive) return false;
        
        // Check placement
        if (!ad.placement.includes(options.placement)) return false;
        
        // Check date range
        const now = new Date();
        if (ad.startDate && ad.startDate > now) return false;
        if (ad.endDate && ad.endDate < now) return false;
        
        // Check type filters
        if (options.showOnlyInternal && ad.type !== 'internal') return false;
        if (options.showOnlyExternal && ad.type !== 'external') return false;
        
        // Check category filter
        if (options.categoryFilter && !options.categoryFilter.includes(ad.category)) return false;
        
        // Check priority threshold
        if (options.priorityThreshold && ad.priority < options.priorityThreshold) return false;
        
        return true;
      });

      // Sort by priority (highest first)
      filtered.sort((a, b) => b.priority - a.priority);
      
      // Limit results
      if (options.maxAds) {
        filtered = filtered.slice(0, options.maxAds);
      }
      
      return filtered;
    } catch (err) {
      console.error('Error filtering ads:', err);
      return [];
    }
  }, [options]);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setAds(filteredAds);
      setLoading(false);
      setError(null);
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredAds]);

  const refreshAds = () => {
    setLoading(true);
    // In a real app, this would refetch from the API
    setTimeout(() => {
      setAds([...filteredAds]);
      setLoading(false);
    }, 100);
  };

  return {
    ads,
    loading,
    error,
    refreshAds,
    hasAds: ads.length > 0
  };
};

export default useAds; 