'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginPageProps {
  onSubmit: (username: string, managerEmail: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), managerEmail.trim());
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <h1 className='text-3xl font-bold mb-4'>Welcome!</h1>
      <p className='mb-4'>
        Please enter your name and, optionally, your line manager's email to
        continue:
      </p>
      <form onSubmit={handleSubmit} className='w-full max-w-sm'>
        <Input
          placeholder='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter your manager's email (optional)"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          className='mt-4'
        />
        <Button type='submit' className='mt-4 w-full'>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
