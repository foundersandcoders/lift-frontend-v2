'use client';

import { useState, useEffect } from 'react';
import nlp from 'compromise';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog.tsx';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useEntries } from '../../hooks/useEntries';
import { postNewEntry } from '../../api/entriesApi';
import type { Entry, SetQuestion, Step } from '../../../types/entries';
import { SubjectTiles } from './SubjectTiles';
import SentimentVerbPicker from './SentimentVerbPicker';
import { PrivacySelector } from './PrivacySelector';
import statementsCategories from '../../../data/statementsCategories.json';
import StepContainer from './StepContainer';
import StatementPreview from './StatementPreview';
import nlp from 'compromise';

interface StatementWizardProps {
  username: string;
  presetQuestion?: SetQuestion;
  onComplete: (newStatement: Entry) => void;
  onClose: () => void;
}

// Default sub-questions for each step
const defaultQuestions = (username: string, selection: Entry) => ({
  subject: `This statement applies to ${username} or someone/something else?`,
  verb: `What's happening with ${selection.atoms.subject}? How do they feel or what do they experience?`,
  object: `In what way does ${
    selection.atoms.subject
  } ${
    selection.atoms.verb.toLowerCase()
  }? What's the context?`,
  category: `You can set a category for your statement`,
  privacy: `Who can see this statement?`,
});

const StatementWizard: React.FC<StatementWizardProps> = ({
  username,
  presetQuestion,
  onComplete,
  onClose,
}) => {
  const { setData } = useEntries();
  const isPreset = Boolean(presetQuestion);

  // Define steps; skip 'category' if using a preset question.
  const steps: Step[] = isPreset
    ? ['subject', 'verb', 'object', 'privacy', 'complement']
    : ['subject', 'verb', 'object', 'category', 'privacy'];

  const stepBorderColors: Record<Exclude<Step, 'closed'>, string> = {
    subject: 'border-subjectSelector',
    verb: 'border-verbSelector',
    object: 'border-objectInput',
    category: 'border-black',
    privacy: 'border-privacySelector',
    complement: 'border-gray-400',
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

  useEffect(() => {
    if (presetQuestion?.steps?.subject?.preset) {
      setSelection((prev) => ({
        ...prev,
        atoms: { ...prev.atoms, subject: username },
      }));
    }
  }, [presetQuestion, username]);

  // Get the sub-question for each step.
  const getSubQuestion = (currentStep: Exclude<Step, 'closed'>) => {
    if (currentStep === 'complement') {
      return 'Add additional statement if needed';
    }
    return (
      // presetQuestion?.steps?.[currentStep]?.question ||
      defaultQuestions(username, selection)[currentStep]
    );
  };

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

  // Render steps
  const renderSubjectStep = () => {
    const subQuestion = getSubQuestion('subject');
    const allowDescriptors = presetQuestion?.steps?.subject?.allowDescriptors;
    if (allowDescriptors === false) {
      return (
        <StepContainer subQuestion={subQuestion}>
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
      <StepContainer subQuestion={subQuestion}>
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
    const subQuestion = getSubQuestion('verb');
    return (
      <StepContainer subQuestion={subQuestion} showBack onBack={handleBack}>
        <div className='flex flex-col h-[60vh] p-4 rounded-md'>
          <SentimentVerbPicker
            selectedVerb={selection.atoms.verb}
            onVerbSelect={(verb) => {
              // Convert verb.name to present tense and lowercase it.
              const processedVerb = nlp(verb.name)
                .verbs()
                .toPresentTense()
                .out('text')
                .toLowerCase();
              setSelection((prev) => ({
                ...prev,
                atoms: { ...prev.atoms, verb: processedVerb },
              }));
              handleNext('object');
            }}
          />
        </div>
      </StepContainer>
    );
  };

  const renderObjectStep = () => {
    const subQuestion = getSubQuestion('object');
    const nextStep: Step = presetQuestion ? 'privacy' : 'category';

    return (
      <StepContainer subQuestion={subQuestion} showBack onBack={handleBack}>
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
          onClick={() => selection.atoms.object.trim() && handleNext(nextStep)}
          disabled={!selection.atoms.object.trim()}
          variant='pink'
          className='mx-auto'
        >
          Next
        </Button>
      </StepContainer>
    );
  };

  const renderCategoryStep = () => {
    const subQuestion = getSubQuestion('category');
    const categories = statementsCategories.categories || [];
    const uncategorisedSelected =
      !selection.category || selection.category === 'uncategorised';

    return (
      <StepContainer subQuestion={subQuestion} showBack onBack={handleBack}>
        <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
          {categories.map((cat: { id: string; name: string }) => (
            <Button
              key={cat.id}
              onClick={() =>
                setSelection((prev) => ({ ...prev, category: cat.id }))
              }
              className={`
                h-auto py-4 px-6 text-left flex flex-col items-start transition-all whitespace-normal break-words
                ${
                  selection.category === cat.id
                    ? 'bg-blue-50 text-blue-600 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300'
                }
              `}
              variant={selection.category === cat.id ? 'default' : 'outline'}
            >
              <span className='font-medium'>{cat.name}</span>
            </Button>
          ))}

          {/* Uncategorised button */}
          <Button
            onClick={() =>
              setSelection((prev) => ({ ...prev, category: 'uncategorised' }))
            }
            className={`
              h-auto py-4 px-6 text-left flex flex-col items-start transition-all whitespace-normal break-words
              ${
                uncategorisedSelected
                  ? 'bg-blue-50 text-blue-600 border-blue-300'
                  : 'bg-white text-gray-700 border-gray-300'
              }
            `}
            variant={uncategorisedSelected ? 'default' : 'outline'}
          >
            <span className='font-medium'>Uncategorised</span>
          </Button>
        </div>

        <Button
          onClick={() => {
            if (!selection.category) {
              setSelection((prev) => ({ ...prev, category: 'uncategorised' }));
            }
            handleNext('privacy');
          }}
          variant='pink'
          className='mx-auto'
        >
          Next
        </Button>
      </StepContainer>
    );
  };

  const renderPrivacyStep = () => {
    const subQuestion = getSubQuestion('privacy');
    return (
      <StepContainer subQuestion={subQuestion} showBack onBack={handleBack}>
        <PrivacySelector
          isPublic={selection.isPublic}
          onChange={(isPublic) =>
            setSelection((prev) => ({ ...prev, isPublic }))
          }
          onComplete={() => {
            console.log('Privacy complete triggered');
            if (isPreset) {
              handleNext('complement');
            } else {
              handleComplete();
            }
          }}
        />
      </StepContainer>
    );
  };

  const renderComplementStep = () => {
    const subQuestion = 'Info';
    return (
      <StepContainer subQuestion={subQuestion} showBack onBack={handleBack}>
        <div className='text-center p-4'>
          <p className='text-lg'>
            If you feel your statement didn't fully answer the question, you can
            later add custom statements to complement it.
          </p>
        </div>
        <Button
          onClick={handleComplete}
          variant='pink'
          className='mx-auto mt-4'
        >
          Finish
        </Button>
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
      case 'complement':
        return renderComplementStep();
      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] p-0 w-full border-8 ${
          stepBorderColors[step as Exclude<Step, 'closed'>]
        }`}
      >
        {/* Top header: only render if there's a preset question */}
        {presetQuestion && (
          <div className='px-4 py-3 bg-gray-200 border-b'>
            <h2 className='text-xl font-bold'>{presetQuestion.mainQuestion}</h2>
          </div>
        )}

        <DialogDescription className='sr-only'>Wizard Steps</DialogDescription>
        <DialogTitle className='sr-only'>Wizard Steps</DialogTitle>

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
        {/* Statement preview shows the statement being built */}
        <StatementPreview selection={selection} />
      </DialogContent>
    </Dialog>
  );
};

export default StatementWizard;
