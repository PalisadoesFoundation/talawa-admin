import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Enable DOM simulation
    globals: true,        // Use global APIs like `vi`
  },
});
