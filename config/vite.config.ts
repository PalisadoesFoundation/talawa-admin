import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import createInternalFileWriterPlugin from '../src/plugin/vite/internalFileWriterPlugin';
import istanbul from 'vite-plugin-istanbul';

/**
 * Plugin to suppress dynamic/static import warnings from Vite reporter
 * These warnings are informational and don't affect functionality.
 * Modules can be both statically and dynamically imported in different contexts.
 */
function suppressDynamicImportWarnings(): Plugin {
  return {
    name: 'suppress-dynamic-import-warnings',
    enforce: 'pre',
    buildStart() {
      // Intercept console warnings and errors during build
      const originalWarn = console.warn;
      const originalError = console.error;
      console.warn = (...args: unknown[]) => {
        const message = String(args[0] || '');
        if (
          message.includes('dynamically imported') &&
          message.includes('statically imported') &&
          (message.includes('AdminPluginFileService') ||
            message.includes('PageNotFound') ||
            message.includes('registry.tsx'))
        ) {
          // Suppress these specific warnings
          return;
        }
        originalWarn.apply(console, args);
      };

      console.error = (...args: unknown[]) => {
        const message = String(args[0] || '');
        if (
          message.includes('[plugin vite:reporter]') &&
          message.includes('dynamically imported') &&
          message.includes('statically imported')
        ) {
          // Suppress these specific errors from vite:reporter
          return;
        }
        originalError.apply(console, args);
      };
    },
    buildEnd() {
      // Restore original console methods after build
      // Note: This might not be necessary, but it's good practice
    },
  };
}

const parsed = parseInt(process.env.PORT || '', 10);
const PORT =
  !isNaN(parsed) && parsed >= 1024 && parsed <= 65535 ? parsed : 4321;

export default defineConfig({
  // depending on your application, base can also be "/"
  build: {
    outDir: 'build',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress dynamic/static import warnings - these are informational
        // and don't affect functionality. Modules can be both statically and
        // dynamically imported in different contexts (e.g., lazy loading vs direct imports)
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          (typeof warning.message === 'string' &&
            warning.message.includes('dynamically imported') &&
            warning.message.includes('statically imported'))
        ) {
          return;
        }
        warn(warning);
      },
    },
    // Suppress chunk size warnings for dynamic imports
    chunkSizeWarningLimit: 1000,
  },
  base: '',
  plugins: [
    react(),
    viteTsconfigPaths(),
    EnvironmentPlugin('all'),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    createInternalFileWriterPlugin({
      enabled: true,
      debug: process.env.NODE_ENV === 'development',
      basePath: 'src/plugin/available',
    }),
    istanbul({
      extension: ['.js', '.ts', '.jsx', '.tsx'],
      requireEnv: true,
      cypress: true,
      include: [
        'src/screens/**/*.{js,jsx,ts,tsx}',
        'src/components/**/*.{js,jsx,ts,tsx}',
        'src/subComponents/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        'node_modules/**',
        'cypress/**',
        'coverage/**',
        '.nyc_output/**',
        'src/**/*.spec.{ts,tsx,js,jsx}',
        'src/**/__tests__/**',
      ],
    }),
    suppressDynamicImportWarnings(),
  ],
  server: {
    // Allow all hosts for flexibility as Talawa runs on multiple domains
    allowedHosts: true,
    watch: {
      ignored: ['**/coverage/**', '**/.nyc_output/**'],
    },
    // this ensures that the browser opens upon server start
    open: false,
    host: '0.0.0.0',
    // Uses PORT environment variable, defaults to 4321
    port: PORT,
  },
});
