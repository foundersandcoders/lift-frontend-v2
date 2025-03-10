'use client';

import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
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
import { BellOff, ChevronUp, ChevronDown } from 'lucide-react';

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
    c => normalizeCategoryIdForGrouping(c.id) === normalized
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
    const cat = mapToPredefinedCategoryId(statement.category || 'Uncategorized');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(statement);
    return acc;
  }, {});
};

const StatementList: React.FC<{ username: string }> = ({ username }) => {
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
  
  // Keep a backup of the original entries when entering edit mode
  const [originalEntries, setOriginalEntries] = useState<{[id: string]: Entry}>({});

  // Handle toggling the resolved state (archive/unarchive)
  const handleToggleResolved = (statementId: string) => {
    const stmt = entries.find((s) => s.id === statementId);
    if (!stmt) return;
    const updated = { ...stmt, isResolved: !stmt.isResolved };
    setData({ type: 'UPDATE_ENTRY', payload: updated });
    updateEntry(updated);
  };
  
  
  // Handle toggling the snoozed state for questions
  const handleToggleQuestionSnooze = (questionId: string) => {
    // Find the question in the questions array
    const questionToToggle = questions.find(q => q.id === questionId);
    if (!questionToToggle) return;
    
    // Create a new array with the updated question
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (q.isSnoozed) {
          // Unsnooze - restore to original category if available
          return {
            ...q,
            isSnoozed: false,
            category: q.originalCategory || q.category
          };
        } else {
          // Snooze - store original category and move to snoozed
          return {
            ...q,
            isSnoozed: true,
            originalCategory: q.category,
            category: 'snoozed'
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
      // Call the backend API with the updated entry.
      await updateEntry(updatedEntry);
      
      // Update the context with the new entry.
      setData({ type: 'UPDATE_ENTRY', payload: updatedEntry });
      
      // Remove from originalEntries since we've saved
      setOriginalEntries(prev => {
        const newEntries = {...prev};
        delete newEntries[updatedEntry.id];
        return newEntries;
      });
      
      // Exit editing mode for this statement.
      setEditingStatementId(null);
    } catch (error) {
      console.error('Error saving statement to DB:', error);
      // Optionally display an error message to the user.
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
    // Store the original entry for possible reversion later
    const entryToEdit = entries.find(e => e.id === statementId);
    if (entryToEdit) {
      setOriginalEntries(prev => ({
        ...prev,
        [statementId]: JSON.parse(JSON.stringify(entryToEdit))
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

  // const handlePartUpdate = (
  //   statementId: string,
  //   part: 'subject' | 'verb' | 'object',
  //   value: string
  // ) => {
  //   const updatedEntries = entries.map((entry) =>
  //     entry.id === statementId
  //       ? { ...entry, atoms: { ...entry.atoms, [part]: value } }
  //       : entry
  //   );
  //   // Update only context
  //   setData({ type: 'SET_ENTRIES', payload: updatedEntries });
  // };

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

  // State for managing the visibility of the snoozed section
  const [isSnoozedQuestionsSectionExpanded, setIsSnoozedQuestionsSectionExpanded] = useState(false);
  
  const renderCategorySection = (catId: string, catLabel: string) => {
    // Don't render the snoozed category in the normal flow
    if (catId === 'snoozed') return null;
    
    const presetForCat = questionsByCategory[catId] || [];
    const statementsForCat = statementsByCategory[catId] || [];
    if (presetForCat.length === 0 && statementsForCat.length === 0) return null;

    // Normalize the category ID for consistent comparison
    const normalizedCatId = normalizeCategoryIdForGrouping(catId);
    
    // Get category color from the categories list
    const categoryObj = categoriesList.find(c => normalizeCategoryIdForGrouping(c.id) === normalizedCatId);
    const categoryColor = categoryObj ? 
      `bg-${categoryObj.id.toLowerCase()}-100 border-${categoryObj.id.toLowerCase()}-300` : 
      'bg-gray-100 border-gray-300';
    
    // Use the answered counts by category to determine if all questions are answered
    const { categoryCounts } = useAnsweredCountByCategory();
    const categoryStatus = categoryCounts[normalizedCatId] || { answered: 0, total: 0 };
    const isComplete = categoryStatus.total > 0 && categoryStatus.answered === categoryStatus.total;
    
    // Debug logging
    console.log(`Category: ${catId} (normalized: ${normalizedCatId})`);
    console.log(`Status: ${categoryStatus.answered}/${categoryStatus.total}`);
    console.log(`Complete: ${isComplete}`);
    
    return (
      <div key={catId} className='mb-8'>
        {/* Folder Tab Design */}
        <div className={`relative mb-1 z-10`}>
          <div 
            className={`inline-block px-4 py-2 rounded-t-lg ${isComplete ? 'bg-green-200 border-green-500' : categoryColor} border-t border-l border-r`}
          >
            <h3 className='text-lg font-semibold'>
              {formatCategoryName(catLabel)}
            </h3>
          </div>
        </div>
        
        {/* Folder Content */}
        <div className={`border rounded-tr-lg rounded-b-lg p-4 ${isComplete ? 'bg-white border-green-500' : 'bg-white border-gray-300'}`}>
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
                    onPartClick={handlePartClick}
                    onLocalSave={handleLocalSave}
                    onCancel={() => {
                      // If we have the original, restore it
                      if (originalEntries[statement.id]) {
                        // Restore the original entry from our backup
                        setData({
                          type: 'UPDATE_ENTRY',
                          payload: originalEntries[statement.id]
                        });
                        
                        // Remove from originalEntries
                        setOriginalEntries(prev => {
                          const newEntries = {...prev};
                          delete newEntries[statement.id];
                          return newEntries;
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
      </div>
    );
  };
  
  
  // Special renderer for the snoozed questions section
  const renderSnoozedQuestionsSection = () => {
    // Filter questions to get snoozed ones
    const snoozedQuestions = questions.filter(q => q.isSnoozed);
    if (snoozedQuestions.length === 0) return null;
    
    return (
      <div className='mb-8 mt-4'>
        {/* Folder Tab Design for Snoozed Questions */}
        <div className={`relative mb-1 z-10`}>
          <div 
            className={`inline-block px-4 py-2 rounded-t-lg bg-blue-100 border-blue-300 border-t border-l border-r cursor-pointer`}
            onClick={() => setIsSnoozedQuestionsSectionExpanded(!isSnoozedQuestionsSectionExpanded)}
          >
            <div className="flex items-center justify-between min-w-[200px]">
              <h3 className='text-lg font-semibold flex items-center text-blue-700'>
                <BellOff className='h-5 w-5 mr-2' />
                Snoozed Questions
              </h3>
              <div className='flex items-center'>
                <span className="mr-2 text-blue-700">({snoozedQuestions.length})</span>
                {isSnoozedQuestionsSectionExpanded ? (
                  <ChevronUp className='h-5 w-5 text-blue-600' />
                ) : (
                  <ChevronDown className='h-5 w-5 text-blue-600' />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Folder Content for Snoozed Questions */}
        {isSnoozedQuestionsSectionExpanded && (
          <div className="border rounded-tr-lg rounded-b-lg p-4 bg-white border-blue-300">
            <ul className='space-y-2'>
              {snoozedQuestions.map((question) => (
                <li key={`snoozed-${question.id}`}>
                  <QuestionCard
                    presetQuestion={question}
                    onSelect={() => {/* Disabled for snoozed questions */}}
                    onToggleSnooze={handleToggleQuestionSnooze}
                  />
                </li>
              ))}
            </ul>
          </div>
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

  // Helper function to find category name from ID
  const getCategoryName = (categoryId: string): string => {
    // First check if it's in our defined categories
    const category = definedCategories.find(c => 
      normalizeCategoryIdForGrouping(c.id) === normalizeCategoryIdForGrouping(categoryId)
    );
    
    if (category) {
      return category.name;
    }
    
    // Check for uncategorized variations
    if (['uncategorized', 'uncategorised'].includes(normalizeCategoryIdForGrouping(categoryId))) {
      return 'Uncategorized';
    }
    
    // If not found, return the ID with formatting
    return formatCategoryName(categoryId);
  };

  return (
    <>
      <div className='mt-8 bg-white rounded-xl shadow-lg p-6 w-full'>
        {/* Regular categories */}
        {definedCategories.map((cat) =>
          renderCategorySection(cat.id, cat.name)
        )}
        {extraCategoryIds.map((catId) => renderCategorySection(catId, getCategoryName(catId)))}
        
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
            // If we're in editing mode for this statement:
            if (editingStatementId === updatedStatement.id) {
              // Only update the UI representation without saving to backend
              // This allows the save button to detect changes and become active
              setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
            } else {
              // If we're not in edit mode, save directly when modal is closed
              setData({ type: 'UPDATE_ENTRY', payload: updatedStatement });
              // Also update backend
              updateEntry(updatedStatement);
            }
          }}
          onClose={() => setEditModalData(null)}
        />
      )}
    </>
  );
};

export default StatementList;
