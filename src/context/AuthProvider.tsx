import React, { useEffect, useReducer } from 'react';
import { AuthContext, initialAuthState } from './AuthContext';
import { 
  getCurrentUser, 
  requestMagicLink as apiRequestMagicLink, 
  signOut as apiSignOut,
  updateUserProfile 
} from '../api/authApi';

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { id: string; email: string; username?: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' };

const authReducer = (state = initialAuthState, action: AuthAction) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Check for user session on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch({ type: 'AUTH_LOADING' });
      try {
        const { user, error } = await getCurrentUser();
        
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: error || 'No user found' });
        }
      } catch (error) {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: error instanceof Error ? error.message : 'Authentication failed' 
        });
      }
    };

    checkAuthStatus();
    
    // Optional: setup event listeners for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth' && e.newValue) {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle magic link request
  const requestMagicLink = async (email: string, callbackURL?: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    const result = await apiRequestMagicLink(email, callbackURL);
    
    if (!result.success) {
      dispatch({ type: 'AUTH_FAILURE', payload: result.error || 'Failed to send magic link' });
    }
    
    return result;
  };

  // Handle sign out
  const signOut = async () => {
    dispatch({ type: 'AUTH_LOADING' });
    const result = await apiSignOut();
    
    if (result.success) {
      dispatch({ type: 'AUTH_LOGOUT' });
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: result.error || 'Failed to sign out' });
    }
    
    return result;
  };

  // Handle profile updates
  const updateProfile = async (data: { username?: string }) => {
    if (!state.user?.id) {
      return { 
        success: false, 
        error: 'No authenticated user'
      };
    }
    
    dispatch({ type: 'AUTH_LOADING' });
    const result = await updateUserProfile(state.user.id, data);
    
    if (result.success && result.user) {
      dispatch({ type: 'AUTH_SUCCESS', payload: result.user });
      return { success: true };
    } else {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: result.error || 'Failed to update profile'
      });
      return { 
        success: false, 
        error: result.error 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ state, requestMagicLink, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};