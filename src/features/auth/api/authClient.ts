import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

// Get API base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL + "/auth";

// Create the authentication client with magic link plugin and secure configuration
export const authClient = createAuthClient({
  plugins: [
    magicLinkClient()
  ],
  baseURL: apiBaseUrl,
  // Configure secure options for production
  cookieOptions: {
    // HttpOnly cookies are not accessible via JavaScript
    httpOnly: true,
    // Secure cookies are only sent over HTTPS
    secure: import.meta.env.PROD, 
    // SameSite helps prevent CSRF attacks
    sameSite: 'lax',
    // Domain and path ensure cookies are only sent to the correct endpoints
    path: '/',
  },
  // Response handling options
  responseOptions: {
    // Handle errors consistently
    handleErrors: true
  }
});