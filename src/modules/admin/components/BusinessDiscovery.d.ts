import React from 'react';
interface BusinessDiscoveryProps {
    userLocation: {
        lat: number;
        lng: number;
    } | null;
    onBusinessAdded?: (business: any) => void;
    onLocationUpdate?: (location: {
        lat: number;
        lng: number;
    }) => void;
}
declare const BusinessDiscovery: React.FC<BusinessDiscoveryProps>;
export default BusinessDiscovery;
