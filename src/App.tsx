'use client';

import React, { useEffect } from 'react';
import { TooltipProvider } from './components/ui/BetterTooltip';

// Providers
import { AuthProvider } from './features/auth/context/AuthProvider';
import { EntriesProvider } from './features/statements/context/EntriesProvider';
import { QuestionsProvider } from './features/questions/context/QuestionsProvider';
import { HelpProvider } from './features/help';

// Components
import LoginPage from './features/auth/components/LoginPage';
import { Header, MainPage } from './components/layout';
import MockNotification from './features/auth/components/MockNotification';

// Hooks and Utilities
import { useEntries } from './features/statements/hooks/useEntries';
import { useAuth } from './features/auth/api/hooks';
import { handleMagicLinkVerification } from './features/auth/utils/authUtils';

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
      console.log(
        'AppContent: Found authenticated user, dispatching event:',
        authState.user
      );
      // Dispatch event to ensure EntriesProvider gets the user data
      window.dispatchEvent(
        new CustomEvent('authStateChanged', {
          detail: { user: authState.user },
        })
      );
    }
  }, [authState.user, authState.isAuthenticated]);

  // Listen for magic link verification and ensure user email is saved to entries context
  useEffect(() => {
    interface MagicLinkVerifiedEvent extends CustomEvent {
      detail: {
        user: {
          email: string;
          [key: string]: unknown;
        };
      };
    }

    const handleMagicLinkVerified = (event: MagicLinkVerifiedEvent) => {
      if (event.detail?.user?.email) {
        console.log(
          'App: Magic link verified with email:',
          event.detail.user.email
        );
        // Dispatch event with user email to entries context
        window.dispatchEvent(
          new CustomEvent('authStateChanged', {
            detail: { user: { email: event.detail.user.email } },
          })
        );
      }
    };

    window.addEventListener('magicLinkVerified', handleMagicLinkVerified as EventListener);
    return () =>
      window.removeEventListener('magicLinkVerified', handleMagicLinkVerified as EventListener);
  }, []);

  return (
    // MainPage and Header receives the username from context.
    <>
      <Header />
      {data.username ? <MainPage /> : <LoginPage />}
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
            <HelpProvider>
              <AppContent />
              {/* Add the mock notification component for testing */}
              {import.meta.env.DEV && <MockNotification />}
            </HelpProvider>
          </QuestionsProvider>
        </EntriesProvider>
      </AuthProvider>
    </TooltipProvider>
  );
};

export default App;
