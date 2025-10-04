import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// Plugin to handle CSS imports in tests
const cssPlugin = {
  name: 'vitest-css-mock',
  transform(code: string, id: string) {
    if (/\.(css|scss|sass|less)$/.test(id)) {
      const isModule = /\.module\.(css|scss|sass|less)$/.test(id);
      return {
        code: isModule
          ? 'export default new Proxy({}, { get: (_, key) => key })'
          : 'export default {}',
        map: null,
      };
    }
  },
};

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin(), cssPlugin],
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
    testTimeout: 30000,
    deps: {
      inline: ['@mui/x-data-grid'],
    },
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
        'vitest.setup.ts', // Exclude from coverage if necessary
        'cypress/**',
        'cypress.config.ts',
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
