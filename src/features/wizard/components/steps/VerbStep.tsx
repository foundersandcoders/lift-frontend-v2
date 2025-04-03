import React from 'react';
import StepContainer from '../StepContainer';
import SentimentVerbPicker from '../SentimentVerbPicker';
import type { Verb } from '../../../../types/entries';

interface VerbStepProps {
  subject: string;
  selection: string;
  onUpdate: (val: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export const VerbStep: React.FC<VerbStepProps> = ({
  subject,
  selection,
  onUpdate,
  currentStep = 3, // Updated since category and subject now come first
  totalSteps = 5,
}) => {
  const subQuestion = subject === "I" 
    ? `What's happening with me? How do I feel or what do I experience?`
    : `What's happening with ${subject}? How do they feel or what do they experience?`;

  return (
    <StepContainer
      subQuestion={subQuestion}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='flex flex-col p-2 md:p-4 rounded-md mt-0'>
        <SentimentVerbPicker
          selectedVerbId={selection}
          onVerbSelect={(verb: Verb) => {
            onUpdate(verb.id);
          }}
        />
      </div>
    </StepContainer>
  );
};
