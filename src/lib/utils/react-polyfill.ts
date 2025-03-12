/**
 * Polyfills for component compatibility with Deno Deploy
 * This helps prevent the "Cannot read properties of undefined" errors
 * in certain environments like SSR or when window.React isn't properly set
 */

// Safely check and set properties
function safelySetProperty(obj: any, prop: string, value: any) {
  // Skip if property already exists
  if (obj[prop] !== undefined) return;
  
  try {
    // Try to set the property - this will fail if the property is read-only
    obj[prop] = value;
  } catch (e) {
    // Property is read-only or can't be assigned - just log in dev mode
    if (process.env.NODE_ENV === 'development') {
      console.debug(`Unable to set ${prop}`, e);
    }
  }
}

// Apply React polyfills safely
if (typeof window !== 'undefined') {
  // Check if window.React exists
  const windowAny = window as any;
  
  // Create React object if it doesn't exist
  if (!windowAny.React) {
    try {
      windowAny.React = {};
    } catch (e) {
      // If we can't assign to window.React, there's not much we can do
      console.debug('Unable to create window.React', e);
    }
  }
  
  // Only try to set properties if window.React exists
  if (windowAny.React) {
    // Safely set individual properties
    safelySetProperty(windowAny.React, 'useLayoutEffect', 
      windowAny.React.useEffect || function() { return function() {}; });
    
    safelySetProperty(windowAny.React, 'createContext', 
      function() { return { Provider: function() {}, Consumer: function() {} }; });
  }
}

// Export a dummy function to make TypeScript happy when importing this module
export default function ensureReactPolyfill() {
  // This function does nothing, it just ensures the side effects above are executed
  return true;
}