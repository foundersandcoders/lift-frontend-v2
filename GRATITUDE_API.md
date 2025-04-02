# Gratitude API

## Overview

The Gratitude feature allows users to send appreciation messages to others when marking actions as completed. This functionality enhances the collaborative nature of the application by enabling users to acknowledge contributions and express thanks to colleagues, managers, or team members.

## API Endpoints

### 1. Send Gratitude Email Endpoint

- **URL**: `/api/gratitude/send`
- **Method**: POST
- **Content-Type**: application/json
- **Credentials**: include
- **Request Body**:
  ```json
  {
    "statementId": "string", // ID of the statement containing the action
    "actionId": "string", // ID of the specific action
    "message": "string", // The gratitude message to send
    "recipientEmail": "string", // Email address of the recipient
    "recipientName": "string" // Optional name of the recipient
  }
  ```
- **Expected Response**:

  - Success:
    ```json
    {
      "success": true,
      "message": "Gratitude email sent successfully",
      "id": "string" // Unique ID for the sent message (for tracking)
    }
    ```
  - Error:
    ```json
    {
      "success": false,
      "message": "Error description"
    }
    ```

- **Backend Behavior**:
  - Validate all inputs, especially the email format
  - Compose an email using an appropriate template
  - Include the gratitude message in the email
  - Send the email to the recipient
  - Return success confirmation with a unique ID
  - Handle failures gracefully with meaningful error messages

### 2. Mark Gratitude Sent Endpoint

- **URL**: `/api/gratitude/mark/{statementId}/{actionId}`
- **Method**: POST
- **Content-Type**: application/json
- **Credentials**: include
- **URL Parameters**:
  - `statementId`: The ID of the statement
  - `actionId`: The ID of the action
- **Request Body**:
  ```json
  {
    "message": "string" // The gratitude message that was sent
  }
  ```
- **Expected Response**:

  - Success: Return the updated Action object:
    ```json
    {
      "id": "string", // Action ID
      "creationDate": "string", // ISO date string
      "byDate": "string", // ISO date string (can be empty)
      "action": "string", // Action text
      "completed": true, // Should be true for gratitude to be sent
      "gratitudeSent": true, // Must be set to true
      "gratitudeMessage": "string", // The message that was sent
      "gratitudeSentDate": "string" // Current timestamp in ISO format
    }
    ```
  - Error:
    ```json
    {
      "success": false,
      "message": "Error description"
    }
    ```

- **Backend Behavior**:
  - Verify the statement and action exist
  - Update the action record with gratitude information
  - Set the `gratitudeSent` flag to true
  - Store the gratitude message
  - Record the current timestamp as the sent date
  - Return the complete updated action object

## Feature Flow

The Gratitude feature flow in the LIFT frontend consists of the following steps:

1. **Initiating Gratitude**

   - User completes an action
   - User clicks the dropdown menu for the action
   - User selects "Send gratitude" option
   - System displays the GratitudeModal

2. **Composing the Message**

   - User enters recipient email
   - User enters gratitude message
   - System validates inputs
   - User submits the form

3. **Sending the Gratitude**

   - System calls the `/api/gratitude/send` endpoint
   - Email is sent to the recipient
   - System calls the `/api/gratitude/mark/{statementId}/{actionId}` endpoint
   - Action is updated with gratitude information

4. **Visual Feedback**
   - System displays success confirmation
   - Action UI updates to show gratitude was sent
   - Dropdown menu options are updated
   - Tooltips display gratitude information

## Mock Implementation

For development and testing purposes, the frontend includes a mock implementation:

- Controlled by the environment variable `VITE_MOCK_EMAIL_SENDING`
- When enabled, simulates the API responses without real backend
- Logs details to console for debugging
- Includes realistic delays to simulate network latency

To use the mock implementation:

1. Set `VITE_MOCK_EMAIL_SENDING=true` in your environment
2. The frontend will use the mock implementations in `gratitudeApi.ts`
3. No actual emails will be sent, but the UI will behave as if they were

## Security Considerations

When implementing the Gratitude API endpoints, consider the following security aspects:

1. **Input Validation**

   - Validate email formats
   - Sanitize message content to prevent injection
   - Validate that IDs exist and belong to the requesting user

2. **Authorization**

   - Ensure users can only send gratitude for actions they have access to
   - Implement proper authentication checks
   - Verify user permissions before processing requests

3. **Rate Limiting**

   - Implement rate limiting to prevent abuse
   - Consider limits like maximum 10 emails per hour per user
   - Add exponential backoff for repeated failures

4. **Email Security**

   - Ensure proper email headers
   - Prevent header injection
   - Include unsubscribe options
   - Follow email sending best practices

5. **Logging**
   - Log all gratitude emails sent for auditing
   - Track failures and errors
   - Monitor for unusual patterns

## Testing the Integration

When testing the integration between frontend and backend:

1. **Verify Email Sending**

   - Test with valid and invalid email addresses
   - Confirm emails are received by recipients
   - Check email content and formatting

2. **Test State Updates**

   - Ensure action records are properly updated
   - Verify timestamps are accurate
   - Confirm UI updates correctly after sending

3. **Error Handling**

   - Test with various error scenarios
   - Verify user-friendly error messages
   - Ensure system recovers gracefully from failures

4. **Edge Cases**
   - Test with very long messages
   - Test with special characters
   - Test with high volume of requests

## Conclusion

The Gratitude API enhances the LIFT application by enabling users to express appreciation for completed actions. When implemented correctly, it creates a positive feedback loop within teams and reinforces collaborative behaviors.

This document provides a comprehensive guide for backend developers to implement the required endpoints and behaviors to support the Gratitude feature in the LIFT frontend application.
