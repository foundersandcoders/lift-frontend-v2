/**
 * Help Center Module - Barrel file
 * 
 * This file serves as a centralized export point for all Help Center components and hooks.
 * It enables clean imports throughout the application by providing a single entry point
 * without requiring consumers to know the internal file structure.
 * 
 * Usage:
 * import { HelpProvider, HelpButton, useHelp } from '@/components/ui/helpCenter';
 */

export { default as HelpProvider } from './HelpProvider';
export { useHelp } from './hooks';
export { default as HelpButton } from './HelpButton';
export { default as HelpCenter } from './HelpCenter';
export { default as WelcomePanel } from './WelcomePanel';