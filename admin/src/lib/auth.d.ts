export interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'super_admin';
    avatar?: string;
    permissions: string[];
    lastLogin: Date;
    isActive: boolean;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface AuthResponse {
    user: AdminUser;
    token: string;
    expiresIn: number;
}
declare class AdminAuthService {
    private tokenKey;
    private userKey;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): AdminUser | null;
    getToken(): string | null;
    isAuthenticated(): boolean;
    hasPermission(permission: string): boolean;
    private generateToken;
}
export declare const adminAuth: AdminAuthService;
export {};
