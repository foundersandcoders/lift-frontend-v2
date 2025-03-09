import { Verb } from '../types/entries';
import nlp from 'compromise';
import verbData from '../data/verbs.json';

/**
 * Gets verb name by id, processed with compromise.
 * Converts to present tense and lowercase.
 */
const getVerbName = (verbId: string): string => {
  const found = (verbData.verbs as Verb[]).find((v) => v.id === verbId);
  if (found) {
    // Convert the verb to present tense and lowercase it.
    return nlp(found.name).verbs().toPresentTense().out('text').toLowerCase();
  }
  return verbId; // Fallback: return the id if not found.
};

export { getVerbName };
