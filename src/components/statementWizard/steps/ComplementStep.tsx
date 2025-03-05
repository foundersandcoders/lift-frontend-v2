// src/components/statementWizard/steps/ComplementStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '../../ui/button';

interface ComplementStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ComplementStep: React.FC<ComplementStepProps> = ({
  onComplete,
  onBack,
}) => {
  const subQuestion = 'Add additional statement if needed';
  return (
    <StepContainer subQuestion={subQuestion} showBack onBack={onBack}>
      <div className='text-center p-4'>
        <p className='text-lg'>
          If you feel your statement didn't fully answer the question, you can
          later add custom statements to complement it.
        </p>
      </div>
      <Button onClick={onComplete} variant='pink' className='mx-auto mt-4'>
        Finish
      </Button>
    </StepContainer>
  );
};
