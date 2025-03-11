// Apply React useLayoutEffect polyfill
if (typeof window !== 'undefined') {
  window.React = window.React || {};
  window.React.useLayoutEffect = window.React.useEffect || function() { return function() {}; };
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Now your App component is the top-level one

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
