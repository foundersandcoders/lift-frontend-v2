import React from 'react';
import StepContainer from '../StepContainer';
import { SubjectTiles } from '../SubjectTiles';
import type { SetQuestion } from '../../../../types/entries';

interface SubjectStepProps {
  username: string;
  presetQuestion?: SetQuestion;
  selection: string;
  selectedCategory?: string;
  onUpdate: (val: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export const SubjectStep: React.FC<SubjectStepProps> = ({
  username,
  presetQuestion,
  selection,
  selectedCategory,
  onUpdate,
  currentStep = 2, // Updated step number since category is now first
  totalSteps = 5,
}) => {
  // Use a default subject question text
  const subQuestion = `Who is this statement about?`;
  // Check whether descriptors are allowed (if using a preset)
  const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;
  
  // If preset answer is "username" but descriptors aren't allowed, update to "I"
  React.useEffect(() => {
    if (allowDescriptors === false && presetQuestion?.steps?.subject?.presetAnswer === "username" && selection === username) {
      onUpdate("I");
    }
  }, [allowDescriptors, presetQuestion, username, selection, onUpdate]);

  return (
    <StepContainer 
      subQuestion={subQuestion}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      {allowDescriptors === false ? (
        <>
          <div className='text-center p-4 border rounded'>
            <p>I</p>
          </div>
        </>
      ) : (
        <SubjectTiles
          username={username}
          activePresetQuestion={presetQuestion}
          selectedCategory={selectedCategory}
          selectedValue={selection}
          onSelect={(value) => {
            onUpdate(value);
          }}
        />
      )}
    </StepContainer>
  );
};
