import { Email } from '../../../types/emails';

// Check if we should use mock implementation
const shouldUseMock = () => {
  return (
    import.meta.env.VITE_MOCK_EMAIL_SENDING === 'true' ||
    typeof import.meta.env.VITE_MOCK_EMAIL_SENDING === 'undefined'
  );
};

// Mock implementation of sending email
const mockSendEmail = async (email: Email) => {
  console.log('MOCK: Sending email with:', email);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock success response
  return {
    success: true,
    message: 'Email sent successfully (mock)',
    id: `mock-email-${Date.now()}`,
  };
};

// Send email via backend API or mock
export async function sendEmail(email: Email) {
  // Use mock implementation if enabled
  if (shouldUseMock()) {
    return mockSendEmail(email);
  }

  // Real implementation
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Mock implementation of sharing statements
const mockShareStatements = async (recipientEmail: string) => {
  console.log('MOCK: Sharing statements from:', recipientEmail);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock success response
  return {
    success: true,
    message: 'Statements shared successfully (mock)',
    id: `mock-share-${Date.now()}`,
  };
};

// Share statements via backend API or mock
export async function shareStatements(recipientEmail: string) {
  // Use mock implementation if enabled
  if (shouldUseMock()) {
    return mockShareStatements(recipientEmail);
  }

  // Real implementation
  try {
    const response = await fetch('/api/email/share-statements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipientEmail }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to share statements');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sharing statements:', error);
    throw error;
  }
}
