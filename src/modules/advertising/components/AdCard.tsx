// [2024-05-10 17:30 UTC] - Reusable Advertisement Card Component

import React, { useEffect } from 'react';
import { Clock, Award } from 'lucide-react';
import { Advertisement } from '../types';
import { trackAdInteraction } from '../services/adAnalytics';

interface AdCardProps {
  ad: Advertisement;
  placement: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showImage?: boolean;
}

const AdCard: React.FC<AdCardProps> = ({ 
  ad, 
  placement, 
  className = '', 
  size = 'medium',
  showImage = true 
}) => {
  
  // Track impression when component mounts
  useEffect(() => {
    trackAdInteraction(ad.id, 'impression', placement);
  }, [ad.id, placement]);

  const handleClick = () => {
    trackAdInteraction(ad.id, 'click', placement);
    
    if (ad.ctaAction) {
      ad.ctaAction();
    } else if (ad.ctaUrl) {
      if (ad.type === 'external') {
        window.open(ad.ctaUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = ad.ctaUrl;
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-3 min-h-[80px]';
      case 'large':
        return 'p-6 min-h-[200px]';
      default:
        return 'p-4 min-h-[120px]';
    }
  };

  const getTextSizes = () => {
    switch (size) {
      case 'small':
        return {
          title: 'text-sm font-semibold',
          description: 'text-xs',
          cta: 'text-xs px-2 py-1'
        };
      case 'large':
        return {
          title: 'text-xl font-bold',
          description: 'text-base',
          cta: 'text-sm px-4 py-2'
        };
      default:
        return {
          title: 'text-lg font-semibold',
          description: 'text-sm',
          cta: 'text-sm px-3 py-2'
        };
    }
  };

  const textSizes = getTextSizes();
  const isInternal = ad.type === 'internal';

  return (
    <div
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 
        hover:scale-105 hover:shadow-lg transform bg-white rounded-lg border border-gray-200
        ${getSizeClasses()}
        ${className}
      `}
      style={{
        background: ad.styling?.gradient || ad.styling?.backgroundColor || '#FFFFFF',
        borderRadius: ad.styling?.borderRadius || '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onClick={handleClick}
    >
      {/* Background Image for External Ads */}
      {showImage && ad.imageUrl && !isInternal && (
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <img 
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback for broken images
              e.currentTarget.src = 'https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Image';
            }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div 
        className="relative z-10 flex flex-col h-full p-4"
        style={{
          color: ad.styling?.textColor || '#000000'
        }}
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1">
            {isInternal ? (
              ad.category === 'internal-promotion' && ad.title.includes('Off Peak') ? (
                <Clock size={size === 'small' ? 16 : 20} className="flex-shrink-0" />
              ) : (
                <Award size={size === 'small' ? 16 : 20} className="flex-shrink-0" />
              )
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
            )}
            <h3 className={`${textSizes.title} leading-tight font-bold`}>
              {ad.title}
            </h3>
          </div>
          
          {/* Priority Badge for High Priority Ads */}
          {ad.priority >= 8 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold ml-2">
              HOT
            </div>
          )}
        </div>

        {/* Description */}
        <p className={`${textSizes.description} opacity-90 mb-4 flex-grow leading-relaxed text-gray-600`}>
          {ad.description}
        </p>

        {/* CTA Button - Improved styling */}
        <div className="flex justify-end">
          <button
            className={`
              ${textSizes.cta} font-bold rounded-lg transition-all duration-200
              hover:scale-105 active:scale-95 shadow-md border-2 border-transparent
              px-4 py-2 min-w-[100px] text-center
            `}
            style={{
              backgroundColor: ad.styling?.accentColor || (isInternal ? '#3B82F6' : '#1F2937'),
              color: '#FFFFFF',
              borderColor: ad.styling?.accentColor || (isInternal ? '#3B82F6' : '#1F2937')
            }}
          >
            {ad.ctaText}
          </button>
        </div>

        {/* Animation Effects */}
        {ad.styling?.animation === 'pulse' && (
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse rounded-lg" />
        )}
        
        {ad.styling?.animation === 'glow' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
        )}
      </div>

      {/* External Ad Indicator */}
      {!isInternal && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          Sponsored
        </div>
      )}
    </div>
  );
};

export default AdCard; 