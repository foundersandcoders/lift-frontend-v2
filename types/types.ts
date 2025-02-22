export interface Action {
  id: string;
  creationDate: string;
  dueDate?: string;
  text: string;
}
export interface Statement {
  id: string;
  subject: string;
  verb: string;
  object: string;
  adverbial?: string;
  isPublic: boolean;
  actions?: Action[];
  category: string;
  presetId?: string;
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
  name: string;
  popularity: number;
  categories: string[];
  color: string;
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
  | 'privacy';
