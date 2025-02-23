'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onSubmit: (username: string, managerEmail: string) => void;
}

const emailRegex = /^\S+@\S+\.\S+$/;

const LoginPage: React.FC<LoginPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (email === '') {
      setEmailError('');
      return true;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailBlur = () => {
    validateEmail(managerEmail.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && validateEmail(managerEmail.trim())) {
      onSubmit(name.trim(), managerEmail.trim());
    }
  };

  // The button is disabled if name is empty or there is an email error.
  const isSubmitDisabled = !name.trim() || emailError !== '';

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-3xl font-bold mb-6 text-center'>Welcome!</h1>
        <p className='mb-6 text-center text-gray-700'>
          Please enter your name and, optionally, your line manager's email to
          continue.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full'
          />
          <div className='relative flex items-center'>
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
          </div>
          <Button
            type='submit'
            variant='ghost'
            className='w-full mt-4'
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
