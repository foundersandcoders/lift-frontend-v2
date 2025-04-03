'use client';

import React from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

// Force Redeploy
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
  <div className='p-1 sm:p-2 space-y-2 sm:space-y-4'>
    <div className='flex items-center mb-1 sm:mb-2 sticky top-0 bg-white z-10 py-1'>
      {showBack && onBack && (
        <Button
          variant='outline'
          size='compact'
          onClick={onBack}
          className='mr-2 p-0 md:p-2'
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
      )}
      <div className='flex items-center'>
        <div className='flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 bg-gray-50 mr-1 sm:mr-2 flex-shrink-0'>
          <span className='text-xs font-medium text-gray-500'>
            {currentStep}/{totalSteps}
          </span>
        </div>
        <h2 className='text-sm sm:text-md font-medium text-gray-700'>
          {subQuestion}
        </h2>
      </div>
    </div>
    <div className='flex-grow overflow-visible'>{children}</div>
  </div>
);

export default StepContainer;
