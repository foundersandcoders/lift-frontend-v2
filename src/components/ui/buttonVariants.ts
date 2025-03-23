import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-brand-pink text-white shadow-sm hover:bg-brand-pink/90 transition-colors',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-pink-200 bg-white text-gray-700 hover:border-pink-300 transition-colors focus:border-pink-200 focus-visible:border-pink-200',
        outlineVerbs:
          'border-2 bg-white text-gray-700 hover:bg-brand-pink hover:border-pink-300 transition-colors',
        secondary:
          'bg-pink-100 text-brand-pink border border-pink-200  transition-colors',
        ghost: 'hover:bg-pink-50 hover:text-brand-pink transition-colors',
        link: 'text-brand-pink underline-offset-4 hover:underline',
        pink: 'rounded-full flex items-center gap-1.5 px-6 py-3 shadow-md bg-brand-pink text-white text-lg hover:bg-brand-darkPurple transition-colors',
        success:
          'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors',
        warning:
          'bg-amber-500 text-white shadow-sm hover:bg-amber-600 transition-colors',
        info: 'bg-blue-500 text-white shadow-sm hover:bg-blue-600 transition-colors',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 text-xs px-3 py-1',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        compact: 'h-8 px-3 py-1',
      },
      selected: {
        true: 'border-4 border-[var(--tile-color)] focus:ring-0 focus:border-[var(--tile-color)] focus-visible:ring-0',
        false: 'focus:ring-0 focus-visible:ring-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      selected: false,
    },
  }
);
