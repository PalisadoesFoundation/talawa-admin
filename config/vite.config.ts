import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import createInternalFileWriterPlugin from '../src/plugin/vite/internalFileWriterPlugin';
import istanbul from 'vite-plugin-istanbul';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4321;

export default defineConfig({
  // depending on your application, base can also be "/"
  build: {
    outDir: 'build',
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
    // this sets a default port to 4321
    port: PORT,
  },
});
