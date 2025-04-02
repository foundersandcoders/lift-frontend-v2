import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SimpleDialogContext } from './SimpleDialogContext';

interface SimpleDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface SimpleDialogContentProps {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
  onOpenAutoFocus?: (e: Event) => void;
  onEscapeKeyDown?: () => void;
  onPointerDownOutside?: () => void;
}

interface SimpleDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface SimpleDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SimpleDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const SimpleDialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const SimpleDialogOverlay: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className,
  onClick 
}) => {
  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        className
      )}
      onClick={onClick}
    />
  );
};

const SimpleDialogContent = React.forwardRef<HTMLDivElement, SimpleDialogContentProps>(
  ({ className, children, headerTitle, onOpenAutoFocus, ...props }, ref) => {
    // Always define the useEffect, but make its behavior conditional inside
    useEffect(() => {
      if (onOpenAutoFocus) {
        const handler = (e: Event) => {
          onOpenAutoFocus(e);
        };
        document.addEventListener('focus', handler, { once: true });
        return () => document.removeEventListener('focus', handler);
      }
      // Return empty cleanup function when onOpenAutoFocus is not provided
      return () => {};
    }, [onOpenAutoFocus]);

    // Stop click propagation to prevent closing the dialog when clicking content
    const handleContentClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 flex flex-col w-full translate-x-[-50%] translate-y-[-50%] border-0 bg-background p-0 shadow-lg duration-200',
          'max-w-[95vw] max-h-[90vh] sm:max-w-lg rounded-lg overflow-hidden',
          className
        )}
        onClick={handleContentClick}
        {...props}
      >
        {/* If there's a header title, add it as a styled header */}
        {headerTitle && (
          <div className="flex items-center justify-between bg-brand-pink p-2 sm:p-4 flex-shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-white">{headerTitle}</h2>
          </div>
        )}
        {/* Main content with scroll capability */}
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    );
  }
);
SimpleDialogContent.displayName = 'SimpleDialogContent';

const SimpleDialogClose: React.FC<{ children: React.ReactNode; className?: string; asChild?: boolean }> = ({ 
  children, 
  className,
}) => {
  return (
    <button className={cn('', className)}>
      {children}
    </button>
  );
};

const SimpleDialogTitle: React.FC<SimpleDialogTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  );
};

const SimpleDialogDescription: React.FC<SimpleDialogDescriptionProps> = ({ children, className }) => {
  return (
    <p className={cn('text-xs sm:text-sm text-muted-foreground mt-1 mb-2 sm:mb-3', className)}>
      {children}
    </p>
  );
};

// Context is now imported from separate file

const SimpleDialogTrigger: React.FC<SimpleDialogTriggerProps> = ({ children }) => {
  // Get the dialog context to control the dialog's open state
  const { onOpenChange } = React.useContext(SimpleDialogContext);
  
  // Create a clickable wrapper that opens the dialog
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('SimpleDialogTrigger: Opening dialog');
    onOpenChange(true);
  };
  
  // If asChild is true, we'd clone the child element and add an onClick handler
  // For simplicity, we'll just wrap the children in a div with an onClick
  return (
    <div onClick={handleClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  );
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({ 
  isOpen, 
  open,
  onOpenChange, 
  children, 
  className 
}) => {
  // Support both isOpen and open props for compatibility
  const isDialogOpen = open !== undefined ? open : isOpen !== undefined ? isOpen : false;
  
  // Handle ESC key press
  useEffect(() => {
    if (!isDialogOpen) return;
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDialogOpen, onOpenChange]);

  // Provide the dialog state to all children via context
  return (
    <SimpleDialogContext.Provider value={{ isOpen: isDialogOpen, onOpenChange }}>
      {isDialogOpen ? (
        <div className={cn('fixed inset-0 z-50', className)}>
          <SimpleDialogOverlay onClick={() => onOpenChange(false)} />
          {children}
        </div>
      ) : (
        // Even when dialog is closed, we need to render the trigger
        <>{children}</>
      )}
    </SimpleDialogContext.Provider>
  );
};

// For compatibility with existing code
const SimpleDialogHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className,
  children 
}) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
  >
    {children}
  </div>
);

const SimpleDialogFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
  >
    {children}
  </div>
);

export {
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
};