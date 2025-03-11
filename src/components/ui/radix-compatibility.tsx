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

// Re-export with Radix-compatible names
// Custom Tooltip components compatible with Radix API
const Tooltip: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger: React.FC<{children: React.ReactNode, asChild?: boolean}> = ({ children }) => {
  return <>{children}</>;
};

const TooltipContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export {
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
  
  SimpleTooltipProvider as TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  
  SimpleLabel as Label,
};