import { Business } from '../lib/supabase';

// Global Google object type declaration
declare global {
  interface Window {
    google: any;
  }
}

// Google Places API Types
export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  business_status?: string;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      close: { day: number; time: string };
      open: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  business_status: string;
}

class GooglePlacesService {
  private isGoogleLoaded = false;

  constructor() {
    // [2025-01-06 12:00 UTC] - Don't check immediately, wait for Google Maps to load
    // this.checkGoogleMapsAvailable();
  }

  private checkGoogleMapsAvailable(): boolean {
    // Check if Google Maps is available
    if (window.google && window.google.maps && window.google.maps.places) {
      this.isGoogleLoaded = true;
      return true;
    } else {
      this.isGoogleLoaded = false;
      return false;
    }
  }

  // [2025-01-06 12:00 UTC] - Wait for Google Maps to load with retry mechanism
  private async waitForGoogleMaps(maxRetries: number = 10, delayMs: number = 500): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      if (this.checkGoogleMapsAvailable()) {
        console.log('✅ Google Maps API is now available');
        return true;
      }
      console.log(`⏳ Waiting for Google Maps API... (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    console.error('❌ Google Maps API failed to load after maximum retries');
    return false;
  }

  // Discover businesses near a location
  async discoverBusinessesNearby(
    lat: number, 
    lng: number, 
    radiusMeters: number = 3000,
    businessType: string = ''
  ): Promise<GooglePlaceResult[]> {
    try {
      // [2024-12-19 16:30 UTC] - Production: Only use real Google Places API
      const realResults = await this.searchRealGooglePlaces(lat, lng, radiusMeters, businessType);
      console.log(`🌟 Found ${realResults.length} real businesses via Google Places API`);
      return realResults;
    } catch (error) {
      console.error('Error in discoverBusinessesNearby:', error);
      // [2024-12-19 16:30 UTC] - Return empty array for production instead of demo data
      return [];
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      // [2025-01-06 12:00 UTC] - Wait for Google Maps API to load before getting details
      const isAvailable = await this.waitForGoogleMaps();
      if (!isAvailable) {
        console.error('Google Maps API not available');
        return null;
      }

      // Use real Google Places API to get details
      return new Promise((resolve) => {
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );

        service.getDetails(
          {
            placeId: placeId,
            fields: [
              'place_id', 'name', 'formatted_address', 'formatted_phone_number',
              'website', 'rating', 'user_ratings_total', 'price_level',
              'opening_hours', 'photos', 'geometry', 'types', 'business_status'
            ]
          },
          (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              resolve({
                place_id: place.place_id!,
                name: place.name!,
                formatted_address: place.formatted_address!,
                formatted_phone_number: place.formatted_phone_number,
                website: place.website,
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                price_level: place.price_level,
                opening_hours: place.opening_hours,
                photos: place.photos,
                geometry: place.geometry!,
                types: place.types!,
                business_status: place.business_status!
              });
            } else {
              console.error('Place details request failed:', status);
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Search for businesses by text query
  async searchBusinessesByText(
    query: string,
    lat: number,
    lng: number,
    radiusMeters: number = 5000
  ): Promise<GooglePlaceResult[]> {
    try {
      console.log(`🔍 Searching for "${query}" near ${lat}, ${lng}`);
      // [2024-12-19 16:30 UTC] - Production: Only use real Google Places API
      const results = await this.searchRealGooglePlaces(lat, lng, radiusMeters, query);
      console.log(`📊 Real businesses found:`, results.length);
      console.log(`🏢 Businesses:`, results);
      return results;
    } catch (error) {
      console.error('Error in text search:', error);
      // [2024-12-19 16:30 UTC] - Return empty array for production
      return [];
    }
  }

  // Convert Google Place to our Business format
  googlePlaceToBusiness(place: GooglePlaceResult, details?: GooglePlaceDetails): Partial<Business> {
    const category = this.categorizeGooglePlace(place.types);
    
    return {
      google_place_id: place.place_id,
      name: place.name,
      category: category,
      address: details?.formatted_address || place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      phone: details?.formatted_phone_number,
      website_url: details?.website,
      partnership_status: 'pending' as const
    };
  }

  // Get photo URL from Google Places photo reference
  getPhotoUrl(photoReference: string): string {
    return photoReference || '/placeholder-business.jpg';
  }

  // Categorize Google Place types into our categories
  private categorizeGooglePlace(types: string[]): string {
    const typeMap: { [key: string]: string } = {
      'restaurant': 'Restaurants',
      'food': 'Restaurants',
      'meal_takeaway': 'Restaurants',
      'cafe': 'Restaurants',
      'spa': 'Wellness',
      'beauty_salon': 'Wellness',
      'gym': 'Wellness',
      'health': 'Wellness',
      'store': 'Shopping',
      'shopping_mall': 'Shopping',
      'clothing_store': 'Shopping',
      'electronics_store': 'Shopping',
      'tourist_attraction': 'Entertainment',
      'amusement_park': 'Entertainment',
      'night_club': 'Entertainment',
      'lodging': 'Travel',
      'travel_agency': 'Travel',
      'car_rental': 'Services',
      'bank': 'Services',
      'hospital': 'Services'
    };

    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }
    return 'Services';
  }

  // Get Google Place types for category
  private getGooglePlaceTypes(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Restaurants': 'restaurant,food,meal_takeaway,cafe',
      'Wellness': 'spa,beauty_salon,gym,health',
      'Shopping': 'store,shopping_mall,clothing_store',
      'Services': 'bank,car_rental,hospital',
      'Entertainment': 'tourist_attraction,amusement_park,night_club',
      'Travel': 'lodging,travel_agency'
    };
    return categoryMap[category] || 'establishment';
  }

  // Generate business description
  private generateBusinessDescription(place: GooglePlaceResult, details?: GooglePlaceDetails): string {
    const rating = place.rating ? `${place.rating}⭐` : '';
    const price = place.price_level ? '฿'.repeat(place.price_level) : '';
    const status = place.opening_hours?.open_now ? 'Currently Open' : '';
    
    return [rating, price, status].filter(Boolean).join(' • ') || 'Local business in your area';
  }

  // Real Google Places API integration - production ready
  private async searchRealGooglePlaces(
    lat: number, 
    lng: number, 
    radiusMeters: number,
    businessType: string
  ): Promise<GooglePlaceResult[]> {
    // [2025-01-06 12:00 UTC] - Wait for Google Maps API to load before searching
    const isAvailable = await this.waitForGoogleMaps();
    if (!isAvailable) {
      console.error('❌ Google Maps API not available - cannot search for real businesses');
      return [];
    }

    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      // [2025-01-06 13:00 UTC] - Determine if this is a text search or category search
      const isTextSearch = businessType && !['Restaurants', 'Wellness', 'Shopping', 'Entertainment', 'Services', 'Travel'].includes(businessType);
      
      if (isTextSearch) {
        // Use text search for specific queries like "daddy" or "pizza"
        console.log(`🔍 Performing TEXT search for "${businessType}"`);
        const request = {
          query: businessType,
          location: new window.google.maps.LatLng(lat, lng),
          radius: radiusMeters
        };

        service.textSearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            console.log(`✅ Found ${results.length} businesses for query: "${businessType}"`);
            
            const mappedResults = results.map((place) => ({
              place_id: place.place_id!,
              name: place.name!,
              vicinity: place.vicinity || place.formatted_address || 'Hua Hin, Thailand',
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                }
              },
              rating: place.rating || null,
              price_level: place.price_level || null,
              types: place.types || [],
              photos: place.photos || [],
              opening_hours: place.opening_hours || null,
              business_status: place.business_status || 'OPERATIONAL'
            }));

            resolve(mappedResults);
          } else {
            console.error(`❌ Google Places text search error for "${businessType}": ${status}`);
            resolve([]);
          }
        });
      } else {
        // Use nearby search for category-based searches
        const getSingleGoogleType = (businessType: string): string => {
          if (businessType.includes('restaurant') || businessType.includes('food') || businessType.includes('dining')) {
            return 'restaurant'; // Single most relevant type
          }
          
          const typeMap: { [key: string]: string } = {
            'Wellness': 'spa',
            'spa wellness massage beauty salon': 'spa',
            'Shopping': 'store',
            'store shop mall market': 'store',
            'Entertainment': 'tourist_attraction',
            'entertainment attraction activity': 'tourist_attraction'
          };
          
          return typeMap[businessType] || 'establishment';
        };
        
        const googleType = getSingleGoogleType(businessType);
        console.log(`🔍 Performing NEARBY search for category: ${businessType}`);
        console.log(`🏷️ Using Google type: ${googleType}`);
        console.log(`📍 Location: ${lat}, ${lng} (radius: ${radiusMeters}m)`);

        const request = {
          location: new window.google.maps.LatLng(lat, lng),
          radius: radiusMeters,
          type: googleType
        };

        service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            console.log(`✅ Found ${results.length} businesses for type: ${googleType}`);
            
            const mappedResults = results.map((place) => ({
              place_id: place.place_id!,
              name: place.name!,
              vicinity: place.vicinity || 'Hua Hin, Thailand',
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                }
              },
              rating: place.rating || null,
              price_level: place.price_level || null,
              types: place.types || [],
              photos: place.photos || [],
              opening_hours: place.opening_hours || null,
              business_status: place.business_status || 'OPERATIONAL'
            }));

            resolve(mappedResults);
          } else {
            console.error(`❌ Google Places API error for type ${googleType}: ${status}`);
            resolve([]);
          }
        });
      }
    });
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();

// Export types and service
export default GooglePlacesService;
export { GooglePlacesService }; 