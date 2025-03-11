import React, { useState } from 'react';

// Import our simple components
import {
  SimpleDialog,
  SimpleDialogTrigger,
  SimpleDialogContent,
  SimpleDialogHeader,
  SimpleDialogFooter,
  SimpleDialogTitle,
  SimpleDialogDescription,
  SimpleDialogClose,
  SimpleDialogOverlay,
  SimpleDialogPortal
} from './simple-dialog';

import {
  SimpleTooltipProvider,
} from './simple-tooltip';

import { SimpleLabel } from './simple-label';
import { Slot } from './simple-slot';

import {
  SimpleDropdownMenu,
  SimpleDropdownMenuTrigger,
  SimpleDropdownMenuContent,
  SimpleDropdownMenuItem,
  SimpleDropdownMenuSeparator,
} from './simple-dropdown';

// Create compatibility layer
interface DialogRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Create a Dialog Root that has the same API as Radix's
const Dialog: React.FC<DialogRootProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };
  
  return (
    <SimpleDialog isOpen={isOpen} onOpenChange={handleOpenChange} className="">
      {children}
    </SimpleDialog>
  );
};

// Simple Popover implementation
const Popover: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};

const PopoverTrigger: React.FC<{children: React.ReactNode, asChild?: boolean}> = ({ children }) => {
  return <>{children}</>;
};

const PopoverContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// Simple Tooltip implementation
const Tooltip: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger: React.FC<{children: React.ReactNode, asChild?: boolean}> = ({ children }) => {
  return <>{children}</>;
};

const TooltipContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// Export all components with Radix-compatible names
export {
  // Dialog components
  Dialog,
  SimpleDialogTrigger as DialogTrigger,
  SimpleDialogContent as DialogContent,
  SimpleDialogHeader as DialogHeader,
  SimpleDialogFooter as DialogFooter,
  SimpleDialogTitle as DialogTitle,
  SimpleDialogDescription as DialogDescription,
  SimpleDialogClose as DialogClose,
  SimpleDialogOverlay as DialogOverlay,
  SimpleDialogPortal as DialogPortal,
  
  // Tooltip components
  SimpleTooltipProvider as TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  
  // Popover components
  Popover,
  PopoverTrigger,
  PopoverContent,
  
  // Dropdown menu components
  SimpleDropdownMenu as DropdownMenu,
  SimpleDropdownMenuTrigger as DropdownMenuTrigger,
  SimpleDropdownMenuContent as DropdownMenuContent,
  SimpleDropdownMenuItem as DropdownMenuItem,
  SimpleDropdownMenuSeparator as DropdownMenuSeparator,
  
  // Other components
  SimpleLabel as Label,
  Slot,
};