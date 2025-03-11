import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '@/components/ui/button';
import { MailX, MailPlus } from 'lucide-react';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (val: boolean) => void;
  isSubmitting?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,
  isSubmitting = false,
  currentStep = 5,
  totalSteps = 5,
}) => {
  const subQuestion = 'Who can see this statement?';

  return (
    <StepContainer 
      subQuestion={subQuestion} 
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='space-y-6'>
        <div className='space-y-4'>
          <Button
            variant='outline'
            selected={!isPublic}
            disabled={isSubmitting}
            className='w-full h-auto p-4 flex items-center justify-between'
            onClick={() => onUpdate(false)}
            style={
              {
                '--tile-color': 'var(--privacy-selector)',
              } as React.CSSProperties
            }
          >
            <div className='flex items-center space-x-3'>
              <MailX className='w-5 h-5 text-gray-500' />
              <div className='text-left'>
                <div className='font-medium'>Private</div>
                <div className='text-sm text-muted-foreground'>
                  Only you can see this
                </div>
              </div>
            </div>
          </Button>
          <Button
            variant='outline'
            selected={isPublic}
            disabled={isSubmitting}
            className='w-full h-auto p-4 flex items-center justify-between'
            onClick={() => onUpdate(true)}
            style={
              {
                '--tile-color': 'var(--privacy-selector)',
              } as React.CSSProperties
            }
          >
            <div className='flex items-center space-x-3'>
              <MailPlus className='w-5 h-5 text-green-500' />
              <div className='text-left'>
                <div className='font-medium'>Public</div>
                <div className='text-sm text-muted-foreground'>
                  Everyone can see this
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </StepContainer>
  );
};
