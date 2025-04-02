'use client';

import React, { useState, useEffect } from 'react';
import { HelpContext } from './HelpContext';
import WelcomePanel from './WelcomePanel';
import HelpButton from './HelpButton';
import HelpCenter from './HelpCenter';

interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');
  const [shouldPulseButton, setShouldPulseButton] = useState(false);

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
    // Pulse the help button after welcome panel closes
    setShouldPulseButton(true);
  };

  const handleShowTutorial = () => {
    setShowWelcome(false);
    setActiveTab('tutorials');
    setShowCenter(true);
    localStorage.setItem('app_visited', 'true');
  };

  const handleHelpCenterClose = () => {
    setShowCenter(false);
    // Pulse the help button after help center closes
    setShouldPulseButton(true);
  };

  const showHelpCenter = (tab = 'welcome') => {
    setActiveTab(tab);
    setShowCenter(true);
    // Stop pulsing when help center opens
    setShouldPulseButton(false);
  };

  return (
    <HelpContext.Provider value={{ showHelpCenter }}>
      {children}
      
      {/* Persistent Help Button */}
      <HelpButton 
        onClick={() => showHelpCenter()} 
        shouldPulse={shouldPulseButton}
      />
      
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
          onClose={handleHelpCenterClose} 
          initialTab={activeTab}
        />
      )}
    </HelpContext.Provider>
  );
};

export default HelpProvider;