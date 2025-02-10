'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import VerbSelector from './ui/VerbSelector';
import SubjectSelector from './ui/subject-selector';
import type { Verb } from '../../types/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import subjects from '../../data/subjects.json';
import nlp from 'compromise';
import { toast } from 'react-hot-toast';
import { Trash2, Edit2, Save, Eye, EyeOff } from 'lucide-react';
import { ConfirmationDialog } from './ui/confirmation-dialog';

interface Statement {
  id: string;
  subject: string;
  verb: string;
  object: string;
  isPublic: boolean;
}

interface StatementBuilderProps {
  onAddStatement: (statement: Statement) => void;
  username: string;
}

const StatementBuilder: React.FC<StatementBuilderProps> = ({
  onAddStatement,
  username,
}) => {
  const [subject, setSubject] = useState(username);
  const [verb, setVerb] = useState<Verb | null>(null);
  const [object, setObject] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showVerbSelector, setShowVerbSelector] = useState(false);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({
    isOpen: false,
    statementId: null,
  });
  const [editingStatementId, setEditingStatementId] = useState<string | null>(
    null
  );
  const [editingPart, setEditingPart] = useState<
    'subject' | 'verb' | 'object' | null
  >(null);
  const objectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPart === 'object' && objectInputRef.current) {
      objectInputRef.current.focus();
    }
  }, [editingPart]);

  // Callback for creation-mode verb selection
  const handleVerbSelect = (selectedVerb: Verb) => {
    const presentTenseVerb = nlp(selectedVerb.name)
      .verbs()
      .toPresentTense()
      .text();
    setVerb({ ...selectedVerb, name: presentTenseVerb });
    setShowVerbSelector(false);
  };

  // Callback for edit-mode verb selection
  const handleEditVerbSelect = (selectedVerb: Verb, statementId: string) => {
    const presentTenseVerb = nlp(selectedVerb.name)
      .verbs()
      .toPresentTense()
      .text();
    handlePartUpdate(statementId, 'verb', presentTenseVerb);
    // Note: We do not clear editingStatementId here because the modal's onClose will do that.
    setEditingPart(null);
  };

  const isStatementUnique = (
    newStatement: Omit<Statement, 'id'>,
    excludeId?: string
  ) => {
    return !statements.some(
      (existingStatement) =>
        existingStatement.id !== excludeId &&
        existingStatement.subject === newStatement.subject &&
        existingStatement.verb === newStatement.verb &&
        existingStatement.object === newStatement.object
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verb) {
      const newStatement: Statement = {
        id: Date.now().toString(),
        subject,
        verb: verb.name,
        object,
        isPublic,
      };

      if (isStatementUnique(newStatement)) {
        setStatements((prevStatements) => [...prevStatements, newStatement]);
        onAddStatement(newStatement); // Add this line to update the shared list
        console.log('Statement:', newStatement);
        toast.success('Statement created successfully!');
        // Reset form fields
        setSubject('Eve');
        setVerb(null);
        setObject('');
        setIsPublic(false);
      } else {
        toast.error('This statement already exists!');
      }
    }
  };

  const handleAddDescriptor = async (newDescriptor: string) => {
    const updatedSubjects = subjects.map((subject) => {
      if (subject.subject === username) {
        return {
          ...subject,
          descriptors: [...subject.descriptors, newDescriptor],
        };
      }
      return subject;
    });

    try {
      await fetch('/api/update-subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubjects),
      });
      console.log('subjects.json updated successfully');
    } catch (error) {
      console.error('Error updating subjects.json:', error);
    }
  };

  const handleDeleteClick = (statementId: string) => {
    setDeleteConfirmation({ isOpen: true, statementId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.statementId) {
      setStatements((prevStatements) =>
        prevStatements.filter(
          (statement) => statement.id !== deleteConfirmation.statementId
        )
      );
      toast.success('Statement deleted successfully!');
    }
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  const handleEditClick = (statementId: string) => {
    setEditingStatementId(statementId);
    setEditingPart(null);
  };

  const handleEditSave = (statementId: string) => {
    const updatedStatement = statements.find((s) => s.id === statementId);
    if (updatedStatement && isStatementUnique(updatedStatement, statementId)) {
      setStatements((prevStatements) =>
        prevStatements.map((s) => (s.id === statementId ? updatedStatement : s))
      );
      setEditingStatementId(null);
      setEditingPart(null);
      toast.success('Statement updated successfully!');
    } else {
      toast.error('This statement already exists! Changes not saved.');
    }
  };

  const handlePartClick = (
    part: 'subject' | 'verb' | 'object',
    statementId: string
  ) => {
    setEditingStatementId(statementId);
    setEditingPart(part);
  };

  const handlePartUpdate = (
    statementId: string,
    part: 'subject' | 'verb' | 'object',
    value: string
  ) => {
    setStatements((prevStatements) =>
      prevStatements.map((s) =>
        s.id === statementId ? { ...s, [part]: value } : s
      )
    );
    if (part !== 'object') {
      setEditingPart(null);
    }
  };

  const renderEditableStatement = (statement: Statement) => {
    return (
      <div className='flex items-center space-x-2 bg-gray-100 p-2 rounded'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Subject */}
          <div
            onClick={() => handlePartClick('subject', statement.id)}
            className='cursor-pointer px-2 py-1 rounded bg-blue-100 hover:bg-blue-200'
          >
            {editingPart === 'subject' &&
            editingStatementId === statement.id ? (
              <SubjectSelector
                value={statement.subject}
                onChange={(value) =>
                  handlePartUpdate(statement.id, 'subject', value)
                }
                onAddDescriptor={handleAddDescriptor}
                username={username}
              />
            ) : (
              statement.subject
            )}
          </div>
          {/* Verb */}
          <div className='cursor-pointer px-2 py-1 rounded bg-green-100 hover:bg-green-200'>
            {editingPart === 'verb' && editingStatementId === statement.id ? (
              <VerbSelector
                onVerbSelect={(verb) =>
                  handleEditVerbSelect(verb, statement.id)
                }
                onClose={() => {
                  setEditingPart(null);
                  setEditingStatementId(null);
                }}
              />
            ) : (
              <span onClick={() => handlePartClick('verb', statement.id)}>
                {statement.verb}
              </span>
            )}
          </div>
          {/* Object */}
          <div
            onClick={() => handlePartClick('object', statement.id)}
            className='cursor-pointer px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200'
          >
            {editingPart === 'object' && editingStatementId === statement.id ? (
              <Input
                ref={objectInputRef}
                value={statement.object}
                onChange={(e) =>
                  handlePartUpdate(statement.id, 'object', e.target.value)
                }
                onBlur={() => setEditingPart(null)}
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
            onClick={() =>
              setStatements((prevStatements) =>
                prevStatements.map((s) =>
                  s.id === statement.id ? { ...s, isPublic: !s.isPublic } : s
                )
              )
            }
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
            onClick={() => handleEditSave(statement.id)}
            className='text-green-500 hover:text-green-700'
          >
            <Save size={16} />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleDeleteClick(statement.id)}
            className='text-red-500 hover:text-red-700'
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  };

  // Add default statements on mount
  useEffect(() => {
    const defaultStatements: Statement[] = [
      {
        id: '1',
        subject: username,
        verb: 'Support',
        object: 'their team',
        isPublic: true,
      },
      {
        id: '2',
        subject: `${username}'s coding practice`,
        verb: 'Improve',
        object: 'software quality',
        isPublic: false,
      },
      {
        id: '3',
        subject: username,
        verb: 'Create',
        object: 'innovative solutions',
        isPublic: true,
      },
      {
        id: '4',
        subject: `${username}'s marketing ideas`,
        verb: 'Engage',
        object: 'potential customers',
        isPublic: true,
      },
      {
        id: '5',
        subject: username,
        verb: 'Learn',
        object: 'new technologies',
        isPublic: false,
      },
    ];
    setStatements(defaultStatements);
  }, [username]);

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl'>
      <h1 className='text-2xl font-bold mb-4'>Statement Builder</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='subject'>Subject</Label>
          <div className='mt-1'>
            <SubjectSelector
              value={subject}
              onChange={setSubject}
              onAddDescriptor={handleAddDescriptor}
              username={username}
            />
          </div>
        </div>
        <div>
          <Label htmlFor='verb'>Verb</Label>
          <div className='flex items-center mt-1'>
            <Input
              id='verb'
              value={verb ? verb.name : ''}
              readOnly
              className='flex-grow'
              placeholder='Click to select a verb'
            />
            <Button
              type='button'
              onClick={() => setShowVerbSelector(true)}
              className='ml-2'
            >
              Select Verb
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor='object'>Object</Label>
          <Input
            id='object'
            value={object}
            onChange={(e) => setObject(e.target.value)}
            className='mt-1'
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => setIsPublic(!isPublic)}
            className={`${
              isPublic
                ? 'bg-green-50 text-green-500'
                : 'bg-gray-50 text-gray-500'
            } hover:bg-opacity-75 rounded-md px-3 py-2`}
          >
            {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
          </Button>
          <Label htmlFor='public'>Public</Label>
        </div>
        <Button type='submit' className='w-full'>
          Create Statement
        </Button>
      </form>
      {/* Global VerbSelector appears only when not editing */}
      {!editingStatementId && showVerbSelector && (
        <VerbSelector
          onVerbSelect={handleVerbSelect}
          onClose={() => setShowVerbSelector(false)}
        />
      )}
      {statements.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-4'>Created Statements</h2>
          <ul className='space-y-2'>
            {statements.map((statement) => (
              <li key={statement.id}>
                {editingStatementId === statement.id ? (
                  renderEditableStatement(statement)
                ) : (
                  <div className='flex justify-between items-center bg-gray-100 p-2 rounded'>
                    <span className='flex-1'>{`${statement.subject} ${statement.verb} ${statement.object}`}</span>
                    <div className='flex items-center space-x-2 ml-auto'>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-2 ${
                          statement.isPublic
                            ? 'text-green-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {statement.isPublic ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEditClick(statement.id)}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick(statement.id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Statement'
        description='Are you sure you want to delete this statement? This action cannot be undone.'
      />
    </div>
  );
};

export default StatementBuilder;
