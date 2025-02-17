import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ActionsCounterProps {
  count: number;
  expanded?: boolean;
}

const ActionsCounter: React.FC<ActionsCounterProps> = ({
  count,
  expanded = false,
}) => {
  const baseClasses =
    'inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors cursor-pointer';
  const backgroundClasses =
    count > 0 ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-600';
  const displayText =
    count === 0
      ? 'no actions'
      : `${count} ${count === 1 ? 'action' : 'actions'}`;

  return (
    <span className={`${baseClasses} ${backgroundClasses} flex items-center`}>
      {displayText}
      <span className='ml-1'>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </span>
    </span>
  );
};

export default ActionsCounter;
