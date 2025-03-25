'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50"
      aria-label="Help"
    >
      <HelpCircle className="w-6 h-6 text-brand-blue" />
    </button>
  );
};

export default HelpButton;