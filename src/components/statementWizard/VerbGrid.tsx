'use client';

import React from 'react';
import { Button } from '../ui/button';
import type { Verb, Category } from '../../../types/entries';
import { getContrastColor } from '../../../utils/colorUtils';
import { getVerbColor } from '../../../utils/categoryUtils';

interface VerbGridProps {
  verbs: Verb[];
  rootCategory: Category;
  selectedVerb: string;
  onVerbSelect: (verb: Verb) => void;
}

const VerbGrid: React.FC<VerbGridProps> = ({
  verbs,
  rootCategory,
  selectedVerb,
  onVerbSelect,
}) => {
  const sortedVerbs = [...verbs].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 overflow-auto'>
      {sortedVerbs.map((verb) => {
        const tileColor = getVerbColor(verb, rootCategory);
        const isSelected = verb.name === selectedVerb;
        return (
          <Button
            key={verb.name}
            onClick={() => onVerbSelect(verb)}
            variant={isSelected ? 'default' : 'outline'}
            className='flex items-center justify-center p-4 rounded-lg shadow-md'
            style={{
              backgroundColor: isSelected ? tileColor : 'transparent',
              color: isSelected ? getContrastColor(tileColor) : 'inherit',
              borderColor: tileColor,
            }}
          >
            <span className='font-medium'>{verb.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default VerbGrid;
