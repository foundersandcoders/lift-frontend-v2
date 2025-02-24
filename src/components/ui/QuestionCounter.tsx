// QuestionCounter.tsx
import React from 'react';

interface QuestionCounterProps {
  answered: number;
  total: number;
}

const QuestionCounter: React.FC<QuestionCounterProps> = ({
  answered,
  total,
}) => {
  return (
    <div className='text-sm text-gray-700'>
      {answered} / {total} answered
    </div>
  );
};

export default QuestionCounter;
