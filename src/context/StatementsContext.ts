import { createContext } from 'react';
import type { Statement } from '../../types/types';

export interface StatementsContextType {
  state: {
    statements: Statement[];
    username: string;
  };
  dispatch: React.Dispatch<StatementsAction>;
}

export type StatementsAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_STATEMENTS'; payload: Statement[] }
  | { type: 'ADD_STATEMENT'; payload: Statement }
  | { type: 'UPDATE_STATEMENT'; payload: Statement }
  | { type: 'DELETE_STATEMENT'; payload: string };

export const StatementsContext = createContext<
  StatementsContextType | undefined
>(undefined);
