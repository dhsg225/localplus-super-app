import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Star, Clock, Bookmark, TrendingUp, Award, Gift, Calendar, Crown, MapPin, QrCode, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  mockPassportUser, 
  mockPassportStats, 
  mockDistrictChallenges, 
  mockCuisineCallenges, 
  mockPassportActivities,
  mockSavedDeals
} from '../data/mockPassportData';

// Mock businesses data with locations in Hua Hin
const mockBusinesses = [
  {
    id: 1,
    name: "Seaside Bistro",
    category: "Restaurants",
    discount: 20,
    distance: 0.8,
    location: "Hua Hin Beach",
    lat: 12.5684,
    lng: 99.9578,
    isRedeemed: false,
    redemptionCode: "HH2024-001"
  },
  {
    id: 2,
    name: "Blue Wave Spa",
    category: "Spa & Wellness", 
    discount: 25,
    distance: 1.2,
    location: "Town Center",
    lat: 12.5704,
    lng: 99.9598,
    isRedeemed: false,
    redemptionCode: "HH2024-002"
  },
  {
    id: 3,
    name: "Local Craft Market",
    category: "Shopping",
    discount: 15,
    distance: 0.5,
    location: "Night Market",
    lat: 12.5694,
    lng: 99.9588,
    isRedeemed: true,
    redemptionCode: "HH2024-003"
  },
  {
    id: 4,
    name: "Sunset Sailing",
    category: "Activities",
    discount: 30,
    distance: 2.1,
    location: "Hua Hin Pier",
    lat: 12.5674,
    lng: 99.9568,
    isRedeemed: false,
    redemptionCode: "HH2024-004"
  },
  {
    id: 5,
    name: "Golden Palace Thai",
    category: "Restaurants",
    discount: 18,
    distance: 1.8,
    location: "Royal Golf Area",
    lat: 12.5654,
    lng: 99.9548,
    isRedeemed: false,
    redemptionCode: "HH2024-005"
  },
  {
    id: 6,
    name: "Wellness Retreat",
    category: "Spa & Wellness",
    discount: 22,
    distance: 2.8,
    location: "Khao Takiab",
    lat: 12.5634,
    lng: 99.9528,
    isRedeemed: false,
    redemptionCode: "HH2024-006"
  }
];

const PassportPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'challenges' | 'saved' | 'activity'>('overview');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string} | null>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState(mockBusinesses);
  const [selectedDistance, setSelectedDistance] = useState<number>(3); // Default 3km
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  
  const user = mockPassportUser;
  const stats = mockPassportStats;

  // Detect user location
  useEffect(() => {
    detectLocation();
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  const detectLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const detectedLocation = {
              lat: latitude,
              lng: longitude,
              city: 'Hua Hin' // For demo, assume we're in Hua Hin
            };
            setUserLocation(detectedLocation);
            
            // Calculate real distances to businesses
            const businessesWithRealDistances = mockBusinesses.map(business => ({
              ...business,
              distance: calculateDistance(latitude, longitude, business.lat, business.lng)
            }));
            setNearbyBusinesses(businessesWithRealDistances);
            setIsLoadingLocation(false);
          },
          async () => {
            // Fallback to IP geolocation
            try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              const fallbackLocation = {
                lat: data.latitude || 12.5684,
                lng: data.longitude || 99.9578,
                city: data.city || 'Hua Hin'
              };
              setUserLocation(fallbackLocation);
              
              // Calculate distances with fallback location
              const businessesWithDistances = mockBusinesses.map(business => ({
                ...business,
                distance: calculateDistance(fallbackLocation.lat, fallbackLocation.lng, business.lat, business.lng)
              }));
              setNearbyBusinesses(businessesWithDistances);
            } catch (error) {
              console.log('IP geolocation failed:', error);
              // Final fallback to Hua Hin center
              setUserLocation({
                lat: 12.5684,
                lng: 99.9578,
                city: 'Hua Hin'
              });
            }
            setIsLoadingLocation(false);
          }
        );
      } else {
        // Geolocation not supported, use IP fallback
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          setUserLocation({
            lat: data.latitude || 12.5684,
            lng: data.longitude || 99.9578,
            city: data.city || 'Hua Hin'
          });
        } catch (error) {
          // Final fallback
          setUserLocation({
            lat: 12.5684,
            lng: 99.9578,
            city: 'Hua Hin'
          });
        }
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.log('Location detection failed:', error);
      setUserLocation({
        lat: 12.5684,
        lng: 99.9578,
        city: 'Hua Hin'
      });
      setIsLoadingLocation(false);
    }
  };

  // Filter businesses within selected distance
  const getBusinessesNearby = () => {
    return nearbyBusinesses
      .filter(business => business.distance <= selectedDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  const handleQRScan = (businessId: number) => {
    // In real app, this would call API to redeem
    setNearbyBusinesses(prev => 
      prev.map(business => 
        business.id === businessId 
          ? { ...business, isRedeemed: true }
          : business
      )
    );
    alert(`Discount redeemed at ${nearbyBusinesses.find(b => b.id === businessId)?.name}! Enjoy your savings.`);
  };
  
  const getLevelProgress = () => {
    const levelStamps = {
      bronze: 50,
      silver: 100,
      gold: 200,
      platinum: 500
    };
    
    const nextLevel = user.level === 'bronze' ? 'silver' : 
                    user.level === 'silver' ? 'gold' : 
                    user.level === 'gold' ? 'platinum' : 'platinum';
    const nextLevelStamps = levelStamps[nextLevel] || 500;
    
    return {
      current: user.stamps,
      target: nextLevelStamps,
      progress: (user.stamps / nextLevelStamps) * 100,
      nextLevel
    };
  };

  const levelProgress = getLevelProgress();

  const formatDaysAgo = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Subscription Status & Benefits */}
      {user.subscriptionTier === 'premium' ? (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Crown size={16} />
                <span className="text-sm opacity-90">{user.level.toUpperCase()} MEMBER</span>
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full">
                  PREMIUM ACTIVE
                </span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                Unlimited discounts • Expires Dec 2024
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{user.stamps}</div>
              <div className="text-sm opacity-75">stamps</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {levelProgress.nextLevel}</span>
              <span>{levelProgress.current}/{levelProgress.target}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(levelProgress.progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Subscription Upgrade Prompt */
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-6">
          <div className="text-center">
            <Crown size={32} className="mx-auto mb-3 text-yellow-400" />
            <h2 className="text-xl font-bold mb-2">Unlock LocalPlus Savings Passport</h2>
            <p className="text-sm opacity-90 mb-4">
              Get instant discounts at 500+ businesses in Hua Hin
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <div className="text-lg font-bold">฿199</div>
                <div className="text-xs opacity-75">per month</div>
              </div>
              <div className="bg-yellow-400 bg-opacity-20 rounded-lg p-3 border border-yellow-400">
                <div className="text-lg font-bold">฿1,990</div>
                <div className="text-xs opacity-75">per year</div>
                <div className="text-xs text-yellow-400 font-medium">Save ฿398</div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/passport/upgrade')}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      )}

      {/* Today's Instant Discounts Near Me - Premium Members Only */}
      {user.subscriptionTier === 'premium' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Today's Instant Discounts Near Me</h3>
              <MapPin size={16} className="text-gray-500" />
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {isLoadingLocation ? 'LOCATING...' : `${getBusinessesNearby().length} WITHIN ${selectedDistance}KM`}
            </span>
          </div>

          {/* Distance Selector */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600">Distance from me:</span>
            </div>
            <div className="flex space-x-2">
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDistance(option.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDistance === option.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Status */}
          {isLoadingLocation && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span className="ml-2 text-sm text-gray-600">Detecting your location...</span>
            </div>
          )}

          {!isLoadingLocation && userLocation && (
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center text-xs text-blue-800">
                <MapPin size={14} className="mr-1" />
                <span>Location: {userLocation.city} ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {getBusinessesNearby().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No businesses found within {selectedDistance}km</p>
                <p className="text-xs mt-1">Try increasing the distance range</p>
              </div>
            ) : (
              getBusinessesNearby().slice(0, 6).map((business) => (
                <div key={business.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{business.name}</h4>
                        <span className="text-lg font-bold text-red-600">{business.discount}% OFF</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {business.category} • {business.location} • {business.distance}km away
                        </div>
                        {business.isRedeemed ? (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle size={14} className="mr-1" />
                            Redeemed 2024
                          </div>
                        ) : (
                          <button
                            onClick={() => handleQRScan(business.id)}
                            className="flex items-center bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            <QrCode size={14} className="mr-1" />
                            Redeem
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-800">
              <strong>How it works:</strong> Each business offers one discount per calendar year. 
              Simply scan the QR code at checkout to redeem your savings. Location detected using GPS.
            </div>
          </div>
          
          <button className="w-full mt-4 text-center text-red-600 text-sm font-medium">
            Browse All Discounts →
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalBadges}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">฿{stats.totalSavings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Bookings Made</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600">Week Streak</div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {user.badges.slice(-6).map((badge) => (
            <div key={badge.id} className="text-center">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="text-xs font-medium text-gray-900">{badge.name}</div>
              <div className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setActiveTab('badges')}
          className="w-full mt-4 text-center text-red-600 text-sm font-medium"
        >
          View All Badges →
        </button>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {user.badges.map((badge) => (
          <div key={badge.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h4 className="font-semibold text-gray-900">{badge.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
              <div className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Earned {formatDaysAgo(badge.unlockedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">District Challenges</h3>
      {mockDistrictChallenges.map((challenge) => (
        <div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
            {challenge.isCompleted && (
              <div className="text-green-600">
                <Trophy size={20} />
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{challenge.visitedRestaurants.length}/{challenge.totalRestaurants}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${challenge.isCompleted ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <Gift size={14} className="inline mr-1" />
            {challenge.reward.description}
          </div>
        </div>
      ))}
      
      <h3 className="text-lg font-semibold text-gray-900 mt-6">Cuisine Challenges</h3>
      {mockCuisineCallenges.map((challenge) => (
        <div key={challenge.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
            {challenge.isCompleted && (
              <div className="text-green-600">
                <Trophy size={20} />
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{challenge.currentCount}/{challenge.targetCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${challenge.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(challenge.currentCount / challenge.targetCount) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <Gift size={14} className="inline mr-1" />
            {challenge.reward.description}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSavedDeals = () => (
    <div className="space-y-4">
      {mockSavedDeals.map((savedDeal) => (
        <div key={savedDeal.id} className={`bg-white rounded-lg border border-gray-200 p-4 ${savedDeal.isUsed ? 'opacity-60' : ''}`}>
          <div className="flex items-start space-x-3">
            <img 
              src={savedDeal.restaurantImage} 
              alt={savedDeal.restaurantName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{savedDeal.restaurantName}</h4>
                <div className="text-2xl font-bold text-red-600">{savedDeal.discountPercentage}%</div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{savedDeal.description}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">
                  Saved {formatDaysAgo(savedDeal.savedAt)}
                </div>
                
                {savedDeal.isUsed ? (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium rounded-full">
                    Used {formatDaysAgo(savedDeal.usedAt!)}
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-orange-500" />
                    <span className="text-xs text-orange-600">
                      Expires {new Date(savedDeal.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {!savedDeal.isUsed && (
                <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg text-sm font-medium">
                  Use Deal
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      {mockPassportActivities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {activity.type === 'badge_earned' && <Award className="h-5 w-5 text-yellow-500" />}
              {activity.type === 'booking_completed' && <Calendar className="h-5 w-5 text-green-500" />}
              {activity.type === 'review_written' && <Star className="h-5 w-5 text-blue-500" />}
              {activity.type === 'deal_redeemed' && <Gift className="h-5 w-5 text-purple-500" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
              {activity.restaurantName && (
                <p className="text-sm text-gray-600">at {activity.restaurantName}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-green-600">+{activity.stampsEarned} stamps</span>
                <span className="text-xs text-blue-600">+{activity.pointsEarned} points</span>
                <span className="text-xs text-gray-500">{formatDaysAgo(activity.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const distanceOptions = [
    { value: 1, label: '1km' },
    { value: 3, label: '3km' },
    { value: 5, label: '5km' },
    { value: 10, label: '10km' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">LocalPlus Passport</h1>
              <p className="text-sm text-gray-600">Your dining journey across Bangkok</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview', icon: Trophy },
              { id: 'badges', name: 'Badges', icon: Award },
              { id: 'challenges', name: 'Challenges', icon: TrendingUp },
              { id: 'saved', name: 'Saved', icon: Bookmark },
              { id: 'activity', name: 'Activity', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'saved' && renderSavedDeals()}
        {activeTab === 'activity' && renderActivity()}
      </div>

      {/* Upgrade Prompt */}
      {user.subscriptionTier === 'free' && (
        <div className="fixed bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Upgrade to Premium</h4>
                <p className="text-sm opacity-90">Unlock exclusive deals & unlimited saves</p>
              </div>
              <button 
                onClick={() => navigate('/passport/upgrade')}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassportPage; 