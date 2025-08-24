import React from 'react';
import { Advertisement } from '../types';
interface AdCardProps {
    ad: Advertisement;
    placement: string;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    showImage?: boolean;
}
declare const AdCard: React.FC<AdCardProps>;
export default AdCard;
