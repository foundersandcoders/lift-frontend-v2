import React, { useState } from 'react';
import StepContainer from '../StepContainer';

interface DescriptionStepProps {
  description?: string;
  onUpdate: (val: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export const DescriptionStep: React.FC<DescriptionStepProps> = ({
  description = '',
  onUpdate,
  currentStep = 4, // After subject, verb, object, before privacy
  totalSteps = 6,
}) => {
  const [inputValue, setInputValue] = useState(description);
  const maxLength = 500; // Maximum character limit

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      // Update the parent component in real-time to reflect changes in the preview
      onUpdate(newValue);
    }
  };

  // Handle Shift+Enter to save and advance, regular Enter adds a new line
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onUpdate(inputValue);
    }
    // Regular Enter will naturally add a new line in the textarea
  };

  const subQuestion = 'Details (optional)';
  const charCount = inputValue.length;
  const remainingChars = maxLength - charCount;

  return (
    <StepContainer
      subQuestion={subQuestion}
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='flex flex-col space-y-2 h-full'>
        <div className='relative flex-grow'>
          <textarea
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='Your statement is complete - only add details if necessary. Press Enter for new line.'
            className='w-full h-48 p-3 border-2 border-[var(--description-input)] rounded-md focus:ring-2 focus:ring-[var(--description-input)] focus:outline-none resize-none'
            aria-label='Description'
          />

          <div className='absolute bottom-2 right-2 text-xs text-gray-500'>
            {remainingChars} characters remaining
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
