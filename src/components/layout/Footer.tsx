'use client';

import React, { useState } from 'react';
import PrivacyModal from '../../components/modals/PrivacyModal';
import TermsModal from '../../components/modals/TermsModal';

const Footer: React.FC = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <>
      <footer className='mt-auto pt-6 pb-4 bg-gray-50 border-t border-gray-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row justify-center items-center text-xs text-gray-500 space-y-2 sm:space-y-0 sm:space-x-4'>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className='hover:text-brand-pink hover:underline'
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className='hover:text-brand-pink hover:underline'
            >
              Terms of Use
            </button>
            <span>© {new Date().getFullYear()} Beacons</span>
          </div>
        </div>
      </footer>

      {/* Conditionally render the privacy modal */}
      {isPrivacyModalOpen && (
        <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />
      )}

      {/* Conditionally render the terms modal */}
      {isTermsModalOpen && (
        <TermsModal onClose={() => setIsTermsModalOpen(false)} />
      )}
    </>
  );
};

export default Footer;