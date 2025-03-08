import React, { useReducer, ReactNode } from 'react';
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
      return {
        ...data,
        entries: [...data.entries, { ...action.payload, dirty: true }],
      };
    case 'UPDATE_ENTRY':
      return {
        ...data,
        entries: data.entries.map((entry) =>
          entry.id === action.payload.id
            ? { ...action.payload, dirty: true }
            : entry
        ),
      };
    case 'DELETE_ENTRY':
      return {
        ...data,
        entries: data.entries.filter((entry) => entry.id !== action.payload),
      };
    case 'MARK_ENTRY_SAVED': {
      // action.payload is the entry id that has been saved successfully
      return {
        ...data,
        entries: data.entries.map((entry) =>
          entry.id === action.payload ? { ...entry, dirty: false } : entry
        ),
      };
    }
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

  return (
    <EntriesContext.Provider value={{ data, setData }}>
      {children}
    </EntriesContext.Provider>
  );
};
