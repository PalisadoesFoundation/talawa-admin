import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

const isCI = !!process.env.CI;

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
    setupFiles: 'vitest.setup.ts',
    // Inline specific dependencies to avoid vitest issues
      deps:{
        inline:["@mui/x-charts", "@mui/x-data-grid", "@mui/x-date-pickers"] 
      },
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Use threads for better performance in CI
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: isCI ? 2 : 4, // Conservative in CI to avoid OOM
        // Keep isolation enabled to prevent test interference
        isolate: true,
      },
    },
    // Lower concurrency in CI to avoid memory issues
    maxConcurrency: isCI ? 1 : 2,
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
