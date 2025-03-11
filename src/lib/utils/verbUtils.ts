import { Verb } from '../../types/entries';
import nlp from 'compromise';
import verbData from '../../data/verbs.json';

/**
 * Gets verb name by id, processed with compromise.
 * Converts to present tense and lowercase.
 * Uses the presentTenseForm property if available.
 */
const getVerbName = (verbId: string): string => {
  const found = (verbData.verbs as Verb[]).find((v) => v.id === verbId);
  if (found) {
    // If the verb has a specified presentTenseForm, use it
    if (found.presentTenseForm) {
      return found.presentTenseForm;
    }
    
    // Convert the verb to present tense and lowercase it.
    const processedVerb = nlp(found.name).verbs().toPresentTense().out('text').toLowerCase();
    
    // If the processed verb is empty, return the original verb name in lowercase
    if (!processedVerb.trim()) {
      return found.name.toLowerCase();
    }
    
    return processedVerb;
  }
  return verbId; // Fallback: return the id if not found.
};

export { getVerbName };
