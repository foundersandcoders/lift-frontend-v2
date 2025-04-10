import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// Context for transferring state between components
const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}>({
  open: false,
  setOpen: () => {},
  content: null,
  setContent: () => {},
  triggerRef: { current: null },
  isMobile: false,
});

// Provider component
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Main tooltip component
export const Tooltip: React.FC<{ 
  children: React.ReactNode; 
  mobileInline?: boolean; // Whether to show inline on mobile
}> = ({ children, mobileInline = false }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Parse children to find TooltipTrigger and TooltipContent
  let triggerElement: React.ReactElement | null = null;
  let contentElement: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    
    if (child.type === TooltipTrigger) {
      triggerElement = child;
    } else if (child.type === TooltipContent) {
      contentElement = child;
    }
  });

  // Set content from TooltipContent element
  useEffect(() => {
    if (contentElement && contentElement.props.children) {
      setContent(contentElement.props.children);
    }
  }, [contentElement]);

  // If we're on mobile and set to inline mode, we'll render differently
  const isInlineMode = isMobile && mobileInline;

  return (
    <TooltipContext.Provider value={{ open, setOpen, content, setContent, triggerRef, isMobile }}>
      {triggerElement}
      {content && (
        <>
          {/* Show regular tooltip on desktop or when mobile but not inline */}
          {open && !isInlineMode && <TooltipPortal />}

          {/* Show inline tooltip directly below trigger on mobile when inline mode is enabled */}
          {open && isInlineMode && (
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-xs text-gray-700 border border-gray-200 max-w-[250px] break-words">
              {content}
            </div>
          )}
        </>
      )}
    </TooltipContext.Provider>
  );
};

// Trigger component
export const TooltipTrigger: React.FC<{ 
  children: React.ReactNode; 
  asChild?: boolean;
}> = ({ children }) => {
  const { setOpen, triggerRef, isMobile } = React.useContext(TooltipContext);

  // Handle touch events for mobile
  const handleTouch = (event: React.TouchEvent) => {
    event.preventDefault();
    setOpen(true);
    
    // Set a timeout to close the tooltip after 3 seconds on mobile
    if (isMobile) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }

    // Add a one-time click listener to close the tooltip when touching elsewhere
    document.addEventListener('touchstart', (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }, { once: true });
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onTouchStart={handleTouch}
      className="inline-block"
    >
      {children}
    </div>
  );
};

// Content component - just stores content in context
export const TooltipContent: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
}> = (
  // We're intentionally not using the props here but TooltipContent element acts as a data container
  { children: _children }
) => {
  return null; // This doesn't render directly, content is passed to portal via context
};

// Portal component that actually renders the tooltip
const TooltipPortal: React.FC = () => {
  const { open, content, triggerRef, isMobile } = React.useContext(TooltipContext);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on trigger
  useEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // Default positioning variables
      let top, left;

      // Different positioning for mobile vs desktop
      if (isMobile) {
        // On mobile, position below the element by default
        top = triggerRect.bottom + 5;
        
        // Center horizontally, but ensure it doesn't go offscreen
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

        // Make sure tooltip stays within screen bounds
        if (left < 10) left = 10;
        if (left + tooltipRect.width > windowWidth - 10) {
          left = windowWidth - tooltipRect.width - 10;
        }
      } else {
        // Desktop positioning (above the element)
        top = triggerRect.top - tooltipRect.height - 5;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        
        // Adjust if tooltip would go off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > windowWidth - 10) {
          left = windowWidth - tooltipRect.width - 10;
        }
        
        // If tooltip would go off the top of the screen, position below instead
        if (top < 10) {
          top = triggerRect.bottom + 5;
        }
      }

      // Adjust for scroll position
      setPosition({
        top: top + window.scrollY,
        left: left + window.scrollX
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [open, triggerRef.current, tooltipRef.current, isMobile]);

  if (!open) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      className={cn(
        'z-50 overflow-hidden rounded-md border bg-white shadow-md absolute',
        isMobile ? 'px-2 py-1 text-xs max-w-[250px]' : 'px-3 py-1.5 text-sm'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        maxWidth: isMobile ? '250px' : 'auto',
        wordWrap: 'break-word',
      }}
    >
      {content}
    </div>,
    document.body
  );
};