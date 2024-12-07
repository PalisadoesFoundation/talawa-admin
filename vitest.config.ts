import { defineConfig } from 'vitest/config'; // Use Vitest's config, not Vite's
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
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./scripts/vitest-setup.ts'],
    include: [
      'src/screens/UserPortal/Volunteer/UpcomingEvents/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
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
        'src/setupTests.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
