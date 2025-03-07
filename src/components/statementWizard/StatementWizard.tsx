'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useEntries } from '../../hooks/useEntries';
import { postNewEntry } from '../../api/entriesApi';
import type { Entry, SetQuestion, Step } from '../../../types/entries';
import { SubjectStep } from './steps/SubjectStep';
import { VerbStep } from './steps/VerbStep';
import { ObjectStep } from './steps/ObjectStep';
import { CategoryStep } from './steps/CategoryStep';
import { PrivacyStep } from './steps/PrivacyStep';
import { ComplementStep } from './steps/ComplementStep';
import StatementPreview from './StatementPreview';

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
  const steps: Step[] = isPreset
    ? ['subject', 'verb', 'object', 'privacy', 'complement']
    : ['subject', 'verb', 'object', 'category', 'privacy'];

  //
  const stepBorderColors: Record<Exclude<Step, 'closed'>, string> = {
    subject: 'border-[var(--subject-selector)]',
    verb: 'border-[var(--verb-selector)]', // Uses the custom property --verb-selector
    object: 'border-[var(--object-input)]', // Uses the custom property --object-input
    category: 'border-black', // Or use another token if defined, e.g. 'border-[var(--category-selector)]'
    privacy: 'border-[var(--privacy-selector)]', // Uses the custom property --privacy-selector
    complement: 'border-gray-400', // Fallback or your custom variable for complement
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

  // If using a preset that presets subject, set it to username
  useEffect(() => {
    if (presetQuestion?.steps?.subject?.preset) {
      setSelection((prev) => ({
        ...prev,
        atoms: { ...prev.atoms, subject: username },
      }));
    }
  }, [presetQuestion, username]);

  const currentStep = steps[currentStepIndex];

  const handleComplete = async () => {
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
      category:
        presetQuestion?.category || selection.category || 'Uncategorized',
    };

    setData({ type: 'ADD_ENTRY', payload: newEntry });
    await postNewEntry(newEntry);
    onComplete(newEntry);
    onClose();
  };

  // Advance to the next step or finish if on the last step
  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'subject':
        return (
          <SubjectStep
            username={username}
            presetQuestion={presetQuestion}
            selection={selection.atoms.subject}
            onUpdate={(val) =>
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, subject: val },
              }))
            }
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 'verb':
        return (
          <VerbStep
            subject={selection.atoms.subject}
            selection={selection.atoms.verb}
            onUpdate={(val) =>
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, verb: val },
              }))
            }
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 'object':
        return (
          <ObjectStep
            subject={selection.atoms.subject}
            verb={selection.atoms.verb}
            selection={selection.atoms.object}
            onUpdate={(val) =>
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, object: val },
              }))
            }
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 'category':
        return (
          <CategoryStep
            selection={selection.category}
            onUpdate={(val) =>
              setSelection((prev) => ({
                ...prev,
                category: val,
              }))
            }
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 'privacy':
        return (
          <PrivacyStep
            isPublic={selection.isPublic}
            onUpdate={(val) =>
              setSelection((prev) => ({
                ...prev,
                isPublic: val,
              }))
            }
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 'complement':
        return <ComplementStep onComplete={handleComplete} onBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] p-0 w-full border-8 ${
          currentStep !== 'closed'
            ? stepBorderColors[currentStep as Exclude<Step, 'closed'>]
            : ''
        }`}
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
        <StatementPreview selection={selection} />
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
