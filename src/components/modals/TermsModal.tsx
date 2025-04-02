'use client';

import React from 'react';
// import { SimpleDialog as Dialog, SimpleDialogContent as DialogContent } from '../ui/simple-dialog';
import { Button } from '../ui/Button';
import { X, FileText, Check, AlertTriangle, Scale } from 'lucide-react';

// Force Redeploy
interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
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
            <FileText className='mr-2' size={20} />
            Terms of Use
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
              {/* Introduction */}
              <section>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  1. Introduction
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm text-gray-700'>
                  <p className='mb-2'>
                    Welcome to Beacons ("Service"), a workplace passport
                    application provided by LIFT. By using our Service, you
                    agree to these Terms of Use. Please read them carefully.
                  </p>
                  <p>
                    The Service allows you to create, maintain, and selectively
                    share workplace statements about your preferences, needs,
                    and working style with your line managers and employers.
                  </p>
                </div>
              </section>

              {/* User Accounts */}
              <section>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  2. User Accounts
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm text-gray-700'>
                  <p className='mb-2'>
                    Authentication is provided through a secure magic link
                    system sent to your email address. You are responsible for:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Maintaining the security of your email account</li>
                    <li>Only using magic links sent directly to your email</li>
                    <li>Notifying us of any unauthorized access</li>
                  </ul>
                  <p className='mt-2'>
                    If you register with a new email address, a new passport
                    will be created that cannot be merged with existing data.
                    This is intentional for data protection reasons.
                  </p>
                </div>
              </section>

              {/* Your Content */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <Check className='mr-2 text-brand-pink' size={20} />
                  3. Your Content
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm text-gray-700'>
                  <p className='mb-2'>
                    You retain ownership of all content you create through our
                    Service. By using Beacons, you:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Are responsible for the accuracy of your statements</li>
                    <li>
                      Control which statements are marked as "public" and can be
                      shared
                    </li>
                    <li>
                      Decide when to share information with your line manager
                    </li>
                    <li>Can update or delete your content at any time</li>
                  </ul>
                </div>
              </section>

              {/* Acceptable Use */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <AlertTriangle className='mr-2 text-brand-pink' size={20} />
                  4. Acceptable Use
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm text-gray-700'>
                  <p className='mb-2'>You agree not to use Beacons to:</p>
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>
                      Create or share statements that are harmful, offensive, or
                      discriminatory
                    </li>
                    <li>
                      Attempt to gain unauthorized access to other users' data
                    </li>
                    <li>
                      Upload malicious code or attempt to compromise the service
                    </li>
                    <li>Impersonate others or provide false information</li>
                  </ul>
                </div>
              </section>

              {/* Legal Terms */}
              <section>
                <h3 className='text-lg font-semibold flex items-center text-gray-800 mb-3'>
                  <Scale className='mr-2 text-brand-pink' size={20} />
                  5. Legal Terms
                </h3>
                <div className='bg-white p-4 rounded-lg shadow-sm text-gray-700'>
                  <p className='mb-2'>
                    <strong>Service Modifications:</strong> We may modify or
                    discontinue the Service at any time with reasonable notice.
                  </p>
                  <p className='mb-2'>
                    <strong>Limitation of Liability:</strong> To the fullest
                    extent permitted by law, LIFT shall not be liable for any
                    indirect, incidental, special, consequential, or punitive
                    damages.
                  </p>
                  <p>
                    <strong>Governing Law:</strong> These Terms are governed by
                    the laws of [Jurisdiction], without regard to its conflict
                    of law principles.
                  </p>
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

export default TermsModal;
