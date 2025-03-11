'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// DISABLED FOR TESTING
// import * as PopoverPrimitive from '@radix-ui/react-popover';

// Mock interfaces and components
interface PopoverProps {
  children?: React.ReactNode;
}

interface PopoverTriggerProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface PopoverContentProps {
  children?: React.ReactNode;
  className?: string;
  align?: string;
  sideOffset?: number;
  [key: string]: any;
}

// Mock components
const Popover: React.FC<PopoverProps> = ({ children }) => <>{children}</>;
const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children }) => <>{children}</>;

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
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
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
