'use client';

import React, { useEffect } from 'react';
import { EntriesProvider } from './context/EntriesProvider';
import { AuthProvider } from './context/AuthProvider';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import MainPage from './components/MainPage';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useEntries } from './hooks/useEntries';
import { QuestionsProvider } from './context/QuestionsProvider';
import { handleMagicLinkVerification } from './utils/authUtils';
import MockNotification from './components/auth/MockNotification';

// Outer Component: Responsible only for setting up the environment (the providers) for the rest of the app.
const AppContent: React.FC = () => {
  const { data } = useEntries();

  // Check for magic link tokens on app load
  useEffect(() => {
    const verifyToken = async () => {
      await handleMagicLinkVerification();
    };

    verifyToken();
  }, []);

  return (
    // MainPage and Header receives the username from context.
    <>
      <Header />
      {data.username ? (
        <MainPage />
      ) : (
        <LoginPage />
      )}
    </>
  );
};

// Inner Component (AppContent): Handles the actual application logic (deciding whether to show LoginPage or MainPage) by consuming the context.
const App: React.FC = () => {
  return (
    <TooltipProvider>
      <AuthProvider>
        <EntriesProvider>
          <QuestionsProvider>
            <AppContent />
            {/* Add the mock notification component for testing */}
            {import.meta.env.DEV && <MockNotification />}
          </QuestionsProvider>
        </EntriesProvider>
      </AuthProvider>
    </TooltipProvider>
  );
};

export default App;
