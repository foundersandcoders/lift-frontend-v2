'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import descriptorsData from '../../data/descriptors.json';
import { verbData } from '../../utils/verbUtils';
import { useStatements } from '../hooks/useStatements';
import { postNewStatement } from '../api/statementsApi';
import type { Statement, SetQuestion, Step } from '../../types/types';

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
  const [step, setStep] = useState<Step>('who');
  const [selection, setSelection] = useState<Statement>({
    id: '',
    subject: '',
    verb: '',
    object: '',
    isPublic: false,
  });

  // Build subject tiles (using descriptors)
  const subjectTiles = useMemo(() => {
    const data = descriptorsData as { descriptors: string[] };
    return [
      { label: username, value: username },
      ...data.descriptors.map((descriptor) => ({
        label: `${username}'s ${descriptor}`,
        value: `${username}'s ${descriptor}`,
      })),
    ];
  }, [username]);

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const getStepQuestion = (currentStep: Step) => {
    if (activePresetQuestion && currentStep !== 'closed') {
      return activePresetQuestion.steps[
        currentStep as keyof typeof activePresetQuestion.steps
      ].question;
    }
    if (currentStep === 'who')
      return `This statement applies to ${username} or someone/something else?`;
    if (currentStep === 'action')
      return `What's happening with ${selection.subject}? How do they feel or what do they experience?`;
    if (currentStep === 'what')
      return `In what way does ${
        selection.subject
      } ${selection.verb.toLowerCase()}? What's the context?`;
    if (currentStep === 'privacy') return `Who can see this statement?`;
    return '';
  };

  useEffect(() => {
    if (activePresetQuestion && activePresetQuestion.steps.who.preset) {
      setSelection((prev) => ({ ...prev, subject: username }));
    }
  }, [activePresetQuestion, username]);

  const handleBack = () => {
    switch (step) {
      case 'action':
        setStep('who');
        break;
      case 'what':
        setStep('action');
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
      case 'who':
        if (activePresetQuestion && activePresetQuestion.steps.who.preset) {
          return (
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold text-center mb-6'>
                {getStepQuestion('who')}
              </h2>
              <div className='text-center p-4 border rounded'>
                <p>{username}</p>
              </div>
              <Button
                onClick={() => {
                  setSelection((prev) => ({ ...prev, subject: username }));
                  setStep('action');
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
              {getStepQuestion('who')}
            </h2>
            <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
              {subjectTiles.map((tile) => (
                <Button
                  key={tile.value}
                  variant={
                    selection.subject === tile.value ? 'default' : 'outline'
                  }
                  className={`h-auto py-4 px-6 text-left flex flex-col items-start space-y-1 transition-all ${
                    tile.value === username
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : ''
                  }`}
                  onClick={() => {
                    if (
                      activePresetQuestion &&
                      !activePresetQuestion.steps.who.allowDescriptors
                    ) {
                      setSelection((prev) => ({ ...prev, subject: username }));
                    } else {
                      setSelection((prev) => ({
                        ...prev,
                        subject: tile.value,
                      }));
                    }
                    setStep('action');
                  }}
                >
                  <span className='font-medium'>{tile.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case 'action':
        return (
          <div className='flex flex-col' style={{ height: '60vh' }}>
            <h2 className='sticky top-0 bg-white z-10 py-2 text-2xl font-semibold text-center'>
              {getStepQuestion('action')}
            </h2>
            <div className='overflow-y-auto'>
              <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2'>
                {verbData
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((verb, index) => (
                    <Button
                      key={`${verb.name}-${index}`}
                      variant={
                        selection.verb === verb.name ? 'default' : 'outline'
                      }
                      className='h-auto py-2 px-3 text-left flex items-center justify-center transition-all text-sm'
                      style={{
                        backgroundColor:
                          selection.verb === verb.name
                            ? verb.color
                            : 'transparent',
                        color:
                          selection.verb === verb.name
                            ? getContrastColor(verb.color)
                            : 'inherit',
                        borderColor: verb.color,
                      }}
                      onClick={() => {
                        setSelection((prev) => ({ ...prev, verb: verb.name }));
                        setStep('what');
                      }}
                    >
                      <span className='font-medium'>{verb.name}</span>
                    </Button>
                  ))}
              </div>
            </div>
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
          {step !== 'who' && (
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
