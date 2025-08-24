import React from 'react';
import { BusinessResult, BusinessCardAction } from './types';
interface RestaurantCardProps {
    business: BusinessResult;
    actions: BusinessCardAction[];
    onAction: (action: BusinessCardAction, business: BusinessResult) => void;
    className?: string;
}
declare const RestaurantCard: React.FC<RestaurantCardProps>;
export default RestaurantCard;
