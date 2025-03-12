/**
 * This module ensures React global methods are available
 * It's needed for compatibility with Deno Deploy and ensures
 * methods like React.useLayoutEffect and React.createContext are available globally
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
      console.debug(`Unable to set ${prop} on React`, e);
    }
  }
}

// Create stubs for common React methods
const noop = () => {};
const noopReturn = () => () => {};
const emptyObj = {};

// Apply React polyfills safely
if (typeof window !== 'undefined') {
  const windowAny = window as any;
  
  // We won't try to create window.React if it doesn't exist
  // This avoids the error of trying to create a property on window
  if (windowAny.React) {
    // Only try to set properties that don't already exist
    safelySetProperty(windowAny.React, 'useState', () => [undefined, noop]);
    safelySetProperty(windowAny.React, 'useEffect', noopReturn);
    safelySetProperty(windowAny.React, 'useLayoutEffect', windowAny.React.useEffect || noopReturn);
    safelySetProperty(windowAny.React, 'useRef', () => ({ current: null }));
    safelySetProperty(windowAny.React, 'useContext', () => emptyObj);
    safelySetProperty(windowAny.React, 'createContext', () => ({ Provider: noop, Consumer: noop }));
    safelySetProperty(windowAny.React, 'forwardRef', (fn: any) => fn);
    safelySetProperty(windowAny.React, 'createElement', () => emptyObj);
    safelySetProperty(windowAny.React, 'cloneElement', () => emptyObj);
    
    // Add Children if it doesn't exist
    if (!windowAny.React.Children) {
      try {
        windowAny.React.Children = {
          map: noop,
          forEach: noop,
          count: noop,
          only: noop,
        };
      } catch (e) {
        // Couldn't set Children
      }
    }
    
    safelySetProperty(windowAny.React, 'Fragment', 'Fragment');
    safelySetProperty(windowAny.React, 'StrictMode', 'StrictMode');
  }
}

// Export to ensure this file isn't tree-shaken
export default function ensureReactExists() {
  return true;
}