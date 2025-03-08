import React, { useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SubjectSelector from '../statementWizard/selectors/SubjectSelector';
import VerbSelector from '../statementWizard/selectors/VerbSelector';
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
  editingPart,
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
  const objectInputRef = useRef<HTMLInputElement>(null);

  // Local "draft" state to hold unsaved modifications.
  const [draft, setDraft] = React.useState<Entry>(statement);

  // Local state to track if we are currently saving the draft. Will control the save button.
  const [isSaving, setIsSaving] = React.useState(false);
  // Compute if there are any changes compared to the original statement prop.
  const hasChanged =
    draft.atoms.subject !== statement.atoms.subject ||
    draft.atoms.verb !== statement.atoms.verb ||
    draft.atoms.object !== statement.atoms.object ||
    draft.isPublic !== statement.isPublic;

  // Whenever the statement prop changes (or when not editing), re-sync the draft.
  useEffect(() => {
    setDraft(statement);
  }, [statement]);

  useEffect(() => {
    if (editingPart === 'object' && objectInputRef.current) {
      objectInputRef.current.focus();
    }
  }, [editingPart]);

  // Local function to update a specific part in the draft.
  const updatePart = (part: 'subject' | 'verb' | 'object', value: string) => {
    setDraft((prev) => ({
      ...prev,
      atoms: {
        ...prev.atoms,
        [part]: value,
      },
    }));
  };

  if (isEditing) {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        {/* Privacy toggle button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            console.log('Privacy toggle clicked for statement:', draft.id);
            setDraft((prev) => ({
              ...prev,
              isPublic: !prev.isPublic,
            }));
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
            onClick={() => onPartClick('subject', draft.id)}
            className='cursor-pointer px-2 py-1 rounded bg-subjectSelector hover:bg-subjectSelectorHover'
          >
            {editingPart === 'subject' ? (
              <SubjectSelector
                value={draft.atoms.subject}
                onChange={(value) => updatePart('subject', value)}
                onAddDescriptor={() => {}}
                username={
                  draft.atoms.subject.split("'s")[0] || draft.atoms.subject
                }
              />
            ) : (
              draft.atoms.subject
            )}
          </div>
          {/* Verb */}
          <div
            className='cursor-pointer px-2 py-1 rounded bg-verbSelector hover:bg-verbSelectorHover'
            onClick={() => onPartClick('verb', draft.id)}
          >
            {editingPart === 'verb' ? (
              <VerbSelector
                onVerbSelect={(verb) => updatePart('verb', verb.id)}
                onClose={() => onPartClick('verb', '')}
              />
            ) : (
              <span>{getVerbName(draft.atoms.verb)}</span>
            )}
          </div>
          {/* Object */}
          <div
            onClick={() => onPartClick('object', draft.id)}
            className='cursor-pointer px-2 py-1 rounded bg-objectInput hover:bg-objectInputHover'
          >
            {editingPart === 'object' ? (
              <Input
                ref={objectInputRef}
                value={draft.atoms.object}
                onChange={(e) => updatePart('object', e.target.value)}
                className='w-full'
              />
            ) : (
              draft.atoms.object
            )}
          </div>
        </div>
        <div className='flex items-center space-x-2 ml-auto'>
          {/* Final Save button. This commits the local draft to the database via onLocalSave */}
          <Button
            variant='ghost'
            size='sm'
            onClick={async () => {
              setIsSaving(true);
              await onLocalSave(draft);
              setIsSaving(false);
            }}
            disabled={!hasChanged || isSaving}
            className='text-green-500 hover:text-green-700'
          >
            <Save size={16} />
          </Button>

          {/* Cancel button: resets draft and exits edit mode */}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              // Reset local draft to original statement passed from parent.
              setDraft(statement);
              // Call the onCancel prop if provided.
              if (onCancel) {
                onCancel(statement.id);
              }
            }}
            className='text-gray-500 hover:text-gray-700'
          >
            Cancel
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(draft.id)}
            className='text-red-500 hover:text-red-700'
          >
            <Trash2 size={16} />
          </Button>
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
      {/* Top row: statement, actions counter, etc. */}
      <div className='flex items-center justify-between'>
        {/* Left side: privacy icon + full statement text */}
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

        {/* Right side: resolved icon, actions counter + dropdown */}
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
