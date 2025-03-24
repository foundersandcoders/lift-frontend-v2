import { createContext } from 'react';
import type { Entry } from '../../../types/entries';

// Add a global store for original categories when editing
export interface OriginalCategoryStore {
  [statementId: string]: string;
}

export interface EntriesContextType {
  data: {
    entries: Entry[];
    username: string;
    userEmail: string;
    managerName: string;
    managerEmail: string;
    // Add originalCategories to the context data
    originalCategories: OriginalCategoryStore;
  };
  setData: React.Dispatch<EntriesAction>;
}

export type EntriesAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_USER_EMAIL'; payload: string }
  | { type: 'SET_MANAGER_NAME'; payload: string }
  | { type: 'SET_MANAGER_EMAIL'; payload: string }
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SET_ORIGINAL_CATEGORY'; payload: { statementId: string; category: string } }
  | { type: 'CLEAR_ORIGINAL_CATEGORY'; payload: string };

export const EntriesContext = createContext<EntriesContextType | undefined>(
  undefined
);
