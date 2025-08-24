import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Globe, Plus, CheckCircle } from 'lucide-react';
import { googlePlacesService, GooglePlaceResult, GooglePlaceDetails } from '../../../services/googlePlaces';
import { businessAPI } from '../../../lib/supabase';

interface BusinessDiscoveryProps {
  userLocation: { lat: number; lng: number } | null;
  onBusinessAdded?: (business: any) => void;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

const BusinessDiscovery: React.FC<BusinessDiscoveryProps> = ({ userLocation, onBusinessAdded, onLocationUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLdpArea, setSelectedLdpArea] = useState('');
  const [discoveredBusinesses, setDiscoveredBusinesses] = useState<GooglePlaceResult[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<GooglePlaceResult | null>(null);
  const [businessDetails, setBusinessDetails] = useState<GooglePlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importedBusinessIds, setImportedBusinessIds] = useState<Set<string>>(new Set());
  const [radius, setRadius] = useState(3000); // Default 3km
  const [importStats, setImportStats] = useState({ found: 0, added: 0 });

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'Restaurants', label: 'Restaurants' },
    { id: 'Wellness', label: 'Wellness & Spa' },
    { id: 'Shopping', label: 'Shopping' },
    { id: 'Services', label: 'Services' },
    { id: 'Entertainment', label: 'Entertainment' },
    { id: 'Travel', label: 'Travel & Hotels' }
  ];

  // [2024-12-19 15:30 UTC] - Added LDP area filtering for geographic zone control
  const ldpAreas = [
    { id: '', label: 'All Areas' },
    { id: 'bangkok', label: 'Bangkok LDP', lat: 13.8179, lng: 100.0416 },
    { id: 'hua-hin', label: 'Hua Hin LDP', lat: 12.5684, lng: 99.9578 },
    { id: 'pattaya', label: 'Pattaya LDP', lat: 12.9236, lng: 100.8825 },
    { id: 'phuket', label: 'Phuket LDP', lat: 7.8804, lng: 98.3923 },
    { id: 'chiang-mai', label: 'Chiang Mai LDP', lat: 18.7883, lng: 98.9853 }
  ];

  const radiusOptions = [
    { value: 1000, label: '1km' },
    { value: 3000, label: '3km' },
    { value: 5000, label: '5km' },
    { value: 10000, label: '10km' },
    { value: 20000, label: '20km' }
  ];

  useEffect(() => {
    if (userLocation) {
      discoverNearbyBusinesses();
    }
  }, [userLocation, selectedCategory, selectedLdpArea, radius]);

  // [2024-12-19 15:30 UTC] - Updated location when LDP area changes
  useEffect(() => {
    if (selectedLdpArea) {
      const area = ldpAreas.find(a => a.id === selectedLdpArea);
      if (area && area.lat && area.lng) {
        onLocationUpdate?.({ lat: area.lat, lng: area.lng });
      }
    }
  }, [selectedLdpArea, onLocationUpdate]);

  const discoverNearbyBusinesses = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      // [2024-12-19 15:30 UTC] - Enhanced restaurant search with specific query
      let searchType = selectedCategory;
      if (selectedCategory === 'Restaurants') {
        searchType = 'restaurant food dining';
      }

      const businesses = await googlePlacesService.discoverBusinessesNearby(
        userLocation.lat,
        userLocation.lng,
        radius,
        searchType
      );
      
      // [2024-12-19 15:30 UTC] - Filter results for restaurants more strictly
      let filteredBusinesses = businesses;
      if (selectedCategory === 'Restaurants') {
        filteredBusinesses = businesses.filter(business => 
          business.types.some(type => 
            ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type)
          )
        );
      }
      
      setDiscoveredBusinesses(filteredBusinesses);
      setImportStats({ found: filteredBusinesses.length, added: 0 });
    } catch (error) {
      console.error('Error discovering businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchBusinesses = async () => {
    if (!userLocation || !searchQuery.trim()) return;

    setLoading(true);
    try {
      // [2024-12-19 15:30 UTC] - Enhanced search query for restaurants
      let enhancedQuery = searchQuery;
      if (selectedCategory === 'Restaurants') {
        enhancedQuery = `${searchQuery} restaurant food dining`;
      }

      const businesses = await googlePlacesService.searchBusinessesByText(
        enhancedQuery,
        userLocation.lat,
        userLocation.lng,
        radius
      );
      
      // [2024-12-19 15:30 UTC] - Filter results for restaurants more strictly
      let filteredBusinesses = businesses;
      if (selectedCategory === 'Restaurants') {
        filteredBusinesses = businesses.filter(business => 
          business.types.some(type => 
            ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bakery'].includes(type)
          )
        );
      }
      
      setDiscoveredBusinesses(filteredBusinesses);
      setImportStats({ found: filteredBusinesses.length, added: 0 });
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessClick = async (business: GooglePlaceResult) => {
    setSelectedBusiness(business);
    setBusinessDetails(null);
    setDetailsLoading(true);

    try {
      const details = await googlePlacesService.getPlaceDetails(business.place_id);
      setBusinessDetails(details);
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const importBusiness = async (business: GooglePlaceResult) => {
    setImporting(true);
    try {
      // Get detailed information first
      const details = await googlePlacesService.getPlaceDetails(business.place_id);
      
      // Convert to our business format
      const businessData = googlePlacesService.googlePlaceToBusiness(business, details || undefined);
      
      // Add to database
      const newBusiness = await businessAPI.addBusiness({
        ...businessData,
        partnership_status: 'pending'
      });
      
      if (newBusiness) {
        setImportedBusinessIds(prev => new Set(prev).add(business.place_id));
        onBusinessAdded?.(newBusiness);
        
        // [2024-12-19 15:30 UTC] - Update import stats when business is successfully added
        setImportStats(prev => ({ ...prev, added: prev.added + 1 }));
        
        // Also create a default discount offer
        await businessAPI.addDiscountOffer({
          business_id: newBusiness.id,
          description: '10% off for new customers',
          discount_percentage: 10,
          valid_from: new Date().toISOString().split('T')[0],
          max_redemptions_per_user: 1,
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error importing business:', error);
    } finally {
      setImporting(false);
    }
  };

  // [2024-12-19 15:30 UTC] - Reset counters function
  const resetCounters = () => {
    setImportStats({ found: 0, added: 0 });
    setImportedBusinessIds(new Set());
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getPriceRange = (priceLevel?: number) => {
    if (!priceLevel) return 'Price not available';
    return '฿'.repeat(priceLevel) + '฿'.repeat(4 - priceLevel).replace(/฿/g, '○');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Discover Real Businesses</h3>
          
          {/* [2024-12-19 15:30 UTC] - Import Stats Display */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              ✅ {selectedCategory || 'Businesses'}: Found {importStats.found}, added {importStats.added}
            </span>
            <button
              onClick={resetCounters}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* [2024-12-19 15:30 UTC] - LDP Area Selection */}
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-900">LDP Area:</span>
            </div>
            <select
              value={selectedLdpArea}
              onChange={(e) => setSelectedLdpArea(e.target.value)}
              className="text-sm px-3 py-1 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {ldpAreas.map(area => (
                <option key={area.id} value={area.id}>{area.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Search Location:</span>
              {userLocation && (
                <span className="text-xs text-blue-700">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };
                      onLocationUpdate?.(newLocation);
                    },
                    (error) => console.error('Geolocation error:', error)
                  );
                }
              }}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use My Location
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={selectedCategory === 'Restaurants' ? "Search for restaurants, cafes, dining..." : "Search for restaurants, spas, shops..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBusinesses()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            onClick={searchBusinesses}
            disabled={loading || !searchQuery.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {radiusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {userLocation && (
          <div className="mt-3 text-xs text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1" />
            Searching near: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            {selectedLdpArea && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                {ldpAreas.find(a => a.id === selectedLdpArea)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Discovered Businesses */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">
            Discovered Businesses ({discoveredBusinesses.length})
          </h4>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Discovering businesses...</p>
          </div>
        ) : discoveredBusinesses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No businesses found. Try adjusting your search or radius.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {discoveredBusinesses.map((business) => (
              <div key={business.place_id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleBusinessClick(business)}
                  >
                    <h5 className="font-medium text-gray-900">{business.name}</h5>
                    <p className="text-sm text-gray-600 mt-1">{business.vicinity}</p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      {business.rating && (
                        <div className="flex items-center space-x-1">
                          <div className="flex">{getRatingStars(business.rating)}</div>
                          <span className="text-xs text-gray-600">{business.rating}</span>
                        </div>
                      )}
                      
                      {business.price_level && (
                        <span className="text-xs text-gray-600">
                          {getPriceRange(business.price_level)}
                        </span>
                      )}
                      
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {business.types.find(type => ['restaurant', 'spa', 'store', 'establishment'].includes(type)) || 'Business'}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    {importedBusinessIds.has(business.place_id) ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle size={16} className="mr-1" />
                        Imported
                      </div>
                    ) : (
                      <button
                        onClick={() => importBusiness(business)}
                        disabled={importing}
                        className="flex items-center bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        <Plus size={14} className="mr-1" />
                        Import
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Business Details Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedBusiness.name}</h3>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {detailsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading details...</p>
                </div>
              ) : businessDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">{businessDetails.formatted_address}</p>
                    {businessDetails.formatted_phone_number && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Phone size={14} className="mr-2" />
                        {businessDetails.formatted_phone_number}
                      </div>
                    )}
                    {businessDetails.website && (
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Globe size={14} className="mr-2" />
                        <a href={businessDetails.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                          {businessDetails.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {businessDetails.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">{getRatingStars(businessDetails.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {businessDetails.rating} ({businessDetails.user_ratings_total} reviews)
                      </span>
                    </div>
                  )}

                  {businessDetails.opening_hours && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {businessDetails.opening_hours.weekday_text.map((day, index) => (
                          <div key={index}>{day}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedBusiness(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                    {!importedBusinessIds.has(selectedBusiness.place_id) && (
                      <button
                        onClick={() => {
                          importBusiness(selectedBusiness);
                          setSelectedBusiness(null);
                        }}
                        disabled={importing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {importing ? 'Importing...' : 'Import Business'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Unable to load business details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDiscovery; 