import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

// Get API base URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL + "/auth";

// Create the authentication client with magic link plugin
export const authClient = createAuthClient({
  plugins: [
    magicLinkClient()
  ],
  baseURL: apiBaseUrl
});