'use client';

import React, { useState } from 'react';
import { useStatements } from '../../hooks/useStatements';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import type { Statement, SetQuestion } from '../../../types/types';
import QuestionCard from './QuestionCard';
import StatementItem from './StatementItem';
import StatementWizard from '../statementWizard/StatementWizard';
import setQuestionsData from '../../../data/setQuestions.json';
import statementsCategories from '../../../data/statementsCategories.json';
import { formatCategoryName } from '../../../lib/utils';

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
const groupStatementsByCategory = (statements: Statement[]) => {
  return statements.reduce<Record<string, Statement[]>>((acc, statement) => {
    const cat = statement.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(statement);
    return acc;
  }, {});
};

const StatementList: React.FC<{ username: string }> = ({ username }) => {
  const { state, dispatch } = useStatements();
  const { statements } = state;

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

  // Preset questions from JSON.
  const presetQuestions = setQuestionsData.setQuestions.filter(
    (q) => !usedPresetQuestions.includes(q.id)
  );

  // Group preset questions and created statements by category.
  const questionsByCategory = groupQuestionsByCategory(presetQuestions);
  const statementsByCategory = groupStatementsByCategory(statements);

  // Get categories from your configuration.
  const categoriesList = statementsCategories.categories; // assumed array of { id: string; name: string }

  // Compute extra categories not defined in your configuration.
  const definedCategoryIds = categoriesList.map((c) => c.id);
  const extraCategoryIds = Array.from(
    new Set([
      ...Object.keys(questionsByCategory),
      ...Object.keys(statementsByCategory),
    ])
  ).filter((catId) => !definedCategoryIds.includes(catId));

  // When a preset question is clicked, open the wizard.
  const handlePresetQuestionSelect = (presetQuestion: SetQuestion) => {
    setSelectedPresetQuestion(presetQuestion);
    setIsWizardOpen(true);
  };

  // When the wizard completes (a new statement is created), mark the question as used.
  const handleWizardComplete = (newStatement: Statement) => {
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

  // Handlers for deletion of statements.
  const handleDeleteClick = (statementId: string) => {
    setDeleteConfirmation({ isOpen: true, statementId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.statementId) {
      dispatch({
        type: 'DELETE_STATEMENT',
        payload: deleteConfirmation.statementId,
      });
    }
    setDeleteConfirmation({ isOpen: false, statementId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, statementId: null });
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
                  onEditClick={() => {}}
                  onAddAction={() => {}}
                  onEditAction={() => {}}
                  onDeleteAction={() => {}}
                  onReset={statement.presetId ? () => {} : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='mt-8 bg-white rounded-xl shadow-lg p-6 w-full'>
        {/* Render defined categories */}
        {categoriesList.map((cat) => renderCategorySection(cat.id, cat.name))}
        {/* Render extra categories (e.g. Uncategorized) */}
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
