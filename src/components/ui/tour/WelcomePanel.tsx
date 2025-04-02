'use client';

import React, { useEffect, useState } from 'react';
import { Info, PlayCircle, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import helpContent from '@/data/helpContent.json';

interface WelcomePanelProps {
  onClose: () => void;
  onShowTutorial: () => void;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({
  onClose,
  onShowTutorial,
}) => {
  const [visible, setVisible] = useState(false);

  // Fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 max-h-[90vh] flex flex-col ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-semibold flex items-center text-brand-blue'>
            <Info className='w-5 h-5 mr-2' />
            {helpContent.welcome.title}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className='flex-1 overflow-y-auto p-5'>
          <p className='text-gray-700 mb-4'>
            {helpContent.welcome.description}
          </p>

          <h3 className='font-medium text-gray-800 mb-2'>Key benefits:</h3>
          <ul className='list-disc pl-5 space-y-1 mb-5 text-gray-700'>
            {helpContent.welcome.keyBenefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className='border-t p-4 flex flex-row gap-3'>
          <Button variant='default' className='flex-1' onClick={onClose}>
            Get Started
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
          <Button
            variant='outline'
            className='flex-1'
            onClick={onShowTutorial}
          >
            Show Tutorial
            <PlayCircle className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;
