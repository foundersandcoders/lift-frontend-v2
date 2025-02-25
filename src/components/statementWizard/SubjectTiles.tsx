import React from 'react';
// import { useMemo } from 'react';
import { Button } from '../ui/button';
import descriptorsData from '../../../data/descriptors.json';
import type { SetQuestion, DescriptorsData } from '../../../types/statements';

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

  // Use the top-level category from the preset question, defaulting to 'wellbeing'
  const categoryKey = activePresetQuestion?.category || 'wellbeing';
  console.log('1 Preset question category:', categoryKey);
  const data = descriptorsData as DescriptorsData;
  const category = data.descriptors.find(
    (d) => d.name.toLowerCase() === categoryKey.toLowerCase()
  );
  console.log('2 Found descriptor category:', category);
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
  // const tiles = useMemo(
  //   () => getSubjectTiles(username, activePresetQuestion),
  //   [username, activePresetQuestion]
  // );
  const tiles = getSubjectTiles(username, activePresetQuestion);

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
