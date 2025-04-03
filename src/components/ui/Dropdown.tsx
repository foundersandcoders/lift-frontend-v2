import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleDropdownMenuProps {
  children: React.ReactNode;
}

interface SimpleDropdownMenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

interface SimpleDropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  align?: string;
}

interface SimpleDropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  title?: string;
}

interface SimpleDropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
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
          return React.cloneElement(child as React.ReactElement<SimpleDropdownMenuTriggerProps>, {
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent event bubbling
              setIsOpen(!isOpen);
            },
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
  onClick,
  ...props 
}) => {
  if (asChild && React.isValidElement(children)) {
    // Create a merged handler that combines the existing handler and our new one
    const mergedClickHandler = (e: React.MouseEvent) => {
      // Call the child's original onClick if it exists
      if (children.props.onClick) {
        children.props.onClick(e);
      }
      // Call our onClick handler
      if (onClick) {
        onClick(e);
      }
    };
    
    // Create a new props object with our merged handler
    const mergedProps = {
      ...props,
    };
    
    // Create a clone with a properly typed handler
    return React.cloneElement(
      children,
      {
        ...mergedProps,
        // Just use the child's props directly
        onClick: mergedClickHandler,
      } as React.HTMLAttributes<HTMLElement>
    );
  }
  
  // Otherwise, wrap the children in a div with the onClick handler
  return (
    <div {...props} onClick={onClick} className="cursor-pointer">
      {children}
    </div>
  );
};

// The dropdown content container
const SimpleDropdownMenuContent = React.forwardRef<HTMLDivElement, SimpleDropdownMenuContentProps>(
  ({ children, className, sideOffset = 4, ...props }, ref) => {
    // Use sideOffset for positioning
    const offsetStyles = {
      marginTop: `${sideOffset}px`
    };
    
    return (
      <div 
        ref={ref}
        className={cn(
          'absolute z-[99999] min-w-[10rem] overflow-hidden rounded-md border bg-white p-2 shadow-md',
          'top-full right-0',
          className
        )}
        style={offsetStyles}
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
  ({ children, className, onClick, ...props }, ref) => {
    // Create a parent div that contains a custom click handler
    return (
      <div
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center rounded-sm px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap',
          className
        )}
        onClick={(e) => {
          e.stopPropagation(); // Prevent bubbling
          
          // Call the original onClick handler if provided
          if (onClick) {
            onClick(e);
          }
        }}
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