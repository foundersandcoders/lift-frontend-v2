'use client';

import React, { useState, useEffect } from 'react';
import {
  SimpleDialog as Dialog,
  SimpleDialogContent as DialogContent,
  SimpleDialogDescription as DialogDescription,
  SimpleDialogTitle as DialogTitle,
} from '@/components/ui/simple-dialog';
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
  // For custom statements, show category first, then subject
  const steps: Exclude<Step, 'closed'>[] = isPreset
    ? ['subject', 'verb', 'object', 'privacy', 'complement']
    : ['category', 'subject', 'verb', 'object', 'privacy'];

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
        // For preset questions, use the category from the preset
        category: presetQuestion.category || 'uncategorised',
        // Add the presetId to identify this as a preset question in the preview
        presetId: presetQuestion.id,
      }));
    } else {
      // For custom statements, set default category to "uncategorised" 
      // but still show the category screen first
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
        presetQuestion?.category || selection.category || 'Uncategorized',
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

  // Validation function for the current step.
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
        // For custom statements (not preset), category must be selected
        return isPreset || selection.category.trim().length > 0;
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
            selectedCategory={selection.category} // Pass the selected category to filter descriptors
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
                // Update the selection but don't automatically advance
                // Let the user click Next or click the same category again to advance
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
        )} flex flex-col max-h-[90vh]`}
      >
        {/* Header Section - Always Visible */}
        {presetQuestion && (
          <div className='p-2 md:p-5 bg-gray-200 border-b flex-shrink-0'>
            <h2 className='text-base md:text-xl font-bold'>
              {presetQuestion.mainQuestion}
            </h2>
          </div>
        )}
        <DialogDescription className='sr-only'>Wizard Steps</DialogDescription>
        <DialogTitle className='sr-only'>Wizard Steps</DialogTitle>
        
        {/* Scrollable Content Area */}
        <div className='flex-grow overflow-y-auto min-h-0'>
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
        </div>
        
        {/* Bottom Section - Always Visible */}
        <div className='flex-shrink-0'>
          {/* Navigation Panel */}
          <div className='flex justify-center p-0 md:p-4 pb-2 mb-0 gap-6'>
            <Button
              onClick={goBack}
              disabled={currentStepIndex === 0}
              variant='outline'
              className='shadow-sm p-2'
            >
              <span>Back</span>
            </Button>
            <Button
              variant='default'
              className='shadow-sm p-2'
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

          {/* Divider to separate preview from wizard content */}
          <div className='w-full border-t border-black my-2 relative'>
            <span className='absolute left-0 right-0 text-center bg-white text-xs text-black px-2 -top-2 mx-auto w-fit'>
              Statement Preview
            </span>
          </div>

          {/* Preview - Always Visible */}
          <StatementPreview selection={{ ...selection, currentStep }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
