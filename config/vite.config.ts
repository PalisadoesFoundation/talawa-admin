import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import EnvironmentPlugin from 'vite-plugin-environment';

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
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: false,
    host: '0.0.0.0',
    // this sets a default port to 4321
    port: 4321,
  },
});
