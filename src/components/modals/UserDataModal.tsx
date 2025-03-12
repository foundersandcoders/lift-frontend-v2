'use client';

import React, { useState, useEffect } from 'react';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { useAuth } from '../../features/auth/api/hooks';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Save, X, User, Mail, Award, Edit2, LogOut, Shield } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/better-tooltip';
import { validateEmail } from '../../lib/utils/validateEmail';
import QuestionCounter from '../ui/questionCounter/QuestionCounter';
import ProgressWithFeedback from '../ui/progress/ProgressWithFeedback';

interface UserDataModalProps {
  onOpenChange: (open: boolean) => void;
}

const UserDataModal: React.FC<UserDataModalProps> = ({ onOpenChange }) => {
  const { data, setData } = useEntries();
  const { signOut } = useAuth();
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [managerEmailInput, setManagerEmailInput] = useState(
    data.managerEmail || ''
  );
  const [managerNameInput, setManagerNameInput] = useState(
    data.managerName || ''
  );
  const [usernameInput, setUsernameInput] = useState(data.username || '');
  const [emailError, setEmailError] = useState('');

  const handleSignOut = async () => {
    await signOut();
    // Clear user data from entries context
    setData({ type: 'SET_USERNAME', payload: '' });
    setData({ type: 'SET_MANAGER_NAME', payload: '' });
    setData({ type: 'SET_MANAGER_EMAIL', payload: '' });
    // Close modal
    onOpenChange(false);
  };

  // Sync local inputs with context when edit mode is activated.
  useEffect(() => {
    if (isEditingContact) {
      setManagerEmailInput(data.managerEmail || '');
      setManagerNameInput(data.managerName || '');
    }
    if (isEditingUsername) {
      setUsernameInput(data.username || '');
    }
  }, [
    isEditingContact,
    isEditingUsername,
    data.managerEmail,
    data.managerName,
    data.username,
  ]);

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

  const handleSaveUsername = () => {
    setData({ type: 'SET_USERNAME', payload: usernameInput });
    setIsEditingUsername(false);
  };

  // Handler for clicks outside the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the overlay (not on the modal content)
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50'
      onClick={handleOutsideClick}
    >
      <div 
        className='bg-white m-2 sm:m-5 max-w-3xl w-full min-w-[280px] rounded-lg p-0 overflow-hidden shadow-xl'
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className='bg-brand-pink p-2 flex items-center justify-between sm:rounded-t-lg'>
          <h2 className='text-xl font-semibold text-white'>User's Data</h2>
          <button
            className='text-white focus:outline-none focus:ring-2 focus:ring-white rounded-sm'
            onClick={() => onOpenChange(false)}
          >
            <X size={24} />
          </button>
        </div>

        <p className='sr-only'>Dashboard with user information and settings.</p>

        <div
          className='relative overflow-auto'
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
          }}
        >
          <div className='p-4 sm:p-6'>
            {/* Main content with responsive layout */}
            <div className='flex flex-col sm:flex-row gap-4'>
              {/* Left column for desktop (stacked on mobile) */}
              <div className='flex flex-col space-y-4 sm:w-1/2 sm:self-stretch'>
                {/* Username section */}
                <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100'>
                  <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center'>
                      <User size={16} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Your name
                      </div>
                    </div>
                    {!isEditingUsername && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                            aria-label='Edit your name'
                            onClick={() => setIsEditingUsername(true)}
                            type='button'
                          >
                            <Edit2 size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Edit your name</TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {isEditingUsername ? (
                    <div className='space-y-2'>
                      <Input
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder='Enter your name'
                        aria-label='Your Name'
                        className='w-full border-pink-200 focus:border-brand-pink text-sm'
                      />
                      <div className='flex space-x-2'>
                        <Button
                          onClick={handleSaveUsername}
                          variant='pink'
                          size='sm'
                          aria-label='Save Name'
                          className='px-2 py-0.5 h-auto text-xs'
                          type='button'
                        >
                          <Save size={12} className='mr-1' />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingUsername(false);
                            setUsernameInput(data.username || '');
                          }}
                          variant='outline'
                          size='sm'
                          aria-label='Cancel Editing'
                          className='px-2 py-0.5 h-auto text-xs'
                          type='button'
                        >
                          <X size={12} className='mr-1' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='bg-pink-50 px-2 py-1 rounded-md text-sm font-medium text-gray-800 break-words'>
                      {data.username || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Manager contact section */}
                <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100 flex-grow'>
                  <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center'>
                      <Mail size={16} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Line manager's details
                      </div>
                    </div>
                    {!isEditingContact && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                            aria-label="Edit your line manager's details"
                            onClick={() => setIsEditingContact(true)}
                            type='button'
                          >
                            <Edit2 size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Edit line manager's details
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {isEditingContact ? (
                    <div className='space-y-2'>
                      <div>
                        <Input
                          value={managerNameInput}
                          onChange={(e) => setManagerNameInput(e.target.value)}
                          placeholder="Manager's name"
                          aria-label='Manager Name'
                          className='w-full border-pink-200 focus:border-brand-pink text-sm mb-1'
                        />
                      </div>
                      <div>
                        <Input
                          value={managerEmailInput}
                          onChange={(e) => setManagerEmailInput(e.target.value)}
                          placeholder="Manager's email"
                          aria-label='Manager Email'
                          className='w-full border-pink-200 focus:border-brand-pink text-sm'
                        />
                        {emailError && (
                          <div className='text-red-500 text-xs mt-0.5'>
                            {emailError}
                          </div>
                        )}
                      </div>
                      <div className='flex space-x-2'>
                        <Button
                          onClick={handleSaveContact}
                          variant='pink'
                          size='sm'
                          aria-label='Save Contact'
                          className='px-2 py-0.5 h-auto text-xs'
                          disabled={
                            managerEmailInput.trim() !== '' &&
                            !validateEmail(managerEmailInput.trim())
                          }
                          type='button'
                        >
                          <Save size={12} className='mr-1' />
                          Save
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
                          className='px-2 py-0.5 h-auto text-xs'
                          type='button'
                        >
                          <X size={12} className='mr-1' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm'>
                      <div className='bg-pink-50 px-2 py-1 rounded-md mb-1'>
                        <span className='text-xs text-gray-500'>Name:</span>{' '}
                        <span className='font-medium text-gray-800 break-words'>
                          {data.managerName || 'Not set'}
                        </span>
                      </div>
                      <div className='bg-pink-50 px-2 py-1 rounded-md'>
                        <span className='text-xs text-gray-500'>Email:</span>{' '}
                        <span className='font-medium text-gray-800 break-all'>
                          {data.managerEmail || 'Not set'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column for desktop (Progress) */}
              <div className='sm:w-1/2 flex sm:self-stretch'>
                {/* Progress section */}
                <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100 w-full'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <Award size={16} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Your progress
                      </div>
                    </div>
                    <QuestionCounter />
                  </div>
                  <div className='bg-pink-50 p-2 sm:p-4 rounded-lg'>
                    <ProgressWithFeedback />
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out and Close buttons in a row at the bottom */}
            <div className='flex justify-between mt-4'>
              <Button
                variant='outline'
                className='px-4'
                type='button'
                onClick={() => onOpenChange(false)}
              >
                <X size={16} className='mr-1.5' />
                Close
              </Button>

              <button
                onClick={handleSignOut}
                className='flex items-center justify-center py-2 px-4 rounded-md border border-pink-100 text-red-600 hover:bg-red-50 transition-colors'
                type='button'
              >
                <LogOut size={16} className='mr-1.5' />
                <span className='font-medium'>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataModal;
