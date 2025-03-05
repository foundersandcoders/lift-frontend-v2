// src/components/statementWizard/steps/ObjectStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface ObjectStepProps {
  subject: string;
  verb: string;
  selection: string; // the current object value
  onUpdate: (objectText: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ObjectStep: React.FC<ObjectStepProps> = ({
  subject,
  verb,
  selection,
  onUpdate,
  onNext,
  onBack,
}) => {
  const subQuestion = `In what way does ${subject} ${verb}? What's the context?`;

  return (
    <StepContainer subQuestion={subQuestion} showBack onBack={onBack}>
      <div className='p-4 rounded-md'>
        <Input
          autoFocus
          placeholder='Type your answer...'
          value={selection}
          onChange={(e) => onUpdate(e.target.value)}
          className='text-lg p-4 rounded'
        />
      </div>
      <Button
        onClick={() => selection.trim() && onNext()}
        disabled={!selection.trim()}
        variant='pink'
        className='mx-auto'
      >
        Next
      </Button>
    </StepContainer>
  );
};
