// Import the mock services for development
import { 
  mockRequestMagicLink, 
  mockVerifyToken, 
  mockGetCurrentUser, 
  mockSignOut,
  mockUpdateUserProfile
} from './mockAuthService';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Check if we should use mock services based on the environment variable
// Use mocks only when explicitly set to true, otherwise use real services
// This way production doesn't need to set this variable at all
const USE_MOCK_SERVICES = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Log a message indicating whether we're using mock services or not
if (import.meta.env.DEV) {
  console.log(`Auth API: ${USE_MOCK_SERVICES ? 'Using MOCK services' : 'Using REAL API services'}`);
  if (!import.meta.env.VITE_USE_MOCK_AUTH) {
    console.log('Note: Set VITE_USE_MOCK_AUTH=true in .env.development to use mock authentication');
  }
}

// Function to request a magic link
export const requestMagicLink = async (email: string, callbackURL?: string) => {
  try {
    if (USE_MOCK_SERVICES) {
      // Use mock implementation
      const { error } = await mockRequestMagicLink(email);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } else {
      // Use real API implementation with fetch
      try {
        // Direct API call to request magic link
        const response = await fetch(`${API_BASE_URL}/auth/signin/magic-link`, {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            callbackURL: callbackURL || '/main'
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to request magic link: ${response.statusText}`);
        }
        
        return { success: true };
      } catch (apiError) {
        console.error('API error requesting magic link:', apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error requesting magic link:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send magic link' 
    };
  }
};

// Function to verify a magic link token
export const verifyMagicLink = async (token: string) => {
  try {
    if (USE_MOCK_SERVICES) {
      // Use mock implementation
      const { data, error } = await mockVerifyToken(token);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true, user: data?.user };
    } else {
      // Use real API implementation with fetch
      try {
        // Direct API call to verify magic link token
        const response = await fetch(`${API_BASE_URL}/auth/verify?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to verify token: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { success: true, user: data.user };
      } catch (apiError) {
        console.error('API error verifying token:', apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to verify magic link' 
    };
  }
};

// Function to get the current user
export const getCurrentUser = async (): Promise<{ user: AuthUser | null; error?: string }> => {
  try {
    if (USE_MOCK_SERVICES) {
      // Use mock implementation
      const { data, error } = await mockGetCurrentUser();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { user: data?.user || null };
    } else {
      // Use real API implementation with fetch
      try {
        // Direct API call to get current user
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to get user: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { user: data.user || null };
      } catch (apiError) {
        console.error('API error getting current user:', apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Failed to get current user' 
    };
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    if (USE_MOCK_SERVICES) {
      // Use mock implementation
      const { error } = await mockSignOut();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true };
    } else {
      // Use real API implementation with fetch
      try {
        // Direct API call to sign out
        const response = await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to sign out: ${response.statusText}`);
        }
        
        return { success: true };
      } catch (apiError) {
        console.error('API error signing out:', apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error signing out:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to sign out' 
    };
  }
};

// Function to update the user's profile
export const updateUserProfile = async (userId: string, data: { username?: string }) => {
  try {
    if (USE_MOCK_SERVICES) {
      // Use mock implementation
      const { data: responseData, error } = await mockUpdateUserProfile(userId, data);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true, user: responseData?.user };
    } else {
      // Use real API implementation with fetch
      try {
        // Direct API call to update user profile
        const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/profile`, {
          method: 'PUT',
          credentials: 'include', // Include cookies in the request
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update profile: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        return { success: true, user: responseData.user };
      } catch (apiError) {
        console.error('API error updating profile:', apiError);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    };
  }
};