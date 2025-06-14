import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, RegisterCredentials } from '../types';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'INIT_AUTH'; payload: { user: User | null; isLoading: boolean } };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      };
    
    case 'INIT_AUTH':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: action.payload.isLoading
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

function mapSupabaseUserToAppUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    dateOfBirth: undefined,
    gender: 'prefer_not_to_say',
    location: undefined,
    preferences: {
      language: 'en',
      currency: 'THB',
      notifications: {
        email: true,
        push: true,
        sms: false,
        deals: true,
        events: true,
        reminders: true,
      },
      dietary: {
        vegetarian: false,
        vegan: false,
        halal: false,
        glutenFree: false,
        allergies: [],
      },
      cuisinePreferences: [],
      priceRange: { min: 100, max: 1000 },
      favoriteDistricts: [],
    },
    accountSettings: {
      privacy: {
        profileVisibility: 'public',
        showActivityStatus: true,
        allowLocationTracking: false,
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
      },
    },
    isEmailVerified: !!supabaseUser.email_confirmed_at,
    isPhoneVerified: false,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    loginProvider: 'email',
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await supabaseAuthService.getCurrentUser();
        dispatch({ type: 'INIT_AUTH', payload: { user: user ? mapSupabaseUserToAppUser(user) : null, isLoading: false } });
      } catch (error) {
        dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      const user = await supabaseAuthService.signIn(credentials.email, credentials.password);
      dispatch({ type: 'SET_USER', payload: mapSupabaseUserToAppUser(user) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      const user = await supabaseAuthService.signUp(credentials.email, credentials.password);
      dispatch({ type: 'SET_USER', payload: mapSupabaseUserToAppUser(user) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  const logout = (): void => {
    supabaseAuthService.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    resetPassword: async () => { throw new Error('Not implemented'); },
    updateProfile: async () => { throw new Error('Not implemented'); },
    deleteAccount: async () => { throw new Error('Not implemented'); },
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 