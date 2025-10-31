import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import os from 'os';

const cpuCount = os.cpus().length;
const isCI = !!process.env.CI;

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
        'vitest.setup.ts',
        'cypress/**',
        'cypress.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
