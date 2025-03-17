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
}>({
  open: false,
  setOpen: () => {},
  content: null,
  setContent: () => {},
  triggerRef: { current: null },
});

// Provider component
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Main tooltip component
export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

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

  return (
    <TooltipContext.Provider value={{ open, setOpen, content, setContent, triggerRef }}>
      {triggerElement}
      {open && content && <TooltipPortal />}
    </TooltipContext.Provider>
  );
};

// Trigger component
export const TooltipTrigger: React.FC<{ 
  children: React.ReactNode; 
  asChild?: boolean;
}> = ({ children }) => {
  const { setOpen, triggerRef } = React.useContext(TooltipContext);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
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
  const { open, content, triggerRef } = React.useContext(TooltipContext);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on trigger
  useEffect(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();

      // Default positioning (above the element)
      const top = triggerRect.top - tooltipRect.height - 5;
      const left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

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
  }, [open, triggerRef.current, tooltipRef.current]);

  if (!open) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      className={cn(
        'z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm shadow-md',
        'absolute'
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
    >
      {content}
    </div>,
    document.body
  );
};