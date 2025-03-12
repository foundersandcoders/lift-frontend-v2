import { Action } from "../../../types/entries";

interface GratitudeRequest {
  statementId: string;
  actionId: string;
  message: string;
  recipientEmail: string;
  recipientName?: string;
}

// Check if we should use mock implementation
const shouldUseMock = () => {
  return (
    import.meta.env.VITE_MOCK_EMAIL_SENDING === 'true' || 
    typeof import.meta.env.VITE_MOCK_EMAIL_SENDING === 'undefined'
  );
};

// Mock implementation of sending gratitude
const mockSendGratitude = async (request: GratitudeRequest) => {
  console.log('MOCK: Sending gratitude email with:', request);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock success response
  return {
    success: true,
    message: 'Gratitude email sent successfully (mock)',
    id: `mock-gratitude-${Date.now()}`
  };
};

// Mock implementation of marking gratitude as sent
const mockMarkGratitudeSent = async (statementId: string, actionId: string, message: string): Promise<Action> => {
  console.log('MOCK: Marking gratitude as sent for statement:', statementId, 'action:', actionId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a mock action with gratitude marked as sent
  return {
    id: actionId,
    creationDate: new Date().toISOString(),
    byDate: '',
    action: `Mock action for statement ${statementId}`,
    completed: true,
    gratitudeSent: true,
    gratitudeMessage: message,
    gratitudeSentDate: new Date().toISOString()
  };
};

// Send gratitude via backend API or mock
export async function sendGratitude(request: GratitudeRequest) {
  // Use mock implementation if enabled
  if (shouldUseMock()) {
    return mockSendGratitude(request);
  }
  
  // Real implementation
  try {
    const response = await fetch('/api/gratitude/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send gratitude');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error sending gratitude:", error);
    throw error;
  }
}

// Mark action as having gratitude sent (updates the state in the database or uses mock)
export async function markGratitudeSent(statementId: string, actionId: string, message: string): Promise<Action> {
  // Use mock implementation if enabled
  if (shouldUseMock()) {
    return mockMarkGratitudeSent(statementId, actionId, message);
  }
  
  // Real implementation
  try {
    const response = await fetch(`/api/gratitude/mark/${statementId}/${actionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark gratitude as sent');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error marking gratitude as sent:", error);
    throw error;
  }
}