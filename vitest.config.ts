import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

const isCI = !!process.env.CI;

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],

  build: {
    sourcemap: false,
  },

  esbuild: {
    sourcemap: false,
  },

  test: {
    include: ['src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',

    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,

    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: isCI ? 2 : 4,
        isolate: true,
      },
    },

    maxConcurrency: isCI ? 1 : 2,
    fileParallelism: true,

    sequence: {
      shuffle: false,
      concurrent: false,
    },

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reportsDirectory: './coverage/vitest',

      // ✅ FINAL STEP — Coverage gates
      thresholds: {
        global: {
          statements: 95,
          branches: 85,
          functions: 90,
          lines: 95,
        },
      },

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
        '.github/**',
        'scripts/**',
        'config/**',
      ],

      reporter: ['lcov', 'json', 'text', 'text-summary'],
    },
  },
});
