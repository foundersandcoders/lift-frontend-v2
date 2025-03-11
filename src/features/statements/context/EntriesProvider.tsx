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
      console.log("[ENTRIES REDUCER] Processing UPDATE_ENTRY action:", {
        updatedId: action.payload.id,
        updatedCategory: action.payload.category,
        updatedTimestamp: action.payload._updateTimestamp
      });
      
      const oldEntry = data.entries.find(entry => entry.id === action.payload.id);
      
      console.log("[ENTRIES REDUCER] Entry being replaced:", {
        oldEntry,
        oldCategory: oldEntry?.category,
        newCategory: action.payload.category,
        categoryChanged: oldEntry?.category !== action.payload.category
      });
      
      const result = {
        ...data,
        entries: data.entries.map((entry) => {
          if (entry.id === action.payload.id) {
            console.log("[ENTRIES REDUCER] Replacing entry:", {
              id: entry.id,
              oldCategory: entry.category,
              newCategory: action.payload.category
            });
            return action.payload;
          }
          return entry;
        }),
      };
      
      console.log("[ENTRIES REDUCER] UPDATE_ENTRY completed");
      return result;
    case 'DELETE_ENTRY':
      return {
        ...data,
        entries: data.entries.filter((entry) => entry.id !== action.payload),
      };
    case 'SET_ORIGINAL_CATEGORY':
      console.log("[ENTRIES REDUCER] Setting original category:", action.payload);
      return {
        ...data,
        originalCategories: {
          ...data.originalCategories,
          [action.payload.statementId]: action.payload.category
        }
      };
    case 'CLEAR_ORIGINAL_CATEGORY':
      console.log("[ENTRIES REDUCER] Clearing original category for:", action.payload);
      const updatedCategories = { ...data.originalCategories };
      delete updatedCategories[action.payload];
      return {
        ...data,
        originalCategories: updatedCategories
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
    originalCategories: {} // Initialize the originalCategories store
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
