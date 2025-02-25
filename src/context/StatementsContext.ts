import { createContext } from 'react';
import type { Statement } from '../../types/types';

export interface StatementsContextType {
  data: {
    statements: Statement[];
    username: string;
    managerEmail: string;
  };
  setData: React.Dispatch<StatementsAction>;
}

export type StatementsAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_MANAGER_EMAIL'; payload: string }
  | { type: 'SET_STATEMENTS'; payload: Statement[] }
  | { type: 'ADD_STATEMENT'; payload: Statement }
  | { type: 'UPDATE_STATEMENT'; payload: Statement }
  | { type: 'DELETE_STATEMENT'; payload: string };

export const StatementsContext = createContext<
  StatementsContextType | undefined
>(undefined);
