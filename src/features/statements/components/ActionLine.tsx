import React from 'react';
import { format, parse } from 'date-fns';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../components/ui/dropdown-menu';
import ActionForm from './ActionForm';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import type { Action } from '../../../types/entries';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ActionLineProps {
  actions: Action[];
  onEditAction: (
    actionId: string,
    updated: { text: string; dueDate?: string }
  ) => void;
  onDeleteAction: (actionId: string) => void;
  onAddAction: (newAction: { text: string; dueDate?: string }) => void;
  onToggleResolved?: (actionId: string) => void;
}

const ActionLine: React.FC<ActionLineProps> = ({
  actions,
  onEditAction,
  onDeleteAction,
  onAddAction,
  onToggleResolved,
}) => {
  const [editingActionId, setEditingActionId] = React.useState<string | null>(
    null
  );
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [actionDeleteConfirmation, setActionDeleteConfirmation] =
    React.useState<{
      isOpen: boolean;
      actionId: string | null;
    }>({ isOpen: false, actionId: null });

  // --- Handlers for Editing ---
  const handleStartEdit = (action: Action) => {
    setEditingActionId(action.id);
  };

  const handleSaveEdit = (
    actionId: string,
    data: { text: string; dueDate?: string }
  ) => {
    onEditAction(actionId, data);
    setEditingActionId(null);
  };

  const handleCancelEdit = () => {
    setEditingActionId(null);
  };

  // --- Handlers for Adding New Action ---
  const handleStartAdd = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = (data: { text: string; dueDate?: string }) => {
    onAddAction(data);
    setIsAddingNew(false);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  // --- Handlers for Deleting an Action with Confirmation ---
  const confirmDeleteAction = (actionId: string) => {
    setActionDeleteConfirmation({ isOpen: true, actionId });
  };

  const handleConfirmDeleteAction = () => {
    if (actionDeleteConfirmation.actionId) {
      onDeleteAction(actionDeleteConfirmation.actionId);
    }
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  const handleCancelDeleteAction = () => {
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  return (
    <div className='ml-1 pl-3 border-gray-200 space-y-2 mt-2'>
      {actions.map((action) => {
        const isEditing = editingActionId === action.id;
        if (!isEditing) {
          let dueDateText: string | null = null;
          if (action.byDate) {
            const dueDateObj = parse(action.byDate, 'yyyy-MM-dd', new Date());
            if (!isNaN(dueDateObj.getTime())) {
              dueDateText = format(dueDateObj, 'dd/MM/yyyy');
            }
          }
          return (
            <div
              key={action.id}
              className={`flex items-center justify-between p-2 rounded border shadow-sm transition-colors bg-gray-50 hover:bg-gray-100 ${
                action.completed ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              {/* Text is placed on the left, taking up all remaining space with "flex-1". */}
              <span className='flex-1'>{action.action}</span>

              {/* Right side holds due date, resolved icon, and dropdown menu. */}
              <div className='flex items-center space-x-4'>
                {/* Show resolved icon if action.completed is true. */}
                {action.completed && (
                  <CheckCircle2 size={18} className='text-green-600' />
                )}
                {/* Show due date if present. */}
                {dueDateText && (
                  <span className='text-sm text-gray-500'>
                    Due: {dueDateText}
                  </span>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={18} className='text-gray-500' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => handleStartEdit(action)}>
                      <Edit2 className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDeleteAction(action.id)}
                      className='text-red-600'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onToggleResolved && onToggleResolved(action.id)
                      }
                    >
                      {action.completed ? (
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        } else {
          // Editing mode remains unchanged
          return (
            <ActionForm
              key={action.id}
              initialText={action.action}
              initialDueDate={action.byDate || ''}
              onSave={(data) => handleSaveEdit(action.id, data)}
              onCancel={handleCancelEdit}
            />
          );
        }
      })}
      {!isAddingNew ? (
        <div
          className='cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 p-2 rounded transition-colors'
          onClick={handleStartAdd}
        >
          <span className='flex-1'>+ Add Action</span>
        </div>
      ) : (
        <ActionForm onSave={handleSaveNew} onCancel={handleCancelNew} />
      )}
      {actionDeleteConfirmation.isOpen && (
        <ConfirmationDialog
          isOpen={actionDeleteConfirmation.isOpen}
          onClose={handleCancelDeleteAction}
          onConfirm={handleConfirmDeleteAction}
          title='Delete Action'
          description='Are you sure you want to delete this action? This action cannot be undone.'
        />
      )}
    </div>
  );
};

export default ActionLine;
