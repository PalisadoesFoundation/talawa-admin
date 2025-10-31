import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import os from 'os';

const cpuCount = os.cpus().length;
const isCI = !!process.env.CI;

/**
 * Parallel test configuration for tests that are parallel-safe.
 * 
 * Pre-existing tests with isolation issues are excluded and run sequentially
 * using vitest.config.sequential.ts instead.
 * 
 * To add a test to parallel execution:
 * 1. Fix any test isolation issues (unique testids, proper async handling)
 * 2. Remove the test file from the exclude list below
 * 3. Run tests to verify it passes in parallel execution
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
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
        minThreads: isCI
          ? 2
          : Math.max(2, Math.floor(cpuCount * 0.5)),
        maxThreads: isCI
          ? 2
          : Math.max(4, Math.floor(cpuCount * 0.5)),
        isolate: true,
      },
    },
    // Parallel execution - optimized for speed
    fileParallelism: true,
    maxConcurrency: isCI
      ? 2
      : Math.max(2, Math.floor(cpuCount * 0.5)),
    sequence: {
      shuffle: false,
      concurrent: true,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: './coverage/vitest-parallel',
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
        // Pre-existing tests with isolation issues - run sequentially instead
        // TODO: Fix test isolation and remove from this list
        'src/components/Advertisements/Advertisements.spec.tsx',
        'src/components/EventListCard/Modal/Preview/EventListCardPreviewModal.spec.tsx',
        'src/screens/UserPortal/Posts/Posts.spec.tsx',
        'src/components/OrgSettings/AgendaItemCategories/Preview/AgendaCategoryPreviewModal.spec.tsx',
        'src/screens/UserPortal/Pledges/Pledge.spec.tsx',
        // Add more pre-existing failing tests as they are identified
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
