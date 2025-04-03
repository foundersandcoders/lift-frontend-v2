// src/components/statementWizard/steps/CategoryStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '@/components/ui/Button';
import statementsCategories from '@/data/statementsCategories.json';

interface CategoryStepProps {
  selection: string;
  onUpdate: (val: string) => void;
  currentStep?: number;
  totalSteps?: number;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  selection,
  onUpdate,
  currentStep = 1, // Updated to be the first step
  totalSteps = 5,
}) => {
  const subQuestion = `Select a category for your statement. This will determine available options for the subject.`;
  const categories = statementsCategories.categories || [];

  // Helper function to normalize category IDs
  const normalizeCategoryId = (id: string): string => {
    return id ? id.toLowerCase() : '';
  };

  // Handle all possible variations of "uncategorized"
  const normalizedSelection = normalizeCategoryId(selection);
  const uncategorisedSelected =
    !selection ||
    normalizedSelection === 'uncategorised' ||
    normalizedSelection === 'uncategorized';

  return (
    <StepContainer
      subQuestion={subQuestion}
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto p-2'>
        {categories.map((cat: { id: string; name: string }) => (
          <Button
            key={cat.id}
            onClick={() => onUpdate(cat.id)}
            variant={'outline'}
            selected={normalizedSelection === normalizeCategoryId(cat.id)}
            className='h-auto p-2 sm:py-4 text-left flex flex-col items-start transition-all whitespace-normal break-words border-3 box-border'
            style={
              {
                // Set the CSS variable to the category selector color. This is used on buttonVariants.ts
                '--tile-color': 'var(--category-selector)',
              } as React.CSSProperties
            }
          >
            <span className='font-medium'>{cat.name}</span>
          </Button>
        ))}
        <Button
          onClick={() => onUpdate('uncategorized')}
          variant={'outline'}
          selected={uncategorisedSelected}
          className='h-auto p-2 sm:py-4 text-left flex flex-col items-start transition-all whitespace-normal break-words border-3 box-border'
          style={
            {
              // Set the CSS variable to the category selector color. This is used on buttonVariants.ts
              '--tile-color': 'var(--category-selector)',
            } as React.CSSProperties
          }
        >
          <span className='font-medium'>Uncategorised</span>
        </Button>
      </div>
    </StepContainer>
  );
};
