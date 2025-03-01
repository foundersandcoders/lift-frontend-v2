import './commands';

// Export the setup function
export const setupWSL2Config = () => {
  // Handle WSL2 specific configurations
  if (Cypress.platform === 'linux') {
  Cypress.config('chromeWebSecurity', false);
  Cypress.config('baseUrl', 'http://localhost:3000');
  
  // Add custom commands for WSL2
  Cypress.Commands.add('wslExec', (command) => {
    return cy.exec(`wsl ${command}`, {
      failOnNonZeroExit: false,
      timeout: 10000
    });
  });

  // Add X server configuration
  before(() => {
    const display = cy.exec('wsl grep nameserver /etc/resolv.conf | awk \'{print $2}\'').then((result) => {
      process.env.DISPLAY = `${result.stdout.trim()}:0`;
    });
  });

  // Add retry logic for flaky tests
  Cypress.Commands.overwrite('should', (originalFn, subject, expectation, ...args) => {
    const retries = 3;
    let attempts = 0;
    
    const tryAgain = (err) => {
      if (attempts < retries) {
        attempts++;
        cy.wait(500, { log: false });
        return originalFn(subject, expectation, ...args);
      }
      throw err;
    };

    return originalFn(subject, expectation, ...args).catch(tryAgain);
  });
};

// Initialize the WSL2 configuration
setupWSL2Config();
