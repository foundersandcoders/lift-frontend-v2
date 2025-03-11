import { useQuestions } from './useQuestions';
import { useEntries } from '../../statements/hooks/useEntries';
import type { SetQuestion } from '@/types/entries';

export function useAnsweredCount(): { answered: number; total: number } {
  const { questions } = useQuestions();
  const { data } = useEntries();

  // Count how many preset questions have been answered (i.e., they have a matching statement)
  const answeredCount = questions.filter((q) =>
    data.entries.some((s) => s.presetId === q.id)
  ).length;

  return { answered: answeredCount, total: questions.length };
}

export function useAnsweredCountByCategory(): { 
  categoryCounts: Record<string, { answered: number; total: number }>,
  totalAnswered: number;
  totalQuestions: number;
} {
  const { questions } = useQuestions();
  const { data } = useEntries();
  
  // Helper function to normalize category IDs (copied from StatementList)
  const normalizeCategoryId = (id: string): string => {
    // Convert to lowercase and handle special cases
    const normalized = id ? id.toLowerCase() : '';
    
    // Handle variations of "uncategorized"
    if (['uncategorized', 'uncategorised'].includes(normalized)) {
      return 'uncategorized';
    }
    
    return normalized;
  };
  
  // Group questions by normalized category
  const questionsByCategory = questions.reduce<Record<string, SetQuestion[]>>((acc, question) => {
    const categoryId = normalizeCategoryId(question.category || 'uncategorized');
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(question);
    return acc;
  }, {});
  
  // Count answered questions per category
  const categoryCounts = Object.entries(questionsByCategory).reduce<
    Record<string, { answered: number; total: number }>
  >((acc, [categoryId, categoryQuestions]) => {
    const answeredCount = categoryQuestions.filter(q => 
      data.entries.some(s => s.presetId === q.id)
    ).length;
    
    acc[categoryId] = {
      answered: answeredCount,
      total: categoryQuestions.length
    };
    return acc;
  }, {});
  
  // Calculate totals
  const totalAnswered = Object.values(categoryCounts).reduce(
    (sum, { answered }) => sum + answered, 0
  );
  const totalQuestions = Object.values(categoryCounts).reduce(
    (sum, { total }) => sum + total, 0
  );
  
  return { 
    categoryCounts,
    totalAnswered,
    totalQuestions
  };
}
