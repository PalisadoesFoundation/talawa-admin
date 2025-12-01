import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import createInternalFileWriterPlugin from '../src/plugin/vite/internalFileWriterPlugin';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const parsed = parseInt(env.PORT || '', 10);
  const PORT =
    !isNaN(parsed) && parsed >= 1024 && parsed <= 65535 ? parsed : 4321;
  // 1. Get the Full Backend URL from the standard env var
  const fullBackendUrl =
    env.REACT_APP_TALAWA_URL || 'http://localhost:4000/graphql';

  // 2. Extract the Origin (e.g., "http://192.168.1.100:4000")
  let apiTarget = 'http://localhost:4000';
  try {
    // We only want the protocol and host (not the /graphql path)
    const urlObj = new URL(fullBackendUrl);
    apiTarget = urlObj.origin;
  } catch {
    // Safe fallback if the URL is empty or invalid
    apiTarget = 'http://localhost:4000';
  }

  return {
    // depending on your application, base can also be "/"
    build: {
      outDir: 'build',
    },
    define: {
      // Force React to use relative paths so requests go through the Proxy
      'process.env.REACT_APP_TALAWA_URL': JSON.stringify('/graphql'),
      'process.env.REACT_APP_BACKEND_WEBSOCKET_URL': JSON.stringify('/graphql'),
    },
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
      proxy: {
        '/graphql': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
