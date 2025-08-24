// [2024-12-19 23:15] - Updated to use unified authentication system exclusively
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, RegisterCredentials, UserPreferences } from '../types';
import { authService } from '@shared/services/authService';
import type { UnifiedUser } from '@shared/services/authService';

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

// [2024-12-19 22:45] - Map unified user to consumer app user format
function mapUnifiedUserToAppUser(unifiedUser: UnifiedUser): User {
  const defaultPreferences = {
    language: 'en' as 'en' | 'th',
    currency: 'THB' as 'THB' | 'USD',
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
  };

  return {
    id: unifiedUser.id,
    email: unifiedUser.email,
    firstName: unifiedUser.firstName,
    lastName: unifiedUser.lastName,
    phone: unifiedUser.phone || '',
    avatar: unifiedUser.avatar || '',
    dateOfBirth: undefined,
    gender: 'prefer_not_to_say',
    location: unifiedUser.consumerProfile?.location,
    preferences: unifiedUser.consumerProfile?.preferences || defaultPreferences,
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
    isEmailVerified: unifiedUser.isEmailVerified,
    isPhoneVerified: false,
    createdAt: unifiedUser.createdAt,
    lastLoginAt: unifiedUser.lastLoginAt,
    loginProvider: unifiedUser.loginProvider,
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        dispatch({ 
          type: 'INIT_AUTH', 
          payload: { 
            user: user ? mapUnifiedUserToAppUser(user) : null, 
            isLoading: false 
          } 
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await authService.signIn({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });
      
      dispatch({ type: 'SET_USER', payload: mapUnifiedUserToAppUser(user) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await authService.signUp({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        phone: credentials.phone,
        role: 'consumer'
      });
      
      dispatch({ type: 'SET_USER', payload: mapUnifiedUserToAppUser(user) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
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
    resetPassword: async () => { throw new Error('Not implemented yet in unified auth'); },
    updateProfile: async () => { throw new Error('Not implemented yet in unified auth'); },
    deleteAccount: async () => { throw new Error('Not implemented yet in unified auth'); },
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