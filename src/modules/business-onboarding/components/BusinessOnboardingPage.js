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
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/ui-components/common/Button';
import BusinessTypeStep from './steps/BusinessTypeStep';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import MediaStep from './steps/MediaStep';
import MenuSubmissionStep from './MenuSubmissionStep';
import ConfirmationStep from './steps/ConfirmationStep';
var TOTAL_STEPS = 6;
var BusinessOnboardingPage = function () {
    var _a = useState({
        currentStep: 1,
        totalSteps: TOTAL_STEPS,
        data: {},
        errors: {},
        isSubmitting: false
    }), formState = _a[0], setFormState = _a[1];
    var updateFormData = function (data) {
        setFormState(function (prev) { return (__assign(__assign({}, prev), { data: __assign(__assign({}, prev.data), data), errors: {} // Clear errors when data updates
         })); });
    };
    var setErrors = function (errors) {
        setFormState(function (prev) { return (__assign(__assign({}, prev), { errors: errors })); });
    };
    var nextStep = function () {
        if (formState.currentStep < TOTAL_STEPS) {
            setFormState(function (prev) { return (__assign(__assign({}, prev), { currentStep: prev.currentStep + 1 })); });
        }
    };
    var prevStep = function () {
        if (formState.currentStep > 1) {
            setFormState(function (prev) { return (__assign(__assign({}, prev), { currentStep: prev.currentStep - 1 })); });
        }
    };
    var validateCurrentStep = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var data = formState.data, currentStep = formState.currentStep;
        var errors = {};
        switch (currentStep) {
            case 1:
                if (!data.businessType) {
                    errors.businessType = 'Please select a business type';
                }
                if (data.businessType === 'other' && !data.otherBusinessType) {
                    errors.otherBusinessType = 'Please specify your business type';
                }
                break;
            case 2:
                if (!((_a = data.businessName) === null || _a === void 0 ? void 0 : _a.trim()))
                    errors.businessName = 'Business name is required';
                if (!((_b = data.contactName) === null || _b === void 0 ? void 0 : _b.trim()))
                    errors.contactName = 'Contact name is required';
                if (!((_c = data.email) === null || _c === void 0 ? void 0 : _c.trim()))
                    errors.email = 'Email is required';
                if (!((_d = data.phone) === null || _d === void 0 ? void 0 : _d.trim()))
                    errors.phone = 'Phone number is required';
                if (!((_e = data.category) === null || _e === void 0 ? void 0 : _e.trim()))
                    errors.category = 'Category is required';
                break;
            case 3:
                if (!((_f = data.address) === null || _f === void 0 ? void 0 : _f.trim()))
                    errors.address = 'Address is required';
                if (!((_g = data.city) === null || _g === void 0 ? void 0 : _g.trim()))
                    errors.city = 'City is required';
                break;
            case 4:
                if (!((_h = data.shortDescription) === null || _h === void 0 ? void 0 : _h.trim())) {
                    errors.shortDescription = 'Short description is required';
                }
                if (!data.agreedToTerms) {
                    errors.agreedToTerms = 'You must agree to the terms of service';
                }
                break;
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return false;
        }
        return true;
    };
    var handleNext = function () {
        if (validateCurrentStep()) {
            nextStep();
        }
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Submit clicked! Current data:', formState.data);
                    console.log('Current step:', formState.currentStep);
                    if (!validateCurrentStep()) {
                        console.log('Validation failed. Errors:', formState.errors);
                        return [2 /*return*/];
                    }
                    console.log('Validation passed, submitting...');
                    setFormState(function (prev) { return (__assign(__assign({}, prev), { isSubmitting: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // TODO: Submit to API - Currently just logging and simulating
                    console.log('Submitting business onboarding data:', formState.data);
                    // Simulate API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 2:
                    // Simulate API call
                    _a.sent();
                    console.log('Submission successful, moving to confirmation...');
                    nextStep(); // Go to confirmation step
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Submission error:', error_1);
                    setErrors({ submit: 'Failed to submit. Please try again.' });
                    return [3 /*break*/, 5];
                case 4:
                    setFormState(function (prev) { return (__assign(__assign({}, prev), { isSubmitting: false })); });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var renderCurrentStep = function () {
        switch (formState.currentStep) {
            case 1:
                return (<BusinessTypeStep data={formState.data} errors={formState.errors} updateData={updateFormData}/>);
            case 2:
                return (<BasicInfoStep data={formState.data} errors={formState.errors} updateData={updateFormData}/>);
            case 3:
                return (<LocationStep data={formState.data} errors={formState.errors} updateData={updateFormData}/>);
            case 4:
                return (<MediaStep data={formState.data} errors={formState.errors} updateData={updateFormData}/>);
            case 5:
                return (<MenuSubmissionStep onNext={handleNext} onBack={prevStep}/>);
            case 6:
                return <ConfirmationStep data={formState.data}/>;
            default:
                return null;
        }
    };
    var getStepTitle = function () {
        switch (formState.currentStep) {
            case 1: return 'Business Type';
            case 2: return 'Basic Information';
            case 3: return 'Location & Hours';
            case 4: return 'Description & Media';
            case 5: return 'Menu Setup';
            case 6: return 'Confirmation';
            default: return '';
        }
    };
    var isLastStep = formState.currentStep === TOTAL_STEPS - 1;
    var isConfirmationStep = formState.currentStep === TOTAL_STEPS;
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={prevStep} disabled={formState.currentStep === 1}>
            <ArrowLeft size={24} className="text-gray-700"/>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {getStepTitle()}
            </h1>
            {!isConfirmationStep && (<p className="text-sm text-gray-500">
                Step {formState.currentStep} of {TOTAL_STEPS - 1}
              </p>)}
          </div>
          <div className="w-6"/> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        {!isConfirmationStep && (<div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{
                width: "".concat((formState.currentStep / (TOTAL_STEPS - 1)) * 100, "%")
            }}/>
            </div>
          </div>)}
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {renderCurrentStep()}
      </div>

      {/* Footer Navigation */}
      {!isConfirmationStep && (<div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-md mx-auto px-4">
            <div className="flex gap-3">
            {formState.currentStep > 1 && (<Button variant="outline" onClick={prevStep} className="flex-1">
                Previous
              </Button>)}
            
            {isLastStep ? (<Button variant="primary" onClick={handleSubmit} isLoading={formState.isSubmitting} className="flex-1">
                Submit Listing
              </Button>) : (<Button variant="primary" onClick={handleNext} className="flex-1">
                Next
                <ArrowRight size={16} className="ml-2"/>
              </Button>)}
            </div>
          </div>
        </div>)}
    </div>);
};
export default BusinessOnboardingPage;
