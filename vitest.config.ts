import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  resolve: {
    alias: [
      {
        find: /@mui\/material\/styles$/,
        replacement:
          '/Users/bharathchandra/g64/talawa-admin/node_modules/@mui/material/node/styles/index.js',
      },
      {
        find: /^@mui\/x-charts(\/.*)?$/,
        replacement:
          '/Users/bharathchandra/g64/talawa-admin/src/test/stubs/mui-x-charts.ts',
      },
    ],
  },
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
    testTimeout: 30000,
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
        'cypress/**',
        'cypress.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
