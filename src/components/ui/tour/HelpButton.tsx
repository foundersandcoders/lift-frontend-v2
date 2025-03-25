'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
  shouldPulse?: boolean;
}

const HelpButton: React.FC<HelpButtonProps> = ({
  onClick,
  shouldPulse = false,
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  // Start pulsing animation when shouldPulse changes to true
  useEffect(() => {
    if (shouldPulse) {
      setIsPulsing(true);

      // Stop pulsing after 3 seconds
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [shouldPulse]);

  return (
    <button
      onClick={() => {
        setIsPulsing(false); // Stop pulsing when clicked
        onClick();
      }}
      className={`fixed bottom-4 right-4 z-40 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50
        ${isPulsing ? 'help-button-pulse' : ''}`}
      aria-label='Help'
    >
      <HelpCircle className='w-6 h-6 text-brand-blue' />
    </button>
  );
};

export default HelpButton;
