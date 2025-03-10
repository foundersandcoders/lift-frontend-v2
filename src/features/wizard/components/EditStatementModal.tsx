import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Entry } from '@/types/entries';
import { SubjectStep } from './steps/SubjectStep';
import { VerbStep } from './steps/VerbStep';
import { ObjectStep } from './steps/ObjectStep';
import { CategoryStep } from './steps/CategoryStep';
import { PrivacyStep } from './steps/PrivacyStep';
import { getVerbName } from '@/lib/utils/verbUtils';

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
      // Update the atoms
      updatedStatement = {
        ...statement,
        atoms: { ...statement.atoms, [editPart]: localValue as string },
      };
      
      // Update the input field to reflect the new statement text
      const updatedAtoms = { ...statement.atoms, [editPart]: localValue as string };
      updatedStatement.input = `${updatedAtoms.subject} ${getVerbName(updatedAtoms.verb)} ${updatedAtoms.object}`;
      
    } else if (editPart === 'category') {
      console.log('EDIT STATEMENT MODAL - Setting category:');
      console.log('Original statement category:', statement.category);
      console.log('New category value:', localValue);
      
      // Create a completely new object to ensure React detects the change
      updatedStatement = JSON.parse(JSON.stringify({
        ...statement,
        category: localValue as string
      }));
      
      console.log('Updated statement:', updatedStatement);
    } else if (editPart === 'privacy') {
      updatedStatement = { ...statement, isPublic: localValue as boolean };
    } else {
      updatedStatement = statement;
    }
    // Send the updated statement to the parent via onUpdate callback
    onUpdate(updatedStatement);
    onClose();
  };

  // Map each edit part to its corresponding Tailwind border class.
  const borderClasses: Record<string, string> = {
    subject: 'border-[var(--subject-selector)]',
    verb: 'border-[var(--verb-selector)]',
    object: 'border-[var(--object-input)]',
    category: 'border-[var(--category-selector)]',
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
            // Create a mock preset question with the statement's category
            presetQuestion={{
              id: 'editing',
              category: statement.category || 'wellbeing',
              mainQuestion: '', // Not needed for editing
              steps: {
                subject: {
                  question: '',
                  preset: false,
                  presetAnswer: null,
                  allowDescriptors: true
                },
                verb: {
                  question: '',
                  preset: false,
                  presetAnswer: null
                },
                object: {
                  question: '',
                  preset: false,
                  presetAnswer: null
                },
                privacy: {
                  question: '',
                  preset: false,
                  presetAnswer: null
                }
              }
            }}
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
          <Button 
            onClick={handleSave} 
            variant='default' 
            className="inline-flex items-center shadow-sm"
          >
            OK
          </Button>
          <Button 
            onClick={onClose} 
            variant='outline'

            className="inline-flex items-center"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
