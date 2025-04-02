'use client';

import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { ConfirmationDialog } from '../../../components/ui/ConfirmationDialog';
import type { Entry, SetQuestion } from '@/types/entries';
import QuestionCard from './QuestionCard';
import StatementItem from './StatementItem';
import StatementWizard from '../../wizard/components/StatementWizard';
import { useQuestions } from '../../questions/hooks/useQuestions';
import { useAnsweredCountByCategory } from '../../questions/hooks/useAnsweredCount';
import statementsCategories from '@/data/statementsCategories.json';
import { formatCategoryName } from '@/lib/utils';
import { updateEntry } from '../api/entriesApi';
import { EditStatementModal } from '../../wizard/components/EditStatementModal';
import { BellOff, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Helper function to normalize category IDs for consistent comparison
const normalizeCategoryIdForGrouping = (id: string): string => {
  // Convert to lowercase and handle special cases
  const normalized = id ? id.toLowerCase() : '';

  // Handle variations of "uncategorized"
  if (['uncategorized', 'uncategorised'].includes(normalized)) {
    return 'uncategorized';
  }

  return normalized;
};

// Map a category ID to its corresponding predefined category ID if it exists
const mapToPredefinedCategoryId = (categoryId: string): string => {
  const normalized = normalizeCategoryIdForGrouping(categoryId);
  const predefinedCategory = statementsCategories.categories.find(
    (c) => normalizeCategoryIdForGrouping(c.id) === normalized
  );

  return predefinedCategory ? predefinedCategory.id : categoryId;
};

const groupQuestionsByCategory = (questions: SetQuestion[]) => {
  return questions.reduce<Record<string, SetQuestion[]>>((acc, question) => {
    // Use the predefined category ID if it exists, otherwise use the normalized ID
    const cat = mapToPredefinedCategoryId(question.category || 'Uncategorized');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(question);
    return acc;
  }, {});
};

const groupStatementsByCategory = (statements: Entry[]) => {
  return statements.reduce<Record<string, Entry[]>>((acc, statement) => {
    // Use the predefined category ID if it exists, otherwise use the normalized ID
    const cat = mapToPredefinedCategoryId(
      statement.category || 'Uncategorized'
    );
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(statement);
    return acc;
  }, {});
};

interface StatementListProps {
  username: string;
}

const StatementList: React.FC<StatementListProps> = ({ username }) => {
  const { data, setData } = useEntries();
  const { entries } = data;

  const [usedPresetQuestions, setUsedPresetQuestions] = useState<string[]>([]);
  const { questions, setQuestions } = useQuestions();

  // Get available preset questions (not used and not in snoozed section)
  const presetQuestions = questions.filter(
    (q) => !usedPresetQuestions.includes(q.id) && !q.isSnoozed
  );

  const questionsByCategory = groupQuestionsByCategory(presetQuestions);
  const statementsByCategory = groupStatementsByCategory(entries);
  const categoriesList = statementsCategories.categories;

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    statementId: string | null;
  }>({ isOpen: false, statementId: null });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPresetQuestion, setSelectedPresetQuestion] = useState<
    SetQuestion | undefined
  >(undefined);

  // State for editing mode:
  const [editingStatementId, setEditingStatementId] = useState<string | null>(
    null
  );
  // State for opening the modal for a specific part:
  const [editModalData, setEditModalData] = useState<{
    statement: Entry;
    editPart: 'subject' | 'verb' | 'object' | 'category' | 'privacy';
  } | null>(null);

  // Keep a backup of the original entries when entering edit mode
  const [originalEntries, setOriginalEntries] = useState<{
    [id: string]: Entry;
  }>({});

  // Store original categories to compare when statements are edited
  const [originalCategories, setOriginalCategories] = useState<{
    [id: string]: string;
  }>({});

  // Handle toggling the archive state (archive/unarchive)
  const handleToggleArchived = (statementId: string) => {
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;
    const updated = { ...stmt, isArchived: !stmt.isArchived };
    setData({ type: 'UPDATE_ENTRY', payload: updated });
    updateEntry(updated);
  };

  // Handle toggling the snoozed state for questions
  const handleToggleQuestionSnooze = (questionId: string) => {
    // Find the question in the questions array
    const questionToToggle = questions.find((q) => q.id === questionId);
    if (!questionToToggle) return;

    // Create a new array with the updated question
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        if (q.isSnoozed) {
          // Unsnooze - restore to original category if available
          return {
            ...q,
            isSnoozed: false,
            category: q.originalCategory || q.category,
          };
        } else {
          // Snooze - store original category and move to snoozed
          return {
            ...q,
            isSnoozed: true,
            originalCategory: q.category,
            category: 'snoozed',
          };
        }
      }
      return q;
    });

    // Update the questions in context
    setQuestions(updatedQuestions);
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

  // Handler for when a statement's local save button is clicked.
  async function handleLocalSave(updatedEntry: Entry) {
    try {
      // Call the backend API with the updated entry
      await updateEntry(updatedEntry);

      // Update the context with the new entry
      setData({ type: 'UPDATE_ENTRY', payload: updatedEntry });

      // Remove from originalEntries since we've saved
      setOriginalEntries((prev) => {
        const newEntries = { ...prev };
        delete newEntries[updatedEntry.id];
        return newEntries;
      });

      // Remove from originalCategories
      setOriginalCategories((prev) => {
        const newCategories = { ...prev };
        delete newCategories[updatedEntry.id];
        return newCategories;
      });

      // Exit editing mode for this statement
      setEditingStatementId(null);
    } catch (error) {
      console.error('Error saving statement to DB:', error);
      // Optionally display an error message to the user
    }
  }

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
    setSelectedPresetQuestion(undefined);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    setSelectedPresetQuestion(undefined);
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
    // Store the original entry for possible reversion later
    const entryToEdit = entries.find((e) => e.id === statementId);
    if (entryToEdit) {
      // Store the full entry for restoring on cancel
      setOriginalEntries((prev) => ({
        ...prev,
        [statementId]: JSON.parse(JSON.stringify(entryToEdit)),
      }));

      // Store the original category for change detection
      setOriginalCategories((prev) => ({
        ...prev,
        [statementId]: entryToEdit.category || '',
      }));
    }

    // Enable edit mode
    setEditingStatementId(statementId);
  };

  // Callback for inline part clicks to open the modal:
  const handlePartClick = (
    part: 'subject' | 'verb' | 'object' | 'category' | 'privacy',
    statementId: string
  ) => {
    const statementToEdit = entries.find((s) => s.id === statementId);
    if (statementToEdit) {
      setEditModalData({ statement: statementToEdit, editPart: part });
    }
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

  // State for managing the visibility of the snoozed section - default to expanded
  const [
    isSnoozedQuestionsSectionExpanded,
    setIsSnoozedQuestionsSectionExpanded,
  ] = useState(true);

  // Move the hook call to the top level
  const { categoryCounts } = useAnsweredCountByCategory();

  const renderCategorySection = (catId: string, catLabel: string) => {
    // Don't render the snoozed category in the normal flow
    if (catId === 'snoozed') return null;

    const presetForCat = questionsByCategory[catId] || [];
    const statementsForCat = statementsByCategory[catId] || [];
    if (presetForCat.length === 0 && statementsForCat.length === 0) return null;

    // Normalize the category ID for consistent comparison
    const normalizedCatId = normalizeCategoryIdForGrouping(catId);

    // We're now using a consistent styling regardless of category

    // Use the pre-fetched category counts
    const categoryStatus = categoryCounts[normalizedCatId] || {
      answered: 0,
      total: 0,
    };
    const isComplete =
      categoryStatus.total > 0 &&
      categoryStatus.answered === categoryStatus.total;

    return (
      <div key={catId} className='mb-4 md:mb-8 category-section'>
        {/* Folder Tab Design */}
        <div className={`relative z-10`}>
          <div
            className={`inline-block px-4 py-1 md:py-2 rounded-t-lg ${
              isComplete
                ? 'bg-green-200 border-green-500'
                : 'bg-slate-100 border-slate-300'
            } border-t border-l border-r border-b-0`}
          >
            <h3 className='text-lg font-semibold'>
              {formatCategoryName(catLabel)}
            </h3>
          </div>
        </div>

        {/* Folder Content */}
        <div
          className={`border rounded-tr-lg rounded-b-lg p-2 md:p-4 -mt-[1px] ${
            isComplete
              ? 'bg-white border-green-500'
              : 'bg-white border-slate-300'
          }`}
        >
          {presetForCat.length > 0 && (
            <ul className='space-y-2'>
              {presetForCat.map((presetQuestion) => (
                <li key={`preset-${presetQuestion.id}`}>
                  <QuestionCard
                    presetQuestion={presetQuestion}
                    onSelect={handlePresetQuestionSelect}
                    onToggleSnooze={handleToggleQuestionSnooze}
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
                    originalCategory={originalCategories[statement.id]}
                    onPartClick={handlePartClick}
                    onLocalSave={handleLocalSave}
                    onCancel={() => {
                      // If we have the original, restore it
                      if (originalEntries[statement.id]) {
                        // Restore the original entry from our backup
                        setData({
                          type: 'UPDATE_ENTRY',
                          payload: originalEntries[statement.id],
                        });

                        // Remove from originalEntries and originalCategories
                        setOriginalEntries((prev) => {
                          const newEntries = { ...prev };
                          delete newEntries[statement.id];
                          return newEntries;
                        });

                        // Also clear from original categories
                        setOriginalCategories((prev) => {
                          const newCategories = { ...prev };
                          delete newCategories[statement.id];
                          return newCategories;
                        });
                      }

                      // Exit edit mode
                      setEditingStatementId(null);
                    }}
                    onDelete={handleDeleteClick}
                    onEditClick={handleEditClick}
                    onAddAction={handleAddAction}
                    onEditAction={handleEditAction}
                    onDeleteAction={handleDeleteAction}
                    onReset={
                      statement.presetId
                        ? () => handleResetClick(statement.id)
                        : undefined
                    }
                    onToggleArchived={handleToggleArchived}
                    onToggleActionResolved={(actionId: string) =>
                      handleToggleActionResolved(statement.id, actionId)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  // Special renderer for the snoozed questions section
  const renderSnoozedQuestionsSection = () => {
    // Filter questions to get snoozed ones
    const snoozedQuestions = questions.filter((q) => q.isSnoozed);
    if (snoozedQuestions.length === 0) return null;

    return (
      <div className='mb-8 mt-4'>
        {/* Snoozed Questions section */}
        <div
          className={`border rounded-lg overflow-hidden bg-white ${
            isSnoozedQuestionsSectionExpanded
              ? 'border-blue-300'
              : 'border-blue-200'
          }`}
        >
          {/* Header/Tab that's always visible */}
          <div
            className={`flex items-center justify-between px-4 py-3 bg-blue-100 cursor-pointer ${
              isSnoozedQuestionsSectionExpanded
                ? 'border-b border-blue-300'
                : ''
            }`}
            onClick={() =>
              setIsSnoozedQuestionsSectionExpanded(
                !isSnoozedQuestionsSectionExpanded
              )
            }
          >
            <h2 className='text-lg font-semibold flex items-center text-blue-700'>
              <BellOff className='h-5 w-5 mr-2' />
              Snoozed Questions
            </h2>
            <div className='flex items-center'>
              <span className='mr-2 text-blue-700 font-medium'>
                ({snoozedQuestions.length})
              </span>
              {isSnoozedQuestionsSectionExpanded ? (
                <ChevronUp className='h-5 w-5 text-blue-600' />
              ) : (
                <ChevronDown className='h-5 w-5 text-blue-600' />
              )}
            </div>
          </div>

          {/* Content section that appears/disappears */}
          {isSnoozedQuestionsSectionExpanded && (
            <div className='p-2 sm:p-4 bg-white'>
              <ul className='space-y-2'>
                {snoozedQuestions.map((question) => (
                  <li key={`snoozed-${question.id}`}>
                    <QuestionCard
                      presetQuestion={question}
                      onSelect={() => {
                        /* Disabled for snoozed questions */
                      }}
                      onToggleSnooze={handleToggleQuestionSnooze}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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

  // Helper function to find category name from ID
  const getCategoryName = (categoryId: string): string => {
    // First check if it's in our defined categories
    const category = definedCategories.find(
      (c) =>
        normalizeCategoryIdForGrouping(c.id) ===
        normalizeCategoryIdForGrouping(categoryId)
    );

    if (category) {
      return category.name;
    }

    // Check for uncategorized variations
    if (
      ['uncategorized', 'uncategorised'].includes(
        normalizeCategoryIdForGrouping(categoryId)
      )
    ) {
      return 'Uncategorized';
    }

    // If not found, return the ID with formatting
    return formatCategoryName(categoryId);
  };

  return (
    <>
      <div
        id='mainContentArea'
        className='my-2 md:my-8 bg-white rounded-xl shadow-lg p-3 md:p-6 w-full'
      >
        {/* Regular categories */}
        {definedCategories.map((cat) =>
          renderCategorySection(cat.id, cat.name)
        )}
        {extraCategoryIds.map((catId) =>
          renderCategorySection(catId, getCategoryName(catId))
        )}

        {/* Add custom statement section */}
        <div className='my-8 text-center'>
          <div className='max-w-md mx-auto'>
            <h2 className='text-lg font-medium text-gray-700 mb-2'>
              Want to add your own statement?
            </h2>

            <Button
              onClick={() => {
                setSelectedPresetQuestion(undefined);
                setIsWizardOpen(true);
              }}
              variant='pink'
              className='flex items-center px-6 py-2 mx-auto shadow-sm add-custom-button'
            >
              <Plus className='w-5 h-5 mr-2' />
              <span>Add custom statement</span>
            </Button>
          </div>
        </div>

        {/* Snoozed sections */}
        {renderSnoozedQuestionsSection()}

        <ConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title='Delete Statement'
          description='Are you sure you want to delete this statement? This action cannot be undone.'
        />
      </div>
      {isWizardOpen && (
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
            console.log('====== MODAL UPDATE SEQUENCE START ======');
            console.log(
              '1. EditStatementModal returned updated statement:',
              updatedStatement
            );
            console.log('2. Current editing state:', {
              isEditing: editingStatementId === updatedStatement.id,
              editingStatementId,
              updatedStatementId: updatedStatement.id,
            });

            // If we're in editing mode for this statement:
            if (editingStatementId === updatedStatement.id) {
              console.log(
                '3. EDIT MODE PATH: Will update UI without saving to backend'
              );
              console.log('4. Original entries stored:', originalEntries);

              // In edit mode, we need to update the data without saving to backend yet
              // But we must ensure the original values in StatementItem aren't updated

              // Create a completely isolated copy with a unique timestamp
              const markedEntry = {
                ...JSON.parse(JSON.stringify(updatedStatement)),
                // Add special properties to force React to treat this as a new object
                _updateTimestamp: Date.now(),
                _forceUpdate: Math.random().toString(),
              };

              console.log('5. Will dispatch UPDATE_ENTRY with:', markedEntry);

              // Before updating the global state, log the current statements
              const existingEntry = entries.find(
                (e) => e.id === updatedStatement.id
              );
              console.log('6. Current entries before update:', existingEntry);

              // Log potential category changes
              console.log('CATEGORY CHANGE CHECK:', {
                existingCategory: existingEntry?.category,
                newCategory: markedEntry.category,
                changed: existingEntry?.category !== markedEntry.category,
                equal: existingEntry?.category === markedEntry.category,
              });

              // Update the UI with the new values
              setData({ type: 'UPDATE_ENTRY', payload: markedEntry });

              console.log('7. UPDATE_ENTRY action dispatched');

              // Log what will happen next
              console.log(
                '8. This will trigger a re-render of StatementItem with:',
                {
                  statementId: updatedStatement.id,
                  isEditing: true,
                  newStatementCategory: markedEntry.category,
                  editingStatementId,
                }
              );
            } else {
              console.log(
                '3. DIRECT SAVE PATH: Will update both UI and backend'
              );

              // If we're not in edit mode, save directly when modal is closed
              setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
              // Also update backend
              updateEntry(updatedStatement);

              console.log('4. Direct save completed');
            }
            console.log('====== MODAL UPDATE SEQUENCE END ======');
          }}
          onClose={() => setEditModalData(null)}
        />
      )}
    </>
  );
};

export default StatementList;
