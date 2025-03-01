import './commands';

// Handle WSL2 specific configurations
if (Cypress.platform === 'linux') {
  Cypress.config('chromeWebSecurity', false);
  Cypress.config('baseUrl', 'http://localhost:3000');
  
  // Add custom commands for WSL2
  Cypress.Commands.add('wslExec', (command) => {
    return cy.exec(`wsl ${command}`);
  });
}
