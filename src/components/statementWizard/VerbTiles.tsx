import React from 'react';
import { Button } from '../ui/button';
import { verbData } from '../../../utils/verbUtils';
import { getContrastColor } from '../../../utils/colorUtils';

interface VerbTilesProps {
  selectedVerb: string;
  onSelect: (verb: string) => void;
}

export const VerbTiles: React.FC<VerbTilesProps> = ({
  selectedVerb,
  onSelect,
}) => {
  const sortedVerbs = [...verbData].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className='overflow-y-auto'>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2'>
        {sortedVerbs.map((verb, index) => (
          <Button
            key={`${verb.name}-${index}`}
            variant={selectedVerb === verb.name ? 'default' : 'outline'}
            className='h-auto py-2 px-3 text-left flex items-center justify-center transition-all text-sm'
            style={{
              backgroundColor:
                selectedVerb === verb.name ? verb.color : 'transparent',
              color:
                selectedVerb === verb.name
                  ? getContrastColor(verb.color)
                  : 'inherit',
              borderColor: verb.color,
            }}
            onClick={() => onSelect(verb.name)}
          >
            <span className='font-medium'>{verb.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
