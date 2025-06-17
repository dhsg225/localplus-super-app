// [2025-01-07 02:10 UTC] - COMPLETELY REMOVED ALL FAKE/MOCK IMAGES - ONLY REAL GOOGLE PLACES IMAGES
// [2025-01-07 11:30 UTC] - Updated to use environment-aware API URLs for production compatibility

import { API_BASE_URL } from '../config/api';

export interface GooglePlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  photos?: GooglePlacePhoto[];
}

export class GooglePlacesImageService {
  private apiKey: string;
  private useBackendProxy: boolean;
  private baseUrl: string;

  constructor(useBackendProxy = true) {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
    this.useBackendProxy = useBackendProxy;
    
    // Use environment-aware base URL for production compatibility
    this.baseUrl = API_BASE_URL || '';

    if (!this.apiKey && !useBackendProxy) {
      console.warn('⚠️ Google Places API key not found. Backend proxy mode enabled.');
      this.useBackendProxy = true;
    }
  }

  /**
   * Fetch place photos from Google Places API
   */
  async getPlacePhotos(placeId: string): Promise<GooglePlacePhoto[]> {
    if (!placeId) {
      console.error('❌ Place ID is required');
      return [];
    }

    try {
      if (this.useBackendProxy) {
        console.log('🔄 Using backend proxy for place photos');
        
        // Use environment-aware URL (localhost in dev, relative path in production)
        const apiUrl = this.baseUrl ? `${this.baseUrl}/api/places/photos/${placeId}` : `/api/places/photos/${placeId}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Backend proxy error: ${response.status}`);
        }

        const data = await response.json();
        return data.photos || [];
      } else {
        // Direct API call (will likely fail due to CORS)
        console.log('🔄 Direct Google Places API call');
        
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${this.apiKey}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status !== 'OK') {
          throw new Error(`Google Places API error: ${data.status}`);
        }

        return data.result?.photos || [];
      }

    } catch (error) {
      console.error('❌ Error fetching place photos:', error);
      
      if (error instanceof Error && error.message.includes('CORS')) {
        console.warn('🚨 CORS error detected - Google Places API must be called from backend');
        console.warn('💡 Switch to backend proxy mode');
      }
      
      return [];
    }
  }

  /**
   * Get Google Places photo URL with proper API key
   */
  getPhotoUrl(photoReference: string, maxWidth: number, maxHeight: number): string {
    if (this.useBackendProxy) {
      // Use environment-aware URL (localhost in dev, relative path in production)
      const apiUrl = this.baseUrl ? `${this.baseUrl}/api/places/photo` : `/api/places/photo`;
      return `${apiUrl}?photo_reference=${photoReference}&maxwidth=${maxWidth}&maxheight=${maxHeight}`;
    }
    
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Get optimized restaurant image URL - ONLY real Google Places images
   */
  async getRestaurantImageUrl(placeId: string, size: 'small' | 'medium' | 'large' = 'medium'): Promise<string | null> {
    try {
      const photos = await this.getPlacePhotos(placeId);
      
      if (photos.length === 0) {
        console.log('📸 No Google Places photos found for place:', placeId);
        return null;
      }

      // Get the first (usually best quality) photo
      const photo = photos[0];
      
      // Size configurations
      const sizeConfig = {
        small: { width: 300, height: 200 },
        medium: { width: 600, height: 400 },
        large: { width: 1200, height: 800 }
      };

      const config = sizeConfig[size];
      const imageUrl = this.getPhotoUrl(photo.photo_reference, config.width, config.height);
      
      console.log('📸 Generated Google Places image URL:', imageUrl);
      return imageUrl;

    } catch (error) {
      console.error('❌ Error getting restaurant image:', error);
      return null;
    }
  }

  /**
   * Get multiple REAL images for gallery/carousel - NO FAKE IMAGES
   */
  async getRestaurantGallery(placeId: string, limit: number = 5): Promise<string[]> {
    try {
      const photos = await this.getPlacePhotos(placeId);
      
      if (photos.length === 0) {
        console.log('📸 No Google Places photos available for gallery');
        return [];
      }

      return photos
        .slice(0, limit)
        .map(photo => this.getPhotoUrl(photo.photo_reference, 600, 400));

    } catch (error) {
      console.error('❌ Error getting restaurant gallery:', error);
      return [];
    }
  }

  /**
   * Cache images locally for better performance - ONLY REAL IMAGES
   */
  async cacheRestaurantImages(restaurants: Array<{ google_place_id?: string; id: string }>): Promise<Map<string, string | null>> {
    const imageCache = new Map<string, string | null>();
    
    console.log('📸 Caching Google Places images for', restaurants.length, 'restaurants');
    
    for (const restaurant of restaurants) {
      if (restaurant.google_place_id) {
        try {
          const imageUrl = await this.getRestaurantImageUrl(restaurant.google_place_id, 'medium');
          imageCache.set(restaurant.id, imageUrl);
          
          // Add small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('❌ Error caching image for restaurant:', restaurant.id, error);
          imageCache.set(restaurant.id, null);
        }
      } else {
        console.log('📸 No Google Place ID for restaurant:', restaurant.id);
        imageCache.set(restaurant.id, null);
      }
    }
    
    console.log('📸 Cached images for', imageCache.size, 'restaurants');
    return imageCache;
  }
}

// Export singleton instance
export const googlePlacesImageService = new GooglePlacesImageService(); 