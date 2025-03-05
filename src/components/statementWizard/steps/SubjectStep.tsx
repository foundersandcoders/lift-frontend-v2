// src/components/statementWizard/steps/SubjectStep.tsx
import React from 'react';
import { Button } from '../../ui/button';
import StepContainer from '../StepContainer';
import { SubjectTiles } from '../SubjectTiles';
import type { SetQuestion } from '../../../../types/entries';

interface SubjectStepProps {
  username: string;
  presetQuestion?: SetQuestion;
  selection: string; // the current subject value
  onUpdate: (subject: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const SubjectStep: React.FC<SubjectStepProps> = ({
  username,
  presetQuestion,
  selection,
  onUpdate,
  onNext,
  onBack,
}) => {
  // Use a default subject question text
  const subQuestion = `This statement applies to ${username} or someone/something else?`;
  // Check whether descriptors are allowed (if using a preset)
  const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;

  return (
    <StepContainer
      subQuestion={subQuestion}
      showBack={!!onBack}
      onBack={onBack}
    >
      {allowDescriptors === false ? (
        <>
          <div className='text-center p-4 border rounded'>
            <p>{username}</p>
          </div>
          <Button
            onClick={() => {
              onUpdate(username);
              onNext();
            }}
            className='w-full'
          >
            Next
          </Button>
        </>
      ) : (
        <SubjectTiles
          username={username}
          activePresetQuestion={presetQuestion}
          selectedValue={selection}
          onSelect={(value) => {
            onUpdate(value);
            onNext();
          }}
        />
      )}
    </StepContainer>
  );
};
