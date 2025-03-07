// src/components/statementWizard/steps/CategoryStep.tsx
import React from 'react';
import StepContainer from '../StepContainer';
import { Button } from '../../ui/button';
import statementsCategories from '../../../../data/statementsCategories.json';

interface CategoryStepProps {
  selection: string;
  onUpdate: (val: string) => void;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  selection,
  onUpdate,
}) => {
  const subQuestion = `You can set a category for your statement`;
  const categories = statementsCategories.categories || [];
  const uncategorisedSelected = !selection || selection === 'uncategorised';

  return (
    <StepContainer subQuestion={subQuestion} showBack>
      <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
        {categories.map((cat: { id: string; name: string }) => (
          <Button
            key={cat.id}
            onClick={() => onUpdate(cat.id)}
            className={`
              h-auto py-4 px-6 text-left flex flex-col items-start transition-all whitespace-normal break-words
              ${
                selection === cat.id
                  ? 'bg-blue-50 text-blue-600 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300'
              }
            `}
            variant={selection === cat.id ? 'default' : 'outline'}
          >
            <span className='font-medium'>{cat.name}</span>
          </Button>
        ))}
        <Button
          onClick={() => onUpdate('uncategorised')}
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
