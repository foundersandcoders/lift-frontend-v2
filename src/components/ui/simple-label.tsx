import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

interface SimpleLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  children: React.ReactNode;
}

const SimpleLabel = React.forwardRef<HTMLLabelElement, SimpleLabelProps>(
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

SimpleLabel.displayName = 'SimpleLabel';

export { SimpleLabel };