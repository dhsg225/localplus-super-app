import React, { useState } from 'react';
import { Button, FormInput } from '@shared/components';
import { authService } from '@shared/services/authService';

interface LoginFormProps {
  onLogin: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // [DEV BYPASS] For testing - create a dev user
      if (email === 'shannon.green.asia@gmail.com' && password === 'test123') {
        const devUser = {
          id: 'dev-user-123',
          email: 'shannon.green.asia@gmail.com',
          firstName: 'Shannon',
          lastName: 'Green',
          businessId: '550e8400-e29b-41d4-a716-446655440000'
        };
        localStorage.setItem('partner_dev_user', JSON.stringify(devUser));
        onLogin(devUser);
        return;
      }

      const { user, error } = await authService.signIn(email, password);
      if (error) {
        setError(error.message);
      } else if (user) {
        onLogin(user);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Partner Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your restaurant
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormInput
              label="Email address"
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
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
