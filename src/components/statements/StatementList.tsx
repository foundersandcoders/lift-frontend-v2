'use client';

import React, { useState } from 'react';
import { useEntries } from '../../hooks/useEntries';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import type { Entry, SetQuestion } from '../../../types/entries';
import QuestionCard from './QuestionCard';
import StatementItem from './StatementItem';
import StatementWizard from '../statementWizard/StatementWizard';
import { useQuestions } from '../../hooks/useQuestions';
import statementsCategories from '../../../data/statementsCategories.json';
import { formatCategoryName } from '../../../lib/utils';
import { updateEntry } from '../../api/entriesApi';

// Helper: group preset questions by their category.
const groupQuestionsByCategory = (questions: SetQuestion[]) => {
  return questions.reduce<Record<string, SetQuestion[]>>((acc, question) => {
    const cat = question.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(question);
    return acc;
  }, {});
};

// Helper: group created statements by their category.
const groupStatementsByCategory = (statements: Entry[]) => {
  return statements.reduce<Record<string, Entry[]>>((acc, statement) => {
    const cat = statement.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(statement);
    return acc;
  }, {});
};

const StatementList: React.FC<{ username: string }> = ({ username }) => {
  const { data, setData } = useEntries();
  const { entries } = data;

  // Track which preset questions have been used.
  const [usedPresetQuestions, setUsedPresetQuestions] = useState<string[]>([]);
  // Delete confirmation state.
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({ isOpen: false, statementId: null });
  // Wizard state.
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPresetQuestion, setSelectedPresetQuestion] =
    useState<SetQuestion | null>(null);

  // Preset questions from context.
  const { questions } = useQuestions();
  const presetQuestions = questions.filter(
    (q) => !usedPresetQuestions.includes(q.id)
  );

  // Group preset questions and created statements by category.
  const questionsByCategory = groupQuestionsByCategory(presetQuestions);
  const statementsByCategory = groupStatementsByCategory(entries);
  // Get categories from your configuration.
  const categoriesList = statementsCategories.categories; // assumed array of { id: string; name: string }

  // Handler to toggle the resolved flag on a statement.
  const handleToggleResolved = (statementId: string) => {
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;
    const updated = { ...stmt, isResolved: !stmt.isResolved };
    setData({ type: 'UPDATE_ENTRY', payload: updated });
    updateEntry(updated);
  };

  // Handler to toggle the resolved flag on an action
  const handleToggleActionResolved = (
    statementId: string,
    actionId: string
  ) => {
    const statementToUpdate = entries.find((s) => s.id === statementId);
    if (!statementToUpdate || !statementToUpdate.actions) return;

    const updatedActions = statementToUpdate.actions.map((action) =>
      action.id === actionId
        ? { ...action, completed: !action.completed }
        : action
    );

    const updatedStatement = { ...statementToUpdate, actions: updatedActions };
    setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
    updateEntry(updatedStatement);
  };

  // Callback: when a preset question is clicked, open the wizard.
  const handlePresetQuestionSelect = (presetQuestion: SetQuestion) => {
    setSelectedPresetQuestion(presetQuestion);
    setIsWizardOpen(true);
  };

  // Callback: when the wizard completes (a new statement is created), mark the question as used.
  const handleWizardComplete = (newStatement: Entry) => {
    // Use newStatement in a no-op so it's not flagged as unused.
    void newStatement;
    if (selectedPresetQuestion) {
      setUsedPresetQuestions((prev) => [...prev, selectedPresetQuestion.id]);
    }
    setIsWizardOpen(false);
    setSelectedPresetQuestion(null);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    setSelectedPresetQuestion(null);
  };

  // Callback: delete a statement.
  const handleDeleteClick = (statementId: string) => {
    setDeleteConfirmation({ isOpen: true, statementId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.statementId) {
      setData({
        type: 'DELETE_ENTRY',
        payload: deleteConfirmation.statementId,
      });
    }
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  // Callback: placeholder for editing a statement.
  const handleEditClick = (statementId: string) => {
    alert(
      `Edit functionality for statement ${statementId} is not implemented yet.`
    );
  };

  // Callback: Reset a preset-generated statement.
  const handleResetClick = (statementId: string) => {
    const statementToReset = entries.find((s) => s.id === statementId);
    if (statementToReset && statementToReset.presetId) {
      setData({ type: 'DELETE_ENTRY', payload: statementId });
      setUsedPresetQuestions((prev) =>
        prev.filter((id) => id !== statementToReset.presetId)
      );
    }
  };

  // Callback: Add a new action to a statement.
  const handleAddAction = (
    statementId: string,
    newAction: { text: string; dueDate?: string }
  ) => {
    const statementToUpdate = entries.find((s) => s.id === statementId);
    if (!statementToUpdate) return;
    const newActionMapped = {
      id: Date.now().toString(),
      creationDate: new Date().toISOString(),
      byDate: newAction.dueDate || '',
      action: newAction.text,
      completed: false,
    };

    const updatedActions = statementToUpdate.actions
      ? [...statementToUpdate.actions, newActionMapped]
      : [newActionMapped];

    const updatedEntry = { ...statementToUpdate, actions: updatedActions };
    setData({ type: 'UPDATE_ENTRY', payload: updatedEntry });
    updateEntry(updatedEntry);
  };

  // Callback: Edit an existing action.
  const handleEditAction = (
    statementId: string,
    actionId: string,
    updatedData: { text: string; dueDate?: string }
  ) => {
    const statementToUpdate = entries.find((s) => s.id === statementId);
    if (!statementToUpdate || !statementToUpdate.actions) return;
    const updatedActions = statementToUpdate.actions.map((action) =>
      action.id === actionId
        ? {
            ...action,
            action: updatedData.text,
            byDate: updatedData.dueDate || action.byDate,
          }
        : action
    );

    const updatedStatement = { ...statementToUpdate, actions: updatedActions };
    setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
    updateEntry(updatedStatement);
  };

  // Callback: Delete an action.
  const handleDeleteAction = (statementId: string, actionId: string) => {
    const statementToUpdate = entries.find((s) => s.id === statementId);
    if (!statementToUpdate || !statementToUpdate.actions) return;
    const updatedActions = statementToUpdate.actions.filter(
      (action) => action.id !== actionId
    );
    const updatedStatement = { ...statementToUpdate, actions: updatedActions };
    setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
    updateEntry(updatedStatement);
  };

  // Render a category section given a category ID and label.
  const renderCategorySection = (catId: string, catLabel: string) => {
    const presetForCat = questionsByCategory[catId] || [];
    const statementsForCat = statementsByCategory[catId] || [];
    if (presetForCat.length === 0 && statementsForCat.length === 0) return null;
    return (
      <div key={catId} className='mb-8'>
        <h3 className='text-lg font-semibold mb-2'>
          {formatCategoryName(catLabel)}
        </h3>
        {presetForCat.length > 0 && (
          <ul className='space-y-2'>
            {presetForCat.map((presetQuestion) => (
              <li key={`preset-${presetQuestion.id}`}>
                <QuestionCard
                  presetQuestion={presetQuestion}
                  onSelect={handlePresetQuestionSelect}
                />
              </li>
            ))}
          </ul>
        )}
        {statementsForCat.length > 0 && (
          <ul className='space-y-4 mt-4'>
            {statementsForCat.map((statement) => (
              <li key={statement.id}>
                <StatementItem
                  statement={statement}
                  isEditing={false}
                  editingPart={null}
                  onPartClick={() => {}}
                  onPartUpdate={() => {}}
                  onSave={() => {}}
                  onDelete={handleDeleteClick}
                  onTogglePublic={() => {}}
                  onEditClick={handleEditClick}
                  onAddAction={handleAddAction}
                  onEditAction={handleEditAction}
                  onDeleteAction={handleDeleteAction}
                  onReset={
                    statement.presetId
                      ? () => handleResetClick(statement.id)
                      : undefined
                  }
                  onToggleResolved={handleToggleResolved}
                  onToggleActionResolved={(actionId: string) =>
                    handleToggleActionResolved(statement.id, actionId)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Render sections for defined categories and any extra categories.
  const definedCategories = categoriesList;
  const definedCategoryIds = definedCategories.map((c) => c.id);
  const extraCategoryIds = Array.from(
    new Set([
      ...Object.keys(questionsByCategory),
      ...Object.keys(statementsByCategory),
    ])
  ).filter((catId) => !definedCategoryIds.includes(catId));

  return (
    <>
      <div className='mt-8 bg-white rounded-xl shadow-lg p-6 w-full'>
        {definedCategories.map((cat) =>
          renderCategorySection(cat.id, cat.name)
        )}
        {extraCategoryIds.map((catId) => renderCategorySection(catId, catId))}
        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title='Delete Statement'
          description='Are you sure you want to delete this statement? This action cannot be undone.'
        />
      </div>
      {isWizardOpen && selectedPresetQuestion && (
        <StatementWizard
          username={username}
          presetQuestion={selectedPresetQuestion}
          onComplete={handleWizardComplete}
          onClose={handleWizardClose}
        />
      )}
    </>
  );
};

export default StatementList;
