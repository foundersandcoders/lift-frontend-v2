import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '../../ui/button';
import { Mail } from 'lucide-react';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (val: boolean) => void;
  isSubmitting?: boolean;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,
  isSubmitting = false,
}) => {
  const subQuestion = 'Who can see this statement?';

  return (
    <StepContainer subQuestion={subQuestion} showBack>
      <div className='space-y-6'>
        <div className='space-y-4'>
          <Button
            variant='outline'
            disabled={isSubmitting}
            className={`w-full h-auto p-4 flex items-center justify-between ${
              !isPublic ? 'border-2 border-primary' : ''
            }`}
            onClick={() => onUpdate(false)}
          >
            <div className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-gray-500' />
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
            onClick={() => onUpdate(true)}
          >
            <div className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-green-500' />
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
