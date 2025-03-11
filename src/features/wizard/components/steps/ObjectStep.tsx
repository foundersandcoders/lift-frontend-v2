// src/components/statementWizard/steps/ObjectStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Input } from '../../../../components/ui/input';
import { getVerbName } from '@/lib/utils/verbUtils';

interface ObjectStepProps {
  subject: string;
  verb: string;
  selection: string;
  onUpdate: (val: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export const ObjectStep: React.FC<ObjectStepProps> = ({
  subject,
  verb,
  selection,
  onUpdate,
  currentStep = 3,
  totalSteps = 5,
}) => {
  const subQuestion = `In what way does ${subject} ${getVerbName(
    verb
  )}? What's the context?`;

  return (
    <StepContainer 
      subQuestion={subQuestion}
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='p-4 rounded-md'>
        <Input
          autoFocus
          placeholder='Type your answer...'
          value={selection}
          onChange={(e) => onUpdate(e.target.value)}
          className='text-lg p-4 rounded'
        />
      </div>
    </StepContainer>
  );
};
