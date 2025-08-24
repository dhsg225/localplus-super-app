// [2024-05-10 17:30 UTC] - Advertisement Container Component

import React, { useState, useEffect } from 'react';
import { getAdsByPlacement } from '../data/mockAds';
import AdCard from './AdCard';
import AdBanner from './AdBanner';

interface AdContainerProps {
  placement: string;
  displayType?: 'card' | 'banner';
  maxAds?: number;
  showOnlyInternal?: boolean;
  showOnlyExternal?: boolean;
  categoryFilter?: string[];
  className?: string;
  size?: 'small' | 'medium' | 'large';
  rotationInterval?: number; // in milliseconds
  showImage?: boolean;
  filterType?: 'internal' | 'external' | 'all';
}

const AdContainer: React.FC<AdContainerProps> = ({
  placement,
  displayType = 'banner',
  maxAds = 2,
  showOnlyInternal = false,
  showOnlyExternal = false,
  categoryFilter,
  className = '',
  size = 'medium',
  rotationInterval = 8000,
  showImage = true,
  filterType = 'all'
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissedAds, setDismissedAds] = useState<string[]>([]);

  // Get and filter ads
  const allAds = getAdsByPlacement(placement);
  const filteredAds = allAds.filter(ad => {
    // Filter by type using filterType prop
    if (filterType === 'internal' && ad.type !== 'internal') return false;
    if (filterType === 'external' && ad.type !== 'external') return false;
    
    // Legacy filter support
    if (showOnlyInternal && ad.type !== 'internal') return false;
    if (showOnlyExternal && ad.type !== 'external') return false;
    
    // Filter by category
    if (categoryFilter && !categoryFilter.includes(ad.category)) return false;
    
    // Filter out dismissed ads
    if (dismissedAds.includes(ad.id)) return false;
    
    // Only show active ads
    if (!ad.isActive) return false;
    
    return true;
  }).slice(0, maxAds);

  // Auto-rotation for ads
  useEffect(() => {
    if (filteredAds.length <= 1 || rotationInterval <= 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % filteredAds.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [filteredAds.length, rotationInterval]);

  // Reset index if it's out of bounds
  useEffect(() => {
    if (currentAdIndex >= filteredAds.length && filteredAds.length > 0) {
      setCurrentAdIndex(0);
    }
  }, [filteredAds.length, currentAdIndex]);

  const handleDismiss = (adId: string) => {
    setDismissedAds(prev => [...prev, adId]);
  };

  if (filteredAds.length === 0) {
    return null;
  }

  // Single ad display with rotation
  if (maxAds === 1) {
    const ad = filteredAds[currentAdIndex] || filteredAds[0];
    
    return (
      <div className={`transition-opacity duration-500 ${className}`}>
        {displayType === 'banner' ? (
          <AdBanner 
            ad={ad} 
            placement={placement}
            dismissible={ad.type === 'external'}
            onDismiss={() => handleDismiss(ad.id)}
          />
        ) : (
          <AdCard 
            ad={ad} 
            placement={placement}
            size={size}
            showImage={showImage}
          />
        )}
        
        {/* Rotation indicator */}
        {filteredAds.length > 1 && (
          <div className="flex justify-center mt-2 space-x-1">
            {filteredAds.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Multiple ads display
  return (
    <div className={`space-y-4 ${className}`}>
      {filteredAds.map((ad) => (
        <div key={ad.id}>
          {displayType === 'banner' ? (
            <AdBanner 
              ad={ad} 
              placement={placement}
              dismissible={ad.type === 'external'}
              onDismiss={() => handleDismiss(ad.id)}
            />
          ) : (
            <AdCard 
              ad={ad} 
              placement={placement}
              size={size}
              showImage={showImage}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AdContainer; 