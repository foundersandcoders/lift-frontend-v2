import React from 'react';
import { useAnsweredCount } from '@/features/questions/hooks/useAnsweredCount';
import { useProgressFeedback } from '@/hooks/useProgressFeedback';
import LargeCircularQuestionCounter from '../questionCounter/LargeCircularQuestionCounter';

const ProgressWithFeedback: React.FC = () => {
  const { answered, total } = useAnsweredCount();
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
  const feedbackMessage = useProgressFeedback(progress);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <LargeCircularQuestionCounter size={120} />
      </div>
      <div className="flex-1 text-center lg:text-left">
        <p className="text-gray-700 text-base italic font-medium">
          "{feedbackMessage}"
        </p>
      </div>
    </div>
  );
};

export default ProgressWithFeedback;