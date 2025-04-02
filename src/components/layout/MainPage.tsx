'use client';

import React, { useState } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
} from '@/components/ui';
import { StatementList } from '@/features/statements/components';
import { useEntries } from '@/features/statements';
import { Mail } from 'lucide-react';
import StatementWizard from '@/features/wizard/components/StatementWizard';
import { ShareEmailModal } from '@/components/modals';
import TestStatementButton from '@/components/debug/TestButton';
import Footer from './Footer';

const MainPage: React.FC = () => {
  const { data } = useEntries();
  const { username, managerName, managerEmail, entries } = data;
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Determine if email button should be disabled:
  const hasManagerEmail = managerEmail && managerEmail.trim().length > 0;
  // Include all public statements (including archived ones)
  const publicStatementsCount = entries.filter(
    (entry) => entry.isPublic
  ).length;

  // Email button should be disabled if no manager email or no public statements
  const isEmailDisabled = !hasManagerEmail || publicStatementsCount === 0;

  // Handler to open the share email modal
  const handleShareEmail = () => {
    setIsShareModalOpen(true);
  };

  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 md:py-8 flex flex-col'>
      <div className='container mx-auto px-4 mb-0'>
        {/* Fixed header layout with 1 or 2 rows */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
          <h1 id='page-title' className='text-2xl md:text-3xl font-bold'>
            {managerName
              ? `Beacons for ${managerName}`
              : `${username}'s Beacons`}
          </h1>
        </div>
      </div>

      <div className='container mx-auto px-4 flex-grow'>
        <StatementList
          username={username}
          // onAddCustomStatement={handleNewStatement}
        />
      </div>

      {/* Footer component */}
      <Footer />

      {/* Floating Email Button */}
      <div className='fixed bottom-4 right-4 z-30'>
        {/* Email Button: Disabled if there's no manager email or no public statements */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={handleShareEmail}
                variant='default'
                className='rounded-full flex items-center px-3 py-2 sm:px-4 sm:py-3 shadow-lg bg-blue-600 hover:bg-blue-700'
                disabled={isEmailDisabled}
              >
                <Mail className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                <span className='ml-1 sm:ml-2 text-base sm:text-lg text-white'>
                  <span className='hidden sm:inline'>Send to manager</span>
                  <span className='sm:hidden'>Email</span>
                </span>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent className='bg-gray-800 text-white p-2 rounded'>
            {!hasManagerEmail
              ? "Please add your manager's email address first."
              : publicStatementsCount === 0
              ? 'Please create at least one public statement to share.'
              : 'Send email with your public statements.'}
          </TooltipContent>
        </Tooltip>

        {/* Debug button */}
        <div className='mt-2'>
          <TestStatementButton />
        </div>
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
