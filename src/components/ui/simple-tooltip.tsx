import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

// Simple provider that doesn't actually do anything
const SimpleTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Tooltip component that shows/hides content on hover
const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  children,
  content,
  className,
  delayDuration = 300,
  side = 'top',
  sideOffset = 4,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate position based on trigger element
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - sideOffset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + sideOffset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - sideOffset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + sideOffset;
        break;
    }

    // Adjust for scroll
    top += window.scrollY;
    left += window.scrollX;

    setPosition({ top, left });
  };

  // Show tooltip with delay
  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delayDuration);
  };

  // Hide tooltip immediately
  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
          }}
          className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            className
          )}
        >
          {content}
        </div>
      )}
    </>
  );
};

// For API compatibility with component structure
const SimpleTooltipTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

const SimpleTooltipContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={cn('', className)}>{children}</div>;
};

export {
  SimpleTooltip,
  SimpleTooltipProvider,
  SimpleTooltipTrigger,
  SimpleTooltipContent,
};