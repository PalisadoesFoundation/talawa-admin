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
  // ensuring the client code receives '/graphql' for both dev proxy and production builds.
  process.env.REACT_APP_TALAWA_URL = '/graphql';
  process.env.REACT_APP_BACKEND_WEBSOCKET_URL = '/graphql';

  return {
    // Production build configuration
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 1000,
      // Use esbuild for fast minification
      minify: 'esbuild',
      // Target modern browsers for smaller bundle size
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      rollupOptions: {
        // Tree-shaking configuration - preserves side-effectful modules
        treeshake: {
          // Preserve side effects for CSS, Bootstrap, i18n, and other critical imports
          moduleSideEffects: (id) => {
            // Preserve all CSS/SCSS files
            if (/\.(css|scss|sass|less)(\?|$)/.test(id)) return true;
            // Preserve Bootstrap JS for interactive components
            if (id.includes('bootstrap/dist/js')) return true;
            // Preserve i18n initialization modules
            if (id.includes('i18next') || id.includes('react-i18next'))
              return true;
            // Preserve react-datepicker styles and functionality
            if (id.includes('react-datepicker')) return true;
            // Preserve flag-icons for country flags
            if (id.includes('flag-icons')) return true;
            // Preserve chart.js registration
            if (id.includes('chart.js')) return true;
            // Default: allow tree-shaking for other modules
            return false;
          },
          // Keep default safe behavior for property reads and try-catch
          propertyReadSideEffects: true,
          tryCatchDeoptimization: true,
        },
        output: {
          manualChunks: (id) => {
            // Skip non-node_modules files
            if (!id.includes('node_modules')) return;

            const hasPackage = (pkg: string) =>
              id.includes(`/node_modules/${pkg}/`) ||
              id.includes(`\\node_modules\\${pkg}\\`);

            // React core libraries (react, react-dom, react-router)
            if (
              hasPackage('react') ||
              hasPackage('react-dom') ||
              hasPackage('react-router-dom') ||
              hasPackage('react-router')
            ) {
              return 'vendor-react';
            }

            if (
              id.includes('/node_modules/@mui/') ||
              id.includes('\\node_modules\\@mui\\')
            ) {
              return 'vendor-mui';
            }

            if (
              id.includes('/node_modules/@apollo/') ||
              id.includes('\\node_modules\\@apollo\\') ||
              hasPackage('graphql')
            ) {
              return 'vendor-apollo';
            }

            // i18next internationalization (includes react-i18next)
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }

            // All other vendor libraries
            return 'vendor-others';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    // Esbuild configuration for production optimizations
    esbuild: {
      // Drop console and debugger statements in production
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      // Remove legal comments to reduce bundle size
      legalComments: 'none',
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@apollo/client',
        '@mui/material',
        'i18next',
        'react-i18next',
      ],
      esbuildOptions: {
        target: 'es2020',
      },
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
      // ---------------------------------------
      // Important: Required for testing in a
      // lab environment where the API and Admin
      // apps run on separate servers.
      // This simulates a production environment
      allowedHosts: true,
      // ---------------------------------------
      host: '0.0.0.0',
      watch: {
        ignored: ['**/coverage/**', '**/.nyc_output/**'],
      },
      open: false,
      port: PORT,
      headers: {
        Connection: 'keep-alive',
      },
      proxy: {
        '/graphql': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy) => {
            // Log outgoing request
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('\n[PROXY REQUEST]');
              console.log('Method:', req.method);
              console.log('URL:', req.url);
              console.log('Target:', apiTarget + req.url);
              console.log('Headers:', JSON.stringify(req.headers, null, 2));

              // Check if body exists and log it
              let body = '';
              req.on('data', (chunk) => {
                body += chunk.toString();
              });
              req.on('end', () => {
                if (body) {
                  console.log('Body:', body);
                }
              });
            });

            // Log response
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('\n[PROXY RESPONSE]');
              console.log('Status:', proxyRes.statusCode);
              console.log('URL:', req.url);

              let responseBody = '';
              proxyRes.on('data', (chunk) => {
                responseBody += chunk.toString();
              });
              proxyRes.on('end', () => {
                if (responseBody) {
                  console.log('Response Body:', responseBody);
                }
              });
            });

            proxy.on('error', (err) => {
              console.error('\n[PROXY ERROR]', err.message);
            });
          },
        },
      },
    },
  };
});
