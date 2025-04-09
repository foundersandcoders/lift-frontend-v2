import { Entry, Verb } from '../../types/entries';
import nlp from 'compromise';
import verbData from '../../data/verbs.json';

/**
 * Gets verb name by id, processed with compromise.
 * Converts to present tense and lowercase.
 * Uses the presentTenseForm property if available.
 */
const getVerbName = (verbId: string, subjectIsI = false): string => {
  const found = (verbData.verbs as Verb[]).find((v) => v.id === verbId);
  if (found) {
    // If the verb has a specified presentTenseForm, use it
    if (found.presentTenseForm) {
      return found.presentTenseForm;
    }
    
    if (subjectIsI) {
      // If subject is "I", use the infinitive form
      return found.name.toLowerCase();
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

/**
 * Formats a statement for email display, replacing "I" with username
 * and ensuring proper verb conjugation.
 * 
 * @param entry The statement entry to format
 * @param username The user's real name to display instead of "I"
 * @returns Formatted statement text for email display
 */
const getEmailFormattedStatement = (entry: Entry, username: string): string => {
  // Get verb in present tense form (force 3rd person present tense)
  const verbForm = getVerbName(entry.atoms.verb, false);
  
  // Replace "I" with username
  let formattedSubject = entry.atoms.subject;
  
  if (formattedSubject === 'I') {
    formattedSubject = username;
  } 
  // If subject starts with "My", replace with "{username}'s"
  else if (formattedSubject.startsWith('My ')) {
    formattedSubject = `${username}'s ${formattedSubject.substring(3)}`;
  }
  
  // Return the complete formatted statement
  return `${formattedSubject} ${verbForm} ${entry.atoms.object}`;
};

/**
 * Determines appropriate Tailwind CSS text size class based on the length of verb text.
 * Used to ensure verb text fits properly in buttons without overflowing.
 * 
 * @param verbText The verb text to evaluate
 * @returns The appropriate Tailwind CSS class for text size
 */
const getVerbTextSizeClass = (verbText: string): string => {
  if (verbText.length >= 11) {
    return 'text-xs'; // Small for longer texts
  } else {
    return 'text-sm'; // Default size
  }
};

export { getVerbName, getEmailFormattedStatement, getVerbTextSizeClass };
