// Import the polyfill first, before any other imports
import './lib/utils/react-polyfill';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Now your App component is the top-level one

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
