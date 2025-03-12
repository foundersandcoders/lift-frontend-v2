'use client';

import React, { useState } from 'react';
import { SimpleDialog as Dialog, SimpleDialogContent as DialogContent, SimpleDialogDescription as DialogDescription } from '../ui/simple-dialog';
import { Button } from '../ui/button';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { sendEmail } from '../../features/email/api/emailApi';
import { Email } from '../../types/emails';
import { Loader2 } from 'lucide-react';
import { getVerbName } from '../../lib/utils/verbUtils';

const ShareEmailModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data } = useEntries();
  const { username, managerName, managerEmail } = data;
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Only include public statements that are not resolved
  const publicStatements = data.entries.filter(
    (entry) => entry.isPublic && !entry.isResolved
  );

  const generateEmailHtml = () => {
    let html = `
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Statements from ${username}</h1>
      <p style="font-size: 16px; margin-bottom: 30px;">
        ${username} would like to share the following statements with you:
      </p>
    `;

    publicStatements.forEach((entry) => {
      html += `
        <div style="margin-bottom: 25px; padding: 15px; border-left: 4px solid #ff69b4; background-color: #f9f9f9;">
          <p style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            ${entry.atoms.subject} ${getVerbName(entry.atoms.verb)} ${entry.atoms.object}
          </p>
      `;

      // Add actions if they exist
      if (entry.actions && entry.actions.length > 0) {
        const pendingActions = entry.actions.filter(
          (action) => !action.completed
        );

        if (pendingActions.length > 0) {
          html += `<div style="margin-top: 10px;">
            <p style="font-weight: bold; color: #555; font-size: 14px;">Actions:</p>
            <ul style="padding-left: 20px;">`;

          pendingActions.forEach((action) => {
            html += `
              <li style="margin-bottom: 5px;">
                <div style="font-size: 14px;">
                  ${action.action}
                  ${
                    action.byDate
                      ? `<span style="color: #888; font-size: 12px;"> (Due: ${action.byDate})</span>`
                      : ''
                  }
                </div>
              </li>
            `;
          });

          html += `</ul></div>`;
        }
      }

      html += `</div>`;
    });

    html += `
      <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        This email was sent from the Lift application.
      </p>
    `;

    return html;
  };

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      setSendError(null);

      if (!managerEmail || managerEmail.trim() === '') {
        throw new Error(
          'Manager email is not set. Please set a manager email first.'
        );
      }

      const emailPayload: Email = {
        from: 'notifications@lift-app.com', // This should be your app's email
        to: [managerEmail],
        subject: `${username} would like to share statements with you`,
        html: generateEmailHtml(),
      };

      await sendEmail(emailPayload);
      setSendSuccess(true);

      // Automatically close after successful send
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSendError(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as Error).message
          : 'Failed to send email. Please try again later.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        headerTitle={`Sharing with ${managerName || 'your manager'}`}
      >
        <div
          className='relative rounded-md overflow-hidden'
          style={{
            border: '8px solid transparent',
            borderImage:
              'repeating-linear-gradient(45deg, #ff69b4, #ff69b4 10px, #4169e1 10px, #4169e1 20px) 8',
            padding: '16px',
            margin: '-8px',
            background: '#f9f9f9',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Postal stamp decoration */}
          <div className='absolute top-4 right-4 w-16 h-20 border-2 border-gray-400 border-dashed rounded-sm opacity-20 flex items-center justify-center pointer-events-none'>
            <div className='w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center'>
              <span className='transform rotate-12 text-gray-500 text-[10px] font-mono'>
                MAIL
              </span>
            </div>
          </div>

          <DialogDescription className='mt-0 text-center'>
            Below are your public, unresolved statements
          </DialogDescription>

          <div className='text-center mb-6'>
            <p className='text-sm text-gray-500 mt-1'>
              Email will be sent to: {managerEmail || 'No email set'}
            </p>
            {sendSuccess && (
              <p className='text-green-600 text-sm font-medium mt-2 bg-green-50 py-1 px-2 rounded-full inline-block'>
                ✓ Email sent successfully!
              </p>
            )}
            <div className="mt-3 p-2 bg-gray-50 rounded-md text-xs text-gray-600 border border-gray-200">
              <p>Only public statements will be shared. For details on how we process your data, see our <a href="#" className="text-brand-pink underline">Privacy Policy</a>.</p>
            </div>
          </div>

          {sendError && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
              {sendError}
            </div>
          )}

          <div className='mt-4 space-y-5 max-h-[50vh] overflow-y-auto px-1'>
            {publicStatements.length > 0 ? (
              publicStatements.map((entry) => (
                <div
                  key={entry.id}
                  className='p-4 border bg-white shadow-sm rounded-sm relative'
                  style={{
                    backgroundImage:
                      'linear-gradient(0deg, rgba(255, 105, 180, 0.05) 1px, transparent 1px)',
                    backgroundSize: '100% 20px',
                    borderColor: '#e5e5e5',
                  }}
                >
                  <p className='text-base font-semibold'>{entry.atoms.subject} {getVerbName(entry.atoms.verb)} {entry.atoms.object}</p>
                  {entry.actions && entry.actions.length > 0 && (
                    <div className='mt-3 space-y-2'>
                      <div className='text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 pb-1 mb-2'>
                        Actions
                      </div>
                      {entry.actions
                        .filter((action) => !action.completed)
                        .map((action) => (
                          <div
                            key={action.id}
                            className='pl-3 border-l-2 border-pink-200 ml-2 py-1'
                          >
                            <p className='text-sm'>{action.action}</p>
                            {action.byDate && action.byDate.trim() !== '' && (
                              <p className='text-xs text-gray-500 italic'>
                                Due by: {action.byDate}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                  <div className='absolute top-1 right-2 opacity-20'>
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M21 14H3M21 4H3M21 9H3M21 19H3'
                        stroke='#ff69b4'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-600 text-center p-8 bg-white border border-gray-200 rounded-sm'>
                No public unresolved statements available.
              </div>
            )}
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <Button
              variant='default'
              onClick={handleSendEmail}
              disabled={
                isSending || publicStatements.length === 0 || !managerEmail
              }
              className='shadow-sm'
            >
              {isSending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Email</span>
              )}
            </Button>
            <Button variant='outline' onClick={onClose}>
              <span>Close</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareEmailModal;
