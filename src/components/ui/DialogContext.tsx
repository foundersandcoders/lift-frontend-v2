import React from 'react';

// Context for communicating between Dialog and DialogTrigger
export const SimpleDialogContext = React.createContext<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpenChange: () => {},
});