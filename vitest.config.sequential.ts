import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import os from 'os';

const cpuCount = os.cpus().length;
const isCI = !!process.env.CI;

/**
 * Sequential test configuration for pre-existing tests that have isolation issues.
 * These tests were written assuming sequential execution and need to be run one at a time.
 *
 * Only includes tests that are excluded from parallel execution.
 *
 * TODO: Fix test isolation issues and migrate these tests to parallel execution.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  test: {
    // Only include tests that are excluded from parallel execution
    include: [
      'src/components/Advertisements/Advertisements.spec.tsx',
      'src/components/EventListCard/Modal/Preview/EventListCardPreviewModal.spec.tsx',
      'src/screens/UserPortal/Posts/Posts.spec.tsx',
      'src/components/OrgSettings/AgendaItemCategories/Preview/AgendaCategoryPreviewModal.spec.tsx',
      'src/screens/UserPortal/Pledges/Pledge.spec.tsx',
      // Add more pre-existing failing tests as they are identified
    ],
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'vitest.setup.ts',
    testTimeout: 10000,
    hookTimeout: 5000,
    teardownTimeout: 5000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: isCI ? 1 : Math.max(2, Math.floor(cpuCount * 0.5)),
        maxThreads: isCI ? 1 : Math.max(4, Math.floor(cpuCount * 0.5)),
        isolate: true,
      },
    },
    // Sequential execution - no parallelization
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: './coverage/vitest-sequential',
      exclude: [
        'node_modules',
        'dist',
        'docs/**',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        'coverage/**',
        '**/index.{js,ts}',
        '**/*.d.ts',
        'src/test/**',
        'vitest.config.ts',
        'vitest.config.sequential.ts',
        'vitest.config.parallel.ts',
        'vitest.setup.ts',
        'cypress/**',
        'cypress.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
