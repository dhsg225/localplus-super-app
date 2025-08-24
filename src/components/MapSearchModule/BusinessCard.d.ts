import React from 'react';
import { BusinessResult, BusinessCardAction, MapSearchContext } from './types';
interface BusinessCardProps {
    business: BusinessResult;
    context: MapSearchContext;
    actions: BusinessCardAction[];
    layout?: 'grid' | 'list';
    onAction: (action: BusinessCardAction, business: BusinessResult) => void;
    className?: string;
}
declare const BusinessCard: React.FC<BusinessCardProps>;
export default BusinessCard;
