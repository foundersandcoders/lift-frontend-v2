'use client';

import React from 'react';
import StatementList from './statements/StatementList';
import { useEntries } from '../hooks/useEntries';
import { Button } from './ui/button';
import { Plus, Mail } from 'lucide-react';
import StatementWizard from './statementWizard/StatementWizard';
import ShareEmailModal from './ShareEmailModal'; // Import the new modal

const MainPage: React.FC = () => {
  const { data } = useEntries();
  const { username } = data;
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Handler to open the wizard for creating a new statement from scratch
  const handleNewStatement = () => {
    setIsWizardOpen(true);
  };

  // Handler to open the share email modal
  const handleShareEmail = () => {
    setIsShareModalOpen(true);
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Statement builder for {username}
      </h1>

      <div className='container mx-auto px-4'>
        <StatementList username={username} />
      </div>
      
      {/* Floating Buttons Container */}
      <div className='fixed bottom-8 right-8 flex items-center space-x-4'>
        {/* Email Button on the left */}
        <Button
          onClick={handleShareEmail}
          variant='outline'
          className='rounded-full p-3 shadow-lg bg-white hover:bg-gray-100'
        >
          <Mail className='w-6 h-6 text-brand-pink' />
        </Button>
        {/* Create Your Own Statement Button */}
        <Button
          onClick={handleNewStatement}
          variant='pink'
          className='rounded-full flex items-center space-x-2 px-6 py-3 shadow-lg'
        >
          <Plus className='w-6 h-6' />
          <span className='text-lg'>Create your own statement</span>
        </Button>
      </div>

      {/* Conditionally render the wizard modal */}
      {isWizardOpen && (
        <StatementWizard
          username={username}
          onComplete={() => setIsWizardOpen(false)}
          onClose={() => setIsWizardOpen(false)}
        />
      )}

      {/* Conditionally render the share email modal */}
      {isShareModalOpen && (
        <ShareEmailModal onClose={() => setIsShareModalOpen(false)} />
      )}
    </main>
  );
};

export default MainPage;
