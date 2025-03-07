import React from 'react';
import StepContainer from '../StepContainer';
import { PrivacySelector } from '../PrivacySelector';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (isPublic: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,
  onNext,
  onBack,
  isSubmitting = false,
}) => {
  const subQuestion = `Who can see this statement?`;
  return (
    <StepContainer subQuestion={subQuestion} showBack onBack={onBack}>
      <PrivacySelector
        isPublic={isPublic}
        onChange={onUpdate}
        onComplete={() => onNext()}
        isSubmitting={isSubmitting} // Pass along the submission state
      />
    </StepContainer>
  );
};
