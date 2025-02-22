import React from 'react';
import { format, parse } from 'date-fns';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import ActionForm from './ActionForm';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import type { Action } from '../../../types/types';

export interface ActionPreviewProps {
  actions: Action[];
  onEditAction: (
    actionId: string,
    updated: { text: string; dueDate: string }
  ) => void;
  onDeleteAction: (actionId: string) => void;
  onAddAction: (newAction: { text: string; dueDate: string }) => void;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({
  actions,
  onEditAction,
  onDeleteAction,
  onAddAction,
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

  // Handlers for editing
  const handleStartEdit = (action: Action) => {
    setEditingActionId(action.id);
  };

  const handleSaveEdit = (
    actionId: string,
    data: { text: string; dueDate: string }
  ) => {
    onEditAction(actionId, data);
    setEditingActionId(null);
  };

  const handleCancelEdit = () => {
    setEditingActionId(null);
  };

  // Handlers for adding new action
  const handleStartAdd = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = (data: { text: string; dueDate: string }) => {
    onAddAction(data);
    setIsAddingNew(false);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
  };

  // Delete action confirmation
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
          // Parse stored "yyyy-MM-dd" into a Date object, then format as "dd/MM/yyyy"
          const dueDateObj = parse(action.dueDate, 'yyyy-MM-dd', new Date());
          const dueDateText = !isNaN(dueDateObj.getTime())
            ? format(dueDateObj, 'dd/MM/yyyy')
            : 'No due date';
          return (
            <div
              key={action.id}
              className='flex items-center justify-between p-2 rounded border border-gray-200 shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors'
            >
              <span className='flex-1'>{action.text}</span>
              <span className='mx-4 text-sm text-gray-500'>
                Due: {dueDateText}
              </span>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        } else {
          return (
            <ActionForm
              key={action.id}
              initialText={action.text}
              initialDueDate={action.dueDate}
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

export default ActionPreview;
