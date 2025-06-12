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
    this.checkGoogleMapsAvailable();
  }

  private checkGoogleMapsAvailable() {
    // Check if Google Maps is available
    if (window.google && window.google.maps && window.google.maps.places) {
      this.isGoogleLoaded = true;
    } else {
      console.warn('Google Maps not available, using fallback data');
      this.isGoogleLoaded = false;
    }
  }

  // Discover businesses near a location
  async discoverBusinessesNearby(
    lat: number, 
    lng: number, 
    radiusMeters: number = 3000,
    businessType: string = ''
  ): Promise<GooglePlaceResult[]> {
    try {
      // Try real Google Places API first
      const realResults = await this.searchRealGooglePlaces(lat, lng, radiusMeters, businessType);
      if (realResults.length > 0) {
        console.log(`🌟 Found ${realResults.length} real businesses via Google Places API`);
        return realResults;
      }
      
      // Fallback to demo data if API fails
      console.log('📋 Using fallback data (API may have failed)');
      return this.getFallbackBusinesses(lat, lng, radiusMeters, businessType);
    } catch (error) {
      console.error('Error in discoverBusinessesNearby:', error);
      return this.getFallbackBusinesses(lat, lng, radiusMeters, businessType);
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      // Return mock details for demo
      return {
        place_id: placeId,
        name: 'Sample Business Details',
        formatted_address: '123 Sample Street, Bangkok, Thailand',
        formatted_phone_number: '+66 2 123 4567',
        website: 'https://example.com',
        rating: 4.5,
        user_ratings_total: 150,
        price_level: 2,
        geometry: {
          location: { lat: 13.8179, lng: 100.0416 }
        },
        types: ['restaurant', 'establishment'],
        business_status: 'OPERATIONAL'
      };
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
      const results = this.getFallbackBusinesses(lat, lng, radiusMeters, query);
      console.log(`📊 Fallback businesses found:`, results.length);
      console.log(`🏢 Businesses:`, results);
      return results;
    } catch (error) {
      console.error('Error in text search:', error);
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
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
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

  // Fallback businesses for demonstration
  private getFallbackBusinesses(lat: number, lng: number, radiusMeters: number, query?: string): GooglePlaceResult[] {
    const baseBusinesses = [
      {
        place_id: 'demo_restaurant_1',
        name: 'Seaside Thai Restaurant',
        vicinity: '123 Beach Road, Bangkok',
        geometry: { location: { lat: lat + 0.001, lng: lng + 0.001 } },
        rating: 4.5,
        price_level: 2,
        types: ['restaurant', 'food', 'establishment'],
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'demo_spa_1',
        name: 'Lotus Wellness Spa',
        vicinity: '456 Wellness Street, Bangkok',
        geometry: { location: { lat: lat + 0.002, lng: lng - 0.001 } },
        rating: 4.7,
        price_level: 3,
        types: ['spa', 'beauty_salon', 'health'],
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'demo_cafe_1',
        name: 'Coffee Culture Cafe',
        vicinity: '789 Cafe Lane, Bangkok',
        geometry: { location: { lat: lat - 0.001, lng: lng + 0.002 } },
        rating: 4.3,
        price_level: 2,
        types: ['cafe', 'food', 'establishment'],
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'demo_market_1',
        name: 'Central Shopping Plaza',
        vicinity: '321 Shopping District, Bangkok',
        geometry: { location: { lat: lat + 0.003, lng: lng - 0.002 } },
        rating: 4.2,
        price_level: 2,
        types: ['shopping_mall', 'store'],
        business_status: 'OPERATIONAL'
      },
      {
        place_id: 'demo_hotel_1',
        name: 'Bangkok Grand Hotel',
        vicinity: '654 Hotel Avenue, Bangkok',
        geometry: { location: { lat: lat - 0.002, lng: lng - 0.001 } },
        rating: 4.6,
        price_level: 4,
        types: ['lodging', 'travel_agency'],
        business_status: 'OPERATIONAL'
      }
    ];

    // Filter based on query if provided
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      console.log(`🔍 Filtering businesses with search term: "${searchTerm}"`);
      
      const filtered = baseBusinesses.filter(business => {
        const nameMatch = business.name.toLowerCase().includes(searchTerm);
        const typeMatch = business.types.some(type => 
          type.includes(searchTerm) || 
          (searchTerm.includes('restaurant') && type === 'restaurant') ||
          (searchTerm.includes('spa') && type === 'spa') ||
          (searchTerm.includes('cafe') && type === 'cafe') ||
          (searchTerm.includes('hotel') && type === 'lodging') ||
          (searchTerm.includes('shop') && (type === 'store' || type === 'shopping_mall'))
        );
        const vicinityMatch = business.vicinity.toLowerCase().includes(searchTerm);
        
        const matches = nameMatch || typeMatch || vicinityMatch;
        console.log(`🏢 "${business.name}": name=${nameMatch}, type=${typeMatch}, vicinity=${vicinityMatch}, matches=${matches}`);
        return matches;
      });
      
      console.log(`📊 Filtered ${filtered.length} businesses from ${baseBusinesses.length} total`);
      return filtered;
    }

    return baseBusinesses;
  }

  // Calculate distance between two points (for fallback filtering)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Real Google Places API integration via our proxy server
  private async searchRealGooglePlaces(
    lat: number, 
    lng: number, 
    radiusMeters: number,
    businessType: string
  ): Promise<GooglePlaceResult[]> {
    // Map our categories to Google Place types
    const typeMap: { [key: string]: string } = {
      'Restaurants': 'restaurant',
      'Wellness': 'spa',
      'Shopping': 'store',
      'Services': 'establishment',
      'Entertainment': 'tourist_attraction',
      'Travel': 'lodging'
    };
    
    const googleType = typeMap[businessType] || 'establishment';
    
    // Use our local proxy server instead of calling Google directly (avoids CORS)
    const proxyUrl = `http://localhost:3003/api/places?` +
      `lat=${lat}&` +
      `lng=${lng}&` +
      `radius=${radiusMeters}&` +
      `type=${googleType}`;
    
    console.log(`🔍 Searching real Google Places in Hua Hin for ${businessType} via proxy...`);
    console.log(`📍 Location: ${lat}, ${lng} (radius: ${radiusMeters}m)`);
    
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results) {
        console.log(`✅ Google Places API returned ${data.results.length} businesses`);
        
        return data.results.map((place: any) => ({
          place_id: place.place_id,
          name: place.name,
          vicinity: place.vicinity || place.formatted_address || 'Hua Hin, Thailand',
          geometry: {
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }
          },
          rating: place.rating || null,
          price_level: place.price_level || null,
          types: place.types || [],
          photos: place.photos || [],
          opening_hours: place.opening_hours || null,
          business_status: place.business_status || 'OPERATIONAL'
        }));
      } else {
        console.log(`⚠️ Proxy API returned: ${data.status || 'ERROR'}`);
        if (data.error || data.message) {
          console.log(`💡 Error: ${data.error || data.message}`);
        }
        return [];
      }
    } catch (error) {
      console.error('❌ Proxy API error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();

// Export types and service
export default GooglePlacesService; 