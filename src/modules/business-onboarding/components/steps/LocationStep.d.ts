import React from 'react';
import { BusinessOnboardingData } from '../../types';
interface LocationStepProps {
    data: Partial<BusinessOnboardingData>;
    errors: Record<string, string>;
    updateData: (data: Partial<BusinessOnboardingData>) => void;
}
declare const LocationStep: React.FC<LocationStepProps>;
export default LocationStep;
