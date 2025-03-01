'use client';

import React from 'react';
import StatementList from './statements/StatementList';
import { useEntries } from '../hooks/useEntries';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import StatementWizard from './statementWizard/StatementWizard';

const MainPage: React.FC = () => {
  const { data } = useEntries();
  const { username } = data;
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);

  // Handler to open the wizard for creating a new statement from scratch
  const handleNewStatement = () => {
    setIsWizardOpen(true);
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 '>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Statement builder for {username}
      </h1>
      <div className='container mx-auto px-4'>
        <StatementList username={username} />
      </div>
      {/* Floating Action Button (FAB) for creating a new custom statement */}

      <Button
        onClick={handleNewStatement}
        variant='default'
        className='fixed bottom-8 right-8 rounded-full flex items-center space-x-2 px-6 py-3 shadow-lg bg-brand-pink text-white text-lg hover:bg-brand-darkPurple'
      >
        <Plus className='w-6 h-6' />
        <span className='text-lg'>Create your own statement</span>
      </Button>

      {/* Conditionally render the wizard modal */}
      {isWizardOpen && (
        <StatementWizard
          username={username}
          onComplete={() => setIsWizardOpen(false)}
          onClose={() => setIsWizardOpen(false)}
        />
      )}
    </main>
  );
};

export default MainPage;
