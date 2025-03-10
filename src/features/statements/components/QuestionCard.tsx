'use client';

import React from 'react';
import type { SetQuestion } from '../../../types/entries';
import { HelpCircle, ChevronRight, BellOff, Bell } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../components/ui/tooltip';

export interface QuestionCardProps {
  presetQuestion: SetQuestion;
  onSelect: (presetQuestion: SetQuestion) => void;
  onToggleSnooze?: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  presetQuestion,
  onSelect,
  onToggleSnooze = () => {},
}) => {
  // Handle snooze button click without triggering the card's onClick
  const handleSnoozeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSnooze(presetQuestion.id);
  };

  return (
    <div className='relative'>
      {/* Question Card */}
      <div 
        onClick={presetQuestion.isSnoozed ? () => {} : () => onSelect(presetQuestion)} 
        className={cn(
          presetQuestion.isSnoozed ? 'cursor-default' : 'cursor-pointer',
          presetQuestion.isSnoozed && 'opacity-60'
        )}
      >
        <div
          className={cn(
            'bg-white rounded-md p-3 shadow-sm flex items-center',
            !presetQuestion.isSnoozed && 'hover:bg-gray-100',
            'transition-colors border-2 border-dotted',
            presetQuestion.isSnoozed ? 'border-blue-300' : 'border-brand-pink'
          )}
        >
          {/* Help icon with tooltip - only for non-snoozed questions */}
          {!presetQuestion.isSnoozed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-center mr-2 text-brand-pink bg-pink-50 p-1 rounded-full">
                  <HelpCircle size={16} />
                </span>
              </TooltipTrigger>
              <TooltipContent className='p-2 bg-black text-white rounded'>
                Your employer would like to ask you this question
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Main question text (truncated if too long) */}
          <span className='flex-1 truncate text-lg'>
            {presetQuestion.mainQuestion}
          </span>
          
          {/* Snooze/Unsnooze button */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleSnoozeClick}
                  className={cn(
                    "mr-2 p-1.5 rounded-full transition-colors flex items-center justify-center",
                    "border border-gray-200 shadow-sm",
                    presetQuestion.isSnoozed 
                      ? "hover:bg-blue-100 bg-blue-50" 
                      : "hover:bg-gray-100"
                  )}
                  aria-label={presetQuestion.isSnoozed ? "Unsnooze question" : "Snooze question"}
                >
                  {presetQuestion.isSnoozed ? (
                    <Bell size={16} className="text-blue-600" />
                  ) : (
                    <BellOff size={16} className="text-gray-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className='p-2 bg-black text-white rounded'>
                {presetQuestion.isSnoozed ? 'Unsnooze question' : 'Snooze question'}
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Chevron icon to indicate clickability - only for non-snoozed questions */}
          {!presetQuestion.isSnoozed && (
            <span className='inline-flex items-center justify-center p-1 rounded-full bg-gray-100 text-gray-500'>
              <ChevronRight size={16} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
