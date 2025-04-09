import React from 'react';

// A simple Slot component that just renders its children
// This is a simplified version that doesn't try to do ref forwarding
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

const Slot: React.FC<SlotProps> = ({ 
  children,
  ...props 
}) => {
  if (!children || !React.isValidElement(children)) {
    return null;
  }

  // Clone the element with merged props
  return React.cloneElement(children, {
    ...props,
    // We don't handle refs in this simplified version
  });
};

export { Slot };