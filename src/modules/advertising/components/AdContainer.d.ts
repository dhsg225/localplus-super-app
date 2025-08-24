import React from 'react';
interface AdContainerProps {
    placement: string;
    displayType?: 'card' | 'banner';
    maxAds?: number;
    showOnlyInternal?: boolean;
    showOnlyExternal?: boolean;
    categoryFilter?: string[];
    className?: string;
    size?: 'small' | 'medium' | 'large';
    rotationInterval?: number;
    showImage?: boolean;
    filterType?: 'internal' | 'external' | 'all';
}
declare const AdContainer: React.FC<AdContainerProps>;
export default AdContainer;
