import { createContext } from 'react';
import type { SetQuestion } from '../../types/types';

export interface QuestionsContextType {
  questions: SetQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<SetQuestion[]>>;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(
  undefined
);
