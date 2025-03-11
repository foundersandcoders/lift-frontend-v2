'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface ActionsCounterProps {
  count: number;
  expanded?: boolean;
}

const ActionsCounter: React.FC<ActionsCounterProps> = ({
  count,
  expanded = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // We force a max width so the text might actually overflow.
  const baseClasses =
    'inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors cursor-pointer whitespace-nowrap max-w-[150px] overflow-hidden';
  const backgroundClasses =
    count > 0 ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-600';

  // Determine the display text.
  let displayText = '';
  if (count === 0) {
    displayText = 'no actions';
  } else if (count === 1) {
    displayText = '1 action';
  } else {
    displayText = `${count} actions`;
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    // Compare the actual content width vs. the visible width.
    setIsOverflowing(el.scrollWidth > el.clientWidth);
  }, [count, displayText]);

  // If overflowing, show an icon; otherwise show the text.
  const content = isOverflowing ? <List size={16} /> : displayText;

  return (
    <span ref={containerRef} className={`${baseClasses} ${backgroundClasses}`}>
      {content}
      <span className='ml-1'>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </span>
    </span>
  );
};

export default ActionsCounter;
