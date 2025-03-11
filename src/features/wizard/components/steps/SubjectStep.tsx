import React from 'react';
import StepContainer from '../StepContainer';
import { SubjectTiles } from '../SubjectTiles';
import type { SetQuestion } from '../../../../types/entries';

interface SubjectStepProps {
  username: string;
  presetQuestion?: SetQuestion;
  selection: string;
  onUpdate: (val: string) => void;
  onConfirm?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const SubjectStep: React.FC<SubjectStepProps> = ({
  username,
  presetQuestion,
  selection,
  onUpdate,
  onConfirm,
  currentStep = 1,
  totalSteps = 5,
}) => {
  // Use a default subject question text
  const subQuestion = `This statement applies to ${username} or someone/something else?`;
  // Check whether descriptors are allowed (if using a preset)
  const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;

  return (
    <StepContainer 
      subQuestion={subQuestion}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
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
            // If this subject is already selected, click the OK button
            if (value === selection) {
              console.log('Subject already selected, clicking OK button');
              // Try the onConfirm function first, then fall back to direct DOM manipulation
              if (onConfirm) {
                onConfirm();
              } else {
                // Import the clickOkButton function here to avoid circular dependencies
                const okButton = document.getElementById('edit-statement-ok-button');
                if (okButton) {
                  (okButton as HTMLButtonElement).click();
                }
              }
            } else {
              onUpdate(value);
            }
          }}
        />
      )}
    </StepContainer>
  );
};
