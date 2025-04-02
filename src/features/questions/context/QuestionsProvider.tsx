import React, { useState, useEffect } from 'react';
import { QuestionsContext, QuestionsContextType } from './QuestionsContext';
import setQuestionsData from '@/data/setQuestions.json';
import type { SetQuestion } from '@/types/entries';

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<SetQuestion[]>([]);

  useEffect(() => {
    // Load questions from JSON (later replace with API call if needed)
    setQuestions(setQuestionsData.setQuestions);
  }, []);

  // Now explicitly annotate the provider value with QuestionsContextType
  const value: QuestionsContextType = { questions, setQuestions };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
