'use client';

import React, { useState, useEffect } from 'react';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { useAuth } from '../../features/auth/hooks/useAuth';
import {
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Save, X, User, Mail, Award, Edit2, LogOut } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { validateEmail } from '../../lib/utils/validateEmail';
import QuestionCounter from '../ui/questionCounter/QuestionCounter';
import LargeCircularQuestionCounter from '../ui/questionCounter/LargeCircularQuestionCounter';

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
  const [usernameInput, setUsernameInput] = useState(
    data.username || ''
  );
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
  }, [isEditingContact, isEditingUsername, data.managerEmail, data.managerName, data.username]);

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

  return (
    <DialogContent
      headerTitle="User's Data"
      className='sm:max-w-md p-0'
    >
      <DialogDescription className='sr-only'>
        Dashboard with user information and settings.
      </DialogDescription>
      <div className='relative rounded-lg overflow-hidden' 
           style={{
             background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
             boxShadow: 'inset 0 0 0 1px rgba(255, 105, 180, 0.15)'
           }}>
        
        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none'>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#ff69b4" />
            <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className='p-6'>
          {/* User Profile Section - Compact layout */}
          <div className='mb-4 flex flex-wrap items-start gap-4'>
            {/* Username section */}
            <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100 flex-1 min-w-[180px]'>
              <div className='flex items-center justify-between mb-1'>
                <div className='flex items-center'>
                  <User size={16} className='text-brand-pink mr-1' />
                  <div className='text-xs font-semibold text-gray-700'>Your name</div>
                </div>
                {!isEditingUsername && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                        aria-label="Edit your name"
                        onClick={() => setIsEditingUsername(true)}
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
                    placeholder="Enter your name"
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
                    >
                      <X size={12} className='mr-1' />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='bg-pink-50 px-2 py-1 rounded-md text-sm font-medium text-gray-800'>
                  {data.username || 'Not set'}
                </div>
              )}
            </div>

            {/* Manager contact section - more compact */}
            <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100 flex-1 min-w-[180px]'>
              <div className='flex items-center justify-between mb-1'>
                <div className='flex items-center'>
                  <Mail size={16} className='text-brand-pink mr-1' />
                  <div className='text-xs font-semibold text-gray-700'>Line manager</div>
                </div>
                {!isEditingContact && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                        aria-label="Edit your line manager's details"
                        onClick={() => setIsEditingContact(true)}
                      >
                        <Edit2 size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Edit line manager's details</TooltipContent>
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
                      <div className='text-red-500 text-xs mt-0.5'>{emailError}</div>
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
                    <span className='font-medium text-gray-800'>
                      {data.managerName || 'Not set'}
                    </span>
                  </div>
                  <div className='bg-pink-50 px-2 py-1 rounded-md'>
                    <span className='text-xs text-gray-500'>Email:</span>{' '}
                    <span className='font-medium text-gray-800'>
                      {data.managerEmail || 'Not set'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress section - more compact */}
          <div className='bg-white rounded-lg p-3 shadow-sm border border-pink-100 mb-4'>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center'>
                <Award size={16} className='text-brand-pink mr-1' />
                <div className='text-xs font-semibold text-gray-700'>Your progress</div>
              </div>
              <QuestionCounter />
            </div>
            <div className='bg-pink-50 p-2 rounded-lg flex justify-center'>
              <LargeCircularQuestionCounter />
            </div>
          </div>
          
          {/* Sign Out section */}
          <button 
            onClick={handleSignOut}
            className='w-full flex items-center justify-center py-3 px-4 rounded-md border border-pink-100 text-red-600 hover:bg-red-50 transition-colors'
          >
            <LogOut size={18} className='mr-2' />
            <span className='font-medium'>Sign Out</span>
          </button>
        </div>
      </div>
      
      <DialogFooter className='p-4 bg-gray-50 sm:rounded-b-lg'>
        <Button
          onClick={() => onOpenChange(false)}
          variant='pink'
          className='w-full sm:w-auto'
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserDataModal;