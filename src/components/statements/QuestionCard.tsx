'use client';

import React from 'react';
import type { SetQuestion } from '../../../types/statements';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export interface QuestionCardProps {
  presetQuestion: SetQuestion;
  onSelect: (presetQuestion: SetQuestion) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  presetQuestion,
  onSelect,
}) => {
  return (
    <div onClick={() => onSelect(presetQuestion)} className='cursor-pointer'>
      <div
        className={cn(
          'bg-white rounded-md p-3 shadow-sm flex items-center hover:bg-gray-100 transition-colors',
          'border-2 border-dotted border-brand-pink'
        )}
      >
        {/* Tooltip wrapped around the HelpCircle icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='inline-flex items-center justify-center text-brand-pink mr-2'>
              <HelpCircle size={16} />
            </span>
          </TooltipTrigger>
          <TooltipContent className='p-2 bg-black text-white rounded'>
            Your employer would like to ask you this question.
          </TooltipContent>
        </Tooltip>
        {/* Main question text (truncated if too long) */}
        <span className='flex-1 truncate text-lg font-semibold'>
          {presetQuestion.mainQuestion}
        </span>
        {/* Chevron icon to indicate clickability */}
        <span className='inline-flex items-center text-gray-400'>
          <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
