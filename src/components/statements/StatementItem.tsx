import React, { useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SubjectSelector from '../ui/subject-selector';
import VerbSelector from '../ui/VerbSelector';
import { Trash2, Edit2, Save, Eye, EyeOff } from 'lucide-react';
import type { Statement } from '../../../types/types';

export interface StatementItemProps {
  statement: Statement;
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
}) => {
  const objectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPart === 'object' && objectInputRef.current) {
      objectInputRef.current.focus();
    }
  }, [editingPart]);

  if (isEditing) {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Subject */}
          <div
            onClick={() => onPartClick('subject', statement.id)}
            className='cursor-pointer px-2 py-1 rounded bg-blue-100 hover:bg-blue-200'
          >
            {editingPart === 'subject' ? (
              <SubjectSelector
                value={statement.subject}
                onChange={(value) =>
                  onPartUpdate(statement.id, 'subject', value)
                }
                onAddDescriptor={() => {}}
                // Here we assume the username is derived from the subject string.
                username={statement.subject.split("'s")[0] || statement.subject}
              />
            ) : (
              statement.subject
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
              <span>{statement.verb}</span>
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
                value={statement.object}
                onChange={(e) =>
                  onPartUpdate(statement.id, 'object', e.target.value)
                }
                className='w-full'
              />
            ) : (
              statement.object
            )}
          </div>
        </div>
        <div className='flex items-center space-x-2 ml-auto'>
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

  // Static view when not in editing mode
  return (
    <div className='flex justify-between items-center bg-gray-100 p-2 rounded'>
      <span className='flex-1'>{`${statement.subject} ${statement.verb} ${statement.object}`}</span>
      <div className='flex items-center space-x-2 ml-auto'>
        <span
          className={`inline-flex items-center justify-center px-3 py-2 ${
            statement.isPublic ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          {statement.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
        </span>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onEditClick(statement.id)}
          className='text-blue-500 hover:text-blue-700'
        >
          <Edit2 size={16} />
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
};

export default StatementItem;
