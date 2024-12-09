import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global `describe`, `it`, etc.
    environment: 'jsdom', // Set environment for React Testing Library
    setupFiles: './vitest.setup.ts', // Path to setup file (if needed)
  },
});
