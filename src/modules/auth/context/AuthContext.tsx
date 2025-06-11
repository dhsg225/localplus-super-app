import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/authService';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        try {
          const isValid = await authService.validateToken(token);
          if (isValid) {
            dispatch({ type: 'INIT_AUTH', payload: { user: storedUser, isLoading: false } });
          } else {
            authService.logout();
            dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
          }
        } catch (error) {
          authService.logout();
          dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
        }
      } else {
        dispatch({ type: 'INIT_AUTH', payload: { user: null, isLoading: false } });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await authService.login(credentials);
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await authService.register(credentials);
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await authService.resetPassword(email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Password reset failed' });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const updatedUser = await authService.updateProfile(state.user.id, updates);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Profile update failed' });
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // In real implementation, call API to delete account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Account deletion failed' });
      throw error;
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
    resetPassword,
    updateProfile,
    deleteAccount,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 