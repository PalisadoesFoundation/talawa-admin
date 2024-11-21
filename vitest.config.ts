import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events'],
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src/
    },
  },
  test: {
    include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html', 'text-summary'],
    },
  },
});
