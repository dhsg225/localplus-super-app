import React from 'react';
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}
declare const FormInput: React.FC<FormInputProps>;
export default FormInput;
