import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleDropdownMenuProps {
  children: React.ReactNode;
}

interface SimpleDropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface SimpleDropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  [key: string]: any;
}

interface SimpleDropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface SimpleDropdownMenuSeparatorProps {
  className?: string;
  [key: string]: any;
}

// The root dropdown component
const SimpleDropdownMenu: React.FC<SimpleDropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Pass the open state and toggle function to the children
        if (child.type === SimpleDropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setIsOpen(!isOpen),
          });
        }

        if (child.type === SimpleDropdownMenuContent) {
          return isOpen ? child : null;
        }

        return child;
      })}
    </div>
  );
};

// The trigger button
const SimpleDropdownMenuTrigger: React.FC<SimpleDropdownMenuTriggerProps> = ({ 
  children, 
  asChild,
  ...props 
}) => {
  return (
    <div {...props} className="cursor-pointer">
      {children}
    </div>
  );
};

// The dropdown content container
const SimpleDropdownMenuContent = React.forwardRef<HTMLDivElement, SimpleDropdownMenuContentProps>(
  ({ children, className, sideOffset = 4, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-2 shadow-md',
          'top-full right-0 mt-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SimpleDropdownMenuContent.displayName = 'SimpleDropdownMenuContent';

// Individual dropdown items
const SimpleDropdownMenuItem = React.forwardRef<HTMLDivElement, SimpleDropdownMenuItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center rounded-sm px-2 py-1 text-sm text-gray-700 hover:bg-gray-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SimpleDropdownMenuItem.displayName = 'SimpleDropdownMenuItem';

// Separator line
const SimpleDropdownMenuSeparator = React.forwardRef<HTMLDivElement, SimpleDropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('my-1 h-px bg-gray-200', className)}
        {...props}
      />
    );
  }
);
SimpleDropdownMenuSeparator.displayName = 'SimpleDropdownMenuSeparator';

export {
  SimpleDropdownMenu,
  SimpleDropdownMenuTrigger,
  SimpleDropdownMenuContent,
  SimpleDropdownMenuItem,
  SimpleDropdownMenuSeparator,
};