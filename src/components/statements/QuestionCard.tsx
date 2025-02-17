import React from 'react';
import type { SetQuestion } from '../../../types/types';

export interface QuestionCardProps {
  presetQuestion: SetQuestion;
  onSelect: (presetQuestion: SetQuestion) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  presetQuestion,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(presetQuestion)}
      className='border rounded-md p-4 cursor-pointer hover:bg-gray-100 transition-colors'
    >
      <div className='flex items-center justify-between'>
        <span className='text-lg font-semibold'>
          {presetQuestion.mainQuestion}
        </span>
        {/* Optionally add an arrow icon here, e.g. ChevronRight */}
      </div>
    </div>
  );
};

export default QuestionCard;
