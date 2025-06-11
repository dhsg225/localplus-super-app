import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Wrench, MessageCircle, Clock, Settings, MapPin, ChevronDown } from 'lucide-react';

// Location interface
interface LocationData {
  city: string;
  country: string;
  suburb?: string;
  isDetected: boolean;
}

const HomePage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    city: 'Bangkok',
    country: 'Thailand',
    isDetected: false
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const availableLocations = [
    'Bangkok',
    'Pattaya', 
    'Hua Hin',
    'Krabi',
    'Samui',
    'Phuket',
    'Chiang Mai',
    'Phuket Town'
  ];

  // Detect location on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      // Try to get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // In a real app, you'd call a reverse geocoding API
            // For demo purposes, we'll simulate detection
            const detectedLocation = await simulateLocationDetection(latitude, longitude);
            
            setCurrentLocation({
              ...detectedLocation,
              isDetected: true
            });
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Fallback to IP-based detection or default
            fallbackLocationDetection();
          }
        );
      } else {
        fallbackLocationDetection();
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      fallbackLocationDetection();
    }
  };

  const simulateLocationDetection = async (lat: number, lng: number): Promise<LocationData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Real-world coordinates for Thailand locations
    const locations = [
      { name: 'Bangkok', lat: 13.7563, lng: 100.5018, radius: 0.5 },
      { name: 'Pattaya', lat: 12.9329, lng: 100.8825, radius: 0.3 },
      { name: 'Hua Hin', lat: 12.5684, lng: 99.9578, radius: 0.3 },
      { name: 'Phuket', lat: 7.8804, lng: 98.3923, radius: 0.3 },
      { name: 'Chiang Mai', lat: 18.7883, lng: 98.9853, radius: 0.3 },
      { name: 'Krabi', lat: 8.0863, lng: 98.9063, radius: 0.3 },
      { name: 'Samui', lat: 9.5380, lng: 100.0614, radius: 0.2 }
    ];
    
    // Find closest matching location
    for (const location of locations) {
      if (Math.abs(lat - location.lat) < location.radius && Math.abs(lng - location.lng) < location.radius) {
        return { city: location.name, country: 'Thailand', isDetected: true };
      }
    }
    
    // Default to Bangkok if no close match
    return { city: 'Bangkok', country: 'Thailand', isDetected: true };
  };

  const fallbackLocationDetection = async () => {
    try {
      // Try IP geolocation as fallback
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      console.log('IP geolocation data:', data); // Debug logging
      
      // More comprehensive mapping for Hua Hin area
      const huaHinKeywords = ['hua hin', 'hin lek fai', 'nong khon', 'prachuap'];
      const pattayaKeywords = ['pattaya', 'chonburi', 'banglamung'];
      const bangkokKeywords = ['bangkok', 'samut prakan', 'nonthaburi'];
      
      const detectedCity = (data.city || '').toLowerCase();
      const detectedRegion = (data.region || '').toLowerCase();
      const detectedCountry = (data.country || '').toLowerCase();
      
      let finalCity = 'Bangkok'; // Default
      
      // Check for Hua Hin and surrounding areas
      if (huaHinKeywords.some(keyword => 
        detectedCity.includes(keyword) || 
        detectedRegion.includes(keyword)
      )) {
        finalCity = 'Hua Hin';
      }
      // Check for Pattaya area
      else if (pattayaKeywords.some(keyword => 
        detectedCity.includes(keyword) || 
        detectedRegion.includes(keyword)
      )) {
        finalCity = 'Pattaya';
      }
      // Check for Bangkok area
      else if (bangkokKeywords.some(keyword => 
        detectedCity.includes(keyword) || 
        detectedRegion.includes(keyword)
      )) {
        finalCity = 'Bangkok';
      }
      // Check for other supported cities
      else {
        const supportedCities = ['Krabi', 'Samui', 'Phuket', 'Chiang Mai'];
        const matchedCity = supportedCities.find(city => 
          detectedCity.includes(city.toLowerCase())
        );
        if (matchedCity) {
          finalCity = matchedCity;
        }
      }
      
      setCurrentLocation({
        city: finalCity,
        country: data.country_name || 'Thailand',
        suburb: data.region || data.city || '',
        isDetected: true
      });
    } catch (error) {
      console.log('Fallback location detection failed:', error);
      // Final fallback to Bangkok
      setCurrentLocation({
        city: 'Bangkok',
        country: 'Thailand',
        isDetected: false // Set to false since we couldn't detect
      });
    }
  };

  const handleLocationChange = (newCity: string) => {
    setCurrentLocation({
      city: newCity,
      country: 'Thailand',
      isDetected: false // User manually selected
    });
    setShowLocationPicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Location */}
      <div className="bg-white px-4 py-6 text-center relative">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to LocalPlus</h1>
        <p className="text-gray-600 mb-3">Your lifestyle companion for Thailand</p>
        
        {/* Location Selector */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <MapPin size={16} />
            <span className="font-medium">{currentLocation.city}</span>
            <ChevronDown size={16} />
          </button>
          
          {showLocationPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 px-2 py-1">Select your location:</p>
                {availableLocations.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationChange(city)}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                      currentLocation.city === city ? 'bg-red-50 text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {currentLocation.isDetected && (
          <p className="text-xs text-gray-500 mt-1">📍 Auto-detected: {currentLocation.city}{currentLocation.suburb ? `, ${currentLocation.suburb}` : ''}</p>
        )}
      </div>

      {/* Off Peak Dining Banner */}
      <div className="px-4 mb-6">
        <Link
          to="/off-peak"
          className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center">
                <Clock size={20} className="mr-2" />
                Off Peak Dining
              </h3>
              <p className="text-purple-100 text-sm">Save up to 50% during off-peak hours</p>
            </div>
            <div className="text-white bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold">
              UP TO 50% OFF
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/restaurants"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Search size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Restaurants</h3>
            <p className="text-sm text-gray-500">Find great places to eat</p>
          </Link>

          <Link
            to="/events"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Calendar size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Events</h3>
            <p className="text-sm text-gray-500">Discover local events</p>
          </Link>

          <Link
            to="/services"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Wrench size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Services</h3>
            <p className="text-sm text-gray-500">Local service providers</p>
          </Link>

          <Link
            to="/ai-assistant"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <MessageCircle size={32} className="text-red-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-500">Ask about anything local</p>
          </Link>
        </div>
      </div>

      {/* Business Section */}
      <div className="px-4 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          For Business Owners
        </h2>
        <div className="space-y-4">
          {/* Business Onboarding */}
          <Link
            to="/business-onboarding"
            className="block bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">List Your Business</h3>
                <p className="text-red-100 text-sm">Join thousands of businesses and reach new customers</p>
              </div>
              <div className="text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* Business Management */}
          <Link
            to="/business"
            className="block bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center">
                  <Settings size={20} className="mr-2" />
                  Manage Business
                </h3>
                <p className="text-green-100 text-sm">Update profile, menu, deals, and view analytics</p>
              </div>
              <div className="text-white bg-orange-500 px-2 py-1 rounded-full text-xs font-bold">
                MANAGE
              </div>
            </div>
          </Link>
        </div>
        
        {/* Discreet Build Number */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 text-center">v0.18</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 