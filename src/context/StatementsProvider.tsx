import React, { useReducer, ReactNode } from 'react';
import {
  StatementsContext,
  StatementsContextType,
  StatementsAction,
} from './StatementsContext';

const statementsReducer = (
  data: StatementsContextType['data'],
  action: StatementsAction
): StatementsContextType['data'] => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...data, username: action.payload };
    case 'SET_STATEMENTS':
      return { ...data, statements: action.payload };
    case 'ADD_STATEMENT':
      return { ...data, statements: [...data.statements, action.payload] };
    case 'UPDATE_STATEMENT':
      return {
        ...data,
        statements: data.statements.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_STATEMENT':
      return {
        ...data,
        statements: data.statements.filter((s) => s.id !== action.payload),
      };
    default:
      return data;
  }
};

interface StatementsProviderProps {
  children: ReactNode;
}

export const StatementsProvider: React.FC<StatementsProviderProps> = ({
  children,
}) => {
  const [data, setData] = useReducer(statementsReducer, {
    statements: [],
    username: '',
  });

  return (
    <StatementsContext.Provider value={{ data, setData }}>
      {children}
    </StatementsContext.Provider>
  );
};
