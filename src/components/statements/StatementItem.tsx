import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { getVerbName } from '../../../utils/verbUtils';
import {
  Trash2,
  Edit2,
  Save,
  MoreVertical,
  RotateCcw,
  CheckCircle2,
  XCircle,
  MailPlus,
  MailX,
  PenOff,
} from 'lucide-react';
import type { Entry } from '../../../types/entries';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import ActionsCounter from './ActionsCounter';
import ActionLine from './ActionLine';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export interface StatementItemProps {
  statement: Entry;
  isEditing: boolean;
  editingPart: 'subject' | 'verb' | 'object' | null;
  onPartClick: (
    part: 'subject' | 'verb' | 'object',
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
    } else {
      // Reset both states when exiting edit mode
      setInitialDraft(statementCopy);
      setDraft(statementCopy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]); // Intentionally excluding statement to avoid resetting initialDraft

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
    isEditing,
  ]);

  // Uncomment and use this if you need to update parts directly instead of using the modal
  /*
  const updatePart = (part: 'subject' | 'verb' | 'object', value: string) => {
    // Create a new draft object to ensure React detects the change
    setDraft((prevDraft) => {
      const newDraft = JSON.parse(JSON.stringify(prevDraft));
      newDraft.atoms[part] = value;
      return newDraft;
    });
  };
  */

  // Compute if draft has changed from the initial state
  const hasSubjectChanged = draft.atoms.subject !== initialDraft.atoms.subject;
  const hasVerbChanged = draft.atoms.verb !== initialDraft.atoms.verb;
  const hasObjectChanged = draft.atoms.object !== initialDraft.atoms.object;
  const hasPrivacyChanged = draft.isPublic !== initialDraft.isPublic;

  const hasChanged =
    hasSubjectChanged ||
    hasVerbChanged ||
    hasObjectChanged ||
    hasPrivacyChanged;

  // Enable save button when any part of the statement has been changed

  if (isEditing) {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        {/* Privacy toggle button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            // Create a new draft object to ensure React detects the change
            setDraft((prevDraft) => {
              const newDraft = JSON.parse(JSON.stringify(prevDraft));
              newDraft.isPublic = !prevDraft.isPublic;
              return newDraft;
            });
          }}
          className={`rounded-md px-3 py-2 transition-colors ${
            draft.isPublic
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          {draft.isPublic ? <MailPlus size={16} /> : <MailX size={16} />}
        </Button>

        <div className='flex flex-1 items-center space-x-2'>
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
        <div className='flex items-center space-x-2 ml-auto'>
          {/* Save button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-block'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={async () => {
                    setIsSaving(true);
                    await onLocalSave(draft);
                    setIsSaving(false);
                  }}
                  disabled={!hasChanged || isSaving}
                  className='text-green-500 hover:text-green-700 px-4 py-2'
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
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    // Deep clone to avoid reference issues
                    setDraft(JSON.parse(JSON.stringify(initialDraft)));
                    if (onCancel) onCancel(statement.id);
                  }}
                  className='text-red-500 hover:text-red-700 px-4 py-2'
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
                  variant='ghost'
                  size='sm'
                  onClick={() => onDelete(draft.id)}
                  className='text-red-500 hover:text-red-700 px-4 py-2'
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
      className={`bg-white border rounded-md p-3 space-y-2 shadow-sm ${
        statement.isResolved ? 'border-green-500' : 'border-gray-200'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center justify-center ${
                  statement.isPublic ? 'text-green-500' : 'text-red-500'
                }`}
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
          <span>{`${statement.atoms.subject} ${getVerbName(
            statement.atoms.verb
          )} ${statement.atoms.object}`}</span>
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
                    <XCircle className='mr-2 h-4 w-4 text-red-500' />
                    Unresolve
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='mr-2 h-4 w-4 text-green-500' />
                    Mark as Resolved
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
