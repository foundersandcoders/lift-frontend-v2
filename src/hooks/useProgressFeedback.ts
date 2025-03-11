import { useMemo } from 'react';
import progressFeedback from '@/data/progressFeedback.json';

export function useProgressFeedback(percentage: number): string {
  return useMemo(() => {
    // Find the appropriate bracket for the given percentage
    const bracket = progressFeedback.feedbackBrackets.find(
      (bracket) => percentage >= bracket.range[0] && percentage <= bracket.range[1]
    );

    if (!bracket) {
      return "Keep reflecting on your journey.";
    }

    // Get a random message from the bracket
    const randomIndex = Math.floor(Math.random() * bracket.messages.length);
    return bracket.messages[randomIndex];
  }, [percentage]);
}