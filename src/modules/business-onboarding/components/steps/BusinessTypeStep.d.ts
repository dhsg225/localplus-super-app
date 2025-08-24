import React from 'react';
import { BusinessOnboardingData } from '../../types';
interface BusinessTypeStepProps {
    data: Partial<BusinessOnboardingData>;
    errors: Record<string, string>;
    updateData: (data: Partial<BusinessOnboardingData>) => void;
}
declare const BusinessTypeStep: React.FC<BusinessTypeStepProps>;
export default BusinessTypeStep;
