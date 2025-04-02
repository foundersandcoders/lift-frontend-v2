'use client';

import React, { useState, useEffect } from 'react';
import type { Verb, Category } from '@/types/entries';
import verbData from '@/data/verbs.json';
import categoryStructure from '@/data/categoryStructure.json';
import FilterBar from './FilterBar';
import VerbGrid from './VerbGrid';
import { getAllDescendants } from '@/lib/utils/categoryUtils';

interface SentimentVerbPickerProps {
  selectedVerbId: string;
  onVerbSelect: (verb: Verb) => void;
}

const SentimentVerbPicker: React.FC<SentimentVerbPickerProps> = ({
  selectedVerbId,
  onVerbSelect,
}) => {
  // Use a navigation stack (path) to track filter levels.
  // An empty path means "All" is selected.
  const [path, setPath] = useState<Category[]>([]);
  const rootCategory = categoryStructure.root as Category;
  const currentCategory = path.length > 0 ? path[path.length - 1] : null;
  
  // State to track if we should show the filter bar based on screen size
  const [showFilterBar, setShowFilterBar] = useState(false);
  
  // Effect to handle screen size changes
  useEffect(() => {
    // Function to check if we're on a desktop/tablet
    const checkScreenSize = () => {
      // Use 768px (md breakpoint) as the threshold
      setShowFilterBar(window.innerWidth >= 768);
    };
    
    // Check initially
    checkScreenSize();
    
    // Add listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // When a category is selected, push it onto the path.
  const handleSelectCategory = (cat: Category) => {
    setPath([...path, cat]);
  };

  // Handler for breadcrumb clicks:
  // Clicking a breadcrumb sets the path to that level.
  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setPath([]);
    } else {
      setPath(path.slice(0, index + 1));
    }
  };

  // Filter verbs:
  // If no category is selected, show all verbs.
  // Otherwise, show verbs that have at least one category included in the union
  // of currentCategory's descendants.
  let allowedNames: string[] = [];
  if (currentCategory) {
    allowedNames = getAllDescendants(currentCategory);
  }
  const filteredVerbs = (verbData.verbs as Verb[]).filter((verb) => {
    if (!currentCategory) return true;
    return verb.categories.some((catName) => allowedNames.includes(catName));
  });

  return (
    <div className='flex flex-col h-full m-0'>
      {showFilterBar && (
        <div className="mb-3">
          <FilterBar
            rootCategory={rootCategory}
            currentCategory={currentCategory}
            path={path}
            onSelectCategory={handleSelectCategory}
            onBreadcrumbClick={handleBreadcrumbClick}
          />
        </div>
      )}
      <VerbGrid
        verbs={filteredVerbs}
        rootCategory={rootCategory}
        selectedVerbId={selectedVerbId}
        onVerbSelect={onVerbSelect}
      />
    </div>
  );
};

export default SentimentVerbPicker;
