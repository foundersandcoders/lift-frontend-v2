'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatements } from '../../hooks/useStatements';
import { postNewStatement } from '../../api/statementsApi';
import type { Statement, SetQuestion, Step } from '../../../types/types';
import { SubjectTiles } from './SubjectTiles';
import { VerbTiles } from './VerbTiles';

interface StatementWizardProps {
  username: string;
  presetQuestion?: SetQuestion;
  onComplete: (newStatement: Statement) => void;
  onClose: () => void;
}

const StatementWizard: React.FC<StatementWizardProps> = ({
  username,
  presetQuestion,
  onComplete,
  onClose,
}) => {
  const { dispatch } = useStatements();
  const activePresetQuestion: SetQuestion | undefined = presetQuestion;

  // Remove internal open state; wizard is controlled by parent rendering.
  const [step, setStep] = useState<Step>('subject');
  const [selection, setSelection] = useState<Statement>({
    id: '',
    subject: '',
    verb: '',
    object: '',
    isPublic: false,
  });

  const getStepQuestion = (currentStep: Step) => {
    if (
      currentStep !== 'closed' &&
      activePresetQuestion?.steps?.[currentStep as Exclude<Step, 'closed'>]
        ?.question
    ) {
      return activePresetQuestion.steps[currentStep as Exclude<Step, 'closed'>]
        .question;
    }
    if (currentStep === 'subject')
      return `This statement applies to ${username} or someone/something else?`;
    if (currentStep === 'verb')
      return `What's happening with ${selection.subject}? How do they feel or what do they experience?`;
    if (currentStep === 'what')
      return `In what way does ${
        selection.subject
      } ${selection.verb.toLowerCase()}? What's the context?`;
    if (currentStep === 'privacy') return `Who can see this statement?`;
    return '';
  };

  useEffect(() => {
    if (activePresetQuestion?.steps?.subject?.preset) {
      setSelection((prev) => ({ ...prev, subject: username }));
    }
  }, [activePresetQuestion, username]);

  const handleBack = () => {
    switch (step) {
      case 'verb':
        setStep('subject');
        break;
      case 'what':
        setStep('verb');
        break;
      case 'privacy':
        setStep('what');
        break;
      default:
        onClose();
    }
  };

  const handleComplete = async () => {
    const newStatement: Statement = {
      ...selection,
      id: Date.now().toString(),
      presetId: activePresetQuestion ? activePresetQuestion.id : undefined,
    };
    dispatch({ type: 'ADD_STATEMENT', payload: newStatement });
    await postNewStatement(newStatement);
    onComplete(newStatement);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'subject':
        if (activePresetQuestion?.steps?.subject?.preset) {
          return (
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold text-center mb-6'>
                {getStepQuestion('subject')}
              </h2>
              <div className='text-center p-4 border rounded'>
                <p>{username}</p>
              </div>
              <Button
                onClick={() => {
                  setSelection((prev) => ({ ...prev, subject: username }));
                  setStep('verb');
                }}
                className='w-full'
              >
                Continue
              </Button>
            </div>
          );
        }
        return (
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold text-center mb-6'>
              {getStepQuestion('subject')}
            </h2>
            <SubjectTiles
              username={username}
              activePresetQuestion={activePresetQuestion}
              selectedValue={selection.subject}
              onSelect={(value) => {
                if (
                  activePresetQuestion &&
                  !activePresetQuestion.steps.subject.allowDescriptors
                ) {
                  setSelection((prev) => ({ ...prev, subject: username }));
                } else {
                  setSelection((prev) => ({ ...prev, subject: value }));
                }
                setStep('verb');
              }}
            />
          </div>
        );

      case 'verb':
        return (
          <div className='flex flex-col' style={{ height: '60vh' }}>
            <h2 className='sticky top-0 bg-white z-10 py-2 text-2xl font-semibold text-center'>
              {getStepQuestion('verb')}
            </h2>
            <VerbTiles
              selectedVerb={selection.verb}
              onSelect={(verb) => {
                setSelection((prev) => ({ ...prev, verb }));
                setStep('what');
              }}
            />
          </div>
        );

      case 'what':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold text-center'>
              {getStepQuestion('what')}
            </h2>
            <Input
              autoFocus
              placeholder='Type your answer...'
              value={selection.object}
              onChange={(e) =>
                setSelection((prev) => ({ ...prev, object: e.target.value }))
              }
              className='text-lg p-4'
            />
            <Button
              className='w-full'
              onClick={() => selection.object.trim() && setStep('privacy')}
              disabled={!selection.object.trim()}
            >
              Continue
            </Button>
          </div>
        );
      case 'privacy':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold text-center'>
              {getStepQuestion('privacy')}
            </h2>
            <div className='space-y-4'>
              <Button
                variant='outline'
                className={`w-full h-auto p-4 flex items-center justify-between ${
                  !selection.isPublic ? 'border-2 border-primary' : ''
                }`}
                onClick={() =>
                  setSelection((prev) => ({ ...prev, isPublic: false }))
                }
              >
                <div className='flex items-center space-x-3'>
                  <EyeOff className='w-5 h-5' />
                  <div className='text-left'>
                    <div className='font-medium'>Private</div>
                    <div className='text-sm text-muted-foreground'>
                      Only you can see this
                    </div>
                  </div>
                </div>
              </Button>
              <Button
                variant='outline'
                className={`w-full h-auto p-4 flex items-center justify-between ${
                  selection.isPublic ? 'border-2 border-primary' : ''
                }`}
                onClick={() =>
                  setSelection((prev) => ({ ...prev, isPublic: true }))
                }
              >
                <div className='flex items-center space-x-3'>
                  <Eye className='w-5 h-5' />
                  <div className='text-left'>
                    <div className='font-medium'>Public</div>
                    <div className='text-sm text-muted-foreground'>
                      Everyone can see this
                    </div>
                  </div>
                </div>
              </Button>
            </div>
            <Button className='w-full' onClick={handleComplete}>
              Create Statement
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className='sm:max-w-[600px] pt-6'>
        {activePresetQuestion && (
          <div className='p-4 bg-gray-200 text-center'>
            <h2 className='text-xl font-bold'>
              {activePresetQuestion.mainQuestion}
            </h2>
          </div>
        )}
        <DialogDescription className='sr-only'>
          Confirmation Dialog
        </DialogDescription>
        <DialogTitle className='sr-only'>Confirmation Dialog</DialogTitle>
        <div className='relative'>
          {step !== 'subject' && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 top-4 z-10'
              onClick={(e) => {
                e.stopPropagation();
                handleBack();
              }}
            >
              <ArrowLeft className='w-4 h-4' />
            </Button>
          )}
          <AnimatePresence
            mode='wait'
            initial={false}
            onExitComplete={() => null}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
