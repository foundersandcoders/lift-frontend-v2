import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    supportFile: './cypress/support/component.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
    experimentalSingleTabRunMode: true,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: './cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: false,
    experimentalRunAllSpecs: true,
    experimentalStudio: true,
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 15000,
    setupNodeEvents(on, config) {
      // Handle WSL2 specific configurations
      if (process.env.WSL_DISTRO_NAME) {
        config.baseUrl = 'http://localhost:3000';
        config.chromeWebSecurity = false;
        config.experimentalSingleTabRunMode = true;
        config.experimentalInteractiveRunEvents = true;
      }
      
      // Add browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
        }
        return launchOptions;
      });

      return config;
    },
  },
});
