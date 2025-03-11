// src/components/statementWizard/steps/CategoryStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '@/components/ui/button';
import statementsCategories from '@/data/statementsCategories.json';
import { clickOkButton } from '../EditStatementModal';

interface CategoryStepProps {
  selection: string;
  onUpdate: (val: string) => void;
  onConfirm?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  selection,
  onUpdate,
  onConfirm,
  currentStep = 4,
  totalSteps = 5,
}) => {
  const subQuestion = `You can set a category for your statement`;
  const categories = statementsCategories.categories || [];
  
  // Helper function to normalize category IDs
  const normalizeCategoryId = (id: string): string => {
    return id ? id.toLowerCase() : '';
  };
  
  // Handle all possible variations of "uncategorized"
  const normalizedSelection = normalizeCategoryId(selection);
  const uncategorisedSelected = !selection || 
    normalizedSelection === 'uncategorised' || 
    normalizedSelection === 'uncategorized';

  return (
    <StepContainer 
      subQuestion={subQuestion} 
      showBack
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
        {categories.map((cat: { id: string; name: string }) => (
          <Button
            key={cat.id}
            onClick={() => {
              // If this category is already selected, click the OK button
              if (normalizedSelection === normalizeCategoryId(cat.id)) {
                console.log('Category already selected, clicking OK button');
                // Try the onConfirm function first, then fall back to direct DOM manipulation
                if (onConfirm) {
                  onConfirm();
                } else {
                  clickOkButton();
                }
              } else {
                // Normal selection behavior
                onUpdate(cat.id);
              }
            }}
            className={`
              h-auto py-4 px-6 text-left flex flex-col items-start transition-all whitespace-normal break-words
              ${
                normalizedSelection === normalizeCategoryId(cat.id)
                  ? 'bg-blue-50 text-blue-600 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300'
              }
            `}
            variant={normalizedSelection === normalizeCategoryId(cat.id) ? 'default' : 'outline'}
          >
            <span className='font-medium'>{cat.name}</span>
          </Button>
        ))}
        <Button
          onClick={() => {
            // If "uncategorized" is already selected, click the OK button
            if (uncategorisedSelected) {
              console.log('Uncategorized already selected, clicking OK button');
              // Try the onConfirm function first, then fall back to direct DOM manipulation
              if (onConfirm) {
                onConfirm();
              } else {
                clickOkButton();
              }
            } else {
              // Normal selection behavior
              onUpdate('uncategorized');
            }
          }} 
          className={`
            h-auto py-4 px-6 text-left flex flex-col items-start transition-all whitespace-normal break-words
            ${
              uncategorisedSelected
                ? 'bg-blue-50 text-blue-600 border-blue-300'
                : 'bg-white text-gray-700 border-gray-300'
            }
          `}
          variant={uncategorisedSelected ? 'default' : 'outline'}
        >
          <span className='font-medium'>Uncategorised</span>
        </Button>
      </div>
    </StepContainer>
  );
};
