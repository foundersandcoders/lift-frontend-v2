'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// DISABLED FOR TESTING
// import * as DialogPrimitive from '@radix-ui/react-dialog';
// interface CustomDialogContentProps
//   extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
//   headerTitle?: string;
// }

// Mock interfaces and components to replace Radix UI
interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface DialogPortalProps {
  children?: React.ReactNode;
}

interface DialogCloseProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

interface DialogOverlayProps {
  className?: string;
  [key: string]: any;
}

interface CustomDialogContentProps {
  className?: string;
  children?: React.ReactNode;
  headerTitle?: string;
  onOpenAutoFocus?: (e: any) => void;
  onEscapeKeyDown?: () => void;
  onPointerDownOutside?: () => void;
  [key: string]: any;
}

interface DialogTitleProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface DialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// Mock components
const Dialog: React.FC<DialogProps> = ({ children }) => <div className="mock-dialog">{children}</div>;
const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => <>{children}</>;
const DialogPortal: React.FC<DialogPortalProps> = ({ children }) => <>{children}</>;
const DialogClose: React.FC<DialogCloseProps> = ({ children }) => <>{children}</>;
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  (props, ref) => <div ref={ref} className="hidden" {...props} />
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<HTMLDivElement, CustomDialogContentProps>(
  ({ className, children, headerTitle, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn('fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2', className)} 
      {...props}
    >
      {headerTitle && (
        <div className='bg-brand-pink p-2 flex items-center justify-between sm:rounded-t-lg'>
          <div className='text-xl font-semibold text-white'>
            {headerTitle}
          </div>
          <button className='text-white' aria-label='Close'>
            <X size={24} />
          </button>
        </div>
      )}
      <div className={headerTitle ? 'p-4 bg-gray-50 sm:rounded-b-lg' : 'p-4'}>
        {children}
      </div>
    </div>
  )
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
