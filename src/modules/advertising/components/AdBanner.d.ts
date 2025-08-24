import React from 'react';
import { Advertisement } from '../types';
interface AdBannerProps {
    ad: Advertisement;
    placement: string;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}
declare const AdBanner: React.FC<AdBannerProps>;
export default AdBanner;
