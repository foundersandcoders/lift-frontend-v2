import React from 'react';
import StepContainer from '../StepContainer';
import { PrivacySelector } from '../selectors/PrivacySelector';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (val: boolean) => void;
  isSubmitting?: boolean;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,

  isSubmitting = false,
}) => {
  const subQuestion = `Who can see this statement?`;
  return (
    <StepContainer subQuestion={subQuestion} showBack>
      <PrivacySelector
        isPublic={isPublic}
        onChange={onUpdate}
        isSubmitting={isSubmitting} // Pass along the submission state
      />
    </StepContainer>
  );
};
