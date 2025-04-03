import { verifyMagicLink } from '../api/authApi';

/**
 * Extract and verify magic link token from URL
 * @returns Promise that resolves with verification result
 */
export const handleMagicLinkVerification = async () => {
  // Get URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  
  // If no token, return early
  if (!token) {
    return { success: false, error: 'No authentication token found' };
  }
  
  console.log('Magic link token found in URL, verifying:', token);
  
  // Verify the token
  const result = await verifyMagicLink(token);
  
  console.log('Token verification result:', result);
  
  // If verification successful, clean up URL params
  if (result.success) {
    console.log('Token verified successfully, user:', result.user);
    
    // Remove token from URL without page reload
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
    
    // Notify other tabs about auth state change
    window.localStorage.setItem('auth', 'updated');
    window.localStorage.removeItem('auth');
    
    // Dispatch magicLinkVerified event
    window.dispatchEvent(new CustomEvent('magicLinkVerified', { 
      detail: { user: result.user }
    }));

    // Also dispatch authStateChanged to update entries context
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
      detail: { user: result.user }
    }));
  }
  
  return result;
};