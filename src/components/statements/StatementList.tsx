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
import { EditStatementModal } from '../statementWizard/EditStatementModal';

const groupQuestionsByCategory = (questions: SetQuestion[]) => {
  return questions.reduce<Record<string, SetQuestion[]>>((acc, question) => {
    const cat = question.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(question);
    return acc;
  }, {});
};

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

  const [usedPresetQuestions, setUsedPresetQuestions] = useState<string[]>([]);
  const { questions } = useQuestions();
  const presetQuestions = questions.filter(
    (q) => !usedPresetQuestions.includes(q.id)
  );

  const questionsByCategory = groupQuestionsByCategory(presetQuestions);
  const statementsByCategory = groupStatementsByCategory(entries);
  const categoriesList = statementsCategories.categories;

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({ isOpen: false, statementId: null });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPresetQuestion, setSelectedPresetQuestion] =
    useState<SetQuestion | null>(null);

  // State for editing mode:
  const [editingStatementId, setEditingStatementId] = useState<string | null>(
    null
  );
  // State for opening the modal for a specific part:
  const [editModalData, setEditModalData] = useState<{
    statement: Entry;
    editPart: 'subject' | 'verb' | 'object' | 'category' | 'privacy';
  } | null>(null);

  const handleToggleResolved = (statementId: string) => {
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;
    const updated = { ...stmt, isResolved: !stmt.isResolved };
    setData({ type: 'UPDATE_ENTRY', payload: updated });
    updateEntry(updated);
  };

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

  const handleTogglePublic = (statementId: string) => {
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;
    const updated = { ...stmt, isPublic: !stmt.isPublic };
    setData({ type: 'UPDATE_ENTRY', payload: updated });
    updateEntry(updated);
  };

  const handleSave = (statementId: string) => {
    // Find the statement from the entries
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;

    // Call the API to persist the updated statement
    updateEntry(stmt)
      .then(() => {
        console.log(`Statement ${statementId} saved successfully.`);
        // Optionally, show a success message or update local state further.
      })
      .catch((error) => {
        console.error(`Error saving statement ${statementId}:`, error);
      });
  };

  const handlePresetQuestionSelect = (presetQuestion: SetQuestion) => {
    setSelectedPresetQuestion(presetQuestion);
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (newStatement: Entry) => {
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

  // Single edit option: when user clicks "Edit" in the dropdown
  const handleEditClick = (statementId: string) => {
    setEditingStatementId(statementId);
  };

  // Callback for inline part clicks to open the modal:
  const handlePartClick = (
    part: 'subject' | 'verb' | 'object',
    statementId: string
  ) => {
    const statementToEdit = entries.find((s) => s.id === statementId);
    if (statementToEdit) {
      setEditModalData({ statement: statementToEdit, editPart: part });
    }
  };

  const handlePartUpdate = (
    statementId: string,
    part: 'subject' | 'verb' | 'object',
    value: string
  ) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === statementId
        ? { ...entry, atoms: { ...entry.atoms, [part]: value } }
        : entry
    );
    // Update only context
    setData({ type: 'SET_ENTRIES', payload: updatedEntries });
  };

  const handleResetClick = (statementId: string) => {
    const statementToReset = entries.find((s) => s.id === statementId);
    if (statementToReset && statementToReset.presetId) {
      setData({ type: 'DELETE_ENTRY', payload: statementId });
      setUsedPresetQuestions((prev) =>
        prev.filter((id) => id !== statementToReset.presetId)
      );
    }
  };

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
                  isEditing={statement.id === editingStatementId}
                  editingPart={null}
                  onPartClick={handlePartClick}
                  onPartUpdate={handlePartUpdate}
                  onSave={handleSave}
                  onDelete={handleDeleteClick}
                  onTogglePublic={handleTogglePublic}
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
      {editModalData && (
        <EditStatementModal
          statement={editModalData.statement}
          editPart={editModalData.editPart}
          username={username}
          onUpdate={(updatedStatement) => {
            setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
            updateEntry(updatedStatement);
          }}
          onClose={() => setEditModalData(null)}
        />
      )}
    </>
  );
};

export default StatementList;
