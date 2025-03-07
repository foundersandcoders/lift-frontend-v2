// src/components/statementWizard/steps/VerbStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import SentimentVerbPicker from '../SentimentVerbPicker';
import nlp from 'compromise';

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
          selectedVerb={selection}
          onVerbSelect={(verb) => {
            // Process verb to present tense and lowercase it
            const processedVerb = nlp(verb.name)
              .verbs()
              .toPresentTense()
              .out('text')
              .toLowerCase();
            onUpdate(processedVerb);
          }}
        />
      </div>
    </StepContainer>
  );
};
