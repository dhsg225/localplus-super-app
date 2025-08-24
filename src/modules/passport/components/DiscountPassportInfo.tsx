import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Trophy, Target, Users, Zap, MapPin, Percent, Crown, ArrowLeft } from 'lucide-react';
var DiscountPassportInfo = function () {
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-white hover:text-orange-100 transition-colors">
              <ArrowLeft size={24}/>
            </Link>
            <div className="flex items-center space-x-2">
              <Award size={28}/>
              <span className="text-lg font-semibold">Savings Passport</span>
            </div>
            <div></div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Everything About</h1>
            <h2 className="text-2xl font-semibold mb-4">LocalPlus Savings Passport</h2>
            <p className="text-orange-100 text-lg">Your ultimate lifestyle companion with instant savings, gamification, and exclusive perks</p>
          </div>
        </div>
      </div>

      {/* Pricing Overview */}
      <div className="px-4 py-6 bg-white">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">฿199/month</div>
          <div className="text-lg text-gray-600 mb-4">or ฿1,990/year (Save ฿398!)</div>
        </div>
      </div>

      {/* Business Categories */}
      <div className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Percent size={24} className="mr-2 text-orange-500"/>
          Instant Discounts at 500+ Businesses
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🍽️ Restaurants & Cafés</h4>
              <span className="text-red-600 font-bold">15-25% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">120+ locations • Fine dining, casual eats, coffee shops</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">💆‍♀️ Spa & Wellness</h4>
              <span className="text-red-600 font-bold">20-30% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">45+ locations • Massage, beauty, fitness centers</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🛍️ Shopping & Retail</h4>
              <span className="text-red-600 font-bold">10-20% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">200+ locations • Fashion, electronics, local crafts</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🏖️ Activities & Tours</h4>
              <span className="text-red-600 font-bold">25-40% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">35+ locations • Beach activities, cultural tours</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🏨 Hotels & Resorts</h4>
              <span className="text-red-600 font-bold">15% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">25+ locations • Boutique hotels, luxury resorts</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">🚗 Transport & Services</h4>
              <span className="text-red-600 font-bold">10-15% OFF</span>
            </div>
            <p className="text-gray-600 text-sm">75+ locations • Car rentals, delivery, home services</p>
          </div>
        </div>
      </div>

      {/* Gamification System */}
      <div className="px-4 py-6 bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Trophy size={24} className="mr-2 text-orange-500"/>
          Gamification & Rewards
        </h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Star size={20} className="text-yellow-500 mr-2"/>
              <h4 className="font-semibold text-gray-900">Stamps & Points System</h4>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Earn stamps for every visit and purchase</li>
              <li>• <strong>2x bonus stamps</strong> with Passport membership</li>
              <li>• Redeem stamps for exclusive rewards</li>
              <li>• Track progress in your digital passport</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Award size={20} className="text-blue-500 mr-2"/>
              <h4 className="font-semibold text-gray-900">Achievement Badges</h4>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 🍜 <strong>Foodie Explorer:</strong> Try 10 different restaurants</li>
              <li>• 💆‍♀️ <strong>Wellness Warrior:</strong> Visit 5 spa & wellness centers</li>
              <li>• 🛍️ <strong>Shopping Guru:</strong> Make purchases at 8 retail stores</li>
              <li>• 🌍 <strong>Local Legend:</strong> Complete all district challenges</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Target size={20} className="text-green-500 mr-2"/>
              <h4 className="font-semibold text-gray-900">District Challenges</h4>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• <strong>Hua Hin Beach District:</strong> Visit 5 beachfront businesses</li>
              <li>• <strong>Town Center District:</strong> Explore 8 central businesses</li>
              <li>• <strong>Royal Golf Course Area:</strong> Complete luxury challenge</li>
              <li>• Unlock exclusive district rewards and recognition</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Crown size={20} className="text-purple-500 mr-2"/>
              <h4 className="font-semibold text-gray-900">Member Levels</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-bronze-50 p-2 rounded">
                <span className="text-sm font-medium">🥉 Bronze Explorer</span>
                <span className="text-xs text-gray-600">0-99 stamps</span>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm font-medium">🥈 Silver Adventurer</span>
                <span className="text-xs text-gray-600">100-299 stamps</span>
              </div>
              <div className="flex items-center justify-between bg-yellow-100 p-2 rounded">
                <span className="text-sm font-medium">🥇 Gold Champion</span>
                <span className="text-xs text-gray-600">300-599 stamps</span>
              </div>
              <div className="flex items-center justify-between bg-purple-100 p-2 rounded">
                <span className="text-sm font-medium">💎 Platinum VIP</span>
                <span className="text-xs text-gray-600">600+ stamps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Benefits */}
      <div className="px-4 py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Zap size={24} className="mr-2 text-orange-500"/>
          Exclusive Passport Benefits
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center mb-2">
              <Percent size={20} className="text-orange-600 mr-2"/>
              <h4 className="font-semibold text-gray-900">Instant Discounts</h4>
            </div>
            <p className="text-gray-600 text-sm">Skip the wait - get immediate savings at all 500+ partner businesses</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center mb-2">
              <Star size={20} className="text-blue-600 mr-2"/>
              <h4 className="font-semibold text-gray-900">2x Bonus Stamps</h4>
            </div>
            <p className="text-gray-600 text-sm">Earn double stamps on every purchase to unlock rewards faster</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center mb-2">
              <Users size={20} className="text-green-600 mr-2"/>
              <h4 className="font-semibold text-gray-900">Exclusive Member Events</h4>
            </div>
            <p className="text-gray-600 text-sm">VIP access to special events, tastings, and member-only experiences</p>
          </div>



          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center mb-2">
              <Zap size={20} className="text-yellow-600 mr-2"/>
              <h4 className="font-semibold text-gray-900">Ad-Free Experience</h4>
            </div>
            <p className="text-gray-600 text-sm">Enjoy the app without any interruptions or promotional banners</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 py-6 bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPin size={24} className="mr-2 text-orange-500"/>
          How It Works
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Subscribe to Savings Passport</h4>
              <p className="text-gray-600 text-sm">Start subscription at ฿199/month or ฿1,990/year</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Visit Partner Businesses</h4>
              <p className="text-gray-600 text-sm">Show your digital passport at checkout for instant discounts</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Earn Stamps & Badges</h4>
              <p className="text-gray-600 text-sm">Get 2x bonus stamps and unlock achievement badges</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Level Up & Get Rewards</h4>
              <p className="text-gray-600 text-sm">Progress through member levels and redeem exclusive rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-8 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Ready to Start Saving?</h3>
          <p className="text-orange-100 mb-6">Join thousands of members already enjoying exclusive discounts</p>
          
          <div className="space-y-3">
            <Link to="/passport" className="block bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-colors">
              Subscribe Now
            </Link>
            
            <Link to="/" className="block text-orange-100 text-sm hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
export default DiscountPassportInfo;
