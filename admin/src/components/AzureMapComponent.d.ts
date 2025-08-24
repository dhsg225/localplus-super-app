import React from 'react';
interface BusinessLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
    address: string;
}
interface AzureMapComponentProps {
    businesses: BusinessLocation[];
    height?: string;
}
declare const AzureMapComponent: React.FC<AzureMapComponentProps>;
export default AzureMapComponent;
