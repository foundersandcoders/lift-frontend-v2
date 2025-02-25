import { useContext } from 'react';
import { StatementsContext } from '../context/StatementsContext';

export function useStatements() {
  const context = useContext(StatementsContext);
  if (!context) {
    throw new Error('useStatements must be used within a StatementsProvider');
  }
  return context;
}
