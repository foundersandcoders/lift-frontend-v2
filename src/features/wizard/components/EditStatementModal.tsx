import React, { useState, useRef } from 'react';
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

// Global utility function to find and click the OK button
export const clickOkButton = (): boolean => {
  console.log('Attempting to click OK button...');
  
  // Try multiple approaches to find the OK button
  try {
    // Method 0: Use the React ref (most reliable)
    if (okButtonRef && okButtonRef.current) {
      console.log('Found OK button via React ref');
      okButtonRef.current.click();
      return true;
    }
    
    // Method 1: Use the ID
    let okButton = document.getElementById('edit-statement-ok-button');
    if (okButton) {
      console.log('Found OK button by ID');
      (okButton as HTMLButtonElement).click();
      return true;
    }
    
    // Method 2: Look for a button with data-testid attribute
    okButton = document.querySelector('button[data-testid="edit-statement-ok-button"]') as HTMLButtonElement;
    if (okButton) {
      console.log('Found OK button by data-testid');
      okButton.click();
      return true;
    }
    
    // Method 3: Find button in dialog content
    const dialogContent = document.querySelector('[role="dialog"]');
    if (dialogContent) {
      const buttons = dialogContent.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent?.trim() === 'OK') {
          console.log('Found OK button within dialog by text');
          buttons[i].click();
          return true;
        }
      }
      
      // If no button with 'OK' text found, try the first non-outline button
      for (let i = 0; i < buttons.length; i++) {
        if (!buttons[i].classList.contains('outline')) {
          console.log('Found first non-outline button within dialog');
          buttons[i].click();
          return true;
        }
      }
    }
    
    // Method 4: Last resort - find any button with text "OK"
    const allButtons = document.querySelectorAll('button');
    for (let i = 0; i < allButtons.length; i++) {
      if (allButtons[i].textContent?.trim() === 'OK') {
        console.log('Found OK button by text content');
        allButtons[i].click();
        return true;
      }
    }
    
    // Method 5: Programmatically call handleSave function
    console.log('All DOM methods failed. Trying handleConfirm programmatically');
    
    // Get the OK button's parent element to find it more reliably
    const okButtonParent = document.querySelector('.DialogContent .p-4.flex.justify-center.gap-4');
    if (okButtonParent) {
      const firstButton = okButtonParent.querySelector('button');
      if (firstButton) {
        console.log('Found OK button via parent element');
        firstButton.click();
        return true;
      }
    }
    
    console.log('All methods failed to find the OK button');
    return false;
    
  } catch (error) {
    console.error('Error while trying to click OK button:', error);
    return false;
  }
};

interface EditStatementModalProps {
  statement: Entry;
  editPart: 'subject' | 'verb' | 'object' | 'category' | 'privacy';
  username: string;
  onUpdate: (updatedStatement: Entry) => void;
  onClose: () => void;
}

// For accessing the OK button from other components
let okButtonRef: React.RefObject<HTMLButtonElement> | null = null;

export const EditStatementModal: React.FC<EditStatementModalProps> = ({
  statement,
  editPart,
  username,
  onUpdate,
  onClose,
}) => {
  // Create a ref for the OK button
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Store the ref in the module-level variable for external access
  okButtonRef = buttonRef;
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
  
  // Function to handle when a selected item is clicked again to save immediately
  const handleConfirm = () => {
    console.log('handleConfirm called - saving immediately');
    handleSave();
  };

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
            onConfirm={handleConfirm}
          />
        );
      case 'verb':
        return (
          <VerbStep
            subject={statement.atoms.subject}
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
            onConfirm={handleConfirm}
          />
        );
      case 'object':
        return (
          <ObjectStep
            subject={statement.atoms.subject}
            verb={statement.atoms.verb}
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
            onConfirm={handleConfirm}
          />
        );
      case 'category':
        return (
          <CategoryStep
            selection={localValue as string}
            onUpdate={(val) => setLocalValue(val)}
            onConfirm={handleConfirm}
          />
        );
      case 'privacy':
        return (
          <PrivacyStep
            isPublic={localValue as boolean}
            onUpdate={(val) => setLocalValue(val)}
            onConfirm={handleConfirm}
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
            id="edit-statement-ok-button"
            ref={buttonRef}
            onClick={handleSave} 
            variant='default' 
            className="inline-flex items-center shadow-sm"
            data-testid="edit-statement-ok-button"
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
