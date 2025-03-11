import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '@/components/ui/button';
import { MailX, MailPlus } from 'lucide-react';
import { clickOkButton } from '../EditStatementModal';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (val: boolean) => void;
  onConfirm?: () => void;
  isSubmitting?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,
  onConfirm,
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
            disabled={isSubmitting}
            className={`w-full h-auto p-4 flex items-center justify-between ${
              !isPublic ? 'border-2 border-primary' : ''
            }`}
            onClick={() => {
              // If already selected as private, click the OK button
              if (!isPublic) {
                console.log('Private already selected, clicking OK button');
                // Try the onConfirm function first, then fall back to direct DOM manipulation
                if (onConfirm) {
                  onConfirm();
                } else {
                  clickOkButton();
                }
              } else {
                // Normal selection behavior
                onUpdate(false);
              }
            }}
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
            disabled={isSubmitting}
            className={`w-full h-auto p-4 flex items-center justify-between ${
              isPublic ? 'border-2 border-primary' : ''
            }`}
            onClick={() => {
              // If already selected as public, click the OK button
              if (isPublic) {
                console.log('Public already selected, clicking OK button');
                // Try the onConfirm function first, then fall back to direct DOM manipulation
                if (onConfirm) {
                  onConfirm();
                } else {
                  clickOkButton();
                }
              } else {
                // Normal selection behavior
                onUpdate(true);
              }
            }}
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
