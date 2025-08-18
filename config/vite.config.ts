import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';
import createInternalFileWriterPlugin from '../src/plugin/vite/internalFileWriterPlugin';

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
  ],
  server: {
  server: {
    // do not auto-open the browser on server start
    open: false,
    host: '0.0.0.0',
    // this sets a default port to 4321
    port: 4321,
  },
  },
});
