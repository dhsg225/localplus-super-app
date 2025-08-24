import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
declare class AuthService {
    private baseURL;
    private delay;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(credentials: RegisterCredentials): Promise<AuthResponse>;
    resetPassword(email: string): Promise<void>;
    updateProfile(userId: string, updates: Partial<User>): Promise<User>;
    logout(): void;
    getStoredToken(): string | null;
    getStoredUser(): User | null;
    validateToken(token: string): Promise<boolean>;
    socialLogin(provider: 'google' | 'facebook' | 'line'): Promise<AuthResponse>;
    private generateMockToken;
}
export declare const authService: AuthService;
export {};
