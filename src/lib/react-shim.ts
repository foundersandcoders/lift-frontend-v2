/**
 * This module ensures React global methods are available
 * It's particularly needed for Radix components that expect
 * React.useLayoutEffect and React.createContext to be available globally
 */

// Force window.React to exist and have key methods
if (typeof window !== 'undefined') {
  // Create stubs for common React methods
  const noop = () => {};
  const noopReturn = () => () => {};
  const emptyObj = {};
  
  // Only add if missing
  if (!window.React) {
    (window as any).React = {};
  }
  
  // Add missing methods - use type assertion for TypeScript
  const reactShim = (window as any).React;
  
  if (!reactShim.useState) reactShim.useState = () => [undefined, noop];
  if (!reactShim.useEffect) reactShim.useEffect = noopReturn;
  if (!reactShim.useLayoutEffect) reactShim.useLayoutEffect = reactShim.useEffect || noopReturn;
  if (!reactShim.useRef) reactShim.useRef = () => ({ current: null });
  if (!reactShim.useContext) reactShim.useContext = () => emptyObj;
  if (!reactShim.createContext) reactShim.createContext = () => ({ Provider: noop, Consumer: noop });
  if (!reactShim.forwardRef) reactShim.forwardRef = (fn: any) => fn;
  if (!reactShim.createElement) reactShim.createElement = () => emptyObj;
  if (!reactShim.cloneElement) reactShim.cloneElement = () => emptyObj;
  
  // Only add these if they don't exist
  if (!reactShim.Children) {
    reactShim.Children = {
      map: noop,
      forEach: noop,
      count: noop,
      only: noop,
    };
  }
  
  if (!reactShim.Fragment) reactShim.Fragment = 'Fragment';
  if (!reactShim.StrictMode) reactShim.StrictMode = 'StrictMode';
}

// Export to ensure this file isn't tree-shaken
export default function ensureReactExists() {
  return true;
}