/**
 * Polyfills for Radix UI components that use useLayoutEffect
 * This helps prevent the "Cannot read properties of undefined (reading 'useLayoutEffect')" error
 * in certain environments like SSR or when window.React isn't properly set
 */

// Apply React useLayoutEffect polyfill
if (typeof window !== 'undefined') {
  // We're in the browser, so we can safely create a React object on window
  // This ensures that libraries that expect to find React on window won't break
  // @ts-ignore - intentionally modifying window
  window.React = window.React || {};
  // @ts-ignore - intentionally modifying window.React
  window.React.useLayoutEffect = window.React.useLayoutEffect || window.React.useEffect || function() { return function() {}; };
}

// Export a dummy function to make TypeScript happy when importing this module
export default function ensureRadixPolyfill() {
  // This function does nothing, it just ensures the side effects above are executed
  return true;
}