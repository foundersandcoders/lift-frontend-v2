import React from 'react';
import StepContainer from '../StepContainer';

interface ComplementStepProps {
  currentStep?: number;
  totalSteps?: number;
}

export const ComplementStep: React.FC<ComplementStepProps> = ({
  currentStep = 5,
  totalSteps = 5,
}) => {
  const subQuestion = 'Add additional statement if needed';
  return (
    <StepContainer
      subQuestion={subQuestion}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='text-center p-4'>
        <p className='text-lg'>
          If you feel your statement didn't fully answer the question, you can
          later create your own statements to complement it.
        </p>
      </div>
    </StepContainer>
  );
};
