'use client';

import React from 'react';
// import { Button } from '../ui/button';
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
    <div className='flex flex-col border rounded-md '>
      {/* Header with integrated filters label and breadcrumbs */}
      <div className='px-3 py-1.5 bg-gray-100 border-b flex items-center'>
        <div className='flex items-center flex-wrap'>
          <h3 className='text-xs font-medium text-gray-700 mr-1'>Filters:</h3>

          <span
            onClick={() => onBreadcrumbClick(-1)}
            className={`cursor-pointer px-2 py-0.5 rounded text-xs font-medium transition-colors
              ${
                path.length === 0
                  ? 'bg-brand-pink text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            All
          </span>

          {path.map((cat, index) => (
            <React.Fragment key={cat.id}>
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='text-gray-400 mx-0.5'
              >
                <path
                  d='M9 6L15 12L9 18'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>

              <span
                onClick={() => onBreadcrumbClick(index)}
                className='cursor-pointer px-1.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center'
                style={{
                  backgroundColor:
                    index === path.length - 1 ? cat.color : undefined,
                  color:
                    index === path.length - 1
                      ? getContrastColor(cat.color)
                      : 'inherit',
                }}
              >
                {cat.displayName}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Categories Grid/Flex Layout */}
      <div className='bg-gray-50 px-3 py-1 flex-1'>
        {/* CASE 1: No filter selected → show top-level categories in a grid */}
        {!currentCategory && (
          <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 justify-items-center'>
            {topCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className='flex flex-col items-center justify-center gap-1 p-1.5 rounded hover:bg-gray-100 transition-colors text-center w-full max-w-[90px]'
                style={{
                  color: getContrastColor(cat.color),
                }}
              >
                <div
                  className='w-6 h-6 flex items-center justify-center rounded-sm'
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon || '•'}
                </div>
                <span className='text-xs font-medium text-gray-700 line-clamp-1'>
                  {cat.displayName}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* CASE 2: A filter is selected → show its children in a grid */}
        {currentCategory &&
          currentCategory.children &&
          currentCategory.children.length > 0 && (
            <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 justify-items-center'>
              {currentCategory.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelectCategory(child)}
                  className='flex flex-col items-center justify-center gap-1 p-1.5 rounded hover:bg-gray-100 transition-colors text-center w-full max-w-[90px]'
                  style={{
                    color: getContrastColor(child.color),
                  }}
                >
                  <div
                    className='w-6 h-6 flex items-center justify-center rounded-sm'
                    style={{ backgroundColor: child.color }}
                  >
                    {child.icon || '•'}
                  </div>
                  <span className='text-xs font-medium text-gray-700 line-clamp-1'>
                    {child.displayName}
                  </span>
                </button>
              ))}
            </div>
          )}

        {/* CASE 3: A filter is selected but has no children */}
        {currentCategory &&
          (!currentCategory.children ||
            currentCategory.children.length === 0) && (
            <div className='flex items-center justify-center py-1 text-xs text-gray-500'>
              No subcategories
            </div>
          )}
      </div>
    </div>
  );
};

export default FilterBar;
