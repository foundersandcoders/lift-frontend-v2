'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// DISABLED FOR TESTING
// import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

// Mock interfaces and components
interface DropdownMenuProps {
  children?: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children?: React.ReactNode;
  className?: string;
  sideOffset?: number;
  [key: string]: any;
}

interface DropdownMenuItemProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface DropdownMenuSeparatorProps {
  className?: string;
  [key: string]: any;
}

// Mock components
const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => <>{children}</>;
const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => <>{children}</>;

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
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
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
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
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn('hidden', className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
