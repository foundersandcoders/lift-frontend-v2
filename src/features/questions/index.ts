/**
 * Questions Feature Module
 * 
 * Centralizes questions-related functionality including context,
 * providers, hooks, and components.
 */

// Re-export context and provider
export { QuestionsContext } from './context/QuestionsContext';
export { QuestionsProvider } from './context/QuestionsProvider';

// Re-export hooks
export { useQuestions } from './hooks/useQuestions';
export { useAnsweredCount } from './hooks/useAnsweredCount';