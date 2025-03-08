// src/components/statementWizard/steps/ObjectStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Input } from '../../ui/input';
import { getVerbName } from '../../../../utils/verbUtils';

interface ObjectStepProps {
  subject: string;
  verb: string;
  selection: string;
  onUpdate: (val: string) => void;
}

export const ObjectStep: React.FC<ObjectStepProps> = ({
  subject,
  verb,
  selection,
  onUpdate,
}) => {
  const subQuestion = `In what way does ${subject} ${getVerbName(
    verb
  )}? What's the context?`;

  return (
    <StepContainer subQuestion={subQuestion} showBack>
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
