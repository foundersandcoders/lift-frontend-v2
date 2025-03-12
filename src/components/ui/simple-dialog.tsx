import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  onOpenAutoFocus?: (e: any) => void;
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
    if (onOpenAutoFocus) {
      // Prevent auto focus
      useEffect(() => {
        const handler = (e: FocusEvent) => {
          if (onOpenAutoFocus) onOpenAutoFocus(e);
        };
        document.addEventListener('focus', handler, { once: true });
        return () => document.removeEventListener('focus', handler);
      }, [onOpenAutoFocus]);
    }

    // Stop click propagation to prevent closing the dialog when clicking content
    const handleContentClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-0 bg-background p-0 shadow-lg duration-200',
          className
        )}
        onClick={handleContentClick}
        {...props}
      >
        {children}
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
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
};

// Context for communicating between Dialog and DialogTrigger
export const SimpleDialogContext = React.createContext<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpenChange: () => {},
});

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