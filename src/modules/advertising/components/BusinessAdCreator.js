// [2024-12-19 18:45 UTC] - Business Advertisement Creation Interface
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from 'react';
import { CreditCard, MapPin, Sparkles, ArrowLeft, ArrowRight, Building, CheckCircle, AlertCircle, Info } from 'lucide-react';
export var BusinessAdCreator = function (_a) {
    var _b = _a.businessId, businessId = _b === void 0 ? '' : _b, _c = _a.businessName, businessName = _c === void 0 ? '' : _c, onSubmit = _a.onSubmit;
    var _d = useState(1), currentStep = _d[0], setCurrentStep = _d[1];
    var _e = useState(false), isGenerating = _e[0], setIsGenerating = _e[1];
    var _f = useState({
        businessName: businessName,
        businessDescription: '',
        contactEmail: '',
        contactPhone: '',
        targetAudience: '',
        adGoal: '',
        budget: 500,
        duration: 7,
        placement: ['homepage-banner'],
        frequency: 'medium',
        location: ['bangkok']
    }), businessData = _f[0], setBusinessData = _f[1];
    var _g = useState(null), generatedAd = _g[0], setGeneratedAd = _g[1];
    var _h = useState('credit'), paymentMethod = _h[0], setPaymentMethod = _h[1];
    var _j = useState(false), isSubmitting = _j[0], setIsSubmitting = _j[1];
    var _k = useState(false), submitSuccess = _k[0], setSubmitSuccess = _k[1];
    var steps = [
        { number: 1, title: 'Business Info', description: 'Tell us about your business' },
        { number: 2, title: 'Campaign Settings', description: 'Configure your advertising campaign' },
        { number: 3, title: 'AI Generation', description: 'Generate your advertisement with AI' },
        { number: 4, title: 'Payment', description: 'Complete your payment' },
        { number: 5, title: 'Review & Submit', description: 'Final review and submission' }
    ];
    var placementOptions = [
        { id: 'homepage-banner', name: 'Homepage Banner', price: 50, description: 'Prime visibility on homepage' },
        { id: 'restaurant-top', name: 'Restaurant Page Top', price: 40, description: 'Top of restaurant listings' },
        { id: 'search-results', name: 'Search Results', price: 35, description: 'Within search results' },
        { id: 'category-pages', name: 'Category Pages', price: 30, description: 'Category-specific placement' },
        { id: 'sidebar', name: 'Sidebar Ads', price: 25, description: 'Sidebar placement across site' }
    ];
    var locationOptions = [
        { id: 'bangkok', name: 'Bangkok', multiplier: 1.0 },
        { id: 'phuket', name: 'Phuket', multiplier: 1.2 },
        { id: 'chiang-mai', name: 'Chiang Mai', multiplier: 0.8 },
        { id: 'pattaya', name: 'Pattaya', multiplier: 1.1 },
        { id: 'hua-hin', name: 'Hua Hin', multiplier: 0.9 }
    ];
    var frequencyMultipliers = {
        low: 0.7, // 30% discount
        medium: 1.0, // Standard rate
        high: 1.5 // 50% premium
    };
    var calculateTotalCost = function () {
        var baseCost = businessData.placement.reduce(function (sum, placementId) {
            var placement = placementOptions.find(function (p) { return p.id === placementId; });
            return sum + ((placement === null || placement === void 0 ? void 0 : placement.price) || 0);
        }, 0);
        var locationMultiplier = businessData.location.reduce(function (sum, locationId) {
            var location = locationOptions.find(function (l) { return l.id === locationId; });
            return sum + ((location === null || location === void 0 ? void 0 : location.multiplier) || 1);
        }, 0) / businessData.location.length;
        var frequencyMultiplier = frequencyMultipliers[businessData.frequency];
        return Math.round(baseCost * locationMultiplier * frequencyMultiplier * businessData.duration);
    };
    var generateAd = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockGeneratedAd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsGenerating(true);
                    // Simulate AI generation
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 1:
                    // Simulate AI generation
                    _a.sent();
                    mockGeneratedAd = {
                        title: "".concat(businessData.businessName, " - ").concat(businessData.adGoal),
                        description: "Experience the best of ".concat(businessData.businessName, ". ").concat(businessData.businessDescription.slice(0, 100), "..."),
                        ctaText: businessData.adGoal.includes('visit') ? 'Visit Now' :
                            businessData.adGoal.includes('order') ? 'Order Now' : 'Learn More',
                        imagePrompt: "Professional photo of ".concat(businessData.businessName, ", ").concat(businessData.businessDescription),
                        targetKeywords: [businessData.businessName.toLowerCase(), businessData.targetAudience.toLowerCase()]
                    };
                    setGeneratedAd(mockGeneratedAd);
                    setIsGenerating(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var submitAd = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    // Simulate submission
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 1:
                    // Simulate submission
                    _a.sent();
                    setSubmitSuccess(true);
                    setIsSubmitting(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var nextStep = function () {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };
    var prevStep = function () {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    if (submitSuccess) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600"/>
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
          <button onClick={function () { return window.location.reload(); }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Create Another Ad
          </button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map(function (step, index) { return (<div key={step.number} className="flex items-center">
                <div className={"flex items-center justify-center w-10 h-10 rounded-full border-2 ".concat(currentStep >= step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-400')}>
                  {step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={"text-sm font-medium ".concat(currentStep >= step.number ? 'text-blue-600' : 'text-gray-400')}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (<div className={"w-12 h-0.5 mx-4 ".concat(currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300')}/>)}
              </div>); })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Step 1: Business Information */}
          {currentStep === 1 && (<div>
              <div className="flex items-center mb-6">
                <Building className="w-6 h-6 text-blue-600 mr-3"/>
                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input type="text" value={businessData.businessName} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { businessName: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your business name"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea value={businessData.businessDescription} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { businessDescription: e.target.value })); }} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe your business, products, or services..."/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input type="email" value={businessData.contactEmail} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { contactEmail: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input type="tel" value={businessData.contactPhone} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { contactPhone: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+66 XX XXX XXXX"/>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Step 2: Campaign Settings */}
          {currentStep === 2 && (<div>
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600 mr-3"/>
                <h2 className="text-2xl font-bold text-gray-900">Campaign Settings</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input type="text" value={businessData.targetAudience} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { targetAudience: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Food lovers, Tourists, Local families"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advertising Goal
                  </label>
                  <select value={businessData.adGoal} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { adGoal: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select your goal</option>
                    <option value="increase-visits">Increase store visits</option>
                    <option value="boost-orders">Boost online orders</option>
                    <option value="brand-awareness">Build brand awareness</option>
                    <option value="promote-offers">Promote special offers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Ad Placement (฿{businessData.placement.reduce(function (sum, p) { var _a; return sum + (((_a = placementOptions.find(function (opt) { return opt.id === p; })) === null || _a === void 0 ? void 0 : _a.price) || 0); }, 0)}/day)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {placementOptions.map(function (option) { return (<div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <label className="flex items-start cursor-pointer">
                          <input type="checkbox" checked={businessData.placement.includes(option.id)} onChange={function (e) {
                    if (e.target.checked) {
                        setBusinessData(__assign(__assign({}, businessData), { placement: __spreadArray(__spreadArray([], businessData.placement, true), [option.id], false) }));
                    }
                    else {
                        setBusinessData(__assign(__assign({}, businessData), { placement: businessData.placement.filter(function (p) { return p !== option.id; }) }));
                    }
                }} className="mt-1 mr-3"/>
                          <div>
                            <div className="font-medium text-gray-900">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                            <div className="text-sm font-semibold text-blue-600">฿{option.price}/day</div>
                          </div>
                        </label>
                      </div>); })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration
                    </label>
                    <select value={businessData.duration} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { duration: parseInt(e.target.value) })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                    <select value={businessData.frequency} onChange={function (e) { return setBusinessData(__assign(__assign({}, businessData), { frequency: e.target.value })); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="low">Low (30% discount)</option>
                      <option value="medium">Medium (standard rate)</option>
                      <option value="high">High (50% premium)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-blue-600 mr-2"/>
                    <div className="text-sm text-blue-800">
                      <strong>Estimated Total Cost: ฿{calculateTotalCost().toLocaleString()}</strong>
                      <div className="mt-1 text-xs">
                        Based on {businessData.duration} days × {businessData.placement.length} placement(s) × {businessData.frequency} frequency
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Step 3: AI Generation */}
          {currentStep === 3 && (<div>
              <div className="flex items-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600 mr-3"/>
                <h2 className="text-2xl font-bold text-gray-900">AI Advertisement Generation</h2>
              </div>
              
              {!generatedAd && !isGenerating && (<div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-blue-600"/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Generate Your Ad</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Our AI will create a compelling advertisement based on your business information and campaign settings.
                  </p>
                  <button onClick={generateAd} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Generate Advertisement
                  </button>
                </div>)}

              {isGenerating && (<div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-8 h-8 text-blue-600 animate-spin"/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generating Your Advertisement...</h3>
                  <p className="text-gray-600">This may take a few moments</p>
                </div>)}

              {generatedAd && (<div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2"/>
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
                            {generatedAd.targetKeywords.map(function (keyword, index) { return (<span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {keyword}
                              </span>); })}
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
                    <button onClick={generateAd} className="text-blue-600 hover:text-blue-800 font-medium">
                      Regenerate Advertisement
                    </button>
                  </div>
                </div>)}
            </div>)}

          {/* Step 4: Payment */}
          {currentStep === 4 && (<div>
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-blue-600 mr-3"/>
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
                      <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={function (e) { return setPaymentMethod(e.target.value); }} className="mr-3"/>
                      <CreditCard className="w-5 h-5 text-gray-400 mr-3"/>
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={function (e) { return setPaymentMethod(e.target.value); }} className="mr-3"/>
                      <Building className="w-5 h-5 text-gray-400 mr-3"/>
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Direct bank transfer</div>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit' && (<div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                      </div>
                    </div>
                  </div>)}

                {paymentMethod === 'bank' && (<div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Bank Transfer Details</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Bank: Bangkok Bank</div>
                      <div>Account: 123-456-7890</div>
                      <div>Name: LocalPlus Co., Ltd.</div>
                      <div className="font-semibold">Amount: ฿{calculateTotalCost().toLocaleString()}</div>
                    </div>
                  </div>)}
              </div>
            </div>)}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (<div>
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3"/>
                <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5"/>
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

                {generatedAd && (<div>
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
                  </div>)}

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" required/>
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
                      <a href="#" className="text-blue-600 hover:underline ml-1">Advertising Guidelines</a>
                    </span>
                  </label>
                </div>

                <button onClick={submitAd} disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Submitting...' : "Submit Advertisement - \u0E3F".concat(calculateTotalCost().toLocaleString())}
                </button>
              </div>
            </div>)}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowLeft size={20} className="mr-2"/>
              Previous
            </button>

            {currentStep < 5 && (<button onClick={nextStep} disabled={(currentStep === 1 && (!businessData.businessName || !businessData.businessDescription || !businessData.contactEmail)) ||
                (currentStep === 2 && (businessData.placement.length === 0 || !businessData.adGoal)) ||
                (currentStep === 3 && !generatedAd)} className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
                <ArrowRight size={20} className="ml-2"/>
              </button>)}
          </div>
        </div>
      </div>
    </div>);
};
