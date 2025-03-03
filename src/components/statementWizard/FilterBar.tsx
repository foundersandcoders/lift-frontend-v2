'use client';

import React from 'react';
import { Button } from '../ui/button';
import type { Category } from '../../../types/entries';
import { getContrastColor } from '../../../utils/colorUtils';

interface FilterBarProps {
  rootCategory: Category;
  currentCategory: Category | null;
  path: Category[];
  onSelectCategory: (cat: Category) => void;
  onBreadcrumbClick: (index: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  rootCategory,
  currentCategory,
  path,
  onSelectCategory,
  onBreadcrumbClick,
}) => {
  const topCategories = rootCategory.children ?? [];

  return (
    <div className='flex flex-col gap-2'>
      {/* Breadcrumbs Row */}
      <div className='flex items-center gap-2 px-4 py-2 border-b bg-gray-50 flex-wrap'>
        <span
          onClick={() => onBreadcrumbClick(-1)}
          className='cursor-pointer text-blue-600 hover:underline'
        >
          All
        </span>
        {path.map((cat, index) => (
          <React.Fragment key={cat.id}>
            <span className='text-gray-500'>/</span>
            <span
              onClick={() => onBreadcrumbClick(index)}
              className='cursor-pointer text-blue-600 hover:underline'
            >
              {cat.displayName}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Filter Bar Row using grid layout */}
      <div
        className='
          grid
          w-full
          gap-4
          px-4
          py-2
          border-b
          bg-gray-100
          grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
        '
      >
        {/* CASE 1: No filter selected → show top-level categories */}
        {!currentCategory &&
          topCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              variant='outline'
              className='flex items-center gap-1 text-sm'
              style={{
                backgroundColor: cat.color,
                color: getContrastColor(cat.color),
                borderColor: cat.color,
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.displayName}</span>
            </Button>
          ))}

        {/* CASE 2: A filter is selected and it has children */}
        {currentCategory &&
          currentCategory.children &&
          currentCategory.children.length > 0 &&
          currentCategory.children.map((child) => {
            // If there's exactly one child at this level, add col-span-full so it fills the row.
            const spanClass =
              currentCategory.children?.length === 1 ? 'col-span-full' : '';
            return (
              <Button
                key={child.id}
                onClick={() => onSelectCategory(child)}
                variant='outline'
                className={`flex items-center gap-1 text-sm ${spanClass}`}
                style={{
                  backgroundColor: child.color,
                  color: getContrastColor(child.color),
                  borderColor: child.color,
                }}
              >
                <span>{child.icon}</span>
                <span>{child.displayName}</span>
              </Button>
            );
          })}

        {/* CASE 3: A filter is selected and it's a leaf (no children) */}
        {/* CASE 3: A filter is selected and it's a leaf (no children) */}
        {currentCategory &&
          (!currentCategory.children ||
            currentCategory.children.length === 0) && (
            <div
              className='flex items-center gap-1 text-sm col-span-full cursor-default select-none rounded-lg shadow-md px-4 py-2'
              style={{
                backgroundColor: currentCategory.color,
                color: getContrastColor(currentCategory.color),
                border: `1px solid ${currentCategory.color}`,
              }}
            >
              <span>{currentCategory.icon}</span>
              <span>{currentCategory.displayName}</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default FilterBar;
