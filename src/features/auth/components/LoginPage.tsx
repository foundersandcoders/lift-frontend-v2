'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../api/hooks';
import { useEntries } from '../../statements/hooks/useEntries';
import MagicLinkForm from './MagicLinkForm';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { handleMagicLinkVerification } from '../utils/authUtils';
import { Loader2 } from 'lucide-react';
import PrivacyModal from '../../../components/modals/PrivacyModal';
import TermsModal from '../../../components/modals/TermsModal';

interface LoginPageProps {
  onSubmit?: (
    username: string,
    managerName: string,
    managerEmail: string
  ) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSubmit }) => {
  const { state } = useAuth();
  const { setData } = useEntries();
  const [name, setName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [step, setStep] = useState<'authenticate' | 'profile'>('authenticate');
  const [verifying, setVerifying] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Handle token verification on initial load and URL changes
  useEffect(() => {
    const verifyToken = async () => {
      setVerifying(true);
      const result = await handleMagicLinkVerification();
      setVerifying(false);

      // If verification successful and we have user data, move to profile step
      if (result.success && 'user' in result && result.user) {
        setStep('profile');
      }
    };

    // Initial verification
    verifyToken();

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      verifyToken();
    };

    // Listen for custom magicLinkVerified events
    const handleVerified = (e: CustomEvent) => {
      console.log('Magic link verified event received:', e.detail);
      setStep('profile');
    };

    // Listen for verify magic link events from mock service
    const handleVerifyEvent = () => {
      console.log('Verify magic link event received');
      verifyToken();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(
      'magicLinkVerified',
      handleVerified as EventListener
    );
    window.addEventListener('verifyMagicLink', handleVerifyEvent);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(
        'magicLinkVerified',
        handleVerified as EventListener
      );
      window.removeEventListener('verifyMagicLink', handleVerifyEvent);
    };
  }, []);

  // When auth state changes and user is authenticated, move to profile step
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      setStep('profile');
    }
  }, [state.isAuthenticated, state.user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save user profile data
    if (name.trim()) {
      // Set user's name
      setData({ type: 'SET_USERNAME', payload: name.trim() });

      // If manager name is provided, save it
      if (managerName.trim()) {
        setData({ type: 'SET_MANAGER_NAME', payload: managerName.trim() });
      }

      // If manager email is provided, save it
      if (managerEmail.trim()) {
        setData({ type: 'SET_MANAGER_EMAIL', payload: managerEmail.trim() });
      }

      // Store user's email from auth in userEmail field
      if (state.user?.email) {
        setData({ type: 'SET_USER_EMAIL', payload: state.user.email });
      }

      // Call original onSubmit if provided (for backward compatibility)
      if (onSubmit) {
        onSubmit(name.trim(), managerName.trim(), managerEmail.trim());
      }
    }
  };

  // Show loader while verifying token
  if (verifying) {
    return (
      <div className='flex items-center justify-center p-4 pt-4 mt-0 bg-gray-50'>
        <div className='flex flex-col items-center'>
          <Loader2 className='h-12 w-12 animate-spin text-brand-pink mb-4' />
          <h2 className='text-xl font-medium'>Verifying your login...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center p-4 pt-4 mt-0 bg-gray-50'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        {isPrivacyModalOpen && (
          <PrivacyModal onClose={() => setIsPrivacyModalOpen(false)} />
        )}
        {isTermsModalOpen && (
          <TermsModal onClose={() => setIsTermsModalOpen(false)} />
        )}
        {step === 'authenticate' ? (
          <>
            <h1 className='text-3xl font-bold mb-6 text-center'>
              Welcome to Beacons
            </h1>
            <p className='mb-6 text-center text-gray-700'>
              Sign in with your email to access the application.
            </p>
            <MagicLinkForm callbackURL='/main' />
            <div className='mt-4 mb-4 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-600'>
              <p className='mb-2'>
                By signing in, you agree to our{' '}
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className='text-brand-pink underline'
                >
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className='text-brand-pink underline'
                >
                  Terms of Use
                </button>
                .
              </p>
              <p>
                We collect and process your data to provide the Beacons service.
                You control what information is shared with your employer.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className='text-3xl font-bold mb-6 text-center'>
              Complete Your Profile
            </h1>

            <form onSubmit={handleProfileSubmit}>
              {/* User Information Section */}
              <div className='mb-6 p-4 bg-pink-50 rounded-lg border border-pink-100'>
                <h3 className='text-md font-semibold text-brand-pink mb-3 border-b pb-2 border-pink-200'>
                  Your Information
                </h3>

                <div className='mb-4'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Your Name <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='name'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full'
                    required
                  />
                </div>

                {state.user?.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Your Email Address
                    </label>
                    <div className='px-3 py-2 bg-white border border-gray-200 rounded text-gray-800 break-all'>
                      {state.user.email}
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      You signed in with this email address
                    </p>
                  </div>
                )}
              </div>

              {/* Manager Information Section */}
              <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                <h3 className='text-md font-semibold text-blue-600 mb-3 border-b pb-2 border-blue-200'>
                  Manager Information (Optional)
                </h3>

                <div className='mb-4'>
                  <label
                    htmlFor='managerName'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Line Manager's Name
                  </label>
                  <Input
                    id='managerName'
                    placeholder="Enter your manager's name"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className='w-full'
                  />
                </div>

                <div>
                  <label
                    htmlFor='managerEmail'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Line Manager's Email
                  </label>
                  <Input
                    id='managerEmail'
                    placeholder="Enter your manager's email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    className='w-full'
                  />
                </div>
              </div>

              <Button
                type='submit'
                variant='pink'
                className='mx-auto shadow-sm w-full'
                disabled={!name.trim()}
              >
                Continue
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
