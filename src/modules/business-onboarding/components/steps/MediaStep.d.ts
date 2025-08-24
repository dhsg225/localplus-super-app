import React from 'react';
import { BusinessOnboardingData } from '../../types';
interface MediaStepProps {
    data: Partial<BusinessOnboardingData>;
    errors: Record<string, string>;
    updateData: (data: Partial<BusinessOnboardingData>) => void;
}
declare const MediaStep: React.FC<MediaStepProps>;
export default MediaStep;
