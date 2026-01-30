import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { cpus } from 'os';

const isCI = !!process.env.CI;
const isSharded = !!process.env.SHARD_INDEX || !!process.env.SHARD_COUNT;
const cpuCount = cpus().length;

const MAX_CI_THREADS = 12; // Reduced to leave headroom
const MAX_LOCAL_THREADS = 16;

const ciThreads = Math.min(
  MAX_CI_THREADS,
  Math.max(4, Math.floor(cpuCount * 0.85)) // Increased utilization
);

const localThreads = Math.min(MAX_LOCAL_THREADS, Math.max(4, cpuCount));

const baseTestInclude = [
  'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  'config/**/*.{spec,test}.{js,jsx,ts,tsx}',
];
const eslintTestInclude = [
  'scripts/eslint/**/*.{spec,test}.{js,jsx,ts,tsx}',
];
const testInclude = isSharded
  ? baseTestInclude
  : [...baseTestInclude, ...eslintTestInclude];

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  build: {
    sourcemap: false, // Disable sourcemaps for faster tests
  },
  esbuild: {
    sourcemap: false, // Disable sourcemaps for faster tests
  },
  test: {
    include: testInclude,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles: 'vitest.setup.ts',
    // Inline specific dependencies to avoid vitest issues
    server: {
      deps: {
        inline: ["@mui/x-charts", "@mui/x-data-grid", "@mui/x-date-pickers"]
      }
    },
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: isCI ? ciThreads : localThreads,
        isolate: true,
      },
    },
    maxConcurrency: isCI ? ciThreads : localThreads,
    fileParallelism: true,
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    coverage: {
      enabled: true,
      provider: 'istanbul', // Keep this
      reportsDirectory: './coverage', // output directly to ./coverage
      exclude: [
        'node_modules',
        'dist',
        'docs/**',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        '**/*.{mocks,mock,helpers,mockHelpers}.{js,jsx,ts,tsx}',
        'coverage/**',
        'src/!(install)/index.{js,ts}',
        '**/*.d.ts',
        'src/test/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        'cypress/**',
        'cypress.config.ts',
        '.github/**',
        'scripts/!(eslint)/**',
        'scripts/*.{js,ts}',
        'scripts/eslint/config/**',
        'config/**',
      ],
      reporter: ['html', 'json-summary', 'text', 'text-summary'], // add 'html' to generate index.html
      all: true, // include all files, not just tested ones
    },
  },
});
