import React, { useMemo } from 'react';
import { Button } from '../ui/button';
import descriptorsData from '../../../data/descriptors.json';
import type { SetQuestion } from '../../../types/types';

interface SubjectTile {
  label: string;
  value: string;
}

interface SubjectTilesProps {
  username: string;
  activePresetQuestion?: SetQuestion;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const getSubjectTiles = (
  username: string,
  activePresetQuestion?: SetQuestion
): SubjectTile[] => {
  let descriptorOptions: string[] = [];
  // Use the descriptorCategory from the subject step or default to 'wellbeing'
  const descriptorCategory =
    activePresetQuestion?.steps?.subject?.descriptorCategory || 'wellbeing';
  const category = (
    descriptorsData as {
      descriptors: Array<{
        name: string;
        description: string;
        options: string[];
      }>;
    }
  ).descriptors.find((d) => d.name === descriptorCategory);
  if (category) {
    descriptorOptions = category.options;
  }
  return [
    { label: username, value: username },
    ...descriptorOptions.map((option) => ({
      label: `${username}'s ${option}`,
      value: `${username}'s ${option}`,
    })),
  ];
};

export const SubjectTiles: React.FC<SubjectTilesProps> = ({
  username,
  activePresetQuestion,
  selectedValue,
  onSelect,
}) => {
  const tiles = useMemo(
    () => getSubjectTiles(username, activePresetQuestion),
    [username, activePresetQuestion]
  );

  return (
    <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
      {tiles.map((tile) => (
        <Button
          key={tile.value}
          variant={selectedValue === tile.value ? 'default' : 'outline'}
          className={`h-auto py-4 px-6 text-left flex flex-col items-start space-y-1 transition-all ${
            tile.value === username ? 'bg-blue-50 hover:bg-blue-100' : ''
          }`}
          onClick={() => onSelect(tile.value)}
        >
          <span className='font-medium'>{tile.label}</span>
        </Button>
      ))}
    </div>
  );
};
