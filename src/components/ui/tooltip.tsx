'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// DISABLED FOR TESTING
// import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// Mock interfaces and components to replace Radix UI
interface TooltipProviderProps {
  children?: React.ReactNode;
}

interface TooltipProps {
  children?: React.ReactNode;
}

interface TooltipTriggerProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps { 
  children?: React.ReactNode;
  className?: string; 
  sideOffset?: number;
  [key: string]: any;
}

// Mock components
const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => <>{children}</>;
const Tooltip: React.FC<TooltipProps> = ({ children }) => <>{children}</>;
const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => <>{children}</>;

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('hidden', className)} 
      {...props}
    >
      {children}
    </div>
  )
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
