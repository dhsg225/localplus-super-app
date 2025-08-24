import React from 'react';
interface Option {
    value: string;
    label: string;
}
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
    helperText?: string;
    required?: boolean;
    placeholder?: string;
}
declare const FormSelect: React.FC<FormSelectProps>;
export default FormSelect;
