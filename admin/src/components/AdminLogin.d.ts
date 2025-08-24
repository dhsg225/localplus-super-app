import React from 'react';
interface UnifiedUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
}
interface AdminLoginProps {
    onLogin: (user: UnifiedUser) => void;
}
export declare const AdminLogin: React.FC<AdminLoginProps>;
export {};
