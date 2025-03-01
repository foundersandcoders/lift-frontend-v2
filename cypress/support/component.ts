import { mount } from 'cypress/react18';
import '../../src/index.css';

// Add proper ES module exports
export const setupMount = () => {
  // Augment the Cypress namespace to include type definitions for
  // your custom command.
  declare global {
    namespace Cypress {
      interface Chainable {
        mount: typeof mount;
      }
    }
  }

  Cypress.Commands.add('mount', mount);
};

// Initialize the mount command
setupMount();
