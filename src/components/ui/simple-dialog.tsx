import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleDialogProps {
  isOpen: boolean;
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

const SimpleDialogOverlay: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        className
      )} 
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

    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-0 bg-background p-0 shadow-lg duration-200',
          className
        )}
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

const SimpleDialogTrigger: React.FC<SimpleDialogTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

const SimpleDialog: React.FC<SimpleDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  children, 
  className 
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <div className={cn('', className)}>
      {children}
    </div>
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