/**
 * Help Center Module - Barrel file
 * 
 * This file serves as a centralized export point for all Help Center components and hooks.
 * It enables clean imports throughout the application by providing a single entry point
 * without requiring consumers to know the internal file structure.
 * 
 * Usage:
 * import { HelpProvider, HelpButton, useHelp } from '@/features/help';
 */

export { HelpProvider } from './context/HelpProvider';
export { useHelp } from './hooks';
export { HelpButton, HelpCenter, WelcomePanel } from './components';