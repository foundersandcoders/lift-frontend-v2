'use client';

import React, { useState } from 'react';
import {
  SimpleDialog as Dialog,
  SimpleDialogContent as DialogContent,
  SimpleDialogDescription as DialogDescription,
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { shareStatements } from '../../features/email/api/emailApi';
import { Loader2 } from 'lucide-react';
import { getVerbName } from '../../lib/utils/verbUtils';
import PrivacyModal from './PrivacyModal';

const ShareEmailModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data } = useEntries();
  const { managerName, managerEmail } = data;
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Only include public statements that are not archived
  const publicStatements = data.entries.filter(
    (entry) => entry.isPublic && !entry.isArchived
  );

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      setSendError(null);

      if (!managerEmail || managerEmail.trim() === '') {
        throw new Error(
          'Manager email is not set. Please set a manager email first in your User Data.'
        );
      }

      if (!data.userEmail) {
        throw new Error(
          'Your email address is not available. Please try signing out and signing in again with magic link.'
        );
      }

      // Send the user's email to the backend, which will retrieve the user's statements
      // and send them to the manager email address stored in the user's profile
      await shareStatements(data.userEmail);

      setSendSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Failed to share statements:', error);
      setSendError(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as Error).message
          : 'Failed to share statements. Please try again later.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isPrivacyModalOpen && (
        <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />
      )}
      <Dialog open onOpenChange={onClose}>
        <DialogContent
          headerTitle={`Sharing with ${managerName || 'your manager'}`}
        >
          <div
            className='relative rounded-md overflow-hidden'
            style={{
              border: '6px solid transparent', // Reduced from 8px to 6px for mobile
              borderImage:
                'repeating-linear-gradient(45deg, #ff69b4, #ff69b4 10px, #4169e1 10px, #4169e1 20px) 8',
              padding: '12px', // Reduced from 16px for mobile
              margin: '-6px', // Reduced from -8px to match border
              background: '#f9f9f9',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogDescription className='mt-0 text-center text-sm'>
              Below are your public, unarchived statements
            </DialogDescription>

            <div className='text-center mb-3 sm:mb-4'>
              <p className='text-xs sm:text-sm text-gray-500 mt-1 break-all'>
                Email will be sent to: {managerEmail || 'No email set'}
              </p>
              {sendSuccess && (
                <p className='text-green-600 text-xs sm:text-sm font-medium mt-2 bg-green-50 py-1 px-2 rounded-full inline-block'>
                  ✓ Email sent successfully!
                </p>
              )}
              <div className='mt-2 p-2 bg-gray-50 rounded-md text-xs text-gray-600 border border-gray-200'>
                <p className='text-xs'>
                  Only public statements will be shared. For details on how we
                  process your data, see our{' '}
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className='text-brand-pink underline'
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>

            {sendError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-3 text-xs sm:text-sm'>
                {sendError}
              </div>
            )}

            <div className='mt-3 space-y-3 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto px-1'>
              {publicStatements.length > 0 ? (
                publicStatements.map((entry) => (
                  <div
                    key={entry.id}
                    className='p-3 sm:p-4 border bg-white shadow-sm rounded-sm'
                  >
                    <p className='text-sm sm:text-base font-semibold break-words'>
                      {entry.atoms.subject} {getVerbName(entry.atoms.verb)}{' '}
                      {entry.atoms.object}
                    </p>

                    {entry.actions && entry.actions.length > 0 && (
                      <div className='mt-2 sm:mt-3'>
                        <div className='text-xs uppercase text-gray-500 font-semibold border-b border-gray-200 pb-1 mb-1 sm:mb-2'>
                          Actions
                        </div>
                        {entry.actions
                          .filter((action) => !action.completed)
                          .map((action) => (
                            <div
                              key={action.id}
                              className='pl-2 sm:pl-3 border-l-2 border-pink-200 ml-1 sm:ml-2 py-1 mt-1 sm:mt-2'
                            >
                              <p className='text-xs sm:text-sm break-words'>
                                {action.action}
                              </p>
                              {action.byDate && action.byDate.trim() !== '' && (
                                <p className='text-xs text-gray-500 italic'>
                                  Due by: {action.byDate}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className='text-gray-600 text-center p-4 sm:p-6 bg-white border border-gray-200 rounded-md text-sm'>
                  No public unarchived statements available.
                </div>
              )}
            </div>

            <div className='mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-4'>
              <Button
                variant='default'
                onClick={handleSendEmail}
                disabled={
                  isSending || publicStatements.length === 0 || !managerEmail
                }
                className='text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2'
              >
                {isSending ? (
                  <>
                    <Loader2 className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin' />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Email</span>
                )}
              </Button>
              <Button
                variant='outline'
                onClick={onClose}
                className='text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2'
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareEmailModal;
