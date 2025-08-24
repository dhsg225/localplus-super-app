// [2024-12-19 18:45 UTC] - Business Advertisement Creation Interface

import React, { useState } from 'react';
import { 
  CreditCard, 
  MapPin, 
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Building,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { AdPlacement } from '../types';

interface BusinessAdCreatorProps {
  businessName?: string;
}

interface GeneratedAd {
  title: string;
  description: string;
  ctaText: string;
  imagePrompt: string;
  targetKeywords: string[];
}

export const BusinessAdCreator: React.FC<BusinessAdCreatorProps> = ({
  businessName = '',
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: businessName,
    businessDescription: '',
    contactEmail: '',
    contactPhone: '',
    targetAudience: '',
    adGoal: '',
    budget: 500,
    duration: 7,
    placement: ['homepage-banner' as AdPlacement],
    frequency: 'medium' as 'low' | 'medium' | 'high',
    location: ['bangkok'] as string[]
  });
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'bank'>('credit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const steps = [
    { number: 1, title: 'Business Info', description: 'Tell us about your business' },
    { number: 2, title: 'Campaign Settings', description: 'Configure your advertising campaign' },
    { number: 3, title: 'AI Generation', description: 'Generate your advertisement with AI' },
    { number: 4, title: 'Payment', description: 'Complete your payment' },
    { number: 5, title: 'Review & Submit', description: 'Final review and submission' }
  ];

  const placementOptions: { id: AdPlacement; name: string; price: number; description: string }[] = [
    { id: 'homepage-hero', name: 'Homepage Hero', price: 50, description: 'Prime visibility on homepage hero' },
    { id: 'homepage-cards', name: 'Homepage Cards', price: 40, description: 'Cards on homepage' },
    { id: 'restaurants-top', name: 'Restaurant Page Top', price: 35, description: 'Top of restaurant listings' },
    { id: 'restaurants-bottom', name: 'Restaurant Page Bottom', price: 30, description: 'Bottom of restaurant listings' },
    { id: 'events-sidebar', name: 'Events Sidebar', price: 25, description: 'Sidebar on events page' },
    { id: 'services-banner', name: 'Services Banner', price: 20, description: 'Banner on services page' },
    { id: 'cuisine-explorer', name: 'Cuisine Explorer', price: 20, description: 'Cuisine explorer section' },
    { id: 'deals-section', name: 'Deals Section', price: 20, description: 'Deals section' },
    { id: 'passport-page', name: 'Passport Page', price: 20, description: 'Passport page' },
    { id: 'profile-page', name: 'Profile Page', price: 20, description: 'Profile page' },
    { id: 'loyalty-cards', name: 'Loyalty Cards', price: 20, description: 'Loyalty cards section' },
    { id: 'business-dashboard', name: 'Business Dashboard', price: 20, description: 'Business dashboard' },
    { id: 'floating-banner', name: 'Floating Banner', price: 20, description: 'Floating banner' },
    { id: 'modal-overlay', name: 'Modal Overlay', price: 20, description: 'Modal overlay' }
  ];

  const locationOptions = [
    { id: 'bangkok', name: 'Bangkok', multiplier: 1.0 },
    { id: 'phuket', name: 'Phuket', multiplier: 1.2 },
    { id: 'chiang-mai', name: 'Chiang Mai', multiplier: 0.8 },
    { id: 'pattaya', name: 'Pattaya', multiplier: 1.1 },
    { id: 'hua-hin', name: 'Hua Hin', multiplier: 0.9 }
  ];

  const frequencyMultipliers = {
    low: 0.7,    // 30% discount
    medium: 1.0, // Standard rate
    high: 1.5    // 50% premium
  };

  const calculateTotalCost = () => {
    const baseCost = businessData.placement.reduce((sum, placementId) => {
      const placement = placementOptions.find(p => p.id === placementId);
      return sum + (placement?.price || 0);
    }, 0);

    const locationMultiplier = businessData.location.reduce((sum, locationId) => {
      const location = locationOptions.find(l => l.id === locationId);
      return sum + (location?.multiplier || 1);
    }, 0) / businessData.location.length;

    const frequencyMultiplier = frequencyMultipliers[businessData.frequency];
    
    return Math.round(baseCost * locationMultiplier * frequencyMultiplier * businessData.duration);
  };

  const generateAd = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockGeneratedAd: GeneratedAd = {
      title: `${businessData.businessName} - ${businessData.adGoal}`,
      description: `Experience the best of ${businessData.businessName}. ${businessData.businessDescription.slice(0, 100)}...`,
      ctaText: businessData.adGoal.includes('visit') ? 'Visit Now' : 
               businessData.adGoal.includes('order') ? 'Order Now' : 'Learn More',
      imagePrompt: `Professional photo of ${businessData.businessName}, ${businessData.businessDescription}`,
      targetKeywords: [businessData.businessName.toLowerCase(), businessData.targetAudience.toLowerCase()]
    };
    
    setGeneratedAd(mockGeneratedAd);
    setIsGenerating(false);
  };

  const submitAd = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertisement Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your advertisement has been submitted for review. You'll receive an email confirmation shortly.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Review process: 1-2 business days</li>
              <li>• Email notification upon approval</li>
              <li>• Ad goes live immediately after approval</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Another Ad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <Building className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={businessData.businessDescription}
                    onChange={(e) => setBusinessData({...businessData, businessDescription: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your business, products, or services..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={businessData.contactEmail}
                      onChange={(e) => setBusinessData({...businessData, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={businessData.contactPhone}
                      onChange={(e) => setBusinessData({...businessData, contactPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+66 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Campaign Settings */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Campaign Settings</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={businessData.targetAudience}
                    onChange={(e) => setBusinessData({...businessData, targetAudience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Food lovers, Tourists, Local families"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advertising Goal
                  </label>
                  <select
                    value={businessData.adGoal}
                    onChange={(e) => setBusinessData({...businessData, adGoal: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your goal</option>
                    <option value="increase-visits">Increase store visits</option>
                    <option value="boost-orders">Boost online orders</option>
                    <option value="brand-awareness">Build brand awareness</option>
                    <option value="promote-offers">Promote special offers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Ad Placement (฿{businessData.placement.reduce((sum, p) => sum + (placementOptions.find(opt => opt.id === p)?.price || 0), 0)}/day)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {placementOptions.map(option => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            checked={businessData.placement.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBusinessData({
                                  ...businessData,
                                  placement: [...businessData.placement, option.id]
                                });
                              } else {
                                setBusinessData({
                                  ...businessData,
                                  placement: businessData.placement.filter(p => p !== option.id)
                                });
                              }
                            }}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                            <div className="text-sm font-semibold text-blue-600">฿{option.price}/day</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration
                    </label>
                    <select
                      value={businessData.duration}
                      onChange={(e) => setBusinessData({...businessData, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={3}>3 days</option>
                      <option value={7}>1 week</option>
                      <option value={14}>2 weeks</option>
                      <option value={30}>1 month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Frequency
                    </label>
                    <select
                      value={businessData.frequency}
                      onChange={(e) => setBusinessData({...businessData, frequency: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low (30% discount)</option>
                      <option value="medium">Medium (standard rate)</option>
                      <option value="high">High (50% premium)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-blue-600 mr-2" />
                    <div className="text-sm text-blue-800">
                      <strong>Estimated Total Cost: ฿{calculateTotalCost().toLocaleString()}</strong>
                      <div className="mt-1 text-xs">
                        Based on {businessData.duration} days × {businessData.placement.length} placement(s) × {businessData.frequency} frequency
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI Generation */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">AI Advertisement Generation</h2>
              </div>
              
              {!generatedAd && !isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Generate Your Ad</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Our AI will create a compelling advertisement based on your business information and campaign settings.
                  </p>
                  <button
                    onClick={generateAd}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Generate Advertisement
                  </button>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generating Your Advertisement...</h3>
                  <p className="text-gray-600">This may take a few moments</p>
                </div>
              )}

              {generatedAd && (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Advertisement Generated Successfully!</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{generatedAd.title}</h3>
                          <p className="text-gray-600 mb-4">{generatedAd.description}</p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          {generatedAd.ctaText}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Generated Content</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Title:</span>
                          <div className="text-gray-600">{generatedAd.title}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <div className="text-gray-600">{generatedAd.description}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Call-to-Action:</span>
                          <div className="text-gray-600">{generatedAd.ctaText}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Targeting</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Keywords:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {generatedAd.targetKeywords.map((keyword, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Image Concept:</span>
                          <div className="text-gray-600">{generatedAd.imagePrompt}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={generateAd}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Regenerate Advertisement
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Campaign Duration:</span>
                      <span>{businessData.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placements:</span>
                      <span>{businessData.placement.length} location(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="capitalize">{businessData.frequency}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>฿{calculateTotalCost().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="mr-3"
                      />
                      <Building className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Direct bank transfer</div>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Bank: Bangkok Bank</div>
                      <div>Account: 123-456-7890</div>
                      <div>Name: LocalPlus Co., Ltd.</div>
                      <div className="font-semibold">Amount: ฿{calculateTotalCost().toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-yellow-800 text-sm">
                      <strong>Review Required:</strong> Your advertisement will be reviewed by our team before going live. 
                      This typically takes 1-2 business days.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Business Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Business:</strong> {businessData.businessName}</div>
                      <div><strong>Email:</strong> {businessData.contactEmail}</div>
                      <div><strong>Phone:</strong> {businessData.contactPhone || 'Not provided'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Campaign Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Duration:</strong> {businessData.duration} days</div>
                      <div><strong>Frequency:</strong> {businessData.frequency}</div>
                      <div><strong>Total Cost:</strong> ฿{calculateTotalCost().toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {generatedAd && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Advertisement Preview</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{generatedAd.title}</h4>
                          <p className="text-gray-600 mb-4">{generatedAd.description}</p>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                          {generatedAd.ctaText}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" required />
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
                      <a href="#" className="text-blue-600 hover:underline ml-1">Advertising Guidelines</a>
                    </span>
                  </label>
                </div>

                <button
                  onClick={submitAd}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : `Submit Advertisement - ฿${calculateTotalCost().toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} className="mr-2" />
              Previous
            </button>

            {currentStep < 5 && (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!businessData.businessName || !businessData.businessDescription || !businessData.contactEmail)) ||
                  (currentStep === 2 && (businessData.placement.length === 0 || !businessData.adGoal)) ||
                  (currentStep === 3 && !generatedAd)
                }
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 