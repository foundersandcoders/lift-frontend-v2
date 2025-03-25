'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import WelcomePanel from './WelcomePanel';
import HelpButton from './HelpButton';
import HelpCenter from './HelpCenter';

interface HelpContextType {
  showHelpCenter: (tab?: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');

  // Check if this is the first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('app_visited');
    if (!hasVisitedBefore) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('app_visited', 'true');
  };

  const handleShowTutorial = () => {
    setShowWelcome(false);
    setActiveTab('tutorials');
    setShowCenter(true);
    localStorage.setItem('app_visited', 'true');
  };

  const showHelpCenter = (tab = 'welcome') => {
    setActiveTab(tab);
    setShowCenter(true);
  };

  return (
    <HelpContext.Provider value={{ showHelpCenter }}>
      {children}
      
      {/* Persistent Help Button */}
      <HelpButton onClick={() => showHelpCenter()} />
      
      {/* Welcome Panel (first visit) */}
      {showWelcome && (
        <WelcomePanel 
          onClose={handleWelcomeClose} 
          onShowTutorial={handleShowTutorial} 
        />
      )}
      
      {/* Help Center Panel */}
      {showCenter && (
        <HelpCenter 
          onClose={() => setShowCenter(false)} 
          initialTab={activeTab}
        />
      )}
    </HelpContext.Provider>
  );
};

export default HelpProvider;