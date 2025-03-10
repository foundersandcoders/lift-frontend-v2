import { useQuestions } from './useQuestions';
import { useEntries } from '../../statements/hooks/useEntries';

export function useAnsweredCount(): { answered: number; total: number } {
  const { questions } = useQuestions();
  const { data } = useEntries();

  // Count how many preset questions have been answered (i.e., they have a matching statement)
  const answeredCount = questions.filter((q) =>
    data.entries.some((s) => s.presetId === q.id)
  ).length;

  return { answered: answeredCount, total: questions.length };
}
