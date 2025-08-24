// [2024-12-19 22:30] - Partner login form with development bypass for email confirmation
import React, { useState } from 'react';
import { Button, FormInput, FormSelect } from '../../shared/components';
import { supabase } from '../../shared/services/supabase';
import { businessService } from '../../shared/services/businessService';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('shannon@localplus.com');
  const [password, setPassword] = useState('testpass123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]); // [2024-07-08] - For business selection
  const [selectedBusiness, setSelectedBusiness] = useState(''); // [2024-07-08] - Selected business for signup

  React.useEffect(() => {
    // [2024-12-19] - Fetch businesses for signup using business service
    const fetchBusinesses = async () => {
      try {
        console.log('🔄 Fetching businesses for signup...');
        const businessData = await businessService.getBusinessesForSignup();
        
        if (businessData.length > 0) {
          console.log(`✅ Successfully fetched ${businessData.length} businesses for signup`);
          setBusinesses(businessData);
        } else {
          console.log('⚠️ No businesses available for signup');
          setBusinesses([]);
        }
      } catch (err) {
        console.error('❌ Error fetching businesses:', err);
        setBusinesses([]);
      }
    };
    fetchBusinesses();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        // Handle email not confirmed error in development
        if (signInError.message.includes('Email not confirmed')) {
          setError('Email not confirmed. For development, please check your email or wait for confirmation.');
          
          // Try to resend confirmation email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email
          });
          
          if (!resendError) {
            setError('Email not confirmed. Confirmation email has been resent to ' + email);
          }
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        console.log('✅ Partner login successful:', data.user.email);
        onLoginSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');
    if (!selectedBusiness) {
      setError('Please select a business to link your account.');
      setLoading(false);
      return;
    }
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: 'Shannon',
            lastName: 'Restaurant Owner',
            phone: '+66-89-123-4567',
            role: 'partner'
          }
        }
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.user) {
        console.log('✅ Partner account created:', data.user.email);
        try {
          await supabase.from('partners').insert({
            user_id: data.user.id,
            business_id: selectedBusiness,
            role: 'owner',
            is_active: true,
            accepted_at: new Date().toISOString()
          });
          console.log('✅ User linked to business:', selectedBusiness);
        } catch (linkErr) {
          console.error('Error linking user to business:', linkErr);
        }
        
        // [2024-07-14] - Handle email confirmation properly
        if (data.user.email_confirmed_at) {
          // Email already confirmed (development mode)
          setError('Account created! You can now sign in.');
          onLoginSuccess();
        } else {
          // Email confirmation required
          setError('Account created! Please check your email to confirm your account before signing in.');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Account creation failed';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Development bypass function
  const handleDevelopmentBypass = async () => {
    setLoading(true);
    setError('');

    try {
      // For development, we'll create a mock user session
      console.log('🔧 Development bypass activated');
      
      // Store mock user data with proper UUID format
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000', // [2024-07-08] - Fixed: Use proper UUID format
        email: email,
        firstName: 'Shannon',
        lastName: 'Restaurant Owner',
        role: 'partner'
      };
      
      localStorage.setItem('partner_dev_user', JSON.stringify(mockUser));
      
      console.log('✅ Development bypass successful');
      onLoginSuccess();
    } catch (err) {
      setError('Development bypass failed');
      console.error('Bypass error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LP</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Partner Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your restaurant bookings
          </p>
          <p className="mt-1 text-center text-xs text-blue-600">
            🔄 Direct Supabase Authentication
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {/* [2024-07-08] - Business selector for signup */}
            <FormSelect
              label="Select Business"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              options={businesses.map(b => ({ value: b.id, label: b.name }))}
              required
              placeholder={businesses.length === 0 ? 'No businesses available' : 'Choose a business'}
              disabled={businesses.length === 0}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              theme="blue"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
            <Button
              type="button"
              theme="gray"
              className="w-full"
              onClick={handleCreateAccount}
              isLoading={loading}
              disabled={businesses.length === 0}
            >
              Create Partner Account
            </Button>
            
            <Button
              type="button"
              theme="red"
              className="w-full"
              onClick={handleDevelopmentBypass}
              isLoading={loading}
            >
              🔧 Development Bypass
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Test credentials: shannon@localplus.com / testpass123
            </p>
            <p className="text-xs text-red-600 mt-1">
              ⚠️ Use Development Bypass if email not confirmed
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}; 