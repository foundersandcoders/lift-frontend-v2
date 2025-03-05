// src/components/statementWizard/steps/PrivacyStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { PrivacySelector } from '../PrivacySelector';

interface PrivacyStepProps {
  isPublic: boolean;
  onUpdate: (isPublic: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PrivacyStep: React.FC<PrivacyStepProps> = ({
  isPublic,
  onUpdate,
  onNext,
  onBack,
}) => {
  const subQuestion = `Who can see this statement?`;
  return (
    <StepContainer subQuestion={subQuestion} showBack onBack={onBack}>
      <PrivacySelector
        isPublic={isPublic}
        onChange={onUpdate}
        onComplete={() => onNext()}
      />
    </StepContainer>
  );
};
