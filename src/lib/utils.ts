import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
