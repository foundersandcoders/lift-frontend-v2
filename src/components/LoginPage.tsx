'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LoginPageProps {
  onSubmit: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <h1 className='text-3xl font-bold mb-4'>Welcome!</h1>
      <p className='mb-4'>Please enter your name to continue:</p>
      <form onSubmit={handleSubmit} className='w-full max-w-sm'>
        <Input
          placeholder='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type='submit' className='mt-4 w-full'>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
