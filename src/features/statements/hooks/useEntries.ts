import { useContext } from 'react';
import { EntriesContext } from '../context/EntriesContext';

export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useStatements must be used within a StatementsProvider');
  }
  return context;
}
