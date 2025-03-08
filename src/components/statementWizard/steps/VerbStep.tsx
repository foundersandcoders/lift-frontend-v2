import React from 'react';
import StepContainer from '../StepContainer';
import SentimentVerbPicker from '../SentimentVerbPicker';
import type { Verb } from '../../../../types/entries';

interface VerbStepProps {
  subject: string;
  selection: string;
  onUpdate: (val: string) => void;
}

export const VerbStep: React.FC<VerbStepProps> = ({
  subject,
  selection,
  onUpdate,
}) => {
  const subQuestion = `What's happening with ${subject}? How do they feel or what do they experience?`;

  return (
    <StepContainer subQuestion={subQuestion}>
      <div className='flex flex-col h-[60vh] p-4 rounded-md'>
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
