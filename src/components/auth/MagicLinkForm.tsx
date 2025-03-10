import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../../utils/validateEmail';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Mail, Loader2 } from 'lucide-react';

interface MagicLinkFormProps {
  callbackURL?: string;
  onSuccess?: () => void;
}

const MagicLinkForm: React.FC<MagicLinkFormProps> = ({ 
  callbackURL = '/main',
  onSuccess 
}) => {
  const { requestMagicLink, state } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setEmailError('');
    
    // Request magic link
    const result = await requestMagicLink(email, callbackURL);
    
    if (result.success) {
      setEmailSent(true);
      if (onSuccess) onSuccess();
    } else {
      setEmailError(result.error || 'Failed to send login link');
    }
  };

  if (emailSent) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-pink-100">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto text-brand-pink mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Check your inbox</h2>
          <p className="text-gray-600 mb-4">
            We've sent a magic link to <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to sign in to your account.
            The link will expire in 5 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`w-full ${emailError ? 'border-red-500' : ''}`}
          autoComplete="email"
          disabled={state.isLoading}
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-500">{emailError}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        variant="pink"
        disabled={state.isLoading}
      >
        {state.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Magic Link"
        )}
      </Button>
    </form>
  );
};

export default MagicLinkForm;