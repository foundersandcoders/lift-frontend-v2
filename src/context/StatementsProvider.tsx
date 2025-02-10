// src/contexts/StatementsProvider.tsx
import React, { useReducer, ReactNode } from 'react';
import {
  StatementsContext,
  StatementsContextType,
  StatementsAction,
} from './StatementsContext';

const statementsReducer = (
  state: StatementsContextType['state'],
  action: StatementsAction
): StatementsContextType['state'] => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_STATEMENTS':
      return { ...state, statements: action.payload };
    case 'ADD_STATEMENT':
      return { ...state, statements: [...state.statements, action.payload] };
    case 'UPDATE_STATEMENT':
      return {
        ...state,
        statements: state.statements.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_STATEMENT':
      return {
        ...state,
        statements: state.statements.filter((s) => s.id !== action.payload),
      };
    default:
      return state;
  }
};

interface StatementsProviderProps {
  children: ReactNode;
}

export const StatementsProvider: React.FC<StatementsProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(statementsReducer, {
    statements: [],
    username: 'Eve',
  });

  return (
    <StatementsContext.Provider value={{ state, dispatch }}>
      {children}
    </StatementsContext.Provider>
  );
};
