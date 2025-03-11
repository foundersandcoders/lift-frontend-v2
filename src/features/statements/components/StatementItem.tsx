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
  SimpleDropdownMenu as DropdownMenu,
  SimpleDropdownMenuTrigger as DropdownMenuTrigger,
  SimpleDropdownMenuContent as DropdownMenuContent,
  SimpleDropdownMenuItem as DropdownMenuItem,
} from '@/components/ui/simple-dropdown';
import ActionsCounter from './ActionsCounter';
import ActionLine from './ActionLine';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/better-tooltip';
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
  originalCategory?: string; // Add prop for original category from parent
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
  originalCategory: externalOriginalCategory, // Get original category from parent
}) => {
  const [isActionsExpanded, setIsActionsExpanded] = React.useState(false);

  // Use simple primitive values to store original state
  // This way we avoid object reference issues
  const [originalCategory, setOriginalCategory] = React.useState<string | null>(null);
  const [originalSubject, setOriginalSubject] = React.useState<string | null>(null);
  const [originalVerb, setOriginalVerb] = React.useState<string | null>(null);
  const [originalObject, setOriginalObject] = React.useState<string | null>(null);
  const [originalPrivacy, setOriginalPrivacy] = React.useState<boolean | null>(null);

  // Local "draft" state to track current modifications
  const [draft, setDraft] = React.useState<Entry>(statement);

  // Local state to track if we are currently saving the draft
  const [isSaving, setIsSaving] = React.useState(false);

  // Effect for edit mode changes - only runs when isEditing changes
  useEffect(() => {
    if (isEditing) {
      // Entering edit mode - capture original values if not already set
      if (originalCategory === null) {
        // Use the external original category from parent if available, otherwise use the current category
        const originalCategoryValue =
          externalOriginalCategory ||
          (statement.category ? String(statement.category) : "");

        // Set it in the local state for immediate use in comparison
        setOriginalCategory(originalCategoryValue);
        setOriginalSubject(statement.atoms.subject);
        setOriginalVerb(statement.atoms.verb);
        setOriginalObject(statement.atoms.object);
        setOriginalPrivacy(statement.isPublic);
      }

      // Always keep draft updated with latest statement value
      setDraft(JSON.parse(JSON.stringify(statement)));
    } else {
      // Exiting edit mode - reset everything
      setOriginalCategory(null);
      setOriginalSubject(null);
      setOriginalVerb(null);
      setOriginalObject(null);
      setOriginalPrivacy(null);

      setDraft(JSON.parse(JSON.stringify(statement)));
    }
    // Only depend on isEditing to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Separate effect to keep draft updated when statement changes
  useEffect(() => {
    if (isEditing) {
      // Keep draft updated with latest changes from the statement
      setDraft(JSON.parse(JSON.stringify(statement)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statement, isEditing]);

  // Helper function to normalize category values for comparison
  const normalizeCategoryForComparison = (
    category: string | null | undefined
  ): string => {
    if (category === null || category === undefined) return '';
    // Convert to string in case it's not already a string
    const categoryStr = String(category).toLowerCase().trim();

    // Handle "uncategorized" variations
    if (['uncategorized', 'uncategorised'].includes(categoryStr)) {
      return 'uncategorized';
    }

    return categoryStr;
  };

  // Calculate changes based on primitive values
  // If we're not in edit mode or don't have original values, no changes to detect
  let hasSubjectChanged = false;
  let hasVerbChanged = false;
  let hasObjectChanged = false;
  let hasPrivacyChanged = false;
  let hasCategoryChanged = false;
  let hasChanged = false;

  if (isEditing) {
    // Use the external original category if available, otherwise use local state
    // This ensures consistent comparison even after component remounts
    const effectiveOriginalCategory = externalOriginalCategory || originalCategory;
    
    if (effectiveOriginalCategory !== null || originalCategory !== null) {
      // Compare current draft with original primitive values
      hasSubjectChanged = draft.atoms.subject !== originalSubject;
      hasVerbChanged = draft.atoms.verb !== originalVerb;
      hasObjectChanged = draft.atoms.object !== originalObject;
      hasPrivacyChanged = draft.isPublic !== originalPrivacy;

      // Normalize categories for comparison
      const draftCategory = normalizeCategoryForComparison(draft.category);
      const originalCategoryNormalized = normalizeCategoryForComparison(effectiveOriginalCategory);

      // Compare normalized categories
      hasCategoryChanged = draftCategory !== originalCategoryNormalized;

      // Calculate overall change status
      hasChanged =
        hasSubjectChanged ||
        hasVerbChanged ||
        hasObjectChanged ||
        hasPrivacyChanged ||
        hasCategoryChanged;
    }
  }

  if (isEditing) {
    return (
      <div className='bg-gray-100 p-3 rounded-lg shadow'>
        {/* Desktop layout - horizontal row */}
        <div className='hidden md:flex md:items-center md:space-x-2'>
          {/* Privacy toggle button */}
          <Button
            variant={draft.isPublic ? 'success' : 'destructive'}
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
                onClick={() => onPartClick('subject', draft.id)}
                className='cursor-pointer px-2 py-1 rounded bg-subjectSelector hover:bg-subjectSelectorHover'
              >
                {draft.atoms.subject}
              </div>
              {/* Verb */}
              <div
                onClick={() => onPartClick('verb', draft.id)}
                className='cursor-pointer px-2 py-1 rounded bg-verbSelector hover:bg-verbSelectorHover'
              >
                <span>{getVerbName(draft.atoms.verb)}</span>
              </div>
              {/* Object */}
              <div
                onClick={() => onPartClick('object', draft.id)}
                className='cursor-pointer px-2 py-1 rounded bg-objectInput hover:bg-objectInputHover'
              >
                {draft.atoms.object}
              </div>
            </div>
            {/* Category */}
            <div
              onClick={() => onPartClick('category', draft.id)}
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
                      const updatedDraft = { ...draft };
                      updatedDraft.input = `${
                        draft.atoms.subject
                      } ${getVerbName(draft.atoms.verb)} ${draft.atoms.object}`;

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
                      // Let the parent handle reset since we're using primitive values
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

        {/* Intermediate layout (640px-768px) - Two rows */}
        <div className='hidden sm:flex md:hidden flex-col space-y-3'>
          {/* Top row: Subject, Verb, Object, Category */}
          <div className='flex flex-wrap gap-2'>
            {/* Subject */}
            <div
              onClick={() => onPartClick('subject', draft.id)}
              className='cursor-pointer p-2 rounded bg-subjectSelector hover:bg-subjectSelectorHover'
            >
              <span className='font-medium'>{draft.atoms.subject}</span>
            </div>

            {/* Verb */}
            <div
              onClick={() => onPartClick('verb', draft.id)}
              className='cursor-pointer p-2 rounded bg-verbSelector hover:bg-verbSelectorHover'
            >
              <span className='font-medium'>
                {getVerbName(draft.atoms.verb)}
              </span>
            </div>

            {/* Object */}
            <div
              onClick={() => onPartClick('object', draft.id)}
              className='cursor-pointer p-2 rounded bg-objectInput hover:bg-objectInputHover'
            >
              <span className='font-medium'>{draft.atoms.object}</span>
            </div>

            {/* Category */}
            <div
              onClick={() => onPartClick('category', draft.id)}
              className='cursor-pointer p-2 rounded bg-categorySelector hover:bg-categorySelectorHover flex items-center'
            >
              <span className='mr-1'>📁</span>
              <span className='font-medium'>
                {draft.category &&
                draft.category.toLowerCase() !== 'uncategorized' &&
                draft.category.toLowerCase() !== 'uncategorised'
                  ? getCategoryDisplayName(draft.category)
                  : 'Uncategorized'}
              </span>
            </div>
          </div>

          {/* Bottom row: Privacy toggle (left), Action buttons (right) */}
          <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
            {/* Left: Privacy toggle */}
            <Button
              variant={draft.isPublic ? 'success' : 'destructive'}
              size='compact'
              onClick={() => {
                setDraft((prevDraft) => {
                  const newDraft = JSON.parse(JSON.stringify(prevDraft));
                  newDraft.isPublic = !prevDraft.isPublic;
                  return newDraft;
                });
              }}
              className='p-2 transition-colors shadow-sm'
            >
              {draft.isPublic ? (
                <>
                  <MailPlus size={16} />
                  <span className='ml-1 text-xs'>Public</span>
                </>
              ) : (
                <>
                  <MailX size={16} />
                  <span className='ml-1 text-xs'>Private</span>
                </>
              )}
            </Button>

            {/* Right: Action buttons */}
            <div className='flex items-center space-x-2'>
              {/* Delete button */}
              <Button
                variant='destructive'
                size='compact'
                onClick={() => onDelete(draft.id)}
                className='px-2 py-1 flex items-center'
              >
                <Trash2 size={16} className='mr-1' />
                <span className='text-xs'>Delete</span>
              </Button>

              {/* Cancel button */}
              <Button
                variant='outline'
                size='compact'
                onClick={() => {
                  // Let the parent handle reset
                  if (onCancel) onCancel(statement.id);
                }}
                className='px-2 py-1 flex items-center'
              >
                <PenOff size={16} className='mr-1' />
                <span className='text-xs'>Cancel</span>
              </Button>

              {/* Save button */}
              <Button
                variant='success'
                size='compact'
                onClick={async () => {
                  setIsSaving(true);
                  const updatedDraft = { ...draft };
                  updatedDraft.input = `${draft.atoms.subject} ${getVerbName(
                    draft.atoms.verb
                  )} ${draft.atoms.object}`;

                  await onLocalSave(updatedDraft);
                  setIsSaving(false);
                }}
                disabled={!hasChanged || isSaving}
                className='px-2 py-1 flex items-center'
              >
                <Save size={16} className='mr-1' />
                <span className='text-xs'>Save</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile layout - vertical stack */}
        <div className='sm:hidden flex flex-col space-y-4'>
          {/* Statement parts column - single column vertical layout */}
          <div className='flex flex-col space-y-2'>
            {/* Subject */}
            <div
              onClick={() => onPartClick('subject', draft.id)}
              className='cursor-pointer p-3 rounded bg-subjectSelector hover:bg-subjectSelectorHover'
            >
              <span className='font-medium'>{draft.atoms.subject}</span>
            </div>

            {/* Verb */}
            <div
              onClick={() => onPartClick('verb', draft.id)}
              className='cursor-pointer p-3 rounded bg-verbSelector hover:bg-verbSelectorHover'
            >
              <span className='font-medium'>
                {getVerbName(draft.atoms.verb)}
              </span>
            </div>

            {/* Object */}
            <div
              onClick={() => onPartClick('object', draft.id)}
              className='cursor-pointer p-3 rounded bg-objectInput hover:bg-objectInputHover'
            >
              <span className='font-medium'>{draft.atoms.object}</span>
            </div>

            {/* Category */}
            <div
              onClick={() => onPartClick('category', draft.id)}
              className='cursor-pointer p-3 rounded bg-categorySelector hover:bg-categorySelectorHover flex items-center'
            >
              <span className='mr-1'>📁</span>
              <span className='font-medium'>
                {draft.category &&
                draft.category.toLowerCase() !== 'uncategorized' &&
                draft.category.toLowerCase() !== 'uncategorised'
                  ? getCategoryDisplayName(draft.category)
                  : 'Uncategorized'}
              </span>
            </div>
          </div>

          {/* Action buttons - bottom fixed bar */}
          <div className='flex justify-between items-center pt-3 mt-2 border-t border-gray-300'>
            {/* Left: Privacy toggle */}
            <Button
              variant={draft.isPublic ? 'success' : 'destructive'}
              size='compact'
              onClick={() => {
                setDraft((prevDraft) => {
                  const newDraft = JSON.parse(JSON.stringify(prevDraft));
                  newDraft.isPublic = !prevDraft.isPublic;
                  return newDraft;
                });
              }}
              className='min-w-[40px] xs:px-3 py-2 flex justify-center'
            >
              {draft.isPublic ? (
                <>
                  <MailPlus size={16} className='xs:mr-1' />
                  <span className='hidden xs:inline text-xs'>Public</span>
                </>
              ) : (
                <>
                  <MailX size={16} className='xs:mr-1' />
                  <span className='hidden xs:inline text-xs'>Private</span>
                </>
              )}
            </Button>

            {/* Right: Action buttons */}
            <div className='flex space-x-2'>
              {/* Delete button */}
              <Button
                variant='destructive'
                size='compact'
                onClick={() => onDelete(draft.id)}
                className='min-w-[40px] xs:px-3 py-2 flex justify-center'
              >
                <Trash2 size={16} className='xs:mr-1' />
                <span className='hidden xs:inline text-xs'>Delete</span>
              </Button>

              {/* Cancel button */}
              <Button
                variant='outline'
                size='compact'
                onClick={() => {
                  // Let the parent handle reset
                  if (onCancel) onCancel(statement.id);
                }}
                className='min-w-[40px] xs:px-3 py-2 flex justify-center'
              >
                <PenOff size={16} className='xs:mr-1' />
                <span className='hidden xs:inline text-xs'>Cancel</span>
              </Button>

              {/* Save button */}
              <Button
                variant='success'
                size='compact'
                onClick={async () => {
                  setIsSaving(true);
                  const updatedDraft = { ...draft };
                  updatedDraft.input = `${draft.atoms.subject} ${getVerbName(
                    draft.atoms.verb
                  )} ${draft.atoms.object}`;

                  await onLocalSave(updatedDraft);
                  setIsSaving(false);
                }}
                disabled={!hasChanged || isSaving}
                className='min-w-[40px] xs:px-3 py-2 flex justify-center'
              >
                <Save size={16} className='xs:mr-1' />
                <span className='hidden xs:inline text-xs'>Save</span>
              </Button>
            </div>
          </div>
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