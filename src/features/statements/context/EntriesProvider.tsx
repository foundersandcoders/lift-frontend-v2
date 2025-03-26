import React, { useReducer, ReactNode, useEffect } from 'react';
import {
  EntriesContext,
  EntriesContextType,
  EntriesAction,
} from './EntriesContext';

const EntriesReducer = (
  data: EntriesContextType['data'],
  action: EntriesAction
): EntriesContextType['data'] => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...data, username: action.payload };
    case 'SET_USER_EMAIL':
      return { ...data, userEmail: action.payload };
    case 'SET_MANAGER_NAME':
      return { ...data, managerName: action.payload };
    case 'SET_MANAGER_EMAIL':
      return { ...data, managerEmail: action.payload };
    case 'SET_ENTRIES':
      return { ...data, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...data, entries: [...data.entries, action.payload] };
    case 'UPDATE_ENTRY': {
      const result = {
        ...data,
        entries: data.entries.map((entry) => {
          if (entry.id === action.payload.id) {
            return action.payload;
          }
          return entry;
        }),
      };
      
      return result;
    }
    case 'DELETE_ENTRY':
      return {
        ...data,
        entries: data.entries.filter((entry) => entry.id !== action.payload),
      };
    case 'SET_ORIGINAL_CATEGORY':
      return {
        ...data,
        originalCategories: {
          ...data.originalCategories,
          [action.payload.statementId]: action.payload.category
        }
      };
    case 'CLEAR_ORIGINAL_CATEGORY': {
      const updatedCategories = { ...data.originalCategories };
      delete updatedCategories[action.payload];
      return {
        ...data,
        originalCategories: updatedCategories
      };
    }
    default:
      return data;
  }
};

interface EntriesProviderProps {
  children: ReactNode;
}

// Define the shape of the CustomEvent for auth state changes
interface AuthStateChangedEvent extends CustomEvent {
  detail: {
    user?: {
      username?: string;
      email?: string;
    };
  };
}

export const EntriesProvider: React.FC<EntriesProviderProps> = ({
  children,
}) => {
  const [data, setData] = useReducer(EntriesReducer, {
    entries: [],
    username: '',
    userEmail: '',
    managerName: '',
    managerEmail: '',
    originalCategories: {} // Initialize the originalCategories store
  });

  // Listen for auth state changes
  useEffect(() => {
    // Handler for auth state changes
    const handleAuthStateChange = (event: AuthStateChangedEvent) => {
      console.log('EntriesProvider: Auth state changed event received:', event.detail);
      
      // If we have a user object with a username
      if (event.detail?.user?.username) {
        // Update username from auth state - ALWAYS update, don't check if empty
        setData({ type: 'SET_USERNAME', payload: event.detail.user.username });
        console.log('EntriesProvider: Updated username to', event.detail.user.username);
      }
      
      // If we have a user object with an email
      if (event.detail?.user?.email) {
        // Store user email from auth (this is the email they used for magic link)
        setData({ type: 'SET_USER_EMAIL', payload: event.detail.user.email });
        console.log('EntriesProvider: Updated user email to', event.detail.user.email);
      }
    };
    
    // Listen for the auth state change event
    window.addEventListener('authStateChanged', handleAuthStateChange as unknown as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange as unknown as EventListener);
    };
  }, []);

  return (
    <EntriesContext.Provider value={{ data, setData }}>
      {children}
    </EntriesContext.Provider>
  );
};
