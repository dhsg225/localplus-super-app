import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BusinessOnboardingData, OnboardingFormState } from '../types';
import Button from '@/ui-components/common/Button';
import BusinessTypeStep from './steps/BusinessTypeStep';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import MediaStep from './steps/MediaStep';
import MenuSubmissionStep from './MenuSubmissionStep';
import ConfirmationStep from './steps/ConfirmationStep';

const TOTAL_STEPS = 6;

const BusinessOnboardingPage: React.FC = () => {
  const [formState, setFormState] = useState<OnboardingFormState>({
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
    data: {},
    errors: {},
    isSubmitting: false
  });

  const updateFormData = (data: Partial<BusinessOnboardingData>) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, ...data },
      errors: {} // Clear errors when data updates
    }));
  };

  const setErrors = (errors: Record<string, string>) => {
    setFormState(prev => ({ ...prev, errors }));
  };

  const nextStep = () => {
    if (formState.currentStep < TOTAL_STEPS) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (formState.currentStep > 1) {
      setFormState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const { data, currentStep } = formState;
    const errors: Record<string, string> = {};

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
        if (!data.businessName?.trim()) errors.businessName = 'Business name is required';
        if (!data.contactName?.trim()) errors.contactName = 'Contact name is required';
        if (!data.email?.trim()) errors.email = 'Email is required';
        if (!data.phone?.trim()) errors.phone = 'Phone number is required';
        if (!data.category?.trim()) errors.category = 'Category is required';
        break;

      case 3:
        if (!data.address?.trim()) errors.address = 'Address is required';
        if (!data.city?.trim()) errors.city = 'City is required';
        break;

      case 4:
        if (!data.shortDescription?.trim()) {
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

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    console.log('Submit clicked! Current data:', formState.data);
    console.log('Current step:', formState.currentStep);
    
    if (!validateCurrentStep()) {
      console.log('Validation failed. Errors:', formState.errors);
      return;
    }

    console.log('Validation passed, submitting...');
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // TODO: Submit to API - Currently just logging and simulating
      console.log('Submitting business onboarding data:', formState.data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Submission successful, moving to confirmation...');
      nextStep(); // Go to confirmation step
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const renderCurrentStep = () => {
    switch (formState.currentStep) {
      case 1:
        return (
          <BusinessTypeStep
            data={formState.data}
            errors={formState.errors}
            updateData={updateFormData}
          />
        );
      case 2:
        return (
          <BasicInfoStep
            data={formState.data}
            errors={formState.errors}
            updateData={updateFormData}
          />
        );
      case 3:
        return (
          <LocationStep
            data={formState.data}
            errors={formState.errors}
            updateData={updateFormData}
          />
        );
      case 4:
        return (
          <MediaStep
            data={formState.data}
            errors={formState.errors}
            updateData={updateFormData}
          />
        );
      case 5:
        return (
          <MenuSubmissionStep
            onNext={handleNext}
            onBack={prevStep}
          />
        );
      case 6:
        return <ConfirmationStep data={formState.data} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
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

  const isLastStep = formState.currentStep === TOTAL_STEPS - 1;
  const isConfirmationStep = formState.currentStep === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button onClick={prevStep} disabled={formState.currentStep === 1}>
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {getStepTitle()}
            </h1>
            {!isConfirmationStep && (
              <p className="text-sm text-gray-500">
                Step {formState.currentStep} of {TOTAL_STEPS - 1}
              </p>
            )}
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        {!isConfirmationStep && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(formState.currentStep / (TOTAL_STEPS - 1)) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {renderCurrentStep()}
      </div>

      {/* Footer Navigation */}
      {!isConfirmationStep && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-md mx-auto px-4">
            <div className="flex gap-3">
            {formState.currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            {isLastStep ? (
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={formState.isSubmitting}
                className="flex-1"
              >
                Submit Listing
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessOnboardingPage; 