import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '@/components/ui/Button';
import { MailX, MailPlus } from 'lucide-react';
import { useEntries } from '@/features/statements/hooks/useEntries';

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
  currentStep = 5, // Still the final step
  totalSteps = 5,
}) => {
  const { data } = useEntries();
  const { managerName } = data;
  const subQuestion = 'Who can see this statement?';

  return (
    <StepContainer
      subQuestion={subQuestion}
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='space-y-4 '>
        <Button
          variant='outline'
          selected={!isPublic}
          disabled={isSubmitting}
          className='w-full h-auto p-2 flex items-center justify-between'
          onClick={() => onUpdate(false)}
          style={
            {
              '--tile-color': 'var(--privacy-selector)',
            } as React.CSSProperties
          }
        >
          <div className='flex items-center space-x-3'>
            <MailX className='w-5 h-5 text-black' />
            <div className='text-left text-black'>
              <div className='font-medium'>Private</div>
              <div className='text-sm'>
                {managerName 
                  ? `This won't be shared with ${managerName}`
                  : "This won't be shared with your manager"
                }
              </div>
            </div>
          </div>
        </Button>
        <Button
          variant='outline'
          selected={isPublic}
          disabled={isSubmitting}
          className='w-full h-auto p-2 flex items-center justify-between'
          onClick={() => onUpdate(true)}
          style={
            {
              '--tile-color': 'var(--privacy-selector)',
            } as React.CSSProperties
          }
        >
          <div className='flex items-center space-x-3'>
            <MailPlus className='w-5 h-5 text-green-500' />
            <div className='text-left text-black'>
              <div className='font-medium'>Public</div>
              <div className='text-sm'>
                {managerName 
                  ? `This will be shared with ${managerName}`
                  : "This will be shared with your manager"
                }
              </div>
            </div>
          </div>
        </Button>
      </div>
    </StepContainer>
  );
};
