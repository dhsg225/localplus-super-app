import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  showDots?: boolean;
  showArrows?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  className = '',
  showDots = true,
  showArrows = true
}) => {
  // [2025-01-05 10:05] - Debug logging for broken images
  console.log(`🖼️ ImageCarousel Debug for ${alt}:`);
  console.log(`🖼️ Received images:`, images);
  console.log(`🖼️ Images array length:`, images.length);
  console.log(`🖼️ First image:`, images[0]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum swipe distance

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        goToNext(); // Swipe left - next image
      } else {
        goToPrev(); // Swipe right - previous image
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image Container */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} - Image ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            onError={(e) => {
              console.error('🖼️ Image failed to load:', image);
              console.error('🖼️ Error event:', e);
            }}
            onLoad={() => {
              console.log('🖼️ Image loaded successfully:', image);
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation Arrows - Always Visible */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm shadow-lg"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
      
      {/* Swipe Hint for Mobile - Shows briefly on first load */}
      {images.length > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded animate-pulse">
            👈 Swipe
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded animate-pulse">
            Swipe 👉
          </div>
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel; 