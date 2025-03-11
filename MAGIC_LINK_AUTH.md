# Magic Link Authentication for LIFT Frontend

This document explains the Magic Link authentication workflow implemented in the LIFT frontend application, detailing the processes, components, and backend requirements.

## Overview

Magic Link authentication is a passwordless authentication method where users receive a unique, time-limited URL (the "magic link") via email. Clicking this link authenticates the user without requiring them to remember or enter a password. This approach enhances security while simplifying the user experience.

## Frontend Implementation

### Components Structure

The LIFT frontend uses the following components for Magic Link authentication:

1. **AuthProvider** (`AuthProvider.tsx`)

   - Context provider that manages authentication state
   - Exposes methods for requesting magic links, verifying authentication, and signing out
   - Handles session persistence

2. **AuthContext** (`AuthContext.ts`)

   - Defines the shape of authentication context
   - Provides access to authentication state and methods

3. **MagicLinkForm** (`MagicLinkForm.tsx`)

   - UI component for requesting a magic link
   - Handles email validation
   - Shows success feedback to users

4. **LoginPage** (`LoginPage.tsx`)

   - Container for the authentication flow
   - Handles token verification from URL
   - Implements profile completion after authentication

5. **authApi.ts**

   - API client for interacting with the authentication endpoints
   - Implements both mock and real API services
   - Handles token verification logic

6. **authUtils.ts**
   - Utility functions for extracting and verifying tokens from URL
   - Manages URL cleanup after verification

### Authentication Flow

The Magic Link authentication flow in the LIFT frontend consists of the following steps:

1. **Request Magic Link**

   - User enters their email in the `MagicLinkForm`
   - Email is validated for format correctness
   - API request is sent to the backend via `requestMagicLink` function
   - User is shown confirmation that the email has been sent

2. **Email Receipt and Link Click**

   - User receives the Magic Link email
   - Email contains a unique URL with a token parameter
   - User clicks the link, opening the application with the token in the URL

3. **Token Verification**

   - `LoginPage` component detects the token in the URL
   - `handleMagicLinkVerification` function is called to verify the token
   - API request is sent to the backend via `verifyMagicLink` function
   - URL is cleaned up by removing the token

4. **Authentication State Update**

   - Upon successful verification, `AuthProvider` updates the authentication state
   - User information is stored in the auth context
   - Components subscribed to the auth context are notified of the change

5. **Profile Completion**

   - After authentication, user is prompted to complete their profile
   - Basic information is collected (name, manager's name)
   - Information is stored in the application state

6. **Session Management**
   - Session is maintained through cookies (when using real API)
   - `AuthProvider` checks for existing sessions on load
   - Handles sign out process when requested

## Backend Requirements

For the Magic Link authentication to work with a real backend, the following API endpoints and behaviors are required:

### 1. Request Magic Link Endpoint

- **URL**: `/auth/signin/magic-link`
- **Method**: POST
- **Content-Type**: application/json
- **Credentials**: include
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "callbackURL": "/" // Optional, path to redirect after authentication (root path in this app)
  }
  ```
- **Expected Response**:

  - Success: HTTP 200 with confirmation message
  - Error: Appropriate HTTP error code with message

- **Backend Behavior**:
  - Generate a secure, time-limited token (typically 5-10 minutes)
  - Associate token with the provided email
  - Send an email to the user containing a link to the application with the token as a URL parameter
  - The email link should be formatted as: `https://your-app-url.com?token=GENERATED_TOKEN`
  - Note: While the frontend code uses `/main` in some places, the actual app structure routes to the root path `/` after authentication, as shown in the App.tsx component

### 2. Verify Token Endpoint

- **URL**: `/auth/verify`
- **Method**: GET
- **Content-Type**: application/json
- **Credentials**: include
- **Query Parameters**:
  - `token`: The token to verify
- **Expected Response**:

  - Success: HTTP 200 with user data:
    ```json
    {
      "user": {
        "id": "user_id_string",
        "email": "user@example.com",
        "username": "optional_username"
      }
    }
    ```
  - Error: Appropriate HTTP error code with message

- **Backend Behavior**:
  - Validate the token (check expiration, integrity)
  - If valid, create or retrieve the user associated with the email
  - Set authentication cookies or session information
  - Return user data

### 3. Get Current User Endpoint

- **URL**: `/auth/user`
- **Method**: GET
- **Content-Type**: application/json
- **Credentials**: include
- **Expected Response**:

  - Success: HTTP 200 with user data:
    ```json
    {
      "user": {
        "id": "user_id_string",
        "email": "user@example.com",
        "username": "optional_username"
      }
    }
    ```
  - Not authenticated: HTTP 401 or 404

- **Backend Behavior**:
  - Check for valid session or authentication cookies
  - If authenticated, return the current user's data
  - Otherwise, indicate that no user is authenticated

### 4. Sign Out Endpoint

- **URL**: `/auth/signout`
- **Method**: POST
- **Content-Type**: application/json
- **Credentials**: include
- **Expected Response**:

  - Success: HTTP 200 with confirmation
  - Error: Appropriate HTTP error code

- **Backend Behavior**:
  - Clear authentication cookies or invalidate the session
  - Perform any necessary cleanup

## Security Considerations

1. **Token Security**:

   - Tokens should be cryptographically secure and time-limited (typically 5-10 minutes)
   - Tokens should be single-use and invalidated after use
   - Token validation should include protection against replay attacks

2. **Email Security**:

   - Email sending should be configured with proper SPF, DKIM, and DMARC to prevent spoofing
   - Emails should clearly identify the sender and purpose

3. **Session Management**:

   - Use secure, HTTP-only cookies for session management
   - Implement CSRF protection for API requests
   - Set appropriate expiration for sessions

4. **Rate Limiting**:
   - Implement rate limiting on the magic link request endpoint to prevent abuse
   - Consider IP-based and email-based rate limiting

## Development and Testing

The LIFT frontend includes a mock authentication service for development purposes. To use it:

1. Set the environment variable `VITE_USE_MOCK_AUTH=true` in your `.env.development` file
2. When testing, any email will work for requesting a magic link
3. The mock service simulates the entire authentication flow without requiring a backend

## Troubleshooting

Common issues with Magic Link authentication:

1. **Magic link emails not receiving**: Check spam folders, email deliverability settings
2. **Token expiration**: Ensure users know tokens expire quickly and may need to request a new one
3. **Cross-device usage**: If a user opens the magic link on a different device than requested, ensure the auth state is properly managed

## Conclusion

Magic Link authentication provides a secure and user-friendly authentication method for the LIFT application. The passwordless approach removes friction from the login process while maintaining high security standards.

When implementing a backend for this system, ensure all the required endpoints are properly secured and follow the expected request/response formats described in this document.
