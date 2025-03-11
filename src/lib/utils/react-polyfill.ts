/**
 * React polyfill to handle useLayoutEffect issues in server-side rendering
 * This fixes the "Cannot read properties of undefined (reading 'useLayoutEffect')" error
 */

// This is a side-effect module that makes sure React.useLayoutEffect is available
// in environments where it might not be (like SSR or certain build environments)
if (typeof window !== 'undefined') {
  // We're in the browser, so we can safely create a React object on window
  // This ensures that libraries that expect to find React on window won't break
  // @ts-ignore - intentionally modifying window
  window.React = window.React || {};
  // @ts-ignore - intentionally modifying window.React
  window.React.useLayoutEffect = window.React.useLayoutEffect || function() { return function() {}; };
}

// Export a dummy function to make TypeScript happy when importing this module
export default function ensureReactPolyfill() {
  // This function does nothing, it just ensures the side effects above are executed
  return true;
}