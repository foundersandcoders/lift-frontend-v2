'use client';

import React, { useState } from 'react';
import {
  SimpleDialog as Dialog,
  SimpleDialogContent as DialogContent,
  SimpleDialogDescription as DialogDescription,
} from '../ui/simple-dialog';
import { Button } from '../ui/button';
import { Loader2, Heart } from 'lucide-react';
import { sendGratitude } from '../../features/email/api/gratitudeApi';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { Action } from '../../types/entries';

interface GratitudeModalProps {
  onClose: () => void;
  statementId: string;
  action: Action;
  onGratitudeSent: (
    statementId: string,
    actionId: string,
    message: string
  ) => void;
}

const GratitudeModal: React.FC<GratitudeModalProps> = ({
  onClose,
  statementId,
  action,
  onGratitudeSent,
}) => {
  const { data } = useEntries();
  const { managerName, managerEmail } = data;

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendGratitude = async () => {
    try {
      setIsSending(true);
      setSendError(null);

      if (!managerEmail || managerEmail.trim() === '') {
        throw new Error(
          'Manager email is not set. Please set a manager email first.'
        );
      }

      if (!message.trim()) {
        throw new Error('Please enter a gratitude message.');
      }

      const gratitudeRequest = {
        statementId,
        actionId: action.id,
        message: message.trim(),
        recipientEmail: managerEmail,
        recipientName: managerName,
      };

      // Check if we're in mock mode
      const isMockMode = 
        typeof import.meta.env.VITE_MOCK_EMAIL_SENDING === 'undefined' || 
        import.meta.env.VITE_MOCK_EMAIL_SENDING === 'true';
      
      try {
        // Try to send gratitude via API
        await sendGratitude(gratitudeRequest);
      } catch (apiError) {
        // If we're in mock mode, continue as if successful
        if (!isMockMode) {
          // Only throw the error if we're not in mock mode
          throw apiError;
        }
        console.warn('API error in mock mode (continuing anyway):', apiError);
      }

      // Always mark the action as having gratitude sent
      // (This works regardless of API success when in mock mode)
      onGratitudeSent(statementId, action.id, message);

      setSendSuccess(true);

      // Automatically close after successful send
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Failed to send gratitude:', error);
      setSendError(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as Error).message
          : 'Failed to send gratitude email. Please try again later.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent headerTitle='Send Gratitude'>
          <div
            className='relative rounded-md overflow-hidden'
            style={{
              border: '8px solid transparent',
              borderImage:
                'repeating-linear-gradient(45deg, #ff69b4, #ff69b4 10px, #fb86b0 10px, #fb86b0 20px) 8',
              padding: '16px',
              margin: '-8px',
              background: '#f9f9f9',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Heart decoration */}
            <div className='absolute top-4 right-4 text-pink-400 opacity-20 pointer-events-none'>
              <Heart size={40} />
            </div>

            <DialogDescription className='mt-0 text-center'>
              Express gratitude for this action
            </DialogDescription>

            <div className='text-center mb-4'>
              <p className='text-sm text-gray-500 mt-1'>
                To: {managerName || managerEmail || 'No recipient set'}
              </p>
              {sendSuccess && (
                <p className='text-green-600 text-sm font-medium mt-2 bg-green-50 py-1 px-2 rounded-full inline-block'>
                  ✓ Gratitude sent successfully!
                </p>
              )}
            </div>

            {sendError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
                {sendError}
              </div>
            )}

            <div className='mb-6 p-4 bg-white rounded-md shadow-sm border border-pink-100'>
              <h3 className='font-semibold text-gray-700 mb-2 flex items-center'>
                <span className='mr-2'>→</span>
                Action
              </h3>
              <p className='text-gray-600'>{action.action}</p>
              {action.byDate && (
                <p className='text-xs text-gray-500 mt-1'>
                  Due by: {action.byDate}
                </p>
              )}
            </div>

            <div className='mb-6'>
              <label
                htmlFor='gratitude-message'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Your gratitude message:
              </label>
              <textarea
                id='gratitude-message'
                rows={4}
                className='w-full rounded-md border border-pink-200 focus:border-pink-500 focus:ring-pink-500 text-gray-900 p-3'
                placeholder='Express your thanks and appreciation here...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className='text-xs text-gray-500 mt-1'>
                This message will be sent with your gratitude email.
              </p>
            </div>

            <div className='mt-6 flex justify-center gap-4'>
              <Button
                variant='default'
                onClick={handleSendGratitude}
                disabled={isSending || !message.trim() || !managerEmail}
                className='shadow-sm bg-pink-600 hover:bg-pink-700 text-white'
              >
                {isSending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Heart className='mr-2 h-4 w-4' />
                    <span>Send Gratitude</span>
                  </>
                )}
              </Button>
              <Button variant='outline' onClick={onClose}>
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GratitudeModal;
