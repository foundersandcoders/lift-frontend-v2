import React, { useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SubjectSelector from '../ui/subject-selector';
import VerbSelector from '../ui/VerbSelector';
import {
  Trash2,
  Edit2,
  Save,
  Eye,
  EyeOff,
  MoreVertical,
  RotateCcw,
  CheckCircle2,
  XCircle,
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
  onPartUpdate: (
    statementId: string,
    part: 'subject' | 'verb' | 'object',
    value: string
  ) => void;
  onSave: (statementId: string) => void;
  onDelete: (statementId: string) => void;
  onTogglePublic: (statementId: string) => void;
  onEditClick: (statementId: string) => void;
  onEditAction?: (
    statementId: string,
    actionId: string,
    updated: { text: string; dueDate?: string }
  ) => void;
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
  onPartUpdate,
  onSave,
  onDelete,
  onTogglePublic,
  onEditClick,
  onEditAction = () => {},
  onDeleteAction = () => {},
  onAddAction = () => {},
  onReset,
  onToggleResolved = () => {},
  onToggleActionResolved = () => {},
}) => {
  const [isActionsExpanded, setIsActionsExpanded] = React.useState(false);
  const objectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPart === 'object' && objectInputRef.current) {
      objectInputRef.current.focus();
    }
  }, [editingPart]);

  if (isEditing) {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        {/* Privacy toggle button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onTogglePublic(statement.id)}
          className={`${
            statement.isPublic
              ? 'bg-green-50 text-green-500'
              : 'bg-gray-50 text-gray-500'
          } hover:bg-opacity-75 rounded-md px-3 py-2`}
        >
          {statement.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
        </Button>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Subject */}
          <div
            onClick={() => onPartClick('subject', statement.id)}
            className='cursor-pointer px-2 py-1 rounded bg-blue-100 hover:bg-blue-200'
          >
            {editingPart === 'subject' ? (
              <SubjectSelector
                value={statement.atoms.subject}
                onChange={(value) =>
                  onPartUpdate(statement.id, 'subject', value)
                }
                onAddDescriptor={() => {}}
                username={
                  statement.atoms.subject.split("'s")[0] ||
                  statement.atoms.subject
                }
              />
            ) : (
              statement.atoms.subject
            )}
          </div>
          {/* Verb */}
          <div
            className='cursor-pointer px-2 py-1 rounded bg-green-100 hover:bg-green-200'
            onClick={() => onPartClick('verb', statement.id)}
          >
            {editingPart === 'verb' ? (
              <VerbSelector
                onVerbSelect={(verb) =>
                  onPartUpdate(statement.id, 'verb', verb.name)
                }
                onClose={() => onPartClick('verb', '')}
              />
            ) : (
              <span>{statement.atoms.verb}</span>
            )}
          </div>
          {/* Object */}
          <div
            onClick={() => onPartClick('object', statement.id)}
            className='cursor-pointer px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200'
          >
            {editingPart === 'object' ? (
              <Input
                ref={objectInputRef}
                value={statement.atoms.object}
                onChange={(e) =>
                  onPartUpdate(statement.id, 'object', e.target.value)
                }
                className='w-full'
              />
            ) : (
              statement.atoms.object
            )}
          </div>
        </div>
        <div className='flex items-center space-x-2 ml-auto'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onSave(statement.id)}
            className='text-green-500 hover:text-green-700'
          >
            <Save size={16} />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(statement.id)}
            className='text-red-500 hover:text-red-700'
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // Static view when not in editing mode with grouped Edit and Delete
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
                  statement.isPublic ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                {statement.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-2 bg-black text-white rounded'>
              {statement.isPublic
                ? 'You are sharing this statement'
                : 'This statement is private'}
            </TooltipContent>
          </Tooltip>
          {/* Construct full sentence from atoms */}
          <span>{`${statement.atoms.subject} ${statement.atoms.verb} ${statement.atoms.object}`}</span>
        </div>

        {/* Right side: resolved icon, actions counter + dropdown */}
        <div className='flex items-center space-x-4'>
          {/* Resolved icon */}
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
          {/* Actions counter */}
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
              {/* Toggle Resolved */}
              <DropdownMenuItem onClick={() => onToggleResolved(statement.id)}>
                {statement.isResolved ? (
                  <>
                    <XCircle className='mr-2 h-4 w-4' />
                    Unresolve
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='mr-2 h-4 w-4' />
                    Mark as Resolved
                  </>
                )}
              </DropdownMenuItem>
              {/* Reset option if provided */}
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

      {/* Inline actions preview if expanded */}
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
