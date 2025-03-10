// Import the mock services for development
import { 
  mockRequestMagicLink, 
  mockVerifyToken, 
  mockGetCurrentUser, 
  mockSignOut,
  mockUpdateUserProfile
} from './mockAuthService';

// Import the real auth client for production
import { authClient } from './authClient';

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
      // Use real API implementation with the secure authClient
      try {
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: callbackURL || '/main'
        });
        
        if (error) {
          throw new Error(error.message);
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
      // Use real API implementation with the secure authClient
      try {
        const { data, error } = await authClient.magicLink.verify({
          query: { token }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return { success: true, user: data?.user };
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
      // Use real API implementation with the secure authClient
      try {
        const { data, error } = await authClient.getUser();
        
        if (error) {
          throw new Error(error.message);
        }
        
        return { user: data?.user || null };
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
      // Use real API implementation with the secure authClient
      try {
        const { error } = await authClient.signOut();
        
        if (error) {
          throw new Error(error.message);
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
      // Use real API implementation with the secure authClient
      try {
        // Note: The actual endpoint and method may vary depending on your backend API
        // This is an example of how it might be implemented
        const { data: responseData, error } = await authClient.request({
          method: 'PUT',
          url: `/users/${userId}/profile`,
          body: data
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return { success: true, user: responseData?.user };
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