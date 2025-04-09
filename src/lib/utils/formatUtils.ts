import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditionally joining class names together using clsx and tailwind-merge.
 * This allows for dynamic class composition that works well with Tailwind CSS.
 * 
 * @param inputs Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a category name by replacing underscores with spaces and capitalizing the first letter of each word.
 * @param category - The category name to format.
 * @returns The formatted category name.
 */
export function formatCategoryName(category: string): string {
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}