import React from 'react';
import { useAnsweredCount } from '../../../hooks/useAnsweredCount';

interface LargeCircularQuestionCounterProps {
  size?: number; // default 100px
  strokeWidth?: number; // default 6px
}

const LargeCircularQuestionCounter: React.FC<
  LargeCircularQuestionCounterProps
> = ({ size = 100, strokeWidth = 6 }) => {
  const { answered, total } = useAnsweredCount();
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div className='relative w-fit'>
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
          className='text-brand-pink'
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
      {/* Percentage Text in Center */}
      <span className='absolute inset-0 flex items-center justify-center text-lg font-semibold'>
        {progress}%
      </span>
    </div>
  );
};

export default LargeCircularQuestionCounter;
