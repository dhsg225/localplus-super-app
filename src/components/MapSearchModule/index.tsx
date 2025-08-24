// [2025-01-07 11:50 UTC] - Unified Map Search Module
// Main component that provides map-based business discovery for both consumer and admin contexts

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, MapPin, RotateCcw, Loader } from 'lucide-react';
import { 
  MapSearchModuleProps, 
  MapSearchState, 
  BusinessResult, 
  BusinessCardAction,
  MapSearchLocation,
  MapSearchFilters 
} from './types';
import { 
  CONSUMER_CONFIG, 
  ADMIN_CONFIG, 
  DEFAULT_RADIUS, 
  MAX_RESULTS, 
  MAP_CONFIG 
} from './config';
import BusinessCard from './BusinessCard';
import RestaurantCard from './RestaurantCard';
import { googlePlacesService } from '../../services/googlePlaces';
import { googlePlacesImageService } from '../../services/googlePlacesImageService';

const MapSearchModule: React.FC<MapSearchModuleProps> = ({
  context,
  filtersEnabled = true,
  radiusSlider = true,
  resultCardType = 'restaurant',
  actions,
  initialLocation,
  defaultRadius,
  maxResults,
  className = '',
  showMap = true,
  mapHeight,
  cardLayout,
  onLocationChange,
  onFiltersChange,
  onBusinessSelect,
  onBusinessAction,
  onApprove,
  onReject,
  onCreateLead
}) => {
  // Get context-specific configuration
  const config = context === 'consumer' ? CONSUMER_CONFIG : ADMIN_CONFIG;
  const effectiveActions = actions || config.actions;
  const effectiveCardLayout = cardLayout || config.cardLayout;
  const effectiveShowMap = showMap !== undefined ? showMap : config.showMap;
  const effectiveMapHeight = mapHeight || config.mapHeight;

  // Component state
  const [state, setState] = useState<MapSearchState>({
    location: initialLocation || null,
    filters: {
      radius: defaultRadius || DEFAULT_RADIUS[context],
      businessType: resultCardType
    },
    results: [],
    selectedBusiness: null,
    isLoading: false,
    error: null,
    mapInstance: null,
    markers: []
  });

  // Map container ref
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!effectiveShowMap || !mapRef.current || !state.location) return;

    try {
      // Wait for Google Maps to load
      await new Promise<void>((resolve) => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          const checkGoogle = () => {
            if (window.google && window.google.maps) {
              resolve();
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
        }
      });

      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: state.location.lat, lng: state.location.lng },
        zoom: MAP_CONFIG.defaultZoom,
        styles: MAP_CONFIG.styles,
        ...MAP_CONFIG.controls
      });

      // Add click listener for pin dropping
      map.addListener('click', (event: any) => {
        const newLocation: MapSearchLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        setState(prev => ({ ...prev, location: newLocation }));
        onLocationChange?.(newLocation);
        performSearch(newLocation, state.filters);
      });

      setState(prev => ({ ...prev, mapInstance: map }));
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setState(prev => ({ ...prev, error: 'Failed to load map' }));
    }
  }, [effectiveShowMap, state.location, onLocationChange]);

  // Convert Google Places result to BusinessResult
  const convertToBusinessResult = async (place: any): Promise<BusinessResult> => {
    // Get photos using the image service
    let photos: string[] = [];
    if (place.place_id) {
      try {
        photos = await googlePlacesImageService.getRestaurantGallery(place.place_id, 3);
      } catch (error) {
        console.warn('Failed to load photos for place:', place.place_id);
      }
    }

    return {
      id: place.place_id || Math.random().toString(36),
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity,
      location: {
        lat: typeof place.geometry.location.lat === 'function' 
          ? place.geometry.location.lat() 
          : place.geometry.location.lat,
        lng: typeof place.geometry.location.lng === 'function' 
          ? place.geometry.location.lng() 
          : place.geometry.location.lng
      },
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      priceLevel: place.price_level,
      photos,
      phoneNumber: place.formatted_phone_number,
      website: place.website,
      cuisine: place.types?.filter((type: string) => 
        ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type)
      ),
      types: place.types,
      openingHours: place.opening_hours ? {
        isOpen: place.opening_hours.open_now,
        hours: place.opening_hours.weekday_text
      } : undefined,
      businessStatus: place.business_status,
      // Admin fields (would be populated from database in real implementation)
      approvalStatus: context === 'admin' ? 'pending' : undefined,
      source: 'google_places',
      addedDate: new Date()
    };
  };

  // Perform search
  const performSearch = async (location: MapSearchLocation, filters: MapSearchFilters) => {
    if (!location) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const radius = filters.radius || DEFAULT_RADIUS[context];
      const businessType = filters.businessType || resultCardType;
      
      // Use existing Google Places service
      const results = await googlePlacesService.searchBusinessesByText(
        businessType,
        location.lat,
        location.lng,
        radius
      );

      // Convert results to BusinessResult format
      const businessResults = await Promise.all(
        results.slice(0, maxResults || MAX_RESULTS[context])
          .map(place => convertToBusinessResult(place))
      );

      // Apply additional filters
      let filteredResults = businessResults;

      if (filters.rating) {
        filteredResults = filteredResults.filter(b => 
          b.rating && b.rating >= filters.rating!
        );
      }

      if (filters.priceLevel && filters.priceLevel.length > 0) {
        filteredResults = filteredResults.filter(b => 
          b.priceLevel && filters.priceLevel!.includes(b.priceLevel)
        );
      }

      if (filters.openNow) {
        filteredResults = filteredResults.filter(b => 
          b.openingHours?.isOpen === true
        );
      }

      if (context === 'admin' && filters.status) {
        filteredResults = filteredResults.filter(b => 
          b.approvalStatus === filters.status
        );
      }

      setState(prev => ({ 
        ...prev, 
        results: filteredResults, 
        isLoading: false 
      }));

      // Update map markers
      updateMapMarkers(filteredResults);

    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Search failed. Please try again.', 
        isLoading: false 
      }));
    }
  };

  // Update map markers
  const updateMapMarkers = (results: BusinessResult[]) => {
    if (!state.mapInstance) return;

    // Clear existing markers
    state.markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = results.map((business) => {
      const marker = new window.google.maps.Marker({
        position: business.location,
        map: state.mapInstance,
        title: business.name,
        icon: {
          url: context === 'consumer' 
            ? 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f97316">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              `)
            : 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      marker.addListener('click', () => {
        setState(prev => ({ ...prev, selectedBusiness: business }));
        onBusinessSelect?.(business);
      });

      return marker;
    });

    setState(prev => ({ ...prev, markers: newMarkers }));
  };

  // Handle business action
  const handleBusinessAction = (action: BusinessCardAction, business: BusinessResult) => {
    // Context-specific actions
    switch (action) {
      case 'approve':
        onApprove?.(business);
        break;
      case 'reject':
        onReject?.(business);
        break;
      case 'lead':
        onCreateLead?.(business);
        break;
      case 'call':
        if (business.phoneNumber) {
          window.location.href = `tel:${business.phoneNumber}`;
        }
        break;
      case 'directions':
        const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
        window.open(url, '_blank');
        break;
      default:
        onBusinessAction?.(action, business);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof MapSearchFilters, value: any) => {
    const newFilters = { ...state.filters, [key]: value };
    setState(prev => ({ ...prev, filters: newFilters }));
    onFiltersChange?.(newFilters);
    
    if (state.location) {
      performSearch(state.location, newFilters);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setState(prev => ({ ...prev, isLoading: true }));
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: MapSearchLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setState(prev => ({ ...prev, location, isLoading: false }));
          onLocationChange?.(location);
          performSearch(location, state.filters);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setState(prev => ({ 
            ...prev, 
            error: 'Unable to get your location', 
            isLoading: false 
          }));
        }
      );
    }
  };

  // Initialize map when location is available
  useEffect(() => {
    if (state.location && effectiveShowMap) {
      initializeMap();
    }
  }, [state.location, initializeMap, effectiveShowMap]);

  // Perform initial search
  useEffect(() => {
    if (state.location) {
      performSearch(state.location, state.filters);
    }
  }, [state.location]);

  return (
    <div className={`map-search-module ${className}`}>
      {/* Header Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {context === 'consumer' ? 'Discover Places' : 'Business Discovery'}
            </h2>
            <p className="text-gray-600 mt-1">
              {context === 'consumer' 
                ? 'Find amazing local businesses near you'
                : 'Discover and manage business listings'
              }
            </p>
          </div>
          
          <button
            onClick={getCurrentLocation}
            disabled={state.isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {state.isLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            <span>Use My Location</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {filtersEnabled && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          )}
        </div>

        {/* Location Info */}
        {state.location && state.location.lat && state.location.lng && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Search Location:</span>
                <span className="text-xs text-blue-700">
                  {state.location.lat.toFixed(4)}, {state.location.lng.toFixed(4)}
                </span>
              </div>
              {radiusSlider && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-700">Radius:</span>
                  <input
                    type="range"
                    min="500"
                    max={context === 'consumer' ? "10000" : "20000"}
                    step="500"
                    value={state.filters.radius || DEFAULT_RADIUS[context]}
                    onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-blue-700">
                    {((state.filters.radius || DEFAULT_RADIUS[context]) / 1000).toFixed(1)}km
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      {effectiveShowMap && (
        <div className="mb-6">
          <div 
            ref={mapRef} 
            style={{ height: effectiveMapHeight }}
            className="w-full rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{state.error}</p>
        </div>
      )}

      {/* Loading State */}
      {state.isLoading && (
        <div className="text-center py-8">
          <Loader size={32} className="mx-auto mb-4 text-orange-500 animate-spin" />
          <p className="text-gray-600">Searching for businesses...</p>
        </div>
      )}

      {/* Results */}
      {!state.isLoading && state.results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Found {state.results.length} result{state.results.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => performSearch(state.location!, state.filters)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <RotateCcw size={14} />
              <span>Refresh</span>
            </button>
          </div>

          <div className={
            effectiveCardLayout === 'grid' && resultCardType !== 'restaurant'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {state.results.map((business) => {
              // Use RestaurantCard for restaurant businesses, otherwise use generic BusinessCard
              const isRestaurant = resultCardType === 'restaurant' || 
                business.types?.some(type => ['restaurant', 'food', 'meal_takeaway', 'cafe'].includes(type));
              
              if (isRestaurant) {
                return (
                  <RestaurantCard
                    key={business.id}
                    business={business}
                    actions={effectiveActions}
                    onAction={handleBusinessAction}
                    className={state.selectedBusiness?.id === business.id ? 'ring-2 ring-orange-500' : ''}
                  />
                );
              }
              
              return (
                <BusinessCard
                  key={business.id}
                  business={business}
                  context={context}
                  actions={effectiveActions}
                  layout={effectiveCardLayout}
                  onAction={handleBusinessAction}
                  className={state.selectedBusiness?.id === business.id ? 'ring-2 ring-orange-500' : ''}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!state.isLoading && state.results.length === 0 && state.location && (
        <div className="text-center py-8">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-2">No businesses found in this area</p>
          <p className="text-sm text-gray-500">Try adjusting your search radius or location</p>
        </div>
      )}
    </div>
  );
};

export default MapSearchModule; 