import React from 'react';
import { BusinessOnboardingData } from '../../types';
interface BasicInfoStepProps {
    data: Partial<BusinessOnboardingData>;
    errors: Record<string, string>;
    updateData: (data: Partial<BusinessOnboardingData>) => void;
}
declare const BasicInfoStep: React.FC<BasicInfoStepProps>;
export default BasicInfoStep;
