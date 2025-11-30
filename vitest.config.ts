import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { cpus } from 'os';

const isCI = !!process.env.CI;
const cpuCount = cpus().length;

// Caps for thread usage to prevent resource exhaustion
const MAX_CI_THREADS = 16; // Cap for large CI runners
const MAX_LOCAL_THREADS = 16; // Soft cap for local machines

// Calculate threads based on environment
// In CI, use 75% of available cores (was 50%) - safe now due to mock isolation
// We clamp it between 2 and MAX_CI_THREADS
const ciThreads = Math.min(
  MAX_CI_THREADS,
  Math.max(2, Math.floor(cpuCount * 0.75))
);

// Locally, use 100% of available cores (was 75%)
// We clamp it between 4 and MAX_LOCAL_THREADS
const localThreads = Math.min(
  MAX_LOCAL_THREADS,
  Math.max(4, cpuCount)
);

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  build: {
    sourcemap: false, // Disable sourcemaps for faster tests
  },
  esbuild: {
    sourcemap: false, // Disable sourcemaps for faster tests
  },
  test: {
    include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: 'vitest.setup.ts',
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Use threads for better performance in CI
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: isCI ? ciThreads : localThreads,
        // Keep isolation enabled to prevent test interference
        isolate: true,
      },
    },
    // Lower concurrency in CI to avoid memory issues
    maxConcurrency: isCI ? ciThreads : localThreads,
    // Enable file parallelism for better performance
    fileParallelism: true,
    sequence: {
      shuffle: false,
      concurrent: false, // Disabled for test stability - files still run in parallel across shards
    },
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reportsDirectory: './coverage/vitest',
      // Don't use 'all: true' with sharding - let merge handle combining partial coverage
      exclude: [
        'node_modules',
        'dist',
        'docs/**',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        '**/*.{mocks,mock,helpers,mockHelpers}.{js,jsx,ts,tsx}', // Exclude mock/helper files from coverage
        'coverage/**',
        '**/index.{js,ts}',
        '**/*.d.ts',
        'src/test/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        'cypress/**',
        'cypress.config.ts',
        '.github/**', // Exclude GitHub workflows and scripts
        'scripts/**', // Exclude build/setup scripts
        'config/**', // Exclude configuration files
      ],
      reporter: ['lcov', 'json', 'text', 'text-summary'], // Use json for accurate merging, lcov for final report
    },
  },
});
