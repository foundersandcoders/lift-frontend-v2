import { useStatements } from './useStatements';

export function useAnsweredCount(): number {
  const { data } = useStatements();
  return data.statements.filter((s) => s.presetId).length;
}
