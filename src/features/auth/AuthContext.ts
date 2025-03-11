import { createContext } from 'react';
import { AuthState } from './api/authApi';

// Initial auth state
export const initialAuthState: AuthState = {
  user: null,
  isLoading: true, // Start with loading state
  isAuthenticated: false,
  error: null
};

// Create context with the initial state
export const AuthContext = createContext<{
  state: AuthState;
  requestMagicLink: (email: string, callbackURL?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { username?: string }) => Promise<{ success: boolean; error?: string }>;
}>({
  state: initialAuthState,
  requestMagicLink: async () => ({ success: false, error: 'Not implemented' }),
  signOut: async () => ({ success: false, error: 'Not implemented' }),
  updateProfile: async () => ({ success: false, error: 'Not implemented' })
});