import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { cpus } from 'os';

const isCI = !!process.env.CI;
const cpuCount = cpus().length;

// Calculate threads based on environment
// In CI, use 75% of available cores (was 50%) - safe now due to mock isolation
// Locally, use 100% of available cores (was 75%)
const ciThreads = Math.max(2, Math.floor(cpuCount * 0.75));
const localThreads = Math.max(4, cpuCount);

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
    css: false, // Optimization: Disable CSS processing for faster tests
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
        isolate: true,
      },
    },
    // maxConcurrency is deprecated in favor of poolOptions.threads.maxThreads
    // but we'll keep it consistent with maxThreads for now if needed,
    // or just rely on maxThreads.
    // Actually, maxConcurrency controls the number of tests running concurrently *within* a file
    // if sequence.concurrent is true. Since we have sequence.concurrent: false,
    // this mainly affects file parallelism if fileParallelism is true.
    // Let's set it to match maxThreads to be safe.
    maxConcurrency: isCI ? ciThreads : localThreads,
    // ... existing config

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
