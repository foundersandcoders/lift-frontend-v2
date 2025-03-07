import React from 'react';
import StepContainer from '../StepContainer';

export const ComplementStep: React.FC = () => {
  const subQuestion = 'Add additional statement if needed';
  return (
    <StepContainer subQuestion={subQuestion}>
      <div className='text-center p-4'>
        <p className='text-lg'>
          If you feel your statement didn't fully answer the question, you can
          later add custom statements to complement it.
        </p>
      </div>
    </StepContainer>
  );
};
