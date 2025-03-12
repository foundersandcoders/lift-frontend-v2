'use client';

import React from 'react';
// import { SimpleDialog as Dialog, SimpleDialogContent as DialogContent } from '../ui/simple-dialog';
import { Button } from '../ui/button';
import { X, Shield, CheckCircle, Lock, Eye } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  // Handler for clicks outside the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the overlay (not on the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50'
      onClick={handleOutsideClick}
    >
      <div
        className='bg-white m-2 sm:m-5 max-w-2xl w-full rounded-lg p-0 overflow-hidden shadow-xl'
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className='bg-brand-pink p-2 flex items-center justify-between sm:rounded-t-lg'>
          <h2 className='text-xl font-semibold text-white flex items-center'>
            <Shield className='mr-2' size={20} />
            Privacy & Data Protection
          </h2>
          <button
            className='text-white focus:outline-none focus:ring-2 focus:ring-white rounded-sm'
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div
          className='relative overflow-auto max-h-[70vh]'
          style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
          }}
        >
          <div className='p-4 sm:p-6'>
            <div className='space-y-6'>
              {/* How We Protect Your Data */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <Lock className='mr-2 text-brand-pink' size={20} />
                  How We Protect Your Data
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='mb-3 text-gray-700'>
                    At Beacons, we prioritize your privacy and ensure your
                    personal information is handled securely.
                  </p>
                  <ul className='list-disc pl-5 space-y-2 text-gray-700'>
                    <li>Your data is encrypted both in transit and at rest</li>
                    <li>
                      We use secure passwordless authentication (Magic Links) to
                      protect your account
                    </li>
                    <li>
                      We only collect the minimum information needed to provide
                      our service
                    </li>
                    <li>
                      You retain complete control over your data at all times
                    </li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <CheckCircle className='mr-2 text-brand-pink' size={20} />
                  Your Rights
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='mb-3 text-gray-700'>
                    Under data protection law, you have the right to:
                  </p>
                  <ul className='list-disc pl-5 space-y-2 text-gray-700'>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Restrict or object to processing of your data</li>
                    <li>Obtain and reuse your data (data portability)</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <Eye className='mr-2 text-brand-pink' size={20} />
                  Data Sharing
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='mb-3 text-gray-700'>We only share your data:</p>
                  <ul className='list-disc pl-5 space-y-2 text-gray-700'>
                    <li>With your explicit consent</li>
                    <li>
                      Only statements marked as "public" can be shared with your
                      line manager
                    </li>
                    <li>You control when and how your data is shared</li>
                    <li>
                      Email sharing is initiated by you and only sent to the
                      email address you provide
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            <div className='mt-6 flex justify-center'>
              <Button
                variant='outline'
                className='px-6'
                type='button'
                onClick={onClose}
              >
                <X size={16} className='mr-1.5' />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
