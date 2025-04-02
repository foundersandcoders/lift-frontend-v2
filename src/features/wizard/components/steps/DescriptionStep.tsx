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
    }
  };

  const handleBlur = () => {
    // Update parent component with current input value
    onUpdate(inputValue);
  };

  // Handle Enter key without Shift to save and advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onUpdate(inputValue);
    }
  };

  const subQuestion = "Add more details to your statement (optional)";
  const charCount = inputValue.length;
  const remainingChars = maxLength - charCount;
  
  return (
    <StepContainer
      subQuestion={subQuestion}
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="flex flex-col space-y-3 h-full">
        <div className="text-sm text-gray-600 mb-1">
          <p>Use this space to provide additional context or details for your statement.</p>
          <p className="text-gray-500 italic mt-1">This field is optional.</p>
        </div>
        
        <div className="relative flex-grow">
          <textarea
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Add more details about your statement..."
            className="w-full h-48 p-3 border-2 border-[var(--description-input)] rounded-md focus:ring-2 focus:ring-[var(--description-input)] focus:outline-none resize-none"
            aria-label="Description"
          />
          
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {remainingChars} characters remaining
          </div>
        </div>
        
        {/* Removed explicit save button to be consistent with other steps */}
      </div>
    </StepContainer>
  );
};