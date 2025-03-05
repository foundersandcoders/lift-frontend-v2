'use client';

import React from 'react';
import { EntriesProvider } from './context/EntriesProvider';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import MainPage from './components/MainPage';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useEntries } from './hooks/useEntries';
import { QuestionsProvider } from './context/QuestionsProvider';

// Outer Component: Responsible only for setting up the environment (the providers) for the rest of the app.
const AppContent: React.FC = () => {
  const { data, setData } = useEntries();

  const handleLoginSubmit = (
    username: string,
    managerName: string,
    managerEmail: string
  ) => {
    // Dispatch an action to update the username in context.
    setData({ type: 'SET_USERNAME', payload: username });
    setData({ type: 'SET_MANAGER_NAME', payload: managerName });
    setData({ type: 'SET_MANAGER_EMAIL', payload: managerEmail });
  };

  return (
    // MainPage and Header receives the username from context.
    <>
      <Header />
      {data.username ? (
        <MainPage />
      ) : (
        <LoginPage onSubmit={handleLoginSubmit} />
      )}
    </>
  );
};

// Inner Component (AppContent): Handles the actual application logic (deciding whether to show LoginPage or MainPage) by consuming the context.
const App: React.FC = () => {
  return (
    <TooltipProvider>
      <EntriesProvider>
        <QuestionsProvider>
          <AppContent />
        </QuestionsProvider>
      </EntriesProvider>
    </TooltipProvider>
  );
};

export default App;
