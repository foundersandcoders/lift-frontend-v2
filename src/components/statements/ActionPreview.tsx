import React from 'react';
import { format } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import type { Action } from '../../../types/types';

export interface ActionPreviewProps {
  actions: Action[];
  onEditAction: (actionId: string) => void;
  onDeleteAction: (actionId: string) => void;
  onAddAction: (newAction: { text: string; dueDate: string }) => void;
}

const ActionPreview: React.FC<ActionPreviewProps> = ({
  actions,
  onEditAction,
  onDeleteAction,
  onAddAction,
}) => {
  const [newAction, setNewAction] = React.useState<{
    text: string;
    dueDate: string;
  }>({
    text: '',
    dueDate: '',
  });

  const handleAddAction = () => {
    if (newAction.text && newAction.dueDate) {
      onAddAction(newAction);
      setNewAction({ text: '', dueDate: '' });
    }
  };

  return (
    <div className='space-y-2 mt-4'>
      {actions.map((action) => (
        <div
          key={action.id}
          className='bg-gray-50 p-3 rounded-lg flex items-center justify-between'
        >
          <div>
            <p>{action.text}</p>
            <p className='text-sm text-gray-500 mt-1'>
              Due: {format(new Date(action.dueDate), 'PP')}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreVertical size={18} className='text-gray-500' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEditAction(action.id)}>
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
      ))}
      <div className='space-y-2 pt-4 border-t'>
        <Input
          placeholder='New action'
          value={newAction.text}
          onChange={(e) => setNewAction({ ...newAction, text: e.target.value })}
        />
        <Input
          type='date'
          value={newAction.dueDate}
          onChange={(e) =>
            setNewAction({ ...newAction, dueDate: e.target.value })
          }
        />
        <Button onClick={handleAddAction} className='w-full'>
          <Plus className='w-4 h-4 mr-2' />
          Add Action
        </Button>
      </div>
    </div>
  );
};

export default ActionPreview;
