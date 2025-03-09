'use client';

import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface StepContainerProps {
  subQuestion: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
}

const StepContainer: React.FC<StepContainerProps> = ({
  subQuestion,
  showBack = false,
  onBack,
  children,
  currentStep = 1,
  totalSteps = 5,
}) => (
  <div className='p-2 space-y-4'>
    <div className='flex items-center mb-2'>
      {showBack && onBack && (
        <Button
          variant='outline'
          size='compact'
          onClick={onBack}
          className='mr-2 p-2'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
      )}
      <div className='flex items-center'>
        <div className='flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-gray-50 mr-2'>
          <span className='text-xs font-medium text-gray-500'>
            {currentStep}/{totalSteps}
          </span>
        </div>
        <h2 className='text-md font-medium text-gray-700'>{subQuestion}</h2>
      </div>
    </div>
    {children}
  </div>
);

export default StepContainer;
