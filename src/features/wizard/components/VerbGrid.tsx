'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import type { Verb, Category } from '@/types/entries';
import { getVerbColor } from '@/lib/utils/categoryUtils';
import { getContrastColor } from '@/lib/utils/colorUtils';
import { getVerbTextSizeClass } from '@/lib/utils/verbUtils';

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
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 p-2 border overflow-y-auto max-h-[35vh] verb-grid'>
      {sortedVerbs.map((verb) => {
        const tileColor = getVerbColor(verb, rootCategory);
        const isSelected = verb.id === selectedVerbId;
        const textSizeClass = getVerbTextSizeClass(verb.name);

        return (
          <Button
            key={verb.name}
            onClick={() => onVerbSelect(verb)}
            variant={'outlineVerbs'}
            selected={isSelected}
            className={`flex items-center justify-center rounded-lg shadow-md px-1 py-1 ${textSizeClass}`}
            style={
              {
                '--tile-color': tileColor,
                borderColor: tileColor,
                backgroundColor: isSelected ? tileColor : 'white',
                color: isSelected ? getContrastColor(tileColor) : 'black',
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
