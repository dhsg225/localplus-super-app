import React from 'react';
interface BookingFormProps {
    businessId: string;
    businessName: string;
    onSuccess?: (booking: any) => void;
    onError?: (error: string) => void;
    theme?: 'blue' | 'red' | 'gray';
    className?: string;
}
export declare const BookingForm: React.FC<BookingFormProps>;
export {};
