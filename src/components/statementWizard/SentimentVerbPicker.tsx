'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import verbData from '../../../data/verbs.json';
import categoryStructure from '../../../data/categoryStructure.json';
import type { Verb, Category } from '../../../types/entries';
import { getContrastColor } from '../../../utils/colorUtils';

/**
 * findCategoryByName:
 *   Recursively searches the category tree for a node matching the given "name".
 */
function findCategoryByName(root: Category, name: string): Category | null {
  if (root.name === name) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findCategoryByName(child, name);
      if (found) return found;
    }
  }
  return null;
}

/**
 * getAllDescendants:
 *   Returns an array of all category names under "node" (including the node's own).
 */
function getAllDescendants(node: Category): string[] {
  const result: string[] = [node.name];
  if (node.children) {
    for (const child of node.children) {
      result.push(...getAllDescendants(child));
    }
  }
  return result;
}

/**
 * getVerbColor:
 *   For a given verb, returns the color of the first matching category in the entire tree.
 *   If no match is found, returns 'transparent'.
 */
function getVerbColor(verb: Verb, root: Category): string {
  for (const catName of verb.categories) {
    const cat = findCategoryByName(root, catName);
    if (cat) {
      return cat.color;
    }
  }
  return 'transparent';
}

interface SentimentVerbPickerProps {
  selectedVerb: string;
  onVerbSelect: (verb: Verb) => void;
}

const SentimentVerbPicker: React.FC<SentimentVerbPickerProps> = ({
  selectedVerb,
  onVerbSelect,
}) => {
  // Root of your category structure
  const rootCategory = categoryStructure.root as Category;

  // If currentCategory is null => "All" is selected (no filter).
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // ---------------------------------
  // FILTERING LOGIC
  // ---------------------------------
  /**
   * If no category is selected => show all verbs.
   * Otherwise => gather the union of the current category's descendants.
   */
  let allowedNames: string[] = [];
  if (currentCategory) {
    allowedNames = getAllDescendants(currentCategory);
  }

  const filteredVerbs = (verbData.verbs as Verb[]).filter((verb) => {
    // "All" => no filtering
    if (!currentCategory) return true;
    // Otherwise => any intersection with the category's descendant names
    return verb.categories.some((catName) => allowedNames.includes(catName));
  });

  // ---------------------------------
  // FILTER BAR
  // ---------------------------------
  /**
   * Layout logic:
   * - If no category => we show [All (highlighted)] + top-level children of root
   * - If a category has children => show [Back Icon] + that category's children
   * - If a category is a leaf => show [Back Icon] + leaf name
   */
  function renderFilterBar() {
    const topLevelChildren = rootCategory.children ?? [];
    const isAllSelected = !currentCategory;
    const hasChildren =
      currentCategory?.children && currentCategory.children.length > 0;

    return (
      <div className='flex items-center gap-4 px-4 py-2 border-b bg-gray-100 overflow-x-auto'>
        {/* CASE 1: No category => show "All" + top-level categories */}
        {isAllSelected && (
          <>
            <Button variant='default' className='text-sm'>
              All
            </Button>
            {topLevelChildren.map((cat) => (
              <Button
                key={cat.id}
                variant='outline'
                className='flex items-center gap-1 text-sm'
                style={{
                  backgroundColor: cat.color,
                  color: getContrastColor(cat.color),
                  borderColor: cat.color,
                }}
                onClick={() => setCurrentCategory(cat)}
              >
                <span>{cat.icon}</span>
                <span>{cat.displayName}</span>
              </Button>
            ))}
          </>
        )}

        {/* CASE 2: A category with children => show [Back] + child categories */}
        {!isAllSelected && hasChildren && currentCategory && (
          <>
            <Button
              variant='ghost'
              className='p-2'
              onClick={() => setCurrentCategory(null)}
            >
              <ChevronLeft size={24} />
            </Button>
            {currentCategory.children.map((child) => (
              <Button
                key={child.id}
                variant='outline'
                className='flex items-center gap-1 text-sm'
                style={{
                  backgroundColor: child.color,
                  color: getContrastColor(child.color),
                  borderColor: child.color,
                }}
                onClick={() => setCurrentCategory(child)}
              >
                <span>{child.icon}</span>
                <span>{child.displayName}</span>
              </Button>
            ))}
          </>
        )}

        {/* CASE 3: A leaf category => show [Back] + the leaf's name */}
        {!isAllSelected && !hasChildren && currentCategory && (
          <>
            <Button
              variant='ghost'
              className='p-2'
              onClick={() => setCurrentCategory(null)}
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant='default'
              className='flex items-center gap-1 text-sm'
              style={{
                backgroundColor: currentCategory.color,
                color: getContrastColor(currentCategory.color),
                borderColor: currentCategory.color,
              }}
            >
              <span>{currentCategory.icon}</span>
              <span>{currentCategory.displayName}</span>
            </Button>
          </>
        )}
      </div>
    );
  }

  // ---------------------------------
  // VERB GRID
  // ---------------------------------
  function renderVerbGrid() {
    return (
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 overflow-auto'>
        {filteredVerbs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((verb) => {
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
  }

  return (
    <div className='flex flex-col h-full'>
      {renderFilterBar()}
      {renderVerbGrid()}
    </div>
  );
};

export default SentimentVerbPicker;
