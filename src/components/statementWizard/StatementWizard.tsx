// src/components/statementWizard/StatementWizard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEntries } from '../../hooks/useEntries';
import { postNewEntry } from '../../api/entriesApi';
import type { Entry, SetQuestion, Step } from '../../../types/entries';
import { SubjectTiles } from './SubjectTiles';
import { VerbTiles } from './VerbTiles';
import { PrivacySelector } from './PrivacySelector';
import statementsCategories from '../../../data/statementsCategories.json';

interface StatementWizardProps {
  username: string;
  presetQuestion?: SetQuestion;
  onComplete: (newStatement: Entry) => void;
  onClose: () => void;
}

// Default questions for each step
const defaultQuestions = (username: string, selection: Entry) => ({
  subject: `This statement applies to ${username} or someone/something else?`,
  verb: `What's happening with ${selection.atoms.subject}? How do they feel or what do they experience?`,
  object: `In what way does ${
    selection.atoms.subject
  } ${selection.atoms.verb.toLowerCase()}? What's the context?`,
  category: `You can set a category for your statement`,
  privacy: `Who can see this statement?`,
});

// A reusable container for each step screen
const StepContainer: React.FC<{
  question: string;
  children: React.ReactNode;
}> = ({ question, children }) => (
  <div className='space-y-4 p-6'>
    <h2 className='text-2xl font-semibold text-center mb-6'>{question}</h2>
    {children}
  </div>
);

const StatementWizard: React.FC<StatementWizardProps> = ({
  username,
  presetQuestion,
  onComplete,
  onClose,
}) => {
  const { setData } = useEntries();
  const isPreset = Boolean(presetQuestion);

  // Define the steps; skip 'category' if using a preset question.
  const steps: Step[] = isPreset
    ? ['subject', 'verb', 'object', 'privacy']
    : ['subject', 'verb', 'object', 'category', 'privacy'];

  // Define a mapping of step names to border color classes.
  const stepBorderColors: Record<Exclude<Step, 'closed'>, string> = {
    subject: 'border-subjectSelector',
    verb: 'border-verbSelector',
    object: 'border-objectInput',
    category: 'border-black',
    privacy: 'border-privacySelector',
  };

  const [step, setStep] = useState<Step>('subject');
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

  // If the preset question indicates a preset subject, default to username.
  useEffect(() => {
    if (presetQuestion?.steps?.subject?.preset) {
      setSelection((prev) => ({
        ...prev,
        atoms: { ...prev.atoms, subject: username },
      }));
    }
  }, [presetQuestion, username]);

  // Get the question text for the current step
  const getQuestion = (currentStep: Exclude<Step, 'closed'>) =>
    presetQuestion?.steps?.[currentStep]?.question ||
    defaultQuestions(username, selection)[currentStep];

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      onClose();
    }
  };

  const handleNext = (nextStep: Step) => {
    setStep(nextStep);
  };

  const handleComplete = async () => {
    // Build the full input string from atoms.
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
      // If using a preset question, use its category; otherwise, use selection.category.
      category:
        presetQuestion?.category || selection.category || 'Uncategorized',
    };

    setData({ type: 'ADD_ENTRY', payload: newEntry });
    await postNewEntry(newEntry);
    onComplete(newEntry);
    onClose();
  };

  // --- Render functions for each step ---

  const renderSubjectStep = () => {
    const question = getQuestion('subject');
    const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;
    if (allowDescriptors === false) {
      return (
        <StepContainer question={question}>
          <div className='text-center p-4 border rounded'>
            <p>{username}</p>
          </div>
          <Button
            onClick={() => {
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, subject: username },
              }));
              handleNext('verb');
            }}
            className='w-full'
          >
            Next
          </Button>
        </StepContainer>
      );
    }
    return (
      <StepContainer question={question}>
        <SubjectTiles
          username={username}
          activePresetQuestion={presetQuestion}
          selectedValue={selection.atoms.subject}
          onSelect={(value) => {
            const newSubject =
              presetQuestion && !presetQuestion.steps.subject.allowDescriptors
                ? username
                : value;
            setSelection((prev) => ({
              ...prev,
              atoms: { ...prev.atoms, subject: newSubject },
            }));
            handleNext('verb');
          }}
        />
      </StepContainer>
    );
  };

  const renderVerbStep = () => {
    const question = getQuestion('verb');
    return (
      <StepContainer question={question}>
        <div className='flex flex-col h-[60vh] p-4 rounded-md'>
          <VerbTiles
            selectedVerb={selection.atoms.verb}
            onSelect={(verb) => {
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, verb },
              }));
              handleNext('object');
            }}
          />
        </div>
      </StepContainer>
    );
  };

  const renderObjectStep = () => {
    const question = getQuestion('object');
    // Next step depends on whether we need to show the category screen.
    const nextStep: Step = presetQuestion ? 'privacy' : 'category';
    return (
      <StepContainer question={question}>
        <div className='p-4 rounded-md'>
          <Input
            autoFocus
            placeholder='Type your answer...'
            value={selection.atoms.object}
            onChange={(e) =>
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, object: e.target.value },
              }))
            }
            className='text-lg p-4 rounded'
          />
        </div>
        <Button
          className='w-full mt-4'
          onClick={() => selection.atoms.object.trim() && handleNext(nextStep)}
          disabled={!selection.atoms.object.trim()}
        >
          Continue
        </Button>
      </StepContainer>
    );
  };

  const renderCategoryStep = () => {
    const question = getQuestion('category');
    const categories = statementsCategories.categories || [];
    return (
      <StepContainer question={question}>
        <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
          {categories.map((cat: { id: string; name: string }) => (
            <Button
              key={cat.id}
              variant={selection.category === cat.id ? 'default' : 'outline'}
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
          onClick={() => selection.category && handleNext('privacy')}
          disabled={!selection.category}
          className='w-full'
        >
          Next
        </Button>
      </StepContainer>
    );
  };

  const renderPrivacyStep = () => {
    const question = getQuestion('privacy');
    return (
      <StepContainer question={question}>
        <PrivacySelector
          isPublic={selection.isPublic}
          onChange={(isPublic) =>
            setSelection((prev) => ({ ...prev, isPublic }))
          }
          onComplete={handleComplete}
        />
      </StepContainer>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'subject':
        return renderSubjectStep();
      case 'verb':
        return renderVerbStep();
      case 'object':
        return renderObjectStep();
      case 'category':
        return renderCategoryStep();
      case 'privacy':
        return renderPrivacyStep();
      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] pt-6 border-8 ${
          stepBorderColors[step as Exclude<Step, 'closed'>]
        }`}
      >
        {presetQuestion && (
          <div className='p-4 bg-gray-200 text-center'>
            <h2 className='text-xl font-bold'>{presetQuestion.mainQuestion}</h2>
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
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
