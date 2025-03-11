import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Polyfill plugin removed as we no longer use Radix UI

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5000,
  },
  build: {
    chunkSizeWarningLimit: 1600, // Increase the limit to suppress the warning if needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          // More granular chunking for node_modules
          if (id.includes('node_modules')) {
            // Split React and related packages into a separate chunk
            if (id.includes('react') || 
                id.includes('scheduler') || 
                id.includes('prop-types')) {
              return 'vendor-react';
            }
            
            // UI libraries
            if (id.includes('class-variance-authority') || 
                id.includes('lucide')) {
              return 'vendor-ui';
            }
            
            // All other third-party dependencies
            return 'vendor-other';
          }
          
          // Group all auth-related code together
          if (id.includes('/src/api/') || id.includes('/src/context/Auth')) {
            return 'auth';
          }
        },
      },
    },
  },
});
