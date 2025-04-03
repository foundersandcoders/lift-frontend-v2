import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  delayDuration?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  mobileInline?: boolean; // Display tooltip inline below element on mobile
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
  mobileInline = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Calculate position based on trigger element
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
    let top = 0;
    let left = 0;

    // Different positioning for mobile
    if (isMobile && side !== 'bottom') {
      // On mobile, prefer positioning below the element
      top = triggerRect.bottom + sideOffset;
      // Center horizontally but ensure it doesn't go off screen
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      
      // Make sure tooltip stays within screen bounds
      if (left < 10) left = 10;
      if (left + tooltipRect.width > windowWidth - 10) {
        left = windowWidth - tooltipRect.width - 10;
      }
    } else {
      // Desktop or explicit bottom positioning
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
      
      // Adjust if tooltip would go off screen
      if (left < 10) left = 10;
      if (left + tooltipRect.width > windowWidth - 10) {
        left = windowWidth - tooltipRect.width - 10;
      }
      
      // If tooltip would go off the top of the screen, position below instead
      if (top < 10) {
        top = triggerRect.bottom + sideOffset;
      }
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

  // Handle touch events for mobile
  const handleTouch = (event: React.TouchEvent) => {
    event.preventDefault();
    showTooltip();
    
    // Set a timeout to close the tooltip after 3 seconds on mobile
    if (isMobile) {
      setTimeout(() => {
        hideTooltip();
      }, 3000);
    }

    // Add a one-time click listener to close the tooltip when touching elsewhere
    document.addEventListener('touchstart', (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        hideTooltip();
      }
    }, { once: true });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // If we're on mobile and inline mode is enabled
  const isInlineMode = isMobile && mobileInline;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onTouchStart={handleTouch}
      >
        {children}
      </div>
      
      {/* Regular tooltip (desktop or mobile non-inline) */}
      {isVisible && !isInlineMode && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
            maxWidth: isMobile ? '250px' : 'auto',
            wordWrap: 'break-word',
          }}
          className={cn(
            'z-50 overflow-hidden rounded-md border bg-white shadow-md',
            isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            className
          )}
        >
          {content}
        </div>
      )}
      
      {/* Inline tooltip (mobile only) */}
      {isVisible && isInlineMode && (
        <div className="mt-1 p-2 bg-gray-100 rounded-md text-xs text-gray-700 border border-gray-200 max-w-[250px] break-words">
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