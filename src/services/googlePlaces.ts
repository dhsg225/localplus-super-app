import { Business } from '../lib/supabase';

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
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Using fallback mode.');
    }
  }

  // Discover businesses near a location
  async discoverBusinessesNearby(
    lat: number, 
    lng: number, 
    radiusMeters: number = 3000,
    businessType: string = ''
  ): Promise<GooglePlaceResult[]> {
    if (!this.apiKey) {
      return this.getFallbackBusinesses(lat, lng, radiusMeters);
    }

    try {
      const types = this.getGooglePlaceTypes(businessType);
      const url = `${this.baseUrl}/nearbysearch/json?` +
        `location=${lat},${lng}&` +
        `radius=${radiusMeters}&` +
        `type=${types}&` +
        `key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.results;
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        return this.getFallbackBusinesses(lat, lng, radiusMeters);
      }
    } catch (error) {
      console.error('Error fetching from Google Places:', error);
      return this.getFallbackBusinesses(lat, lng, radiusMeters);
    }
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const fields = [
        'place_id', 'name', 'formatted_address', 'formatted_phone_number',
        'website', 'rating', 'user_ratings_total', 'price_level',
        'opening_hours', 'photos', 'geometry', 'types', 'business_status'
      ].join(',');

      const url = `${this.baseUrl}/details/json?` +
        `place_id=${placeId}&` +
        `fields=${fields}&` +
        `key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.result;
      } else {
        console.error('Google Places Details API error:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
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
    if (!this.apiKey) {
      return this.getFallbackBusinesses(lat, lng, radiusMeters);
    }

    try {
      const url = `${this.baseUrl}/textsearch/json?` +
        `query=${encodeURIComponent(query)}&` +
        `location=${lat},${lng}&` +
        `radius=${radiusMeters}&` +
        `key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.results;
      } else {
        console.error('Google Places Text Search error:', data.status);
        return [];
      }
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
      description: this.generateBusinessDescription(place, details),
      partnership_status: 'pending' as const
    };
  }

  // Get photo URL from Google Places photo reference
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.apiKey) {
      return '/placeholder-business.jpg';
    }
    
    return `${this.baseUrl}/photo?` +
      `maxwidth=${maxWidth}&` +
      `photo_reference=${photoReference}&` +
      `key=${this.apiKey}`;
  }

  // Map Google Place types to our categories
  private categorizeGooglePlace(types: string[]): string {
    const categoryMappings = {
      'Restaurants': ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery', 'bar'],
      'Wellness': ['spa', 'gym', 'health', 'beauty_salon', 'hair_care', 'physiotherapist'],
      'Shopping': ['store', 'shopping_mall', 'clothing_store', 'jewelry_store', 'shoe_store'],
      'Services': ['car_repair', 'bank', 'real_estate_agency', 'lawyer', 'accounting'],
      'Entertainment': ['amusement_park', 'movie_theater', 'night_club', 'bowling_alley'],
      'Travel': ['lodging', 'travel_agency', 'tourist_attraction', 'car_rental']
    };

    for (const [category, keywords] of Object.entries(categoryMappings)) {
      if (types.some(type => keywords.includes(type))) {
        return category;
      }
    }

    return 'Services'; // Default category
  }

  // Convert business category to Google Places types
  private getGooglePlaceTypes(category: string): string {
    const typeMapping: Record<string, string> = {
      'Restaurants': 'restaurant',
      'Wellness': 'spa',
      'Shopping': 'store',
      'Services': 'establishment',
      'Entertainment': 'amusement_park',
      'Travel': 'lodging'
    };

    return typeMapping[category] || 'establishment';
  }

  // Generate business description from Google Places data
  private generateBusinessDescription(place: GooglePlaceResult, details?: GooglePlaceDetails): string {
    const parts: string[] = [];
    
    if (place.rating) {
      parts.push(`Rated ${place.rating} stars`);
    }
    
    if (details?.user_ratings_total) {
      parts.push(`${details.user_ratings_total} reviews`);
    }
    
    if (place.price_level) {
      const priceSymbols = '฿'.repeat(place.price_level);
      parts.push(`Price range: ${priceSymbols}`);
    }

    const category = this.categorizeGooglePlace(place.types);
    parts.unshift(`${category} business`);
    
    return parts.join(' • ');
  }

  // Fallback businesses when Google API is not available
  private getFallbackBusinesses(lat: number, lng: number, radiusMeters: number): GooglePlaceResult[] {
    // Return enhanced version of our existing mock businesses
    const fallbackBusinesses: GooglePlaceResult[] = [
      {
        place_id: 'fallback_seaside_bistro',
        name: 'Seaside Bistro',
        vicinity: '123 Beach Road, Hua Hin',
        geometry: { location: { lat: 12.5684, lng: 99.9578 } },
        rating: 4.5,
        price_level: 2,
        types: ['restaurant', 'food', 'establishment']
      },
      {
        place_id: 'fallback_blue_wave_spa',
        name: 'Blue Wave Spa',
        vicinity: '456 Wellness Center, Hua Hin',
        geometry: { location: { lat: 12.5704, lng: 99.9598 } },
        rating: 4.7,
        price_level: 3,
        types: ['spa', 'health', 'establishment']
      },
      {
        place_id: 'fallback_local_craft_market',
        name: 'Local Craft Market',
        vicinity: '789 Night Market Street, Hua Hin',
        geometry: { location: { lat: 12.5664, lng: 99.9568 } },
        rating: 4.2,
        types: ['store', 'shopping_mall', 'establishment']
      },
      {
        place_id: 'fallback_sunset_sailing',
        name: 'Sunset Sailing',
        vicinity: 'Hua Hin Pier, Hua Hin',
        geometry: { location: { lat: 12.5744, lng: 99.9638 } },
        rating: 4.8,
        price_level: 2,
        types: ['amusement_park', 'tourist_attraction', 'establishment']
      },
      {
        place_id: 'fallback_golden_palace',
        name: 'Golden Palace Thai',
        vicinity: '321 Royal Golf Area, Hua Hin',
        geometry: { location: { lat: 12.5804, lng: 99.9718 } },
        rating: 4.6,
        price_level: 3,
        types: ['restaurant', 'food', 'establishment']
      },
      {
        place_id: 'fallback_wellness_retreat',
        name: 'Wellness Retreat Center',
        vicinity: '654 Khao Takiab Road, Hua Hin',
        geometry: { location: { lat: 12.5584, lng: 99.9518 } },
        rating: 4.4,
        price_level: 2,
        types: ['spa', 'health', 'establishment']
      }
    ];

    // Calculate distances and filter by radius
    const userLocation = { lat, lng };
    return fallbackBusinesses.filter(business => {
      const distance = this.calculateDistance(
        userLocation.lat, userLocation.lng,
        business.geometry.location.lat, business.geometry.location.lng
      );
      return distance * 1000 <= radiusMeters; // Convert km to meters
    });
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService();

// Export types and service
export default GooglePlacesService; 