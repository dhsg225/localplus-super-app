import React from 'react';
interface GeoLocationSelectorProps {
    onLocationChange: (location: {
        province_id?: string;
        district_id?: string;
        sub_district_id?: string;
    }) => void;
    initialValues?: {
        province_id?: string;
        district_id?: string;
        sub_district_id?: string;
    };
    className?: string;
    showLabels?: boolean;
    required?: boolean;
}
export declare const GeoLocationSelector: React.FC<GeoLocationSelectorProps>;
export {};
