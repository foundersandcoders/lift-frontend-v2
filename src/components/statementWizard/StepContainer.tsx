'use client';

import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface StepContainerProps {
  subQuestion: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({
  subQuestion,
  showBack = false,
  onBack,
  children,
}) => (
  <div className='p-2 space-y-4'>
    <div className='flex items-center'>
      {showBack && onBack && (
        <Button variant='ghost' size='icon' onClick={onBack} className='mr-2'>
          <ArrowLeft className='w-4 h-4' />
        </Button>
      )}
      <h2 className='text-xl font-semibold'>{subQuestion}</h2>
    </div>
    {children}
  </div>
);

export default StepContainer;
