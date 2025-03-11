import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getVerbName } from '@/lib/utils/verbUtils';
import {
  Trash2,
  Edit2,
  Save,
  MoreVertical,
  RotateCcw,
  CheckCircle2,
  Archive,
  ArchiveRestore,
  MailPlus,
  MailX,
  PenOff,
} from 'lucide-react';
import type { Entry } from '@/types/entries';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import ActionsCounter from './ActionsCounter';
import ActionLine from './ActionLine';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import statementsCategories from '@/data/statementsCategories.json';
import { formatCategoryName } from '@/lib/utils';

export interface StatementItemProps {
  statement: Entry;
  isEditing: boolean;
  editingPart: 'subject' | 'verb' | 'object' | 'category' | 'privacy' | null;
  onPartClick: (
    part: 'subject' | 'verb' | 'object' | 'category' | 'privacy',
    statementId: string
  ) => void;
  // When the green save icon is clicked, the updated entry (draft) is passed back
  onLocalSave: (updatedEntry: Entry) => void;
  onDelete: (statementId: string) => void;
  onEditClick: (statementId: string) => void;
  onEditAction?: (
    statementId: string,
    actionId: string,
    updated: { text: string; dueDate?: string }
  ) => void;
  onCancel?: (statementId: string) => void;
  onDeleteAction?: (statementId: string, actionId: string) => void;
  onAddAction?: (
    statementId: string,
    newAction: { text: string; dueDate?: string }
  ) => void;
  onReset?: (statementId: string) => void;
  onToggleResolved?: (statementId: string) => void;
  onToggleActionResolved?: (actionId: string) => void;
}

// Helper function to normalize category ID for comparison
const normalizeCategoryId = (id: string): string => {
  // Convert to lowercase and handle special cases
  const normalized = id ? id.toLowerCase() : '';

  // Handle variations of "uncategorized"
  if (['uncategorized', 'uncategorised'].includes(normalized)) {
    return 'uncategorized';
  }

  return normalized;
};

// Helper function to get category display name from ID
const getCategoryDisplayName = (categoryId: string): string => {
  // Find the category in our predefined categories
  const category = statementsCategories.categories.find(
    (c) => normalizeCategoryId(c.id) === normalizeCategoryId(categoryId)
  );

  if (category) {
    return category.name;
  }

  // Check for uncategorized variations
  if (
    ['uncategorized', 'uncategorised'].includes(normalizeCategoryId(categoryId))
  ) {
    return 'Uncategorized';
  }

  // If not found, return the formatted ID
  return formatCategoryName(categoryId);
};

const StatementItem: React.FC<StatementItemProps> = ({
  statement,
  isEditing,
  onPartClick,
  onLocalSave,
  onDelete,
  onEditClick,
  onCancel,
  onEditAction = () => {},
  onDeleteAction = () => {},
  onAddAction = () => {},
  onReset,
  onToggleResolved = () => {},
  onToggleActionResolved = () => {},
}) => {
  const [isActionsExpanded, setIsActionsExpanded] = React.useState(false);

  // Local "draft" state to hold unsaved modifications.
  const [draft, setDraft] = React.useState<Entry>(statement);

  // initialDraft freezes the original values when editing begins.
  const [initialDraft, setInitialDraft] = React.useState<Entry>(statement);

  // Local state to track if we are currently saving the draft.
  const [isSaving, setIsSaving] = React.useState(false);

  // First useEffect: Capture changes in edit mode status
  useEffect(() => {
    // Create a deep copy of the statement to avoid reference issues
    const statementCopy = JSON.parse(JSON.stringify(statement));

    if (isEditing) {
      // Only capture initial state when entering edit mode
      // This will be our reference point for comparison
      setInitialDraft(statementCopy);
      // Also ensure draft is synchronized with current statement
      setDraft(statementCopy);
    } else {
      // Reset both states when exiting edit mode
      setInitialDraft(statementCopy);
      setDraft(statementCopy);
    }
  }, [isEditing, statement]); // Include statement to ensure we're always using the latest version

  // Second useEffect: Always keep draft updated with latest statement to reflect modal changes
  useEffect(() => {
    if (isEditing) {
      // When statement changes while in edit mode, update the draft
      // This happens when the modal updates the statement
      setDraft(JSON.parse(JSON.stringify(statement)));
    }
  }, [
    statement,
    // We're specifically tracking these properties to ensure we detect changes
    // from the modal even if the statement reference doesn't change
    statement.atoms.subject,
    statement.atoms.verb,
    statement.atoms.object,
    statement.isPublic,
    statement.category,
    isEditing,
  ]);

  // Compute if draft has changed from the initial state
  const hasSubjectChanged = draft.atoms.subject !== initialDraft.atoms.subject;
  const hasVerbChanged = draft.atoms.verb !== initialDraft.atoms.verb;
  const hasObjectChanged = draft.atoms.object !== initialDraft.atoms.object;
  const hasPrivacyChanged = draft.isPublic !== initialDraft.isPublic;
  // Force this to true for now for debugging
  const hasCategoryChanged = true; // draft.category !== initialDraft.category;

  console.log('CATEGORY DEBUG:');
  console.log('Draft category:', draft.category);
  console.log('Initial draft category:', initialDraft.category);
  console.log('Normally would be:', draft.category !== initialDraft.category);
  console.log('Forcing to true for debugging');

  const hasChanged =
    hasSubjectChanged ||
    hasVerbChanged ||
    hasObjectChanged ||
    hasPrivacyChanged ||
    hasCategoryChanged;

  // Enable save button when any part of the statement has been changed

  if (isEditing) {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        {/* Privacy toggle button */}
        <Button
          variant={draft.isPublic ? 'success' : 'warning'}
          size='compact'
          onClick={() => {
            // Create a new draft object to ensure React detects the change
            setDraft((prevDraft) => {
              const newDraft = JSON.parse(JSON.stringify(prevDraft));
              newDraft.isPublic = !prevDraft.isPublic;
              return newDraft;
            });
          }}
          className='p-2 transition-colors shadow-sm'
        >
          {draft.isPublic ? <MailPlus size={16} /> : <MailX size={16} />}
        </Button>

        <div className='flex flex-1 items-center flex-wrap gap-2'>
          <div className='flex space-x-2 flex-wrap'>
            {/* Subject */}
            <div
              onClick={() => {
                // Just call onPartClick to open the modal, and don't try to edit inline
                onPartClick('subject', draft.id);
              }}
              className='cursor-pointer px-2 py-1 rounded bg-subjectSelector hover:bg-subjectSelectorHover'
            >
              {draft.atoms.subject}
            </div>
            {/* Verb */}
            <div
              onClick={() => {
                // Just call onPartClick to open the modal, and don't try to edit inline
                onPartClick('verb', draft.id);
              }}
              className='cursor-pointer px-2 py-1 rounded bg-verbSelector hover:bg-verbSelectorHover'
            >
              <span>{getVerbName(draft.atoms.verb)}</span>
            </div>
            {/* Object */}
            <div
              onClick={() => {
                // Just call onPartClick to open the modal, and don't try to edit inline
                onPartClick('object', draft.id);
              }}
              className='cursor-pointer px-2 py-1 rounded bg-objectInput hover:bg-objectInputHover'
            >
              {draft.atoms.object}
            </div>
          </div>
          {/* Category */}
          <div
            onClick={() => {
              // Open the category modal
              onPartClick('category', draft.id);
            }}
            className='cursor-pointer px-2 py-1 rounded bg-categorySelector text-black flex items-center gap-1 hover:bg-categorySelectorHover'
          >
            <span className='mr-1'>📁</span>
            {/* Use formatted category name */}
            {draft.category &&
            draft.category.toLowerCase() !== 'uncategorized' &&
            draft.category.toLowerCase() !== 'uncategorised'
              ? getCategoryDisplayName(draft.category)
              : 'Uncategorized'}
          </div>
        </div>
        <div className='flex items-center space-x-2 ml-auto'>
          {/* Save button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-block'>
                <Button
                  variant='success'
                  size='compact'
                  onClick={async () => {
                    setIsSaving(true);
                    // Update the input field to reflect the edited statement
                    const updatedDraft = { ...draft };
                    updatedDraft.input = `${draft.atoms.subject} ${getVerbName(
                      draft.atoms.verb
                    )} ${draft.atoms.object}`;
                    await onLocalSave(updatedDraft);
                    setIsSaving(false);
                  }}
                  disabled={!hasChanged || isSaving}
                  className='shadow-sm p-2'
                >
                  <Save size={16} />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-2 bg-black text-white rounded'>
              Save changes
            </TooltipContent>
          </Tooltip>

          {/* Cancel button with PenOff icon and tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-block'>
                <Button
                  variant='outline'
                  size='compact'
                  onClick={() => {
                    // Deep clone to avoid reference issues
                    setDraft(JSON.parse(JSON.stringify(initialDraft)));
                    if (onCancel) onCancel(statement.id);
                  }}
                  className='p-2'
                >
                  <PenOff size={16} />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-2 bg-black text-white rounded'>
              Cancel editing
            </TooltipContent>
          </Tooltip>

          {/* Delete button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-block'>
                <Button
                  variant='destructive'
                  size='compact'
                  onClick={() => onDelete(draft.id)}
                  className='shadow-sm p-2'
                >
                  <Trash2 size={16} />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-2 bg-black text-white rounded'>
              Delete statement
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // Static view when not in editing mode.
  return (
    <div
      className={`border rounded-md p-3 space-y-2 relative ${
        statement.isResolved
          ? 'bg-gray-100 border-gray-300 opacity-80'
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Archived badge - positioned in top right corner */}
      {statement.isResolved && (
        <span className='absolute -top-2 -right-2 bg-gray-200 text-gray-600 text-xs gap-1 px-2 py-0.5 rounded-full flex'>
          <Archive size={14} />
          Archived
        </span>
      )}

      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {/* Privacy status icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center justify-center ${
                  statement.isPublic ? 'text-green-500' : 'text-red-500'
                } ${statement.isResolved ? 'opacity-70' : ''}`}
              >
                {statement.isPublic ? (
                  <MailPlus size={16} />
                ) : (
                  <MailX size={16} />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-2 bg-black text-white rounded'>
              {statement.isPublic
                ? 'You are sharing this statement'
                : 'This statement is private'}
            </TooltipContent>
          </Tooltip>

          {/* Statement text with archived styling if needed */}
          <div className='flex flex-col'>
            <span className={statement.isResolved ? 'text-gray-500' : ''}>
              {`${statement.atoms.subject} ${getVerbName(
                statement.atoms.verb
              )} ${statement.atoms.object}`}
            </span>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          {statement.isResolved && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='inline-flex items-center justify-center text-green-600'>
                  <CheckCircle2 size={18} />
                </span>
              </TooltipTrigger>
              <TooltipContent className='p-2 bg-black text-white rounded'>
                This statement is resolved.
              </TooltipContent>
            </Tooltip>
          )}
          <div
            onClick={() => setIsActionsExpanded((prev) => !prev)}
            className='cursor-pointer'
          >
            <ActionsCounter
              count={statement.actions?.length ?? 0}
              expanded={isActionsExpanded}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={18} className='text-gray-500' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEditClick(statement.id)}>
                <Edit2 className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(statement.id)}
                className='text-red-600'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleResolved(statement.id)}>
                {statement.isResolved ? (
                  <>
                    <ArchiveRestore className='mr-2 h-4 w-4 text-red-500' />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className='mr-2 h-4 w-4 text-green-500' />
                    Archive
                  </>
                )}
              </DropdownMenuItem>

              {onReset && (
                <DropdownMenuItem onClick={() => onReset(statement.id)}>
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Reset
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isActionsExpanded && (
        <div className='mt-2'>
          <ActionLine
            actions={statement.actions ?? []}
            onEditAction={(
              actionId,
              updated: { text: string; dueDate?: string }
            ) => onEditAction && onEditAction(statement.id, actionId, updated)}
            onDeleteAction={(actionId) =>
              onDeleteAction && onDeleteAction(statement.id, actionId)
            }
            onAddAction={(newAction: { text: string; dueDate?: string }) =>
              onAddAction && onAddAction(statement.id, newAction)
            }
            onToggleResolved={(actionId) =>
              onToggleActionResolved && onToggleActionResolved(actionId)
            }
          />
        </div>
      )}
    </div>
  );
};

export default StatementItem;
