import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import type { Entry } from '../../../types/entries';
import { SubjectStep } from './steps/SubjectStep';
import { VerbStep } from './steps/VerbStep';
import { ObjectStep } from './steps/ObjectStep';
import { CategoryStep } from './steps/CategoryStep';
import { PrivacyStep } from './steps/PrivacyStep';

interface EditStatementModalProps {
  statement: Entry;
  editPart: 'subject' | 'verb' | 'object' | 'category' | 'privacy';
  username: string;
  onUpdate: (updatedStatement: Entry) => void;
  onClose: () => void;
}

export const EditStatementModal: React.FC<EditStatementModalProps> = ({
  statement,
  editPart,
  username,
  onUpdate,
  onClose,
}) => {
  // Initialize local state with the current value of the part
  const [localValue, setLocalValue] = useState(() => {
    switch (editPart) {
      case 'subject':
        return statement.atoms.subject;
      case 'verb':
        return statement.atoms.verb;
      case 'object':
        return statement.atoms.object;
      case 'category':
        return statement.category;
      case 'privacy':
        return statement.isPublic;
      default:
        return '';
    }
  });

  // When saving, update the statement with the new value
  const handleSave = () => {
    let updatedStatement: Entry;
    if (
      editPart === 'subject' ||
      editPart === 'verb' ||
      editPart === 'object'
    ) {
      updatedStatement = {
        ...statement,
        atoms: { ...statement.atoms, [editPart]: localValue as string },
      };
    } else if (editPart === 'category') {
      updatedStatement = { ...statement, category: localValue as string };
    } else if (editPart === 'privacy') {
      updatedStatement = { ...statement, isPublic: localValue as boolean };
    } else {
      updatedStatement = statement;
    }
    onUpdate(updatedStatement);
    onClose();
  };

  // Map each edit part to its corresponding Tailwind border class.
  const borderClasses: Record<string, string> = {
    subject: 'border-[var(--subject-selector)]',
    verb: 'border-[var(--verb-selector)]',
    object: 'border-[var(--object-input)]',
    category: 'border-black',
    privacy: 'border-[var(--privacy-selector)]',
    complement: 'border-gray-400',
  };
  const borderClass = borderClasses[editPart] || 'border-gray-400';

  // Render the correct edit component based on the part to edit.
  const renderEditComponent = () => {
    switch (editPart) {
      case 'subject':
        return (
          <SubjectStep
            username={username}
            // For editing mode, it doesn't need a preset question
            presetQuestion={undefined}
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
          />
        );
      case 'verb':
        return (
          <VerbStep
            subject={statement.atoms.subject}
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
          />
        );
      case 'object':
        return (
          <ObjectStep
            subject={statement.atoms.subject}
            verb={statement.atoms.verb}
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
          />
        );
      case 'category':
        return (
          <CategoryStep
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
          />
        );
      case 'privacy':
        return (
          <PrivacyStep
            isPublic={localValue as boolean}
            onUpdate={(val) => setLocalValue(val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[600px] p-0 w-full border-8 ${borderClass}`}
      >
        <DialogTitle>Edit {editPart}</DialogTitle>
        <DialogDescription className='sr-only'>
          Edit the {editPart} of your statement.
        </DialogDescription>
        {renderEditComponent()}
        {/* Optionally add a footer for explicit Save/Cancel */}
        <div className='p-4 flex justify-center gap-4'>
          <Button onClick={handleSave} variant='pink'>
            Save
          </Button>
          <Button onClick={onClose} variant='pink'>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
