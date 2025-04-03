'use client';

import { createContext } from 'react';

export interface HelpContextType {
  showHelpCenter: (tab?: string) => void;
}

export const HelpContext = createContext<HelpContextType | undefined>(undefined);
