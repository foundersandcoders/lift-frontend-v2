import { useQuestions } from './useQuestions';
import { useStatements } from './useStatements';

export function useAnsweredCount(): { answered: number; total: number } {
  const { questions } = useQuestions();
  const { data } = useStatements();

  // Count how many preset questions have been answered (i.e., they have a matching statement)
  const answeredCount = questions.filter((q) =>
    data.statements.some((s) => s.presetId === q.id)
  ).length;

  return { answered: answeredCount, total: questions.length };
}
