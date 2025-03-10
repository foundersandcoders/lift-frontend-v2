import React from 'react';
import { useAnsweredCount } from '../../../features/questions/hooks/useAnsweredCount';
import { cn } from '../../../../lib/utils';

interface QuestionCounterProps {
  className?: string;
}

const QuestionCounter: React.FC<QuestionCounterProps> = ({ className }) => {
  const { answered, total } = useAnsweredCount(); // Extract values

  return (
    <div className={cn('text-sm text-gray-700', className)}>
      {answered} / {total} questions answered
    </div>
  );
};

export default QuestionCounter;
