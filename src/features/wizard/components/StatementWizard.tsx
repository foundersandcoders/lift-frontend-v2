'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useEntries } from '@/features/statements/hooks/useEntries';
import { postNewEntry } from '@/features/statements/api/entriesApi';
import type { Entry, SetQuestion, Step } from '@/types/entries';
import { SubjectStep } from './steps/SubjectStep';
import { VerbStep } from './steps/VerbStep';
import { ObjectStep } from './steps/ObjectStep';
import { CategoryStep } from './steps/CategoryStep';
import { PrivacyStep } from './steps/PrivacyStep';
import { ComplementStep } from './steps/ComplementStep';
import StatementPreview from './StatementPreview';
import { Button } from '@/components/ui/button';

interface StatementWizardProps {
  username: string;
  presetQuestion?: SetQuestion;
  onComplete: (newStatement: Entry) => void;
  onClose: () => void;
}

const StatementWizard: React.FC<StatementWizardProps> = ({
  username,
  presetQuestion,
  onComplete,
  onClose,
}) => {
  const { setData } = useEntries();
  const isPreset = Boolean(presetQuestion);

  // Define steps: if preset, skip "category" and add "complement"
  const steps: Exclude<Step, 'closed'>[] = isPreset
    ? ['subject', 'verb', 'object', 'privacy', 'complement']
    : ['subject', 'verb', 'object', 'category', 'privacy'];

  // Use design tokens for border colors via Tailwind’s arbitrary value syntax:
  const stepBorderColors: Record<Exclude<Step, 'closed'>, string> = {
    subject: 'border-[var(--subject-selector)]',
    verb: 'border-[var(--verb-selector)]',
    object: 'border-[var(--object-input)]',
    category: 'border-[var(--category-selector)]',
    privacy: 'border-[var(--privacy-selector)]',
    complement: 'border-gray-400',
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selection, setSelection] = useState<Entry>({
    id: '',
    input: '',
    isPublic: false,
    atoms: {
      subject: '',
      verb: '',
      object: '',
      adverbial: [],
    },
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add a flag to prevent rapid multiple step transitions
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize default values based on whether this is a preset or custom statement
  useEffect(() => {
    // For preset questions, set the subject if a preset is specified
    if (presetQuestion?.steps?.subject?.preset) {
      setSelection((prev) => ({
        ...prev,
        atoms: { ...prev.atoms, subject: username },
      }));
    } else {
      // For custom statements, set defaults:
      setSelection((prev) => ({
        ...prev,
        // Set default subject to username
        atoms: { ...prev.atoms, subject: username },
        // Set default category to 'uncategorised'
        category: 'uncategorised',
      }));
    }
  }, [presetQuestion, username]);

  const currentStep = steps[currentStepIndex];

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { subject, verb, object, adverbial } = selection.atoms;
    const adverbialText =
      adverbial && adverbial.length > 0 ? adverbial.join(' ') : '';
    const fullInput = `${subject} ${verb} ${object}${
      adverbialText ? ' ' + adverbialText : ''
    }`;

    const newEntry: Entry = {
      ...selection,
      id: Date.now().toString(),
      input: fullInput,
      presetId: presetQuestion ? presetQuestion.id : undefined,
      // Use the category ID directly - display name will be handled by the UI
      category:
        presetQuestion?.category ||
        selection.category ||
        'Uncategorized',
    };

    try {
      setData({ type: 'ADD_ENTRY', payload: newEntry });
      await postNewEntry(newEntry);
      onComplete(newEntry);
      onClose();
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    // Check if we're already in the middle of a transition
    if (isTransitioning) {
      return; // Prevent multiple rapid transitions
    }
    
    // Set transitioning flag to prevent additional advances
    setIsTransitioning(true);
    
    // Add a small delay to prevent double-click issues
    setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        handleComplete();
      }
      
      // Reset transition flag after a slightly longer delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200); // 200ms delay to prevent step skipping
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  // Optional: Define a validation function for the current step.
  // This function should return true if the current step’s required data is valid.
  const isStepValid = (step: Exclude<Step, 'closed'>): boolean => {
    switch (step) {
      case 'subject':
        return selection.atoms.subject.trim().length > 0;
      case 'verb':
        return selection.atoms.verb.trim().length > 0;
      case 'object':
        return selection.atoms.object.trim().length > 0;
      case 'category':
        return selection.category.trim().length > 0;
      case 'privacy':
        // Always valid since it's a boolean toggle.
        return true;
      case 'complement':
        // Complement is optional; consider it valid.
        return true;
      default:
        return false;
    }
  };

  // Render the current step component without navigation buttons.
  const renderStep = () => {
    switch (currentStep) {
      case 'subject':
        return (
          <SubjectStep
            username={username}
            presetQuestion={presetQuestion}
            selection={selection.atoms.subject}
            onUpdate={(val) => {
              // If the same value is selected again, move to next step
              if (selection.atoms.subject === val) {
                goNext();
              } else {
                // Otherwise, just update the selection
                setSelection((prev) => ({
                  ...prev,
                  atoms: { ...prev.atoms, subject: val },
                }));
              }
            }}
          />
        );
      case 'verb':
        return (
          <VerbStep
            subject={selection.atoms.subject}
            selection={selection.atoms.verb}
            onUpdate={(val) => {
              // If the same value is selected again, move to next step
              if (selection.atoms.verb === val) {
                goNext();
              } else {
                // Otherwise, just update the selection
                setSelection((prev) => ({
                  ...prev,
                  atoms: { ...prev.atoms, verb: val },
                }));
              }
            }}
          />
        );
      case 'object':
        return (
          <ObjectStep
            subject={selection.atoms.subject}
            verb={selection.atoms.verb}
            selection={selection.atoms.object}
            onUpdate={(val) => {
              // If the same value is selected again, move to next step
              if (selection.atoms.object === val) {
                goNext();
              } else {
                // Otherwise, just update the selection
                setSelection((prev) => ({
                  ...prev,
                  atoms: { ...prev.atoms, object: val },
                }));
              }
            }}
          />
        );
      case 'category':
        return (
          <CategoryStep
            selection={selection.category}
            onUpdate={(val) => {
              // If the same value is selected again, move to next step
              if (selection.category === val) {
                goNext();
              } else {
                // Otherwise, just update the selection
                setSelection((prev) => ({
                  ...prev,
                  category: val,
                }));
              }
            }}
          />
        );
      case 'privacy':
        return (
          <PrivacyStep
            isPublic={selection.isPublic}
            onUpdate={(val) => {
              // If the same value is selected again, move to next step
              if (selection.isPublic === val) {
                goNext();
              } else {
                // Otherwise, just update the selection
                setSelection((prev) => ({
                  ...prev,
                  isPublic: val,
                }));
              }
            }}
          />
        );
      case 'complement':
        return <ComplementStep />;
      default:
        return null;
    }
  };

  // Helper function to get the border color class
  const getBorderColor = (step: Exclude<Step, 'closed'>): string => {
    return stepBorderColors[step];
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] p-0 w-full border-8 ${getBorderColor(
          currentStep
        )}`}
      >
        {presetQuestion && (
          <div className='px-4 py-3 bg-gray-200 border-b'>
            <h2 className='text-xl font-bold'>{presetQuestion.mainQuestion}</h2>
          </div>
        )}
        <DialogDescription className='sr-only'>Wizard Steps</DialogDescription>
        <DialogTitle className='sr-only'>Wizard Steps</DialogTitle>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        {/* Navigation Panel */}
        <div className='flex justify-center p-4 pb-4 mb-0 gap-4'>
          <Button
            onClick={goBack}
            disabled={currentStepIndex === 0}
            variant='outline'
            className='shadow-sm'
          >
            <span>Back</span>
          </Button>
          <Button
            variant='default'
            className='shadow-sm'
            onClick={
              currentStepIndex === steps.length - 1 ? handleComplete : goNext
            }
            disabled={!isStepValid(currentStep) || isSubmitting}
          >
            <span>
              {isSubmitting
                ? 'Submitting...'
                : currentStepIndex === steps.length - 1
                ? 'Create Statement'
                : 'Next'}
            </span>
          </Button>
        </div>
        <StatementPreview selection={{...selection, currentStep}} />
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
