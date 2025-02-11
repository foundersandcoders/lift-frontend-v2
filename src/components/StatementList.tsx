'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStatements } from '../hooks/useStatements';
import SubjectSelector from './ui/subject-selector';
import VerbSelector from './ui/VerbSelector';
// import { Label } from '../components/ui/input';
import { Input } from '../components/ui/input';
import { Button } from './ui/button';
import nlp from 'compromise';
import { Trash2, Edit2, Save, Eye, EyeOff } from 'lucide-react';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import type { Statement, Verb } from '../../types/types';
import preStatements from '../../data/preStatements.json';

const StatementList: React.FC<{ username: string }> = ({ username }) => {
  const { state, dispatch } = useStatements();
  const { statements } = state;

  // Local state for editing and confirmations:
  const [editingStatementId, setEditingStatementId] = useState<string | null>(
    null
  );
  const [editingPart, setEditingPart] = useState<
    'subject' | 'verb' | 'object' | null
  >(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({
    isOpen: false,
    statementId: null,
  });
  const [duplicateConfirmation, setDuplicateConfirmation] = useState<{
    isOpen: boolean;
    statement: Statement | null;
  }>({
    isOpen: false,
    statement: null,
  });
  const objectInputRef = useRef<HTMLInputElement>(null);

  // Focus the object input when editing that part.
  useEffect(() => {
    if (editingPart === 'object' && objectInputRef.current) {
      objectInputRef.current.focus();
    }
  }, [editingPart]);

  // If there are no statements, set some defaults.
  useEffect(() => {
    if (statements.length === 0) {
      const newDefaults: Statement[] = (
        preStatements as Array<
          Omit<Statement, 'subject'> & { descriptor?: string }
        >
      ).map((stmt) => {
        const subject = stmt.descriptor
          ? `${username}'s ${stmt.descriptor}`
          : username;
        return {
          ...stmt,
          subject,
          // Optionally, regenerate the id:
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 7),
        };
      });
      dispatch({ type: 'SET_STATEMENTS', payload: newDefaults });
    }
  }, [username, dispatch, statements.length]);

  // Handler for editing verb selection in edit mode.
  const handleEditVerbSelect = (selectedVerb: Verb, statementId: string) => {
    const presentTenseVerb = nlp(selectedVerb.name)
      .verbs()
      .toPresentTense()
      .text();
    handlePartUpdate(statementId, 'verb', presentTenseVerb);
    setEditingPart(null);
  };

  // Duplicate check (ignoring public/private)
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

  const handleEditClick = (statementId: string) => {
    setEditingStatementId(statementId);
    setEditingPart(null);
  };

  const handleEditSave = (statementId: string) => {
    const updatedStatement = statements.find((s) => s.id === statementId);
    if (updatedStatement && isStatementUnique(updatedStatement, statementId)) {
      dispatch({ type: 'UPDATE_STATEMENT', payload: updatedStatement });
      setEditingStatementId(null);
      setEditingPart(null);
      console.log('Statement updated successfully!');
    } else {
      // If not unique, open duplicate confirmation (simply to inform the user).
      setDuplicateConfirmation({ isOpen: true, statement: null });
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
    const updatedStatement = statements.find((s) => s.id === statementId);
    if (updatedStatement) {
      const newStatement = { ...updatedStatement, [part]: value };
      dispatch({ type: 'UPDATE_STATEMENT', payload: newStatement });
    }
    if (part !== 'object') {
      setEditingPart(null);
    }
  };

  const handleDeleteClick = (statementId: string) => {
    setDeleteConfirmation({ isOpen: true, statementId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.statementId) {
      dispatch({
        type: 'DELETE_STATEMENT',
        payload: deleteConfirmation.statementId,
      });
      console.log('Statement deleted successfully!');
    }
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, statementId: null });
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
                onAddDescriptor={() => {}}
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
              dispatch({
                type: 'UPDATE_STATEMENT',
                payload: { ...statement, isPublic: !statement.isPublic },
              })
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

  return (
    <div className='mt-8 bg-white rounded-xl shadow-lg p-6 w-full'>
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
                      statement.isPublic ? 'text-green-500' : 'text-gray-400'
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
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Delete Statement'
        description='Are you sure you want to delete this statement? This action cannot be undone.'
      />
      <ConfirmationDialog
        isOpen={duplicateConfirmation.isOpen}
        onClose={() =>
          setDuplicateConfirmation({ isOpen: false, statement: null })
        }
        onConfirm={() =>
          setDuplicateConfirmation({ isOpen: false, statement: null })
        }
        title='Duplicate Statement'
        description='This statement already exists and will not be added.'
        singleButton
      />
    </div>
  );
};

export default StatementList;
