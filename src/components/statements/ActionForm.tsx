import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Save, X } from 'lucide-react';

export interface ActionFormProps {
  initialText?: string;
  initialDueDate?: string;
  onSave: (data: { text: string; dueDate: string }) => void;
  onCancel: () => void;
}

const ActionForm: React.FC<ActionFormProps> = ({
  initialText = '',
  initialDueDate = '',
  onSave,
  onCancel,
}) => {
  const [text, setText] = React.useState(initialText);
  const [dueDate, setDueDate] = React.useState(initialDueDate);

  const handleSave = () => {
    if (text && dueDate) {
      onSave({ text, dueDate });
    }
  };

  return (
    <div className='flex items-center bg-gray-50 p-2 rounded space-x-2'>
      <Input
        placeholder='Action text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='flex-1'
      />
      <Input
        type='date'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className='w-36'
      />
      <Button
        variant='ghost'
        size='sm'
        onClick={handleSave}
        className='text-green-500 hover:text-green-700'
      >
        <Save size={16} />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={onCancel}
        className='text-gray-500 hover:text-gray-700'
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default ActionForm;
