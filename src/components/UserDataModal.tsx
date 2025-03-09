'use client';

import React, { useState, useEffect } from 'react';
import { useEntries } from '../hooks/useEntries';
import {
  DialogContent,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save, X, User, Mail, Award, Edit2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { validateEmail } from '../../utils/validateEmail';
import QuestionCounter from './ui/questionCounter/QuestionCounter';
import LargeCircularQuestionCounter from './ui/questionCounter/LargeCircularQuestionCounter';

interface UserDataModalProps {
  onOpenChange: (open: boolean) => void;
}

const UserDataModal: React.FC<UserDataModalProps> = ({ onOpenChange }) => {
  const { data, setData } = useEntries();
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
          {/* Username section */}
          <div className='mb-6 bg-white rounded-lg p-4 shadow-sm border border-pink-100'>
            <div className='flex items-center mb-2'>
              <User size={18} className='text-brand-pink mr-2' />
              <div className='text-sm font-semibold text-gray-700'>
                Your name
              </div>
            </div>
            <div className='ml-6 text-lg font-medium text-gray-800 bg-pink-50 px-3 py-2 rounded-md'>
              {data.username || 'Not set'}
            </div>
          </div>
          
          {/* Manager contact section */}
          <div className='mb-6 bg-white rounded-lg p-4 shadow-sm border border-pink-100'>
            <div className='flex items-center mb-2'>
              <Mail size={18} className='text-brand-pink mr-2' />
              <div className='text-sm font-semibold text-gray-700'>
                Your line manager's details
              </div>
              {!isEditingContact && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className='ml-auto flex items-center justify-center rounded-full bg-pink-50 p-2 text-brand-pink hover:bg-pink-100 transition-colors'
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
              )}
            </div>
            
            {isEditingContact ? (
              <div className='ml-6 space-y-3'>
                <div>
                  <label className='text-xs text-gray-500 block mb-1'>Name</label>
                  <Input
                    value={managerNameInput}
                    onChange={(e) => setManagerNameInput(e.target.value)}
                    placeholder="Enter manager's name (optional)"
                    aria-label='Manager Name'
                    className='w-full border-pink-200 focus:border-brand-pink'
                  />
                </div>
                <div>
                  <label className='text-xs text-gray-500 block mb-1'>Email</label>
                  <Input
                    value={managerEmailInput}
                    onChange={(e) => setManagerEmailInput(e.target.value)}
                    placeholder="Enter manager's email (optional)"
                    aria-label='Manager Email'
                    className='w-full border-pink-200 focus:border-brand-pink'
                  />
                  {emailError && (
                    <div className='text-red-500 text-xs mt-1'>
                      {emailError}
                    </div>
                  )}
                </div>
                <div className='flex space-x-2 pt-2'>
                  <Button
                    onClick={handleSaveContact}
                    variant='pink'
                    size='sm'
                    aria-label='Save Contact'
                    className='px-4 py-1 h-auto text-sm'
                    disabled={
                      managerEmailInput.trim() !== '' &&
                      !validateEmail(managerEmailInput.trim())
                    }
                  >
                    <Save size={14} className='mr-1' />
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
                    className='px-4 py-1 h-auto text-sm'
                  >
                    <X size={14} className='mr-1' />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className='ml-6 space-y-1'>
                <div className='bg-pink-50 px-3 py-2 rounded-md'>
                  <span className='text-xs text-gray-500 block'>Name</span>
                  <span className='text-md font-medium text-gray-800'>
                    {data.managerName ? data.managerName : 'Not set'}
                  </span>
                </div>
                <div className='bg-pink-50 px-3 py-2 rounded-md'>
                  <span className='text-xs text-gray-500 block'>Email</span>
                  <span className='text-md font-medium text-gray-800'>
                    {data.managerEmail ? data.managerEmail : 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress section */}
          <div className='bg-white rounded-lg p-4 shadow-sm border border-pink-100'>
            <div className='flex items-center mb-3'>
              <Award size={18} className='text-brand-pink mr-2' />
              <div className='text-sm font-semibold text-gray-700'>
                Your progress
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <QuestionCounter className='mb-2' />
              <div className='bg-pink-50 p-4 rounded-lg w-full flex justify-center'>
                <LargeCircularQuestionCounter />
              </div>
            </div>
          </div>
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