'use client';

import React, { useState, useEffect } from 'react';
import { useStatements } from '../../hooks/useStatements';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import type { Statement, SetQuestion } from '../../../types/types';
import preStatements from '../../../data/preStatements.json';
import nlp from 'compromise';
import StatementItem from './StatementItem';
import { updateStatement } from '../../api/statementsApi';
import QuestionCard from './QuestionCard';
import setQuestionsData from '../../../data/setQuestions.json';
import StatementWizard from '../StatementWizard';

const StatementList: React.FC<{ username: string }> = ({ username }) => {
  const { state, dispatch } = useStatements();
  const { statements } = state;

  const [editingStatementId, setEditingStatementId] = useState<string | null>(
    null
  );
  const [editingPart, setEditingPart] = useState<
    'subject' | 'verb' | 'object' | null
  >(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({ isOpen: false, statementId: null });
  const [duplicateConfirmation, setDuplicateConfirmation] = useState<{
    isOpen: boolean;
    statement: Statement | null;
  }>({ isOpen: false, statement: null });

  const [actionDeleteConfirmation, setActionDeleteConfirmation] = useState<{
    isOpen: boolean;
    actionId: string | null;
  }>({ isOpen: false, actionId: null });

  // State for the reset confirmation dialog.
  const [resetConfirmation, setResetConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({ isOpen: false, statementId: null });

  // State to hold the selected preset question from the QuestionCards.
  const [selectedPresetQuestion, setSelectedPresetQuestion] =
    useState<SetQuestion | null>(null);
  // State to control if the StatementWizard is open.
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  // State to keep track of used preset questions (so they can be hidden later).
  const [usedPresetQuestions, setUsedPresetQuestions] = useState<string[]>([]);

  console.log(
    'Wizard open:',
    isWizardOpen,
    'Selected question:',
    selectedPresetQuestion
  );

  // If there are no statements, set default ones from preStatements.json
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
        const presentTenseVerb = nlp(stmt.verb)
          .verbs()
          .toPresentTense()
          .text()
          .toLowerCase();
        const objectLower = stmt.object.toLowerCase();
        return {
          ...stmt,
          subject,
          verb: presentTenseVerb,
          object: objectLower,
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 7),
        };
      });
      dispatch({ type: 'SET_STATEMENTS', payload: newDefaults });
    }
  }, [username, dispatch, statements.length]);

  const handleEditClick = (statementId: string) => {
    setEditingStatementId(statementId);
    setEditingPart(null);
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

  const handleEditSave = (statementId: string) => {
    const updatedStatement = statements.find((s) => s.id === statementId);
    if (updatedStatement) {
      // Check for duplicates (ignoring public/private status)
      const isUnique = !statements.some(
        (s) =>
          s.id !== statementId &&
          s.subject === updatedStatement.subject &&
          s.verb === updatedStatement.verb &&
          s.object === updatedStatement.object
      );
      if (isUnique) {
        dispatch({ type: 'UPDATE_STATEMENT', payload: updatedStatement });
        setEditingStatementId(null);
        setEditingPart(null);
        console.log('Statement updated successfully!');
      } else {
        setDuplicateConfirmation({ isOpen: true, statement: updatedStatement });
      }
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

  const handleTogglePublic = (statementId: string) => {
    const updated = statements.find((s) => s.id === statementId);
    if (updated) {
      dispatch({
        type: 'UPDATE_STATEMENT',
        payload: { ...updated, isPublic: !updated.isPublic },
      });
    }
  };

  // HandleAddAction callback for adding a new action to a statement.
  const handleAddAction = (
    statementId: string,
    newAction: { text: string; dueDate: string }
  ) => {
    const actionObj = {
      id: Date.now().toString(),
      creationDate: new Date().toISOString(),
      text: newAction.text,
      dueDate: newAction.dueDate,
    };

    const statementToUpdate = statements.find((s) => s.id === statementId);
    if (!statementToUpdate) return;

    const updatedActions = statementToUpdate.actions
      ? [...statementToUpdate.actions, actionObj]
      : [actionObj];

    const updatedStatement: Statement = {
      ...statementToUpdate,
      actions: updatedActions,
    };

    dispatch({ type: 'UPDATE_STATEMENT', payload: updatedStatement });
    updateStatement(updatedStatement);
  };

  // Handler for editing an existing action.
  const handleEditAction = (
    actionId: string,
    updated: { text: string; dueDate: string }
  ) => {
    // Find the statement that contains this action.
    const statementToUpdate = statements.find(
      (s) => s.actions && s.actions.some((a) => a.id === actionId)
    );
    if (!statementToUpdate) return;

    const updatedActions = statementToUpdate.actions!.map((action) =>
      action.id === actionId ? { ...action, ...updated } : action
    );

    const updatedStatement: Statement = {
      ...statementToUpdate,
      actions: updatedActions,
    };

    dispatch({ type: 'UPDATE_STATEMENT', payload: updatedStatement });
    updateStatement(updatedStatement);
  };

  // Handler for deleting an existing action.

  const handleDeleteActionClick = (actionId: string) => {
    setActionDeleteConfirmation({ isOpen: true, actionId });
  };

  const handleDeleteActionConfirm = () => {
    if (actionDeleteConfirmation.actionId) {
      const actionId = actionDeleteConfirmation.actionId;
      // Find the statement that contains this action.
      const statementToUpdate = statements.find(
        (s) => s.actions && s.actions.some((a) => a.id === actionId)
      );
      if (statementToUpdate && statementToUpdate.actions) {
        // Remove the action from the actions array.
        const updatedActions = statementToUpdate.actions.filter(
          (a) => a.id !== actionId
        );
        const updatedStatement: Statement = {
          ...statementToUpdate,
          actions: updatedActions,
        };

        // Update the context.
        dispatch({ type: 'UPDATE_STATEMENT', payload: updatedStatement });
        // Persist the change via the API.
        updateStatement(updatedStatement);
      }
    }
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  const handleDeleteActionCancel = () => {
    setActionDeleteConfirmation({ isOpen: false, actionId: null });
  };

  // When a preset question is clicked, open the wizard and set the selected preset question.
  const handlePresetQuestionSelect = (presetQuestion: SetQuestion) => {
    setSelectedPresetQuestion(presetQuestion);
    setIsWizardOpen(true);
  };

  // Callback for when the wizard completes (i.e. a new statement is created).
  const handleWizardComplete = (newStatement: Statement) => {
    // The next console.log is actually needed for type checking.
    console.log('New statement:', newStatement);
    // The wizard itself dispatches an ADD_STATEMENT action.
    // Now mark the preset question as used (or hidden).
    if (selectedPresetQuestion) {
      setUsedPresetQuestions((prev) => [...prev, selectedPresetQuestion.id]);
    }

    // Close the wizard and clear the selected question.
    setIsWizardOpen(false);
    setSelectedPresetQuestion(null);
  };

  // Handler for resetting a statement (only applicable for statements with a presetId).
  const handleResetClick = (statementId: string) => {
    setResetConfirmation({ isOpen: true, statementId });
  };

  const handleResetConfirm = () => {
    if (resetConfirmation.statementId) {
      const statementToReset = statements.find(
        (s) => s.id === resetConfirmation.statementId
      );
      if (statementToReset && statementToReset.presetId) {
        dispatch({
          type: 'DELETE_STATEMENT',
          payload: resetConfirmation.statementId,
        });
        setUsedPresetQuestions((prev) =>
          prev.filter((id) => id !== statementToReset.presetId)
        );
      }
    }
    setResetConfirmation({ isOpen: false, statementId: null });
  };

  const handleResetCancel = () => {
    setResetConfirmation({ isOpen: false, statementId: null });
  };

  return (
    <div className='mt-8 bg-white rounded-xl shadow-lg p-6 w-full'>
      <h2 className='text-xl font-semibold mb-4'>Items</h2>
      {/* Single list merging preset questions and created statements */}
      <ul className='space-y-2'>
        {/* Render preset questions first – filter out any that have been used */}
        {setQuestionsData.setQuestions
          .filter((q: SetQuestion) => !usedPresetQuestions.includes(q.id))
          .map((presetQuestion: SetQuestion) => (
            <li key={`preset-${presetQuestion.id}`}>
              <QuestionCard
                presetQuestion={presetQuestion}
                onSelect={handlePresetQuestionSelect}
              />
            </li>
          ))}

        {/* Render created statements */}
        {statements.map((statement) => (
          <li key={statement.id}>
            <StatementItem
              statement={statement}
              isEditing={editingStatementId === statement.id}
              editingPart={
                editingStatementId === statement.id ? editingPart : null
              }
              onPartClick={handlePartClick}
              onPartUpdate={handlePartUpdate}
              onSave={handleEditSave}
              onDelete={handleDeleteClick}
              onTogglePublic={handleTogglePublic}
              onEditClick={handleEditClick}
              onAddAction={handleAddAction}
              onEditAction={handleEditAction}
              onDeleteAction={handleDeleteActionClick}
              onReset={statement.presetId ? handleResetClick : undefined}
            />
          </li>
        ))}
      </ul>

      {/* Conditionally render the StatementWizard when open */}
      {isWizardOpen && selectedPresetQuestion && (
        <StatementWizard
          username={username}
          presetQuestion={selectedPresetQuestion}
          onComplete={handleWizardComplete}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedPresetQuestion(null);
          }}
        />
      )}

      {/* Existing ConfirmationDialogs */}
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
      <ConfirmationDialog
        isOpen={actionDeleteConfirmation.isOpen}
        onClose={handleDeleteActionCancel}
        onConfirm={handleDeleteActionConfirm}
        title='Delete Action'
        description='Are you sure you want to delete this action? This action cannot be undone.'
      />
      <ConfirmationDialog
        isOpen={resetConfirmation.isOpen}
        onClose={handleResetCancel}
        onConfirm={handleResetConfirm}
        title='Reset Statement'
        description='Are you sure you want to reset this statement? The statement will be deleted and the original question reinstated.'
      />
    </div>
  );
};

export default StatementList;
