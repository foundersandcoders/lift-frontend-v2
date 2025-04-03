// src/components/statements/ActionForm.tsx
import React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Save, X } from 'lucide-react';

// Force Redeploy
export interface ActionFormProps {
  initialText?: string;
  initialDueDate?: string;
  onSave: (data: { text: string; dueDate?: string }) => void;
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
    if (text.trim()) {
      onSave({ text: text.trim(), dueDate: dueDate.trim() || undefined });
    }
  };

  const isSaveDisabled = !text.trim();

  return (
    <div className='flex flex-col space-y-1'>
      {/* Desktop layout (xs and up) - all in one row */}
      <div className='hidden xs:flex items-center cursor-pointer hover:bg-gray-100 gap-1 border border-dashed border-gray-300 p-1 rounded'>
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
          disabled={isSaveDisabled}
          className={`m-0 ${
            isSaveDisabled
              ? 'text-gray-500'
              : 'text-green-500 hover:text-green-700'
          }`}
        >
          <Save size={16} />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={onCancel}
          className='text-gray-500 hover:text-gray-700 m-0'
        >
          <X size={16} />
        </Button>
      </div>

      {/* Mobile layout (below xs) - three rows */}
      <div className='xs:hidden flex flex-col space-y-2 cursor-pointer hover:bg-gray-100 border border-dashed border-gray-300 p-2 rounded'>
        {/* Row 1: Action text */}
        <div className='w-full'>
          <Input
            placeholder='Action text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='w-full'
          />
        </div>

        {/* Row 2: Date field with label on same row */}
        <div className='w-full pt-0 flex items-center justify-end gap-2'>
          <label className='text-sm text-right text-gray-700 min-w-[110px]'>
            Due date
          </label>
          <Input
            type='date'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className='flex-1'
          />
        </div>

        {/* Row 3: Buttons */}
        <div className='flex justify-start space-x-2 pt-2 '>
          <Button
            variant='outline'
            size='sm'
            onClick={onCancel}
            className='border-gray-300'
          >
            <X size={16} className='mr-1' />
            <span>Cancel</span>
          </Button>
          <Button
            variant='default'
            size='sm'
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`bg-green-600 hover:bg-green-700 text-white ${
              isSaveDisabled ? 'opacity-50' : ''
            }`}
          >
            <Save size={16} className='mr-1' />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Due date helper text - only show on desktop view */}
      {!dueDate.trim() && (
        <div className='text-sm text-gray-500 ml-2 text-right hidden xs:block'>
          No due date selected (optional)
        </div>
      )}
    </div>
  );
};

export default ActionForm;
