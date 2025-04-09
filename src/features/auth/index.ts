/**
 * Barrel file for auth feature
 * 
 * Provides unified access to authentication-related functionality
 * including context, providers, hooks, and components.
 */

// Re-export context and provider
export { AuthContext } from './context/AuthContext';
export { AuthProvider } from './context/AuthProvider';

// Re-export hooks
export { useAuth } from './api/hooks';

// Re-export utilities
export { handleMagicLinkVerification } from './utils/authUtils';

// Re-export components as needed
export { default as LoginPage } from './components/LoginPage';
export { default as MagicLinkForm } from './components/MagicLinkForm';