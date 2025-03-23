'use client';

import React, { useState } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../components/ui/better-tooltip';
import StatementList from '../../features/statements/components/StatementList';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { Button } from '../../components/ui/button';
import { Mail } from 'lucide-react';
import StatementWizard from '../../features/wizard/components/StatementWizard';
import ShareEmailModal from '../../components/modals/ShareEmailModal';
import PrivacyModal from '../../components/modals/PrivacyModal';
import TermsModal from '../../components/modals/TermsModal';
import TestStatementButton from '../../components/debug/TestButton';
// import { useTour } from '../../components/ui/tour/useTour';

const MainPage: React.FC = () => {
  const { data } = useEntries();
  const { username, managerName, managerEmail, entries } = data;
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Get tour functionality
  // const { startTour, hasSeenTour } = useTour();

  // Auto-start tour for new users
  // useEffect(() => {
  //   // Check if the user is authenticated and has not seen the tour
  //   if (username && !hasSeenTour) {
  //     // Wait for the UI to fully render before starting the tour
  //     const tourTimeout = setTimeout(() => {
  //       startTour();
  //     }, 1000);

  //     return () => clearTimeout(tourTimeout);
  //   }
  // }, [username, hasSeenTour, startTour]);

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
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 md:py-8 flex flex-col'>
      <div className='container mx-auto px-4 mb-0'>
        {/* Fixed header layout with 1 or 2 rows */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
          <h1
            id='page-title'
            className='text-2xl md:text-3xl font-bold mb-3 md:mb-0 truncate'
          >
            {managerName
              ? `${username} would like to share with ${managerName}`
              : `${username}'s statements for sharing`}
          </h1>
        </div>
      </div>

      <div className='container mx-auto px-4 flex-grow'>
        <StatementList
          username={username}
          onAddCustomStatement={handleNewStatement}
        />
      </div>

      {/* Footer with privacy links */}
      <footer className='mt-auto pt-6 pb-4 bg-gray-50 border-t border-gray-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row justify-center items-center text-xs text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4'>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className='hover:text-brand-pink hover:underline'
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className='hover:text-brand-pink hover:underline'
            >
              Terms of Use
            </button>
            <span>© {new Date().getFullYear()} Beacons</span>
          </div>
        </div>
      </footer>

      {/* Floating Email Button (now singular) */}
      <div className='fixed bottom-8 right-8 z-30'>
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

      {/* Conditionally render the privacy modal */}
      {isPrivacyModalOpen && (
        <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />
      )}

      {/* Conditionally render the terms modal */}
      {isTermsModalOpen && (
        <TermsModal onClose={() => setIsTermsModalOpen(false)} />
      )}
    </main>
  );
};

export default MainPage;
