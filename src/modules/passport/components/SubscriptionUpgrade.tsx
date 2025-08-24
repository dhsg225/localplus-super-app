import React, { useState } from 'react';
import { ArrowLeft, Check, Crown, Star, Zap, Users, Shield, Store, MapPin, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockSubscriptionTiers } from '../data/mockPassportData';

const SubscriptionUpgrade: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('premium-monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyTier = mockSubscriptionTiers.find(t => t.id === 'premium-monthly')!;
  const yearlyTier = mockSubscriptionTiers.find(t => t.id === 'premium-yearly')!;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    // Navigate to success page or back to passport
    navigate('/passport?upgraded=true');
  };

  const CompareFeature = ({ feature, free, premium }: { feature: string; free: boolean; premium: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span className="text-sm text-gray-700">{feature}</span>
      <div className="flex items-center space-x-8">
        <div className="w-16 text-center">
          {free ? (
            <Check size={16} className="text-green-500 mx-auto" />
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </div>
        <div className="w-16 text-center">
          {premium ? (
            <Check size={16} className="text-green-500 mx-auto" />
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/passport')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Get LocalPlus Passport</h1>
              <p className="text-sm text-gray-600">Unlock instant savings at local businesses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Premium Benefits Hero */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6 mb-6">
          <div className="text-center">
            <Crown size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">LocalPlus Passport</h2>
            <p className="text-sm opacity-90 mb-3">
              Instant discounts at 500+ businesses in Hua Hin
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs opacity-75">
              <span>🍴 Restaurants</span>
              <span>🧘 Spas</span>
              <span>🛍️ Shopping</span>
              <span>🎯 Activities</span>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why LocalPlus Passport?</h3>
            <p className="text-sm text-gray-600">Pay once, save everywhere</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Store size={24} className="text-red-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">500+</div>
              <div className="text-xs text-gray-600">Partner Businesses</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Percent size={24} className="text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">15-30%</div>
              <div className="text-xs text-gray-600">Average Savings</div>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <MapPin size={24} className="text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">All Hua Hin</div>
              <div className="text-xs text-gray-600">Beach to Hills</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Zap size={24} className="text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">Instant</div>
              <div className="text-xs text-gray-600">No Waiting</div>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="space-y-4 mb-6">
          {/* Monthly Plan */}
          <div 
            onClick={() => setSelectedTier('premium-monthly')}
            className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
              selectedTier === 'premium-monthly' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedTier === 'premium-monthly' 
                    ? 'border-orange-500 bg-orange-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedTier === 'premium-monthly' && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Monthly Passport</h3>
                  <p className="text-sm text-gray-600">Perfect for short stays</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">฿199</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>
            <div className="mt-2">
              <span className="bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                Subscribe Monthly
              </span>
            </div>
          </div>

          {/* Yearly Plan */}
          <div 
            onClick={() => setSelectedTier('premium-yearly')}
            className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
              selectedTier === 'premium-yearly' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedTier === 'premium-yearly' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedTier === 'premium-yearly' && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Annual Passport</h3>
                  <p className="text-sm text-gray-600">Best value for residents</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">฿1,990</div>
                <div className="text-sm text-gray-500">per year</div>
                <div className="text-xs text-green-600 font-medium">Save ฿398</div>
              </div>
            </div>
            <div className="mt-2 flex space-x-2">
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                Best Value
              </span>
              <span className="bg-blue-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                2 Months Free
              </span>
            </div>
          </div>
        </div>

        {/* Business Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Business Categories</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🍴 Restaurants & Cafés</div>
              <div className="text-xs text-gray-600">15-25% off meals</div>
              <div className="text-xs text-red-600 font-medium">120+ locations</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🧘 Spa & Wellness</div>
              <div className="text-xs text-gray-600">20-30% off treatments</div>
              <div className="text-xs text-red-600 font-medium">45+ locations</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🛍️ Shopping & Retail</div>
              <div className="text-xs text-gray-600">10-20% off purchases</div>
              <div className="text-xs text-red-600 font-medium">200+ locations</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🎯 Activities & Tours</div>
              <div className="text-xs text-gray-600">25-40% off experiences</div>
              <div className="text-xs text-red-600 font-medium">35+ locations</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🏨 Hotels & Resorts</div>
              <div className="text-xs text-gray-600">15% off room rates</div>
              <div className="text-xs text-red-600 font-medium">25+ locations</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">🚗 Transport & Services</div>
              <div className="text-xs text-gray-600">10-15% off services</div>
              <div className="text-xs text-red-600 font-medium">75+ locations</div>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center space-x-8">
              <div className="w-16 text-center">
                <div className="text-sm font-medium text-gray-900">Free</div>
              </div>
              <div className="w-16 text-center">
                <div className="text-sm font-medium text-orange-600">Passport</div>
              </div>
            </div>
          </div>

          <CompareFeature feature="Browse businesses & menus" free={true} premium={true} />
          <CompareFeature feature="Off-peak time-based deals" free={true} premium={true} />
          <CompareFeature feature="Instant discount access" free={false} premium={true} />
          <CompareFeature feature="All business categories" free={false} premium={true} />
          <CompareFeature feature="Unlimited usage per month" free={false} premium={true} />
          <CompareFeature feature="Gamification & badges" free={true} premium={true} />
          <CompareFeature feature="Bonus stamps (2x multiplier)" free={false} premium={true} />
          <CompareFeature feature="Exclusive member events" free={false} premium={true} />
          <CompareFeature feature="Priority customer support" free={false} premium={true} />
          <CompareFeature feature="No ads experience" free={false} premium={true} />
        </div>

        {/* Premium Highlights */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Flash Deals</h4>
              <p className="text-xs text-gray-600 mt-1">
                Get early access to limited-time deals up to 70% off
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Priority Booking</h4>
              <p className="text-xs text-gray-600 mt-1">
                Skip the queue with reserved time slots
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Group Booking</h4>
              <p className="text-xs text-gray-600 mt-1">
                Book for larger groups with special rates
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">VIP Support</h4>
              <p className="text-xs text-gray-600 mt-1">
                Get priority customer service and assistance
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900">Credit Card</div>
              <div className="text-xs text-gray-500 mt-1">Visa, Mastercard</div>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900">PromptPay</div>
              <div className="text-xs text-gray-500 mt-1">QR Code</div>
            </div>
            <div className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-900">Bank Transfer</div>
              <div className="text-xs text-gray-500 mt-1">Thai Banks</div>
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={handleUpgrade}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg text-lg font-semibold disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Upgrade to Premium - ฿${selectedTier === 'premium-yearly' ? yearlyTier.price : monthlyTier.price}`
          )}
        </button>

        {/* Terms */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By upgrading, you agree to our Terms of Service and Privacy Policy.
            Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade; 