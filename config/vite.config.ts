import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import createInternalFileWriterPlugin from '../src/plugin/vite/internalFileWriterPlugin';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  const parsed = parseInt(env.PORT || '', 10);
  const PORT =
    !isNaN(parsed) && parsed >= 1024 && parsed <= 65535 ? parsed : 4321;

  // Determine full backend GraphQL URL
  const fullBackendUrl =
    env.REACT_APP_TALAWA_URL || 'http://localhost:4000/graphql';

  // Extract backend origin for proxy target
  let apiTarget = 'http://localhost:4000';
  try {
    const urlObj = new URL(fullBackendUrl);
    apiTarget = urlObj.origin;
  } catch {
    apiTarget = 'http://localhost:4000';
  }

  // Override environment variables to force relative proxy paths.
  // These mutations must occur before EnvironmentPlugin('all') processes them,
  // ensuring the client code receives '/graphql' for both dev proxy and production builds.  process.env.REACT_APP_TALAWA_URL = '/graphql';
  process.env.REACT_APP_BACKEND_WEBSOCKET_URL = '/graphql';

  return {
    // Production build configuration
    build: {
      outDir: 'build',
    },
    // Global build definitions
    define: {
      // Backup build definitions (process.env overrides take precedence)
      'process.env.REACT_APP_TALAWA_URL': JSON.stringify('/graphql'),
      'process.env.REACT_APP_BACKEND_WEBSOCKET_URL': JSON.stringify('/graphql'),
    },
    // Vite plugins configuration
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
    ],
    // Development server configuration
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
      headers: {
        Connection: 'keep-alive',
      },
      proxy: {
        '/graphql': {
          target: apiTarget,
          changeOrigin: true,
          secure: false, // Add this - allows proxying to http when dev server might be https
          ws: true,
          rewrite: (path) => path, // Explicitly preserve the path
          configure: (proxy, options) => {
            // Add logging to debug what's being proxied
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(
                '[Proxy Request]',
                req.method,
                req.url,
                '→',
                options.target + req.url,
              );
              console.log('[Headers]', JSON.stringify(req.headers, null, 2));
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(
                '[Proxy Response]',
                req.method,
                req.url,
                '←',
                proxyRes.statusCode,
              );
            });
            proxy.on('error', (err, req, res) => {
              console.error('[Proxy Error]', err.message);
            });
          },
        },
      },
    },
  };
});
