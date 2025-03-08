'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { validateEmail } from '../../utils/validateEmail';

interface LoginPageProps {
  onSubmit: (
    username: string,
    managerName: string,
    managerEmail: string
  ) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailBlur = () => {
    const trimmedEmail = managerEmail.trim();
    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !emailError) {
      onSubmit(name.trim(), managerName.trim(), managerEmail.trim());
    }
  };

  // The button is disabled if name is empty or there is an email error.
  const isSubmitDisabled = !name.trim() || emailError !== '';

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-6 text-center'>Welcome!</h1>
        <p className='mb-6 text-center text-gray-700'>
          Please enter your name and, optionally, your line manager's name and
          email to continue.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full'
          />
          <Input
            placeholder="Enter your manager's name (optional)"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            className='w-full pr-10'
          />
          <Input
            placeholder="Enter your manager's email (optional)"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            onBlur={handleEmailBlur}
            className='w-full pr-10'
          />
          {emailError && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='absolute right-2'>
                  <AlertCircle className='w-5 h-5 text-red-500' />
                </div>
              </TooltipTrigger>
              <TooltipContent className='bg-red-500 text-white p-2 rounded'>
                {emailError}
              </TooltipContent>
            </Tooltip>
          )}

          <Button
            type='submit'
            variant='pink'
            className='mx-auto'
            disabled={isSubmitDisabled}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
