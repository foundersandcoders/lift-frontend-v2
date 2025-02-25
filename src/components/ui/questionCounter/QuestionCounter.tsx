import React from 'react';
import { useAnsweredCount } from '../../../hooks/useAnsweredCount';

const QuestionCounter: React.FC = () => {
  const { answered, total } = useAnsweredCount(); // Extract values

  return (
    <div className='text-sm text-gray-700'>
      {answered} / {total} questions answered
    </div>
  );
};

export default QuestionCounter;
