import React, { useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import descriptorsData from '../../../data/descriptors.json';
import type { SetQuestion, DescriptorsData } from '../../../types/entries';

interface SubjectTile {
  label: string;
  value: string;
}

interface SubjectTilesProps {
  username: string;
  activePresetQuestion?: SetQuestion;
  selectedCategory?: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const getSubjectTiles = (
  username: string,
  activePresetQuestion?: SetQuestion,
  selectedCategory?: string
): SubjectTile[] => {
  let descriptorOptions: string[] = [];

  // Use the selected category if available, or the top-level category from the preset question
  // defaulting to 'wellbeing' if neither is available
  const categoryKey = selectedCategory || activePresetQuestion?.category || 'wellbeing';
  const data = descriptorsData as DescriptorsData;
  const category = data.descriptors.find(
    (d) => d.name.toLowerCase() === categoryKey.toLowerCase()
  );
  if (category) {
    descriptorOptions = category.options;
  }
  return [
    { label: "I", value: "I" },
    ...descriptorOptions.map((option) => ({
      label: `My ${option}`,
      value: `My ${option}`,
    })),
  ];
};

export const SubjectTiles: React.FC<SubjectTilesProps> = ({
  username,
  activePresetQuestion,
  selectedCategory,
  selectedValue,
  onSelect,
}) => {
  const tiles = useMemo(
    () => getSubjectTiles(username, activePresetQuestion, selectedCategory),
    [username, activePresetQuestion, selectedCategory]
  );

  return (
    <div className='grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-2'>
      {tiles.map((tile) => (
        <Button
          key={tile.value}
          variant={'outline'}
          selected={selectedValue === tile.value}
          className={`h-auto py-2 px-2 text-left flex flex-col items-start space-y-1  
      
          `}
          onClick={() => onSelect(tile.value)}
          style={
            {
              // Set the CSS variable to the subject selector color. This is used on buttonVariants.ts
              '--tile-color': 'var(--subject-selector)',
            } as React.CSSProperties
          }
        >
          <span className='font-medium'>{tile.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default SubjectTiles;
