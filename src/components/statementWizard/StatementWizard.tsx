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
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatements } from '../../hooks/useStatements';
import { postNewStatement } from '../../api/statementsApi';
import type { Statement, SetQuestion, Step } from '../../../types/types';
import { SubjectTiles } from './SubjectTiles';
import { VerbTiles } from './VerbTiles';
import { PrivacySelector } from './PrivacySelector';
import statementsCategories from '../../../data/statementsCategories.json';

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

  const [step, setStep] = useState<Step>('subject');
  const [selection, setSelection] = useState<Statement>({
    id: '',
    subject: '',
    verb: '',
    object: '',
    category: '',
    isPublic: false,
  });

  const categories = statementsCategories.categories || [];

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
    if (currentStep === 'object')
      return `In what way does ${
        selection.subject
      } ${selection.verb.toLowerCase()}? What's the context?`;
    if (currentStep === 'category')
      return `You can set a category for your statement`;
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
      case 'object':
        setStep('verb');
        break;
      case 'category':
        setStep('object');
        break;
      case 'privacy':
        setStep('category');
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
      case 'subject': {
        const allowDescriptors =
          activePresetQuestion?.steps?.subject?.allowDescriptors;
        if (allowDescriptors === false) {
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
                Next
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
      }

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
                setStep('object');
              }}
            />
          </div>
        );

      case 'object':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold text-center'>
              {getStepQuestion('object')}
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
              onClick={() => selection.object.trim() && setStep('category')}
              disabled={!selection.object.trim()}
            >
              Continue
            </Button>
          </div>
        );

      case 'category':
        return (
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold text-center mb-6'>
              {getStepQuestion('category')}
            </h2>
            <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
              {categories.map((cat: { id: string; name: string }) => (
                <Button
                  key={cat.id}
                  variant={
                    selection.category === cat.id ? 'default' : 'outline'
                  }
                  className='h-auto py-4 px-6 text-left flex flex-col items-start space-y-1 transition-all'
                  onClick={() =>
                    setSelection((prev) => ({ ...prev, category: cat.id }))
                  }
                >
                  <span className='font-medium'>{cat.name}</span>
                </Button>
              ))}
            </div>
            <Button
              onClick={() => {
                if (selection.category) {
                  setStep('privacy');
                }
              }}
              disabled={!selection.category}
              className='w-full'
            >
              Next
            </Button>
          </div>
        );

      case 'privacy':
        return (
          <PrivacySelector
            isPublic={selection.isPublic}
            onChange={(isPublic) =>
              setSelection((prev) => ({ ...prev, isPublic }))
            }
            onComplete={handleComplete} // <-- This prop was added
          />
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
