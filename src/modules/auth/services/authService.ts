import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock user data for development
const mockUsers: User[] = [
  {
    id: 'b3e1c2d4-1234-5678-9abc-def012345678',
    email: 'siriporn@localplus.co.th',
    firstName: 'Siriporn',
    lastName: 'Tanaka',
    phone: '+66-89-123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150',
    location: {
      city: 'Hua Hin',
      country: 'Thailand',
      coordinates: { lat: 12.5684, lng: 99.9578 }
    },
    preferences: {
      language: 'th',
      currency: 'THB',
      notifications: {
        email: true,
        push: true,
        sms: false,
        deals: true,
        events: true,
        reminders: true
      },
      dietary: {
        vegetarian: false,
        vegan: false,
        halal: false,
        glutenFree: false,
        allergies: []
      },
      cuisinePreferences: ['Thai', 'Japanese', 'Italian'],
      priceRange: { min: 100, max: 1500 },
      favoriteDistricts: ['Hua Hin Beach', 'Town Center', 'Royal Golf Course Area']
    },
    accountSettings: {
      privacy: {
        profileVisibility: 'public',
        showActivityStatus: true,
        allowLocationTracking: true
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-08-15'),
    lastLoginAt: new Date(),
    loginProvider: 'email'
  }
];

// Storage keys
const TOKEN_KEY = 'localplus_auth_token';
const REFRESH_TOKEN_KEY = 'localplus_refresh_token';
const USER_KEY = 'localplus_user';

class AuthService {
  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay();

    // Mock authentication logic
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('User not found');
    }

    // In real implementation, verify password hash
    if (credentials.password !== 'password123') {
      throw new Error('Invalid password');
    }

    const authResponse: AuthResponse = {
      user: { ...user, lastLoginAt: new Date() },
      token: this.generateMockToken(),
      refreshToken: this.generateMockToken(),
      expiresIn: 86400 // 24 hours
    };

    // Store auth data
    if (credentials.rememberMe) {
      localStorage.setItem(TOKEN_KEY, authResponse.token);
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, authResponse.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    }

    return authResponse;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await this.delay(1500);

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      phone: credentials.phone,
      preferences: {
        language: 'en',
        currency: 'THB',
        notifications: {
          email: credentials.subscribeToNewsletter ?? true,
          push: true,
          sms: false,
          deals: true,
          events: true,
          reminders: true
        },
        dietary: {
          vegetarian: false,
          vegan: false,
          halal: false,
          glutenFree: false,
          allergies: []
        },
        cuisinePreferences: [],
        priceRange: { min: 100, max: 1000 },
        favoriteDistricts: []
      },
      accountSettings: {
        privacy: {
          profileVisibility: 'public',
          showActivityStatus: true,
          allowLocationTracking: false
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true
        }
      },
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      loginProvider: 'email'
    };

    mockUsers.push(newUser);

    const authResponse: AuthResponse = {
      user: newUser,
      token: this.generateMockToken(),
      refreshToken: this.generateMockToken(),
      expiresIn: 86400
    };

    // Store auth data
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));

    return authResponse;
  }

  async resetPassword(email: string): Promise<void> {
    await this.delay();

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('No user found with this email address');
    }

    // In real implementation, send reset email
    console.log(`Password reset email sent to ${email}`);
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await this.delay(800);

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;

    // Update stored user data
    const storedUser = this.getStoredUser();
    if (storedUser && storedUser.id === userId) {
      const storage = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      // Convert date strings back to Date objects
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt),
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined
      };
    } catch {
      return null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    await this.delay(300);
    // In real implementation, validate token with backend
    return token.startsWith('mock_token_');
  }

  async socialLogin(provider: 'google' | 'facebook' | 'line'): Promise<AuthResponse> {
    await this.delay(2000);

    // Mock social login - in real implementation, integrate with OAuth providers
    const socialUser: User = {
      id: `${provider}_${Date.now()}`,
      email: `user@${provider}.com`,
      firstName: 'Social',
      lastName: 'User',
      avatar: `https://via.placeholder.com/150?text=${provider.toUpperCase()}`,
      preferences: {
        language: 'en',
        currency: 'THB',
        notifications: {
          email: true,
          push: true,
          sms: false,
          deals: true,
          events: true,
          reminders: true
        },
        dietary: {
          vegetarian: false,
          vegan: false,
          halal: false,
          glutenFree: false,
          allergies: []
        },
        cuisinePreferences: [],
        priceRange: { min: 100, max: 1000 },
        favoriteDistricts: []
      },
      accountSettings: {
        privacy: {
          profileVisibility: 'public',
          showActivityStatus: true,
          allowLocationTracking: false
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true
        }
      },
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      loginProvider: provider
    };

    const authResponse: AuthResponse = {
      user: socialUser,
      token: this.generateMockToken(),
      refreshToken: this.generateMockToken(),
      expiresIn: 86400
    };

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));

    return authResponse;
  }

  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const authService = new AuthService(); 