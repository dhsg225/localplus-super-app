import React from 'react';
interface ImageCarouselProps {
    images: string[];
    alt: string;
    className?: string;
    showDots?: boolean;
    showArrows?: boolean;
}
declare const ImageCarousel: React.FC<ImageCarouselProps>;
export default ImageCarousel;
