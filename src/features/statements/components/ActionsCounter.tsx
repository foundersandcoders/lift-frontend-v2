'use client';

import React, { useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ActionsCounterProps {
  count: number;
  expanded?: boolean;
}

const ActionsCounter: React.FC<ActionsCounterProps> = ({
  count,
  expanded = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  // Tab-like styling similar to category tabs
  const baseClasses =
    'inline-flex items-center px-3 py-1 text-sm transition-colors cursor-pointer whitespace-nowrap';
  
  // Determine border radius and border styling based on expanded state
  const borderStyles = expanded 
    ? 'rounded-t-lg border-t border-l border-r' 
    : 'rounded-lg border';
    
  const backgroundClasses =
    count > 0
      ? `bg-brand-pink text-white ${borderStyles} border-brand-pink`
      : `bg-slate-100 text-gray-600 ${borderStyles} border-slate-300`;

  // Determine the display text.
  let displayText = '';
  if (count === 0) {
    displayText = 'No actions';
  } else if (count === 1) {
    displayText = '1 action';
  } else {
    displayText = `${count} actions`;
  }

  // Always show text for tab-like design
  return (
    <span ref={containerRef} className={`${baseClasses} ${backgroundClasses}`}>
      <span className='font-medium'>{displayText}</span>
      <span className='ml-1'>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </span>
    </span>
  );
};

export default ActionsCounter;
