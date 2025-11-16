import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // ADD THE BUILD CONFIGURATION HERE
  build: {
    // Set limit to 4000 KB (4 MB) to easily clear the current warning
    // The default is 500 KB.
    chunkSizeWarningLimit: 4000 
  },
});