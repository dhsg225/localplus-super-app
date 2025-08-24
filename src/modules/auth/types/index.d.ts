export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    preferences: UserPreferences;
    accountSettings: AccountSettings;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: Date;
    lastLoginAt: Date;
    loginProvider: 'email' | 'google' | 'facebook' | 'line';
}
export interface UserPreferences {
    language: 'en' | 'th';
    currency: 'THB' | 'USD';
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        deals: boolean;
        events: boolean;
        reminders: boolean;
    };
    dietary: {
        vegetarian: boolean;
        vegan: boolean;
        halal: boolean;
        glutenFree: boolean;
        allergies: string[];
    };
    cuisinePreferences: string[];
    priceRange: {
        min: number;
        max: number;
    };
    favoriteDistricts: string[];
}
export interface AccountSettings {
    privacy: {
        profileVisibility: 'public' | 'friends' | 'private';
        showActivityStatus: boolean;
        allowLocationTracking: boolean;
    };
    security: {
        twoFactorEnabled: boolean;
        loginAlerts: boolean;
    };
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
    subscribeToNewsletter?: boolean;
}
export interface ResetPasswordRequest {
    email: string;
}
export interface ResetPasswordConfirm {
    token: string;
    password: string;
    confirmPassword: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface SocialLoginProvider {
    id: 'google' | 'facebook' | 'line';
    name: string;
    icon: string;
    color: string;
}
export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
}
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    deleteAccount: () => Promise<void>;
    clearError: () => void;
}
