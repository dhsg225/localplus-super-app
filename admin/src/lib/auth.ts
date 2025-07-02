// [2024-12-15 23:20] - Admin Authentication System (adapted from mobile version)
import { supabase } from './supabase';

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

// Admin users with enhanced permissions
const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-001',
    email: 'admin@localplus.co.th',
    firstName: 'LocalPlus',
    lastName: 'Administrator',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    permissions: [
      'view_dashboard',
      'manage_businesses',
      'approve_listings',
      'bulk_operations',
      'export_data',
      'manage_users',
      'system_settings',
      'analytics_full'
    ],
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: 'admin-002', 
    email: 'curator@localplus.co.th',
    firstName: 'Business',
    lastName: 'Curator',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150',
    permissions: [
      'view_dashboard',
      'manage_businesses',
      'approve_listings',
      'export_data',
      'analytics_basic'
    ],
    lastLogin: new Date(),
    isActive: true
  }
];

class AdminAuthService {
  private tokenKey = 'localplus_admin_token';
  private userKey = 'localplus_admin_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate admin credentials
    const adminUser = mockAdminUsers.find(u => u.email === credentials.email);
    if (!adminUser) {
      throw new Error('Invalid admin credentials');
    }

    // Check admin password (in production, use proper password hashing)
    const validPasswords = {
      'admin@localplus.co.th': 'admin123',
      'curator@localplus.co.th': 'curator123'
    };

    if (credentials.password !== validPasswords[credentials.email as keyof typeof validPasswords]) {
      throw new Error('Invalid admin password');
    }

    if (!adminUser.isActive) {
      throw new Error('Admin account is deactivated');
    }

    const authResponse: AuthResponse = {
      user: { ...adminUser, lastLogin: new Date() },
      token: this.generateToken(),
      expiresIn: 28800 // 8 hours for admin sessions
    };

    // Store admin session
    if (credentials.rememberMe) {
      localStorage.setItem(this.tokenKey, authResponse.token);
      localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    } else {
      sessionStorage.setItem(this.tokenKey, authResponse.token);
      sessionStorage.setItem(this.userKey, JSON.stringify(authResponse.user));
    }

    return authResponse;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return {
        ...user,
        lastLogin: new Date(user.lastLogin)
      };
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  private generateToken(): string {
    return `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

export const adminAuth = new AdminAuthService(); 