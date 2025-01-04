import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events'], // Add any other Node modules you may need
    }),
    tsconfigPaths(),
  ],
  test: {
    include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'], // Match .spec. or .test. extensions
    globals: true, // Use global helpers like describe and test
    environment: 'jsdom', // Simulate the browser environment for UI tests
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reportsDirectory: './coverage/vitest',
      exclude: [
        'node_modules',
        'dist',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        'coverage/**',
        '**/index.{js,ts}',
        '**/*.d.ts',
        'src/test/**',
        'vitest.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});