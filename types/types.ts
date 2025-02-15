export interface Action {
  creationDate: string;
  byDate: string;
  action: string;
}

export interface PreStatement {
  subject: string;
  verb: string;
  object: string;
  adverbial?: string;
  isPublic: boolean;
}
export interface Statement extends PreStatement {
  id: string;
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
