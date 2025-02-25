'use client';

import React, { useState } from 'react';
import VerbSelector from './ui/VerbSelector';
import SubjectSelector from './ui/subject-selector';
import type { Verb } from '../../types/statements';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import nlp from 'compromise';
import { Eye, EyeOff } from 'lucide-react';
import { ConfirmationDialog } from './ui/confirmation-dialog';
import { useStatements } from '../hooks/useStatements';
import { postNewStatement } from '../api/statementsApi';
import type { Statement } from '../../types/statements';

interface StatementBuilderProps {
  username: string;
}

const StatementBuilder: React.FC<StatementBuilderProps> = ({ username }) => {
  // Get the current statements and the dispatch function from context.
  const { dispatch, state } = useStatements();
  const { statements } = state;

  // Local form states.
  const [subject, setSubject] = useState(username);
  const [verb, setVerb] = useState<Verb | null>(null);
  const [object, setObject] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showVerbSelector, setShowVerbSelector] = useState(false);
  const [duplicateConfirmation, setDuplicateConfirmation] = useState<{
    isOpen: boolean;
    statement: Statement | null;
  }>({ isOpen: false, statement: null });

  // Callback for verb selection.
  const handleVerbSelect = (selectedVerb: Verb) => {
    const presentTenseVerb = nlp(selectedVerb.name)
      .verbs()
      .toPresentTense()
      .text();
    setVerb({ ...selectedVerb, name: presentTenseVerb });
    setShowVerbSelector(false);
  };

  // Check whether a new statement is unique (ignoring public/private).
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Dispatch an action to add the new statement.
        dispatch({ type: 'ADD_STATEMENT', payload: newStatement });
        // Call the POST function to send the statement to the backend.
        await postNewStatement(newStatement);
        // Reset the form fields.
        setSubject(username);
        setVerb(null);
        setObject('');
        setIsPublic(false);
      } else {
        // Inform the user that the statement is a duplicate.
        setDuplicateConfirmation({ isOpen: true, statement: newStatement });
      }
    }
  };

  const handleDuplicateConfirm = () => {
    // Simply dismiss the duplicate confirmation dialog.
    setDuplicateConfirmation({ isOpen: false, statement: null });
  };

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 w-full'>
      <h1 className='text-2xl font-bold mb-4'>Statement Builder</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Subject Field */}
        <div>
          <Label htmlFor='subject'>Subject</Label>
          <div className='mt-1'>
            <SubjectSelector
              value={subject}
              onChange={setSubject}
              onAddDescriptor={() => {}}
              username={username}
            />
          </div>
        </div>

        {/* Verb Field */}
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

        {/* Object Field */}
        <div>
          <Label htmlFor='object'>Object</Label>
          <Input
            id='object'
            value={object}
            onChange={(e) => setObject(e.target.value)}
            className='mt-1'
          />
        </div>

        {/* Public Toggle */}
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

        {/* Submit Button */}
        <Button type='submit' className='w-full'>
          Create Statement
        </Button>
      </form>

      {/* VerbSelector Dialog */}
      {showVerbSelector && (
        <VerbSelector
          onVerbSelect={handleVerbSelect}
          onClose={() => setShowVerbSelector(false)}
        />
      )}

      {/* Duplicate Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={duplicateConfirmation.isOpen}
        onClose={handleDuplicateConfirm}
        onConfirm={handleDuplicateConfirm}
        title='Duplicate Statement'
        description='This statement already exists and will not be added.'
        singleButton
      />
    </div>
  );
};

export default StatementBuilder;
