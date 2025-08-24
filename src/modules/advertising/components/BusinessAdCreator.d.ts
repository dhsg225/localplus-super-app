import React from 'react';
import { Advertisement } from '../types';
interface BusinessAdCreatorProps {
    businessId?: string;
    businessName?: string;
    onSubmit?: (adData: Partial<Advertisement>) => void;
}
export declare const BusinessAdCreator: React.FC<BusinessAdCreatorProps>;
export {};
