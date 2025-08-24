// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
import { useState, useEffect } from 'react';

interface UseGooglePlacesImageOptions {
  size?: 'small' | 'medium' | 'large';
}

export const useGooglePlacesImage = (
  heroImage: string,
  options: UseGooglePlacesImageOptions = {}
) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { size = 'medium' } = options;

  useEffect(() => {
    // Check if this is a Google Places placeholder
    if (!heroImage.startsWith('google-places:')) {
      setImageUrl(heroImage || null);
      return;
    }

    const placeId = heroImage.replace('google-places:', '');
    
    if (!placeId) {
      setImageUrl(null);
      return;
    }

    const loadGooglePlacesImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Import the service dynamically to avoid bundling issues
        const { googlePlacesImageService } = await import('../services/googlePlacesImageService');
        
        console.log('📸 Loading Google Places image for:', placeId);
        
        const imageUrl = await googlePlacesImageService.getRestaurantImageUrl(placeId, size);
        
        if (imageUrl) {
          console.log('📸 Successfully loaded Google Places image');
          setImageUrl(imageUrl);
        } else {
          console.log('📸 No Google Places image available');
          setImageUrl(null);
        }
      } catch (err) {
        console.error('📸 Error loading Google Places image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image');
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadGooglePlacesImage();
  }, [heroImage, size]);

  return { imageUrl, isLoading, error };
};

// Hook for preloading multiple restaurant images
export const useRestaurantImageCache = (restaurants: Array<{ id: string; heroImage: string }>) => {
  const [cachedImages, setCachedImages] = useState<Map<string, string | null>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      
      try {
        const { googlePlacesImageService } = await import('../services/googlePlacesImageService');
        
        // Filter restaurants that need Google Places images
        const googlePlacesRestaurants = restaurants.filter(r => 
          r.heroImage.startsWith('google-places:')
        ).map(r => ({
          id: r.id,
          google_place_id: r.heroImage.replace('google-places:', '')
        }));

        if (googlePlacesRestaurants.length > 0) {
          console.log('📸 Preloading images for', googlePlacesRestaurants.length, 'restaurants');
          
          const imageCache = await googlePlacesImageService.cacheRestaurantImages(googlePlacesRestaurants);
          setCachedImages(imageCache);
        }
      } catch (error) {
        console.error('📸 Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurants.length > 0) {
      loadImages();
    }
  }, [restaurants]);

  const getImageUrl = (restaurantId: string, fallback: string): string => {
    return cachedImages.get(restaurantId) || fallback;
  };

  return {
    getImageUrl,
    isLoading,
    cachedImages
  };
}; 