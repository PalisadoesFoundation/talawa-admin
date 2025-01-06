import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events'],
    }),
    tsconfigPaths(),
    svgrPlugin(),
  ],
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
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
        'vitest.setup.ts', // Exclude from coverage if necessary
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
