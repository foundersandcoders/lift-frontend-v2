'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useEntries } from '../hooks/useEntries';

const ShareEmailModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data } = useEntries();
  const managerEmail = data.managerEmail;
  // Only include public statements that are not resolved.
  const publicStatements = data.entries.filter(
    (entry) => entry.isPublic && !entry.isResolved
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] w-full p-4'>
        <DialogTitle className='text-lg font-bold'>
          Sharing with: {managerEmail || 'No manager email set'}
        </DialogTitle>
        <DialogDescription className='mt-2'>
          Below are your public, unresolved statements and their pending
          actions:
        </DialogDescription>
        <div className='mt-4 space-y-4'>
          {publicStatements.length > 0 ? (
            publicStatements.map((entry) => (
              <div
                key={entry.id}
                className='p-4 border rounded bg-white shadow-sm'
              >
                <p className='text-base font-semibold'>{entry.input}</p>
                {entry.actions && entry.actions.length > 0 && (
                  <div className='mt-2 space-y-2'>
                    {entry.actions
                      .filter((action) => !action.completed)
                      .map((action) => (
                        <div
                          key={action.id}
                          className='pl-4 border-l-2 border-gray-300'
                        >
                          <p className='text-sm'>{action.action}</p>
                          {action.byDate && action.byDate.trim() !== '' && (
                            <p className='text-xs text-gray-500'>
                              Due: {action.byDate}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className='text-gray-600'>
              No public unresolved statements available.
            </p>
          )}
        </div>
        <DialogFooter className='mt-4 flex justify-end space-x-4'>
          <Button
            variant='pink'
            onClick={() => {
              /* placeholder for Send */
            }}
          >
            Send
          </Button>
          <Button variant='pink' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareEmailModal;
