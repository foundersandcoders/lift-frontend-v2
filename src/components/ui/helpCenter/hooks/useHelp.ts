'use client';

import { useContext } from 'react';
import { HelpContext } from '../HelpContext';

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
