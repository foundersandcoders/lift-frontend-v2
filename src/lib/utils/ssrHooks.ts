import { useEffect, useLayoutEffect } from 'react';

/**
 * A version of useLayoutEffect that works in both browser and SSR environments
 * This prevents errors like "Cannot read properties of undefined (reading 'useLayoutEffect')"
 */
export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;