import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
var ImageCarousel = function (_a) {
    var images = _a.images, alt = _a.alt, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.showDots, showDots = _c === void 0 ? true : _c, _d = _a.showArrows, showArrows = _d === void 0 ? true : _d;
    // [2025-01-05 10:05] - Debug logging for broken images
    console.log("\uD83D\uDDBC\uFE0F ImageCarousel Debug for ".concat(alt, ":"));
    console.log("\uD83D\uDDBC\uFE0F Received images:", images);
    console.log("\uD83D\uDDBC\uFE0F Images array length:", images.length);
    console.log("\uD83D\uDDBC\uFE0F First image:", images[0]);
    var _e = useState(0), currentIndex = _e[0], setCurrentIndex = _e[1];
    var _f = useState(false), isTransitioning = _f[0], setIsTransitioning = _f[1];
    var touchStartX = useRef(null);
    var touchEndX = useRef(null);
    var goToSlide = function (index) {
        if (isTransitioning)
            return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(function () { return setIsTransitioning(false); }, 300);
    };
    var goToNext = function () {
        var nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        goToSlide(nextIndex);
    };
    var goToPrev = function () {
        var prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        goToSlide(prevIndex);
    };
    var handleTouchStart = function (e) {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    var handleTouchMove = function (e) {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    var handleTouchEnd = function () {
        if (!touchStartX.current || !touchEndX.current)
            return;
        var distance = touchStartX.current - touchEndX.current;
        var threshold = 50; // minimum swipe distance
        if (Math.abs(distance) > threshold) {
            if (distance > 0) {
                goToNext(); // Swipe left - next image
            }
            else {
                goToPrev(); // Swipe right - previous image
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };
    if (images.length === 0) {
        return (<div className={"bg-gray-200 flex items-center justify-center ".concat(className)}>
        <span className="text-gray-400">No image</span>
      </div>);
    }
    if (images.length === 1) {
        return (<img src={images[0]} alt={alt} className={"w-full h-full object-cover ".concat(className)}/>);
    }
    return (<div className={"relative overflow-hidden ".concat(className)}>
      {/* Image Container */}
      <div className="flex transition-transform duration-300 ease-out" style={{ transform: "translateX(-".concat(currentIndex * 100, "%)") }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {images.map(function (image, index) { return (<img key={index} src={image} alt={"".concat(alt, " - Image ").concat(index + 1)} className="w-full h-full object-cover flex-shrink-0" onError={function (e) {
                console.error('🖼️ Image failed to load:', image);
                console.error('🖼️ Error event:', e);
            }} onLoad={function () {
                console.log('🖼️ Image loaded successfully:', image);
            }}/>); })}
      </div>

      {/* Enhanced Navigation Arrows - Always Visible */}
      {showArrows && images.length > 1 && (<>
          <button onClick={goToPrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm shadow-lg">
            <ChevronLeft size={16}/>
          </button>
          <button onClick={goToNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm shadow-lg">
            <ChevronRight size={16}/>
          </button>
        </>)}
      
      {/* Swipe Hint for Mobile - Shows briefly on first load */}
      {images.length > 1 && (<div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded animate-pulse">
            👈 Swipe
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded animate-pulse">
            Swipe 👉
          </div>
        </div>)}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map(function (_, index) { return (<button key={index} onClick={function () { return goToSlide(index); }} className={"w-2 h-2 rounded-full transition-colors ".concat(index === currentIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50')}/>); })}
        </div>)}

      {/* Image Counter */}
      {images.length > 1 && (<div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1}/{images.length}
        </div>)}
    </div>);
};
export default ImageCarousel;
