import React from 'react';
import { useAnsweredCount } from '../../hooks/useAnsweredCount';
import { useQuestions } from '../../hooks/useQuestions';

const QuestionCounter: React.FC = () => {
  const answered = useAnsweredCount();
  const { questions } = useQuestions();
  const total = questions.length;

  return (
    <div className='text-sm text-gray-700'>
      {answered} / {total} answered
    </div>
  );
};

export default QuestionCounter;
