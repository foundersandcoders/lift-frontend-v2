import React from 'react';
import StepContainer from '../StepContainer';
import { SubjectTiles } from '../SubjectTiles';
import type { SetQuestion } from '../../../../types/entries';

interface SubjectStepProps {
  username: string;
  presetQuestion?: SetQuestion;
  selection: string;
  onUpdate: (val: string) => void;
}

export const SubjectStep: React.FC<SubjectStepProps> = ({
  username,
  presetQuestion,
  selection,
  onUpdate,
}) => {
  // Use a default subject question text
  const subQuestion = `This statement applies to ${username} or someone/something else?`;
  // Check whether descriptors are allowed (if using a preset)
  const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;

  return (
    <StepContainer subQuestion={subQuestion}>
      {allowDescriptors === false ? (
        <>
          <div className='text-center p-4 border rounded'>
            <p>{username}</p>
          </div>
        </>
      ) : (
        <SubjectTiles
          username={username}
          activePresetQuestion={presetQuestion}
          selectedValue={selection}
          onSelect={(value) => {
            onUpdate(value);
          }}
        />
      )}
    </StepContainer>
  );
};
