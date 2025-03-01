import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    supportFile: './cypress/support/component.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
});
