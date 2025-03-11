'use client';

import React from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../components/ui/radix-compatibility';
import StatementList from '../../features/statements/components/StatementList';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { Button } from '../../components/ui/button';
import { Plus, Mail } from 'lucide-react';
import StatementWizard from '../../features/wizard/components/StatementWizard';
import ShareEmailModal from '../../components/modals/ShareEmailModal';
import TestStatementButton from '../../components/debug/TestButton';

const MainPage: React.FC = () => {
  const { data } = useEntries();
  const { username, managerName, managerEmail, entries } = data;
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Determine if email button should be disabled:
  const hasManagerEmail = managerEmail && managerEmail.trim().length > 0;
  // Include all public statements (including archived ones)
  const publicStatementsCount = entries.filter(
    (entry) => entry.isPublic
  ).length;

  // Email button should be disabled if no manager email or no public statements
  const isEmailDisabled = !hasManagerEmail || publicStatementsCount === 0;

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
        {managerName
          ? `${username} would like to share with ${managerName}`
          : `${username}'s statements for sharing`}
      </h1>
      <div className='container mx-auto px-4'>
        <StatementList username={username} />
      </div>
      {/* Floating Buttons Container with higher z-index */}
      <div className='fixed bottom-8 right-8 flex items-center space-x-4 z-30'>
        {/* Email Button: Disabled if there's no manager email or no public statements */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={handleShareEmail}
                variant='outline'
                className='rounded-full p-3 shadow-lg bg-white hover:bg-gray-100'
                disabled={isEmailDisabled}
              >
                <Mail className='w-6 h-6 text-brand-pink' />
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
        {/* Create Your Own Statement Button */}
        <Button
          onClick={handleNewStatement}
          variant='pink'
          className='rounded-full flex items-center px-3 py-2 sm:px-4 sm:py-3 shadow-lg'
        >
          <Plus className='w-5 h-5 sm:w-6 sm:h-6' />
          <span className='ml-1 sm:ml-2 text-base sm:text-lg'>
            <span className='hidden sm:inline'>Custom statement</span>
            <span className='sm:hidden'>Add</span>
          </span>
        </Button>
        <TestStatementButton />
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
