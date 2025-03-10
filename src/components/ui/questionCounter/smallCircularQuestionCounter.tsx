import React from 'react';
import { useAnsweredCount } from '../../../features/questions/hooks/useAnsweredCount';

interface SmallCircularQuestionCounterProps {
  size?: number; // default 24px
  strokeWidth?: number; // default 2px
}

const SmallCircularQuestionCounter: React.FC<
  SmallCircularQuestionCounterProps
> = ({ size = 24, strokeWidth = 4 }) => {
  const { answered, total } = useAnsweredCount();
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        className='text-gray-200'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className='text-green-500'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        fill='transparent'
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // ✅ Start from the top
        style={{ transition: 'stroke-dashoffset 0.35s ease-out' }}
      />
    </svg>
  );
};

export default SmallCircularQuestionCounter;
