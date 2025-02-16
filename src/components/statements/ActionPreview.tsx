import React from 'react';
// import { format } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import type { Action } from '../../../types/types';
import { format, parse } from 'date-fns';

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
  // Add Action State
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newAction, setNewAction] = React.useState({ text: '', dueDate: '' });

  // Edit Action State
  const [editingActionId, setEditingActionId] = React.useState<string | null>(
    null
  );
  const [editForm, setEditForm] = React.useState({ text: '', dueDate: '' });

  // ---------------------------
  // ADD ACTION LOGIC
  // ---------------------------
  const handleStartAdd = () => {
    setIsAddingNew(true);
    setNewAction({ text: '', dueDate: '' });
  };

  const handleSaveNew = () => {
    if (!newAction.text || !newAction.dueDate) return;
    onAddAction(newAction);
    setIsAddingNew(false);
    setNewAction({ text: '', dueDate: '' });
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewAction({ text: '', dueDate: '' });
  };

  // ---------------------------
  // EDIT ACTION LOGIC
  // ---------------------------
  const handleStartEdit = (action: Action) => {
    setEditingActionId(action.id);
    // Directly use the stored dueDate, which is assumed to be in "YYYY-MM-DD" format.
    setEditForm({
      text: action.text,
      dueDate: action.dueDate,
    });
  };

  const handleSaveEdit = (actionId: string) => {
    if (!editForm.text || !editForm.dueDate) return;
    onEditAction(actionId, { text: editForm.text, dueDate: editForm.dueDate });
    setEditingActionId(null);
    setEditForm({ text: '', dueDate: '' });
  };

  const handleCancelEdit = () => {
    setEditingActionId(null);
    setEditForm({ text: '', dueDate: '' });
  };

  return (
    <div className='space-y-2'>
      {actions.map((action) => {
        const isEditing = editingActionId === action.id;

        if (!isEditing) {
          // Normal (read-only) view
          // Since dueDate is already in "YYYY-MM-DD", we can display it directly or format it if needed.
          return (
            <div
              key={action.id}
              className='flex items-center justify-between bg-gray-50 p-2 rounded'
            >
              <span className='flex-1'>{action.text}</span>
              <span className='mx-4 text-sm text-gray-500'>
                Due:{' '}
                {action.dueDate
                  ? format(
                      parse(action.dueDate, 'yyyy-MM-dd', new Date()),
                      'dd/MM/yyyy'
                    )
                  : 'No due date'}
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
          // Editing this action
          return (
            <div
              key={action.id}
              className='flex items-center bg-gray-50 p-2 rounded space-x-2'
            >
              <Input
                placeholder='Action text'
                value={editForm.text}
                onChange={(e) =>
                  setEditForm({ ...editForm, text: e.target.value })
                }
                className='flex-1'
              />
              <Input
                type='date'
                value={editForm.dueDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, dueDate: e.target.value })
                }
                className='w-36'
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleSaveEdit(action.id)}
                className='text-green-500 hover:text-green-700'
              >
                <Save size={16} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCancelEdit}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={16} />
              </Button>
            </div>
          );
        }
      })}

      {/* Add Action row or inline form */}
      {!isAddingNew ? (
        <div
          className='flex items-center justify-between bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-100'
          onClick={handleStartAdd}
        >
          <span className='flex-1'>+ Add Action</span>
        </div>
      ) : (
        <div className='flex items-center bg-gray-50 p-2 rounded space-x-2'>
          <Input
            placeholder='Action text'
            value={newAction.text}
            onChange={(e) =>
              setNewAction({ ...newAction, text: e.target.value })
            }
            className='flex-1'
          />
          <Input
            type='date'
            value={newAction.dueDate}
            onChange={(e) =>
              setNewAction({ ...newAction, dueDate: e.target.value })
            }
            className='w-36'
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={handleSaveNew}
            className='text-green-500 hover:text-green-700'
          >
            <Save size={16} />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleCancelNew}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionPreview;
