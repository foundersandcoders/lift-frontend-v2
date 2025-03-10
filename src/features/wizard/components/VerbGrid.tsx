'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { Verb, Category } from '@/types/entries';
import { getContrastColor } from '@/lib/utils/colorUtils';
import { getVerbColor } from '@/lib/utils/categoryUtils';

interface VerbGridProps {
  verbs: Verb[];
  rootCategory: Category;
  selectedVerbId: string;
  onVerbSelect: (verb: Verb) => void;
}

const VerbGrid: React.FC<VerbGridProps> = ({
  verbs,
  rootCategory,
  selectedVerbId,
  onVerbSelect,
}) => {
  const sortedVerbs = [...verbs].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 overflow-auto border'>
      {sortedVerbs.map((verb) => {
        const tileColor = getVerbColor(verb, rootCategory);

        const isSelected = verb.id === selectedVerbId;
        return (
          <Button
            key={verb.name}
            onClick={() => onVerbSelect(verb)}
            variant={'outlineVerbs'}
            selected={isSelected}
            className='flex items-center justify-center p-4 rounded-lg shadow-md'
            style={
              {
                '--tile-color': tileColor,
                color: isSelected ? getContrastColor(tileColor) : 'inherit',
                borderColor: tileColor,
              } as React.CSSProperties
            }
          >
            <span className='font-medium'>{verb.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default VerbGrid;
