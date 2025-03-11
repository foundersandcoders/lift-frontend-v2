export interface Atoms {
  subject: string;
  verb: string;
  object: string;
  adverbial?: string[];
}

export interface Action {
  id: string;
  creationDate: string;
  byDate: string;
  action: string;
  completed: boolean;
}

export interface Entry {
  id: string;
  input: string; // The full statement as a single string (headline)
  isPublic: boolean;
  atoms: Atoms; // Nested grammatical components
  actions?: Action[];
  category: string;
  presetId?: string;
  isResolved?: boolean;
  _needsScroll?: boolean; // Flag to indicate if this entry needs to be scrolled into view
  _updateTimestamp?: number; // Optional timestamp for tracking updates
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  children?: Category[];
}

export interface Verb {
  id: string;
  name: string;
  popularity: number;
  categories: string[];
  color: string;
  presentTenseForm?: string;  // Optional field for verbs that need explicit present tense form
}

export interface SubjectData {
  subject: string;
  descriptors: string[];
}

export interface SetQuestionStep {
  question: string;
  preset: boolean;
  presetAnswer: string | null;
  allowDescriptors?: boolean;
  descriptorCategory?: string;
  allowedVerbs?: string[];
}

export interface SetQuestion {
  id: string;
  mainQuestion: string;
  category?: string;
  isSnoozed?: boolean;
  originalCategory?: string; // Store the original category when snoozed
  steps: {
    subject: SetQuestionStep;
    verb: SetQuestionStep;
    object: SetQuestionStep;
    category?: SetQuestionStep;
    privacy: SetQuestionStep;
  };
}

export interface SetQuestionsData {
  setQuestions: SetQuestion[];
}

export interface Descriptor {
  name: string;
  description: string;
  options: string[];
}

export interface DescriptorsData {
  descriptors: Descriptor[];
}

export type Step =
  | 'closed'
  | 'subject'
  | 'verb'
  | 'object'
  | 'category'
  | 'privacy'
  | 'complement';
