// [2024-12-19 23:00] - Admin Login Component using enhanced admin authentication
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { adminAuth } from '../lib/supabase';
import type { UnifiedUser } from '@shared/services/authService';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AdminLoginProps {
  onLogin: (user: UnifiedUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: 'admin@localplus.com', // Updated for unified auth
    password: 'admin123',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminAuth.signIn(credentials.email, credentials.password);
      
      if (!result.user) {
        setError('Login failed: No user returned');
        return;
      }

      // Check if user has admin role
      const hasAdminRole = await adminAuth.checkAdminRole(result.user.id);
      
      if (!hasAdminRole) {
        setError('Access denied: Admin privileges required');
        return;
      }

      const user: UnifiedUser = {
        id: result.user.id,
        email: result.user.email || '',
        firstName: result.user.user_metadata?.firstName || '',
        lastName: result.user.user_metadata?.lastName || '',
        roles: ['admin'],
        isEmailVerified: result.user.email_confirmed_at != null,
        isActive: true,
        createdAt: new Date(result.user.created_at),
        lastLoginAt: new Date(),
        loginProvider: 'email'
      };

      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdminAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await adminAuth.signUp(
        credentials.email,
        credentials.password,
        'LocalPlus',
        'Administrator'
      );

      if (!result.user) {
        setError('Account creation failed: No user returned');
        return;
      }

      const user: UnifiedUser = {
        id: result.user.id,
        email: result.user.email || '',
        firstName: 'LocalPlus',
        lastName: 'Administrator',
        roles: ['admin'],
        isEmailVerified: result.user.email_confirmed_at != null,
        isActive: true,
        createdAt: new Date(result.user.created_at),
        lastLoginAt: new Date(),
        loginProvider: 'email'
      };

      console.log('✅ Admin account created:', user.email);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-2xl">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            LocalPlus Admin
          </h1>
          <p className="text-gray-300">
            Secure access to dashboard
          </p>
          <p className="text-purple-300 text-sm mt-1">
            🔄 Now using Unified Authentication
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center text-gray-200">
                <input
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 bg-white/10"
                />
                <span className="ml-2 text-sm">Keep me signed in</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>

            {/* Create Admin Account Button */}
            <button
              type="button"
              onClick={handleCreateAdminAccount}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Create Admin Account
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-200 font-medium mb-2">Unified Auth Credentials:</h4>
            <div className="text-sm text-blue-100 space-y-1">
              <div><strong>Test Admin:</strong> admin@localplus.com / admin123</div>
              <div><strong>Partner:</strong> shannon@localplus.com / testpass123</div>
              <div className="text-xs text-blue-200 mt-2">
                ✨ Same login works across all LocalPlus apps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 