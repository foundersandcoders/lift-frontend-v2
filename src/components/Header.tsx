import React, { useState } from 'react';
import { useStatements } from '../hooks/useStatements';
// import { useQuestions } from '@/hooks/useQuestions';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Edit2, Save, X } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { validateEmail } from '../../utils/validateEmail';
import QuestionCounter from './ui/QuestionCounter';

const Header: React.FC = () => {
  // const { questions, setQuestions } = useQuestions();
  const { data, setData } = useStatements();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [managerEmailInput, setManagerEmailInput] = useState(
    data.managerEmail || ''
  );
  const [emailError, setEmailError] = useState('');

  const handleEmailSave = () => {
    if (!validateEmail(managerEmailInput.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setData({ type: 'SET_MANAGER_EMAIL', payload: managerEmailInput });
    setIsEditingEmail(false);
    setEmailError('');
  };

  return (
    <header className='bg-brand-pink text-white p-4 shadow-md'>
      <div className='container mx-auto flex items-center justify-between'>
        {/* Left side: Logo and Title */}
        <div className='flex items-center'>
          <img src='/lift_logo.png' alt='Logo' className='h-10 mr-2' />
          <h1 className='text-2xl font-bold'>Nassport</h1>
        </div>
        {/* Right side: Clickable container with border that opens the dialog */}
        <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
          <DialogTrigger asChild>
            <div className='flex items-center border-2 border-white rounded-full px-4 py-2 cursor-pointer'>
              {data.username ? (
                <span className='mr-2'>Logged as: {data.username}</span>
              ) : (
                <span>Not logged</span>
              )}
              <User size={24} />
            </div>
          </DialogTrigger>
          <DialogContent headerTitle="User's Data" className='sm:max-w-md p-0'>
            <DialogDescription className='sr-only'>
              Dashboard with user information and settings.
            </DialogDescription>
            <div className='bg-gray-50 p-4'>
              {/* Username section */}
              <div>
                <div className='text-sm font-semibold text-gray-700 mb-1'>
                  Your name:
                </div>
                <div className='text-sm text-gray-800'>
                  {data.username || 'Not set'}
                </div>
              </div>
              {/* Manager email section */}
              <div className='mt-4'>
                <div className='text-sm font-semibold text-gray-700 mb-1'>
                  Your line's manager email:
                </div>
                <div className='flex items-center space-x-2'>
                  {isEditingEmail ? (
                    <>
                      <Input
                        value={managerEmailInput}
                        onChange={(e) => setManagerEmailInput(e.target.value)}
                        placeholder='Enter new manager email'
                        aria-label='Manager Email'
                        className='w-full'
                      />
                      <Button
                        onClick={handleEmailSave}
                        variant='outline'
                        size='sm'
                        aria-label='Save Email'
                        disabled={
                          managerEmailInput.trim() !== '' &&
                          !validateEmail(managerEmailInput.trim())
                        }
                      >
                        <Save size={16} className='text-green-500' />
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingEmail(false);
                          setManagerEmailInput(data.managerEmail || '');
                          setEmailError('');
                        }}
                        variant='outline'
                        size='sm'
                        aria-label='Cancel Editing'
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className='text-sm text-gray-800'>
                        {data.managerEmail || 'Not set'}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className='flex items-center justify-center rounded-full bg-white p-2 text-brand-pink'
                            aria-label="Edit your line's manager email"
                            onClick={() => setIsEditingEmail(true)}
                          >
                            <Edit2 size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Edit your line's manager email
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
                {emailError && (
                  <div className='text-red-500 text-xs mt-1'>{emailError}</div>
                )}
              </div>
              {/* Question counter */}
              <div>
                <div className='text-sm font-semibold text-gray-700 mb-1'>
                  Your progress:
                </div>
                <div className='text-sm text-gray-800'>
                  <QuestionCounter />
                </div>
              </div>
            </div>
            <DialogFooter className='p-4 bg-gray-50 sm:rounded-b-lg'>
              <Button
                onClick={() => setIsDashboardOpen(false)}
                variant='outline'
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
