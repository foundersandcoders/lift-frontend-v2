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
  // State to track which action is being edited.
  const [editingActionId, setEditingActionId] = React.useState<string | null>(
    null
  );
  // State to control whether we're adding a new action.
  const [isAddingNew, setIsAddingNew] = React.useState(false);

  // --- Handlers for Editing ---
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

  // --- Handlers for Adding New Action ---
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

  return (
    <div className='space-y-2'>
      {actions.map((action) => {
        const isEditing = editingActionId === action.id;
        if (!isEditing) {
          // Read-only view for an action.
          // Parse stored "yyyy-MM-dd" into a Date object, then format as "dd/MM/yyyy"
          const dueDateObj = parse(action.dueDate, 'yyyy-MM-dd', new Date());
          const dueDateText = !isNaN(dueDateObj.getTime())
            ? format(dueDateObj, 'dd/MM/yyyy')
            : 'No due date';
          return (
            <div
              key={action.id}
              className='flex items-center justify-between bg-gray-50 p-2 rounded'
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
                    onClick={() => onDeleteAction(action.id)}
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
          // Editing mode: use the ActionForm prefilled with the action data.
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

      {/* Add new action: either show the "+ Add Action" row or the inline form */}
      {!isAddingNew ? (
        <div
          className='flex items-center justify-between bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100'
          onClick={handleStartAdd}
        >
          <span className='flex-1'>+ Add Action</span>
        </div>
      ) : (
        <ActionForm onSave={handleSaveNew} onCancel={handleCancelNew} />
      )}
    </div>
  );
};

export default ActionPreview;
