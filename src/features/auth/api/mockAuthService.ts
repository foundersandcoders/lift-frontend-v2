// Load any saved mock users from localStorage
const getSavedMockUsers = (): Record<string, {
  id: string;
  email: string;
  username?: string;
}> => {
  try {
    const savedUsers = localStorage.getItem('mockUsers');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
  } catch (error) {
    console.error('Error loading saved mock users:', error);
  }
  return {};
};

// Mock user data store - in a real app, this would be in the backend
const mockUsers: Record<string, {
  id: string;
  email: string;
  username?: string;
}> = getSavedMockUsers();

// Mock tokens store - maps tokens to user emails
const mockTokens: Record<string, {
  email: string;
  expires: number;
}> = {};

// Initialize current session from localStorage if available
const getInitialSession = () => {
  try {
    const savedSession = localStorage.getItem('mockAuthSession');
    if (savedSession) {
      return { user: JSON.parse(savedSession) };
    }
  } catch (error) {
    console.error('Error loading saved session:', error);
  }
  return { user: null };
};

// Current user session - initialize from localStorage if available
const currentSession: {
  user: { id: string; email: string; username?: string } | null;
} = getInitialSession();

// Helper to generate a random token
const generateToken = (length = 20) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Mock implementation of the magic link request
export const mockRequestMagicLink = async (email: string): Promise<{ 
  data: { success: boolean } | null; 
  error: { message: string } | null 
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Generate a token that expires in 5 minutes
    const token = generateToken();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    // Store the token
    mockTokens[token] = { email, expires };
    
    // Check if user exists, if not, create one
    if (!mockUsers[email]) {
      mockUsers[email] = {
        id: generateToken(8),
        email,
      };
      
      // Save updated users to localStorage
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
    
    // In a real implementation, this would send an email
    console.log(`MOCK: Magic link for ${email}: ${window.location.origin}?token=${token}`);
    
    // Show "mock email sent" notification
    const mockEmailEvent = new CustomEvent('mockMagicLinkSent', { 
      detail: { 
        email,
        token,
        mockLink: `${window.location.origin}?token=${token}`
      }
    });
    window.dispatchEvent(mockEmailEvent);
    
    // For testing, automatically set the token in URL after a delay
    // This simulates the user clicking the link from their email
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('token', token);
      window.history.pushState({}, '', url.toString());
      
      // Show "magic link clicked" notification
      const mockClickEvent = new CustomEvent('mockMagicLinkClicked');
      window.dispatchEvent(mockClickEvent);
      
      // Trigger verification (since pushState doesn't trigger popstate)
      const verifyEvent = new Event('verifyMagicLink');
      window.dispatchEvent(verifyEvent);
    }, 3000);
    
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error('Mock auth error:', error);
    return { 
      data: null, 
      error: { message: 'Failed to send magic link' } 
    };
  }
};

// Mock implementation of token verification
export const mockVerifyToken = async (token: string): Promise<{ 
  data: { user: { id: string; email: string; username?: string }; session: { expires: string } } | null; 
  error: { message: string } | null 
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Check if token exists and hasn't expired
    const tokenData = mockTokens[token];
    if (!tokenData) {
      return { 
        data: null, 
        error: { message: 'Invalid token' } 
      };
    }
    
    if (tokenData.expires < Date.now()) {
      delete mockTokens[token];
      return { 
        data: null, 
        error: { message: 'Token expired' } 
      };
    }
    
    // Get the user associated with this token
    const user = mockUsers[tokenData.email];
    
    // Set the user as the current user
    currentSession.user = user;
    
    // Save user to localStorage for persistent sessions
    localStorage.setItem('mockAuthSession', JSON.stringify(user));
    
    // Clean up the used token
    delete mockTokens[token];
    
    return { 
      data: { 
        user,
        session: { 
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
        } 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Mock verification error:', error);
    return { 
      data: null, 
      error: { message: 'Failed to verify token' } 
    };
  }
};

// Mock implementation of get current user
export const mockGetCurrentUser = async (): Promise<{ 
  data: { user: { id: string; email: string; username?: string } | null } | null; 
  error: { message: string } | null 
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { 
    data: { user: currentSession.user }, 
    error: null 
  };
};

// Mock implementation of updating user profile
export const mockUpdateUserProfile = async (
  userId: string, 
  data: { username?: string }
): Promise<{
  data: { user: { id: string; email: string; username?: string } } | null;
  error: { message: string } | null;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    // Find the user by ID
    const userEmail = Object.keys(mockUsers).find(
      email => mockUsers[email].id === userId
    );
    
    if (!userEmail || !mockUsers[userEmail]) {
      return {
        data: null,
        error: { message: 'User not found' }
      };
    }
    
    // Update the user's profile
    if (data.username !== undefined) {
      mockUsers[userEmail].username = data.username;
    }
    
    // If this is the current user, update the current session
    if (currentSession.user && currentSession.user.id === userId) {
      currentSession.user = { ...mockUsers[userEmail] };
      localStorage.setItem('mockAuthSession', JSON.stringify(currentSession.user));
    }
    
    // Save updated users to localStorage
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    
    return {
      data: { user: mockUsers[userEmail] },
      error: null
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      data: null,
      error: { message: 'Failed to update user profile' }
    };
  }
};

// Mock implementation of sign out
export const mockSignOut = async (): Promise<{ 
  data: { success: boolean } | null; 
  error: { message: string } | null 
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Clear the current session
  currentSession.user = null;
  
  // Remove user from localStorage
  localStorage.removeItem('mockAuthSession');
  
  return { 
    data: { success: true }, 
    error: null 
  };
};