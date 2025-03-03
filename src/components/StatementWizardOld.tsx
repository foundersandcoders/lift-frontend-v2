'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import descriptorsData from '../../data/descriptors.json';
import { verbData } from '../../utils/verbUtils';
import { useEntries } from '../hooks/useEntries';
import { postNewEntry } from '../api/entriesApi';
import type React from 'react';
import type { Entry, DescriptorsData } from '../../types/entries';

type Step = 'closed' | 'who' | 'action' | 'object' | 'privacy';

const StatementWizard: React.FC<{ username: string }> = ({ username }) => {
  const { setData } = useEntries();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('closed');
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
    // presetId and isResolved can remain undefined at start
  });
  const [, setSelectedCategory] = useState<string | null>(null);

  // Filter subject tiles based on the provided username.
  const subjectTiles = useMemo(() => {
    const data = descriptorsData as DescriptorsData;
    return [
      { label: username, value: username },
      ...data.descriptors.flatMap((descriptor) =>
        descriptor.options.map((option) => ({
          label: `${username}'s ${option}`,
          value: `${username}'s ${option}`,
        }))
      ),
    ];
  }, [username]);

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const getSubjectQuestion = (username: string): string => {
    return `This statement applies to ${username} or someone/something else?`;
  };

  const getActionQuestion = (subject: string): string => {
    return `What's happening with ${subject}? How do they feel or what do they experience?`;
  };

  const getContextQuestion = (subject: string, verb: string): string => {
    const verbObj = verbData.find((v) => v.name === verb);
    if (!verbObj) return 'Can you elaborate on that?';

    // Customize question based on verb category.
    if (
      verbObj.categories.some(
        (cat) => cat.includes('Support') || cat.includes('Help')
      )
    ) {
      return `How does ${subject} ${verb.toLowerCase()}? What's the impact?`;
    }
    if (
      verbObj.categories.some(
        (cat) => cat.includes('Growth') || cat.includes('Development')
      )
    ) {
      return `In what way does ${subject} ${verb.toLowerCase()}? What's the goal?`;
    }
    if (
      verbObj.categories.some(
        (cat) => cat.includes('Conflict') || cat.includes('Opposition')
      )
    ) {
      return `Why does ${subject} ${verb.toLowerCase()}? What's the reason?`;
    }
    return `How does ${subject} ${verb.toLowerCase()}? What's the context?`;
  };

  const handleOpen = () => {
    setIsOpen(true);
    setStep('who');
    setSelection({
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
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('closed');
    setSelectedCategory(null);
  };

  const handleBack = () => {
    switch (step) {
      case 'action':
        setStep('who');
        setSelectedCategory(null);
        break;
      case 'object':
        setStep('action');
        break;
      case 'privacy':
        setStep('object');
        break;
      default:
        handleClose();
    }
  };

  const handleComplete = async () => {
    // Build the full input string from atoms.
    const { subject, verb, object, adverbial } = selection.atoms;
    const adverbialText =
      adverbial && adverbial.length > 0 ? adverbial.join(' ') : '';
    const fullInput = `${subject} ${verb} ${object}${
      adverbialText ? ' ' + adverbialText : ''
    }`;

    const newEntry = {
      ...selection,
      id: Date.now().toString(),
      input: fullInput,
    };

    // Dispatch the new entry to the context.
    setData({ type: 'ADD_ENTRY', payload: newEntry });
    // Post the new entry to the backend.
    await postNewEntry(newEntry);
    // Close the wizard.
    handleClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'who':
        return (
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold text-center mb-6'>
              {getSubjectQuestion(username)}
            </h2>
            <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
              {subjectTiles.map((tile, index) => (
                <Button
                  key={tile.value}
                  variant={
                    selection.atoms.subject === tile.value
                      ? 'default'
                      : 'outline'
                  }
                  className={`h-auto py-4 px-6 text-left flex flex-col items-start space-y-1 transition-all ${
                    index === 0 ? 'bg-blue-50 hover:bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    setSelection((prev) => ({
                      ...prev,
                      atoms: { ...prev.atoms, subject: tile.value },
                    }));
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
              {getActionQuestion(selection.atoms.subject)}
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
                        selection.atoms.verb === verb.name
                          ? 'default'
                          : 'outline'
                      }
                      className='h-auto py-2 px-3 text-left flex items-center justify-center transition-all text-sm'
                      style={{
                        backgroundColor:
                          selection.atoms.verb === verb.name
                            ? verb.color
                            : 'transparent',
                        color:
                          selection.atoms.verb === verb.name
                            ? getContrastColor(verb.color)
                            : 'inherit',
                        borderColor: verb.color,
                      }}
                      onClick={() => {
                        setSelection((prev) => ({
                          ...prev,
                          atoms: { ...prev.atoms, verb: verb.name },
                        }));
                        setStep('object');
                      }}
                    >
                      <span className='font-medium'>{verb.name}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        );
      case 'object':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold text-center'>
              {getContextQuestion(
                selection.atoms.subject,
                selection.atoms.verb
              )}
            </h2>
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
              className='text-lg p-4'
            />
            <Button
              className='w-full'
              onClick={() =>
                selection.atoms.object.trim() && setStep('privacy')
              }
              disabled={!selection.atoms.object.trim()}
            >
              Continue
            </Button>
          </div>
        );
      case 'privacy':
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold text-center'>
              Who can see this statement?
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
    <>
      <Button onClick={handleOpen} className='w-full'>
        <Plus className='w-5 h-5 mr-2' />
        Statement Wizard
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-[600px] pt-6'>
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
    </>
  );
};

export default StatementWizard;
