'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEntries } from '../../features/statements/hooks/useEntries';
import { useAuth } from '../../features/auth/api/hooks';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Save, X, User, Mail, Award, Edit2, LogOut } from 'lucide-react';
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
  
  // Add refs for height measurements
  const userViewRef = useRef<HTMLDivElement>(null);
  const userEditRef = useRef<HTMLDivElement>(null);
  const managerViewRef = useRef<HTMLDivElement>(null);
  const managerEditRef = useRef<HTMLDivElement>(null);
  
  // Store heights in state to handle transitions
  const [userViewHeight, setUserViewHeight] = useState<number>(0);
  const [userEditHeight, setUserEditHeight] = useState<number>(0);
  const [managerViewHeight, setManagerViewHeight] = useState<number>(0);
  const [managerEditHeight, setManagerEditHeight] = useState<number>(0);
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
    setData({ type: 'SET_USER_EMAIL', payload: '' });
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
  
  // Measure content heights when they change or when edit state changes
  useEffect(() => {
    // Use a small delay to ensure the DOM has updated
    const measureHeights = () => {
      setTimeout(() => {
        // Measure user info section heights
        if (userViewRef.current) {
          setUserViewHeight(userViewRef.current.scrollHeight);
        }
        if (userEditRef.current) {
          setUserEditHeight(userEditRef.current.scrollHeight);
        }
        
        // Measure manager info section heights
        if (managerViewRef.current) {
          setManagerViewHeight(managerViewRef.current.scrollHeight);
        }
        if (managerEditRef.current) {
          setManagerEditHeight(managerEditRef.current.scrollHeight);
        }
      }, 10);
    };
    
    measureHeights();
    
    // Add resize listener to handle window size changes
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [isEditingUsername, isEditingContact, data.username, data.userEmail, data.managerName, data.managerEmail]);

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
  
  // Handle keyboard events for input fields
  const handleKeyDown = (e: React.KeyboardEvent, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunction();
    }
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
          <div className='p-3 max-h-[calc(100vh-140px)] overflow-y-auto'>
            {/* Main content with responsive layout */}
            <div className='flex flex-col sm:flex-row gap-2'>
              {/* Left column for desktop (stacked on mobile) */}
              <div className='flex flex-col space-y-2 sm:w-1/2 sm:self-stretch'>
                {/* User Profile Section */}
                <div className='bg-white rounded-lg p-2 shadow-sm border border-pink-100 transition-all duration-300'>
                  {/* User Information Title */}
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <User size={14} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Your information
                      </div>
                    </div>
                    {!isEditingUsername && (
                      <button
                        className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                        aria-label='Edit your name'
                        onClick={() => setIsEditingUsername(true)}
                        type='button'
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>

                  <div className='overflow-hidden transition-height duration-300' style={{height: isEditingUsername ? `${userEditHeight}px` : `${userViewHeight}px`}}>
                  {isEditingUsername ? (
                    <div className='space-y-2' ref={userEditRef}>
                      <div>
                        <label
                          htmlFor='username'
                          className='block text-xs font-medium text-gray-500 mb-0.5'
                        >
                          Your Name
                        </label>
                        <input
                          id='username'
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, handleSaveUsername)}
                          placeholder='Enter your name'
                          aria-label='Your Name'
                          className='w-full h-8 rounded-md border border-pink-200 focus:border-brand-pink text-gray-500 text-sm px-2'
                        />
                      </div>

                      {data.userEmail && (
                        <div className='flex flex-col sm:flex-row sm:items-center gap-1'>
                          <div className='flex-1'>
                            <label
                              htmlFor='useremail'
                              className='block text-xs font-medium mb-0.5'
                            >
                              <span className='text-gray-500'>Your Email</span>
                              <span className='ml-1 text-gray-400 italic'>
                                (cannot be changed)
                              </span>
                            </label>
                            <div className='flex h-8'>
                              <input
                                id='useremail'
                                value={data.userEmail}
                                readOnly
                                disabled
                                className='w-full h-full rounded-l-md bg-gray-100 border border-gray-200 text-gray-500 text-xs px-2'
                              />
                              <div className='flex items-center justify-center bg-gray-100 text-gray-500 px-1 rounded-r-md border border-l-0 border-gray-200 h-full'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='10'
                                  height='10'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                >
                                  <rect
                                    x='3'
                                    y='11'
                                    width='18'
                                    height='11'
                                    rx='2'
                                    ry='2'
                                  ></rect>
                                  <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className='flex justify-end space-x-2 mt-2'>
                        <Button
                          onClick={handleSaveUsername}
                          variant='pink'
                          size='sm'
                          aria-label='Save Name'
                          className='px-2 py-0.5 h-6 text-xs'
                          type='button'
                        >
                          <Save size={10} className='mr-1' />
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
                          className='px-2 py-0.5 h-6 text-xs'
                          type='button'
                        >
                          <X size={10} className='mr-1' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm' ref={userViewRef}>
                      <div className='bg-pink-50 px-2 py-1 rounded-md mb-1'>
                        <span className='text-xs text-gray-500'>Name:</span>{' '}
                        <span className='font-medium text-gray-800 break-words'>
                          {data.username || 'Not set'}
                        </span>
                      </div>

                      {data.userEmail && (
                        <div className='bg-pink-50 px-2 py-1 rounded-md mt-2'>
                          <span className='text-xs text-gray-500'>Email:</span>{' '}
                          <span className='font-medium text-gray-800 break-all'>
                            {data.userEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>

                {/* Manager contact section */}
                <div className='bg-white rounded-lg p-2 shadow-sm border border-pink-100 flex-grow transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <Mail size={14} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Line manager's info
                      </div>
                    </div>
                    {!isEditingContact && (
                      <button
                        className='flex items-center justify-center rounded-full bg-pink-50 p-1 text-brand-pink hover:bg-pink-100 transition-colors'
                        aria-label="Edit your line manager's details"
                        onClick={() => setIsEditingContact(true)}
                        type='button'
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>

                  <div className='overflow-hidden transition-height duration-300' style={{height: isEditingContact ? `${managerEditHeight}px` : `${managerViewHeight}px`}}>
                  {isEditingContact ? (
                    <div className='space-y-2' ref={managerEditRef}>
                      <div>
                        <label
                          htmlFor='managerName'
                          className='block text-xs font-medium text-gray-500 mb-0.5'
                        >
                          Manager's Name
                        </label>
                        <input
                          id='managerName'
                          value={managerNameInput}
                          onChange={(e) => setManagerNameInput(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, handleSaveContact)}
                          placeholder="Manager's name"
                          aria-label='Manager Name'
                          className='w-full h-8 rounded-md border border-pink-200 focus:border-brand-pink text-gray-500 text-sm px-2'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='managerEmail'
                          className='block text-xs font-medium text-gray-500 mb-0.5'
                        >
                          Manager's Email
                        </label>
                        <input
                          id='managerEmail'
                          value={managerEmailInput}
                          onChange={(e) => setManagerEmailInput(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, handleSaveContact)}
                          placeholder="Manager's email"
                          aria-label='Manager Email'
                          className='w-full h-8 rounded-md border border-pink-200 focus:border-brand-pink  text-gray-500 text-sm px-2'
                        />
                        {emailError && (
                          <div className='text-red-500 text-xs mt-0.5'>
                            {emailError}
                          </div>
                        )}
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Button
                          onClick={handleSaveContact}
                          variant='pink'
                          size='sm'
                          aria-label='Save Contact'
                          className='px-2 py-0.5 h-6 text-xs'
                          disabled={
                            managerEmailInput.trim() !== '' &&
                            !validateEmail(managerEmailInput.trim())
                          }
                          type='button'
                        >
                          <Save size={10} className='mr-1' />
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
                          className='px-2 py-0.5 h-6 text-xs'
                          type='button'
                        >
                          <X size={10} className='mr-1' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm' ref={managerViewRef}>
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
              </div>

              {/* Right column for desktop (Progress) */}
              <div className='sm:w-1/2 flex sm:self-stretch'>
                {/* Progress section */}
                <div className='bg-white rounded-lg p-2 shadow-sm border border-pink-100 w-full transition-all duration-300'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <Award size={14} className='text-brand-pink mr-1' />
                      <div className='text-xs font-semibold text-gray-700'>
                        Your progress
                      </div>
                    </div>
                    <QuestionCounter />
                  </div>
                  <div className='bg-pink-50 p-2 rounded-lg'>
                    <ProgressWithFeedback />
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out and Close buttons in a row at the bottom */}
            <div className='flex justify-between mt-2'>
              <Button
                variant='outline'
                className='px-3 py-1 h-8 text-xs'
                type='button'
                onClick={() => onOpenChange(false)}
              >
                <X size={12} className='mr-1' />
                Close
              </Button>

              <button
                onClick={handleSignOut}
                className='flex items-center justify-center py-1 px-3 h-8 rounded-md border border-pink-100 text-red-600 hover:bg-red-50 transition-colors text-xs'
                type='button'
              >
                <LogOut size={12} className='mr-1' />
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
