import { StrictMode } from './lib/utils/react-safe';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; // Now your App component is the top-level one

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
