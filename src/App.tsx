'use client';

import React, { useEffect } from 'react';
import { TooltipProvider } from './components/ui/better-tooltip';

// Providers
import { AuthProvider } from './features/auth/AuthProvider';
import { EntriesProvider } from './features/statements/context/EntriesProvider';
import { QuestionsProvider } from './providers/QuestionsProvider';

// Components
import LoginPage from './features/auth/components/LoginPage';
import Header from './layouts/components/Header';
import MainPage from './layouts/components/MainPage';
import MockNotification from './features/auth/components/MockNotification';

// Hooks and Utilities
import { useEntries } from './features/statements/hooks/useEntries';
import { useAuth } from './features/auth/api/hooks';
import { handleMagicLinkVerification } from './features/auth/authUtils';

// Outer Component: Responsible only for setting up the environment (the providers) for the rest of the app.
const AppContent: React.FC = () => {
  const { data } = useEntries();
  const { state: authState } = useAuth();

  // Check for magic link tokens on app load
  useEffect(() => {
    const verifyToken = async () => {
      await handleMagicLinkVerification();
    };

    verifyToken();
  }, []);
  
  // Force synchronization between auth state and entries state when component mounts
  useEffect(() => {
    if (authState.user && authState.isAuthenticated) {
      console.log('AppContent: Found authenticated user, dispatching event:', authState.user);
      // Dispatch event to ensure EntriesProvider gets the user data
      window.dispatchEvent(new CustomEvent('authStateChanged', { 
        detail: { user: authState.user }
      }));
    }
  }, [authState.user, authState.isAuthenticated]);

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
