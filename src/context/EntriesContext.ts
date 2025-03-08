import { createContext } from 'react';
import type { Entry } from '../../types/entries';

export interface EntriesContextType {
  data: {
    entries: Entry[];
    username: string;
    managerName: string;
    managerEmail: string;
  };
  setData: React.Dispatch<EntriesAction>;
}

export type EntriesAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_MANAGER_NAME'; payload: string }
  | { type: 'SET_MANAGER_EMAIL'; payload: string }
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'MARK_ENTRY_SAVED'; payload: string };

export const EntriesContext = createContext<EntriesContextType | undefined>(
  undefined
);
