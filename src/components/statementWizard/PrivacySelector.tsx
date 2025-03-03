import React from 'react';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacySelectorProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  onComplete: () => void;
}

export const PrivacySelector: React.FC<PrivacySelectorProps> = ({
  isPublic,
  onChange,
  onComplete,
}) => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-center'>
        Who can see this statement?
      </h2>
      <div className='space-y-4'>
        <Button
          variant='outline'
          className={`w-full h-auto p-4 flex items-center justify-between ${
            !isPublic ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onChange(false)}
        >
          <div className='flex items-center space-x-3'>
            <EyeOff className='w-5 h-5' />
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
          className={`w-full h-auto p-4 flex items-center justify-between ${
            isPublic ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onChange(true)}
        >
          <div className='flex items-center space-x-3'>
            <Eye className='w-5 h-5' />
            <div className='text-left'>
              <div className='font-medium'>Public</div>
              <div className='text-sm text-muted-foreground'>
                Everyone can see this
              </div>
            </div>
          </div>
        </Button>
      </div>
      <Button variant='pink' className='mx-auto' onClick={onComplete}>
        Create Statement
      </Button>
    </div>
  );
};
