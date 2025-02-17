'use client';

import React, { useState } from 'react';
import { StatementsProvider } from './context/StatementsProvider';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const App: React.FC = () => {
  // Local state to store the username from the login page.
  const [username, setUsername] = useState('');

  return (
    <TooltipProvider>
      <StatementsProvider>
        {username ? (
          // If username is set, show the main app page.
          <MainPage username={username} />
        ) : (
          // Otherwise, show the login page.
          <LoginPage onSubmit={setUsername} />
        )}
      </StatementsProvider>
    </TooltipProvider>
  );
};

export default App;
