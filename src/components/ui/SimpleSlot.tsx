import React from 'react';

// A simple Slot component that just renders its children
// This is a simplified version that doesn't try to do ref forwarding
const Slot: React.FC<{ 
  children?: React.ReactNode; 
  className?: string;
  [key: string]: any;
}> = ({ 
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