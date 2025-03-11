import React, { useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import descriptorsData from '../../../data/descriptors.json';
import type { SetQuestion, DescriptorsData } from '../../../types/entries';

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
  const data = descriptorsData as DescriptorsData;
  const category = data.descriptors.find(
    (d) => d.name.toLowerCase() === categoryKey.toLowerCase()
  );
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
          variant={'outline'}
          selected={selectedValue === tile.value}
          className={`h-auto py-4 px-6 text-left flex flex-col items-start space-y-1  
      
          `}
          onClick={() => {
            // If this tile is already selected, trigger a double-click behavior
            if (selectedValue === tile.value) {
              // Find and click the OK button by its ID
              const okButton = document.getElementById('edit-statement-ok-button');
              if (okButton) {
                okButton.click();
              }
            } else {
              // Normal selection behavior
              onSelect(tile.value);
            }
          }}
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
