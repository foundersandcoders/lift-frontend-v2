/**
 * This file provides safe React hooks that work in both client and server environments.
 * Import these hooks instead of directly importing from React when SSR compatibility is needed.
 */
import React, { useEffect, useLayoutEffect } from 'react';

// Use a safe version of useLayoutEffect that falls back to useEffect in non-browser environments
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Re-export React to ensure consistent usage
export default React;
export * from 'react';