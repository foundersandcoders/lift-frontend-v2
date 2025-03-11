import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// This ensures the polyfill is always included early in the bundle
const polyfillPlugin = {
  name: 'react-polyfill',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    // Only add to entry point
    if (id.includes('main.tsx')) {
      // Make sure the polyfill import is at the top
      const hasPolyfill = code.includes("import './lib/utils/react-polyfill'");
      if (!hasPolyfill) {
        return `import './lib/utils/react-polyfill';\n${code}`;
      }
    }
    return code;
  }
};

export default defineConfig({
  base: '/',
  plugins: [polyfillPlugin, react()],
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
                id.includes('prop-types') ||
                id.includes('src/lib/utils/react-polyfill')) {
              return 'vendor-react';
            }
            
            // UI libraries
            if (id.includes('@radix-ui') || 
                id.includes('radix') || 
                id.includes('class-variance-authority') || 
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
