'use client';

import React from 'react';
import { StatementsProvider } from './context/StatementsProvider';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useStatements } from './hooks/useStatements';

// Outer Component: Responsible only for setting up the environment (the providers) for the rest of the app.
const AppContent: React.FC = () => {
  const { data, setData } = useStatements();

  const handleLoginSubmit = (username: string) => {
    // Dispatch an action to update the username in context.
    setData({ type: 'SET_USERNAME', payload: username });
  };

  return data.username ? (
    // MainPage receives the username from context.
    <MainPage />
  ) : (
    <LoginPage onSubmit={handleLoginSubmit} />
  );
};

// Inner Component (AppContent): Handles the actual application logic (deciding whether to show LoginPage or MainPage) by consuming the context.
const App: React.FC = () => {
  return (
    <TooltipProvider>
      <StatementsProvider>
        <AppContent />
      </StatementsProvider>
    </TooltipProvider>
  );
};

export default App;
