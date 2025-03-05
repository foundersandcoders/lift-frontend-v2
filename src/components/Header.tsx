// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useEntries } from '../hooks/useEntries';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Edit2, Save, X } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { validateEmail } from '../../utils/validateEmail';
import QuestionCounter from './ui/questionCounter/QuestionCounter';
import SmallCircularQuestionCounter from './ui/questionCounter/smallCircularQuestionCounter';
import LargeCircularQuestionCounter from './ui/questionCounter/LargeCircularQuestionCounter';

const Header: React.FC = () => {
  const { data, setData } = useEntries();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  // Combined editing state for manager details
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [managerEmailInput, setManagerEmailInput] = useState(
    data.managerEmail || ''
  );
  const [managerNameInput, setManagerNameInput] = useState(
    data.managerName || ''
  );
  const [emailError, setEmailError] = useState('');

  // Sync local inputs with context when edit mode is activated.
  useEffect(() => {
    if (isEditingContact) {
      setManagerEmailInput(data.managerEmail || '');
      setManagerNameInput(data.managerName || '');
    }
  }, [isEditingContact, data.managerEmail, data.managerName]);

  const handleSaveContact = () => {
    if (managerEmailInput.trim() && !validateEmail(managerEmailInput.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setData({ type: 'SET_MANAGER_EMAIL', payload: managerEmailInput });
    setData({ type: 'SET_MANAGER_NAME', payload: managerNameInput });
    setIsEditingContact(false);
    setEmailError('');
  };

  return (
    <header className='bg-brand-pink text-white p-4 shadow-md'>
      <div className='container mx-auto flex items-center justify-between'>
        {/* Left side: Logo and Title */}
        <div className='flex items-center'>
          <img src='/lift_logo.png' alt='Logo' className='h-10 mr-2' />
          <h1 className='text-2xl font-bold'>Beacons</h1>
        </div>
        {/* Right side: User info & dashboard */}
        {data.username ? (
          <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
            <DialogTrigger asChild>
              <div className='flex items-center border-2 border-white rounded-full px-4 py-2 cursor-pointer'>
                {data.username ? (
                  <span className='mr-2'>Logged as: {data.username}</span>
                ) : (
                  <span className='mr-2'>Not logged in</span>
                )}
                <SmallCircularQuestionCounter />
              </div>
            </DialogTrigger>
            <DialogContent
              headerTitle="User's Data"
              className='sm:max-w-md p-0'
            >
              <DialogDescription className='sr-only'>
                Dashboard with user information and settings.
              </DialogDescription>
              <div className='bg-gray-50 p-4'>
                {/* Username section */}
                <div>
                  <div className='text-sm font-semibold text-gray-700 mb-1'>
                    Your name:
                  </div>
                  <div className='text-sm text-gray-800'>
                    {data.username || 'Not set'}
                  </div>
                </div>
                {/* Manager contact section */}
                <div className='mt-4'>
                  <div className='text-sm font-semibold text-gray-700 mb-1'>
                    Your line manager's details:
                  </div>
                  {isEditingContact ? (
                    <div className='space-y-2'>
                      <Input
                        value={managerNameInput}
                        onChange={(e) => setManagerNameInput(e.target.value)}
                        placeholder="Enter manager's name (optional)"
                        aria-label='Manager Name'
                        className='w-full'
                      />
                      <Input
                        value={managerEmailInput}
                        onChange={(e) => setManagerEmailInput(e.target.value)}
                        placeholder="Enter manager's email (optional)"
                        aria-label='Manager Email'
                        className='w-full'
                      />
                      {emailError && (
                        <div className='text-red-500 text-xs mt-1'>
                          {emailError}
                        </div>
                      )}
                      <div className='flex space-x-2'>
                        <Button
                          onClick={handleSaveContact}
                          variant='outline'
                          size='sm'
                          aria-label='Save Contact'
                          disabled={
                            managerEmailInput.trim() !== '' &&
                            !validateEmail(managerEmailInput.trim())
                          }
                        >
                          <Save size={16} className='text-green-500' />
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingContact(false);
                            setManagerEmailInput(data.managerEmail || '');
                            setManagerNameInput(data.managerName || '');
                            setEmailError('');
                          }}
                          variant='outline'
                          size='sm'
                          aria-label='Cancel Editing'
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center space-x-2'>
                      <div className='text-sm text-gray-800'>
                        {data.managerName ? data.managerName : 'Name not set'} |{' '}
                        {data.managerEmail
                          ? data.managerEmail
                          : 'Email not set'}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className='flex items-center justify-center rounded-full bg-white p-2 text-brand-pink'
                            aria-label="Edit your line manager's details"
                            onClick={() => setIsEditingContact(true)}
                          >
                            <Edit2 size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Edit your line manager's details
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
                {/* Progress section */}
                <div>
                  <div className='text-sm font-semibold text-gray-700 mb-1'>
                    Your progress:
                  </div>
                  <div className='text-sm text-gray-800'>
                    <QuestionCounter />
                    <LargeCircularQuestionCounter />
                  </div>
                </div>
              </div>
              <DialogFooter className='p-4 bg-gray-50 sm:rounded-b-lg'>
                <Button
                  onClick={() => setIsDashboardOpen(false)}
                  variant='outline'
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <div className='flex items-center border-2 border-white rounded-full px-4 py-2 cursor-default'>
            <span className='mr-2'>Not logged</span>
            <SmallCircularQuestionCounter />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
