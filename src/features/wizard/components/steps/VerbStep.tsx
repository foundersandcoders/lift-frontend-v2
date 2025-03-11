import React from 'react';
import StepContainer from '../StepContainer';
import SentimentVerbPicker from '../SentimentVerbPicker';
import type { Verb } from '../../../../types/entries';

interface VerbStepProps {
  subject: string;
  selection: string;
  onUpdate: (val: string) => void;
  onConfirm?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const VerbStep: React.FC<VerbStepProps> = ({
  subject,
  selection,
  onUpdate,
  onConfirm,
  currentStep = 2,
  totalSteps = 5,
}) => {
  const subQuestion = `What's happening with ${subject}? How do they feel or what do they experience?`;

  return (
    <StepContainer 
      subQuestion={subQuestion}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='flex flex-col h-[60vh] p-4 rounded-md'>
        <SentimentVerbPicker
          selectedVerbId={selection}
          onVerbSelect={(verb: Verb) => {
            // If this verb is already selected, trigger the confirm function (double-click behavior)
            if (verb.id === selection) {
              console.log('Double-click on already selected verb:', verb.id);
              if (onConfirm) {
                console.log('Calling onConfirm function');
                onConfirm();
              } else {
                console.log('No onConfirm function provided');
              }
            } else {
              onUpdate(verb.id);
            }
          }}
        />
      </div>
    </StepContainer>
  );
};
