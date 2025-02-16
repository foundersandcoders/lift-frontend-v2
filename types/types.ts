export interface Action {
  id: string;
  creationDate: string;
  dueDate: string;
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

interface SetQuestionStep {
  question: string;
  preset: boolean;
  presetAnswer: string | null;
  allowDescriptors: boolean;
}

export interface SetQuestion {
  id: string;
  mainQuestion: string;
  steps: {
    who: SetQuestionStep;
    action: SetQuestionStep;
    what: SetQuestionStep;
    privacy: SetQuestionStep;
  };
}

export type Step = 'closed' | 'who' | 'action' | 'what' | 'privacy';
