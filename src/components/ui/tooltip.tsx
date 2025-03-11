'use client';

import * as React from 'react';
// Commenting out to test if this is causing the useLayoutEffect error
// import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

// Creating mock components to replace Radix UI Tooltip
// This will disable all tooltips but will let us test if they're causing the error
type TooltipProviderProps = { children: React.ReactNode };
const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => <>{children}</>;

type TooltipProps = { children: React.ReactNode };
const Tooltip: React.FC<TooltipProps> = ({ children }) => <>{children}</>;

type TooltipTriggerProps = { children: React.ReactNode, asChild?: boolean };
const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => <>{children}</>;

type TooltipContentProps = { 
  children: React.ReactNode,
  className?: string, 
  sideOffset?: number,
  [key: string]: any
};
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('hidden', className)} {...props}>
      {children}
    </div>
  )
);
TooltipContent.displayName = 'TooltipContent';

// Commenting out the original implementation
// const TooltipProvider = TooltipPrimitive.Provider;
// const Tooltip = TooltipPrimitive.Root;
// const TooltipTrigger = TooltipPrimitive.Trigger;
// const TooltipContent = React.forwardRef<
//   React.ElementRef<typeof TooltipPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
// >(({ className, sideOffset = 4, ...props }, ref) => (
//   <TooltipPrimitive.Content
//     ref={ref}
//     sideOffset={sideOffset}
//     className={cn(
//       'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
//       className
//     )}
//     {...props}
//   />
// ));
// TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
