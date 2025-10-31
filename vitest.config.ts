import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import os from 'os';

const cpuCount = os.cpus().length;
const isCI = !!process.env.CI;

/**
 * Vitest configuration optimized for test speed improvement.
 * 
 * Uses sequential execution (fileParallelism: false) to avoid pre-existing
 * test isolation issues, while still achieving 4x speedup through CI sharding.
 * 
 * Configuration optimized for:
 * - CI: 1 thread, sequential execution, 4 shards
 * - Local: Multiple threads, sequential execution
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
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
    // Sequential execution - avoids pre-existing test isolation issues
    // Speed comes from CI sharding (4 shards = 4x speedup)
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: './coverage/vitest',
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
        'vitest.setup.ts',
        'cypress/**',
        'cypress.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
