import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events'],
    }),
    tsconfigPaths(),
  ],
  test: {
    include: ['src/screens/UserPortal/Volunteer/Actions/Actions.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
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
        'scripts/custom-test-env.js', // Exclude from coverage if necessary
        'src/setupTests.ts', // Exclude from coverage if necessary
        'src/utils/i18nForTest.ts', // Exclude from coverage if necessary
        'vitest.setup.ts', // Exclude from coverage if necessary
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
