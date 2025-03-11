'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// DISABLED FOR TESTING
// import * as LabelPrimitive from '@radix-ui/react-label';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

// Mock interfaces
type LabelProps = {
  className?: string;
  htmlFor?: string;
  children?: React.ReactNode;
  [key: string]: any;
} & VariantProps<typeof labelVariants>;

// Mock components
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
