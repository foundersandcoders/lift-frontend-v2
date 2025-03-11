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
    case 'SET_MANAGER_NAME':
      return { ...data, managerName: action.payload };
    case 'SET_MANAGER_EMAIL':
      return { ...data, managerEmail: action.payload };
    case 'SET_ENTRIES':
      return { ...data, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...data, entries: [...data.entries, action.payload] };
    case 'UPDATE_ENTRY':
      return {
        ...data,
        entries: data.entries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'DELETE_ENTRY':
      return {
        ...data,
        entries: data.entries.filter((entry) => entry.id !== action.payload),
      };
    default:
      return data;
  }
};

interface EntriesProviderProps {
  children: ReactNode;
}

export const EntriesProvider: React.FC<EntriesProviderProps> = ({
  children,
}) => {
  const [data, setData] = useReducer(EntriesReducer, {
    entries: [],
    username: '',
    managerName: '',
    managerEmail: '',
  });

  // Listen for auth state changes
  useEffect(() => {
    // Handler for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      console.log('Auth state changed event received in EntriesProvider:', event.detail);
      
      // If we have a user object with a username
      if (event.detail?.user?.username) {
        console.log('Setting username in EntriesProvider:', event.detail.user.username);
        // Update username from auth state - ALWAYS update, don't check if empty
        setData({ type: 'SET_USERNAME', payload: event.detail.user.username });
      }
      
      // If we have a user object with an email
      if (event.detail?.user?.email) {
        console.log('Setting manager email in EntriesProvider:', event.detail.user.email);
        // Update manager email from auth state - ALWAYS update, don't check if empty
        setData({ type: 'SET_MANAGER_EMAIL', payload: event.detail.user.email });
      }
    };
    
    // Listen for the auth state change event
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, []);

  return (
    <EntriesContext.Provider value={{ data, setData }}>
      {children}
    </EntriesContext.Provider>
  );
};
