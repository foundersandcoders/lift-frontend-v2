import { Verb } from '../types/entries';
import nlp from 'compromise';
import verbData from '../data/verbs.json';

const sentimentCategories = {
  positive: [
    {
      name: 'Support & Assistance',
      subcategories: ['Support & Help', 'Guide & Encourage'],
    },
    {
      name: 'Growth & Development',
      subcategories: ['Personal Growth', 'Adaptation & Learning'],
    },
    {
      name: 'Innovation & Creation',
      subcategories: ['Creative Process', 'Implementation'],
    },
    {
      name: 'Collaboration & Connection',
      subcategories: ['Teamwork', 'Engagement'],
    },
    {
      name: 'Achievement & Leadership',
      subcategories: ['Leadership', 'Achievement'],
    },
  ],
  negative: [
    {
      name: 'Conflict & Opposition',
      subcategories: ['Direct Conflict', 'Resistance'],
    },
    {
      name: 'Obstruction & Hindrance',
      subcategories: ['Active Obstruction', 'Passive Hindrance'],
    },
    {
      name: 'Evasion & Avoidance',
      subcategories: ['Active Evasion', 'Passive Avoidance'],
    },
    {
      name: 'Criticism & Rejection',
      subcategories: ['Criticism', 'Rejection'],
    },
    {
      name: 'Neglect & Indifference',
      subcategories: ['Active Neglect', 'Passive Indifference'],
    },
    {
      name: 'Underperformance & Failure',
      subcategories: ['Underperformance', 'Failure'],
    },
  ],
};

const categorizeBySentiment = (verbs: Verb[]) => {
  const categorized: Record<string, Record<string, Record<string, Verb[]>>> = {
    positive: {},
    negative: {},
  };

  // Initialize categories and subcategories
  sentimentCategories.positive.forEach((category) => {
    categorized.positive[category.name] = {};
    category.subcategories.forEach((subcategory) => {
      categorized.positive[category.name][subcategory] = [];
    });
  });
  sentimentCategories.negative.forEach((category) => {
    categorized.negative[category.name] = {};
    category.subcategories.forEach((subcategory) => {
      categorized.negative[category.name][subcategory] = [];
    });
  });

  // Group verbs by their categories and subcategories
  verbs.forEach((verb) => {
    const sentiment = verb.categories.some((cat) =>
      sentimentCategories.positive.some((posCategory) =>
        posCategory.subcategories.includes(cat)
      )
    )
      ? 'positive'
      : 'negative';

    verb.categories.forEach((category) => {
      for (const mainCategory of sentimentCategories[sentiment]) {
        if (mainCategory.subcategories.includes(category)) {
          categorized[sentiment][mainCategory.name][category].push(verb);
          break;
        }
      }
    });
  });

  return categorized;
};

// Get verb name by id, processed with compromise.
const getVerbName = (verbId: string): string => {
  const found = (verbData.verbs as Verb[]).find((v) => v.id === verbId);
  if (found) {
    // Convert the verb to present tense and lowercase it.
    return nlp(found.name).verbs().toPresentTense().out('text').toLowerCase();
  }
  return verbId; // Fallback: return the id if not found.
};

export { getVerbName, categorizeBySentiment, sentimentCategories, type Verb };
