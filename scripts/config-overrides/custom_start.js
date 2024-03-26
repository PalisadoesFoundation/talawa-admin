require('dotenv').config();
const { spawn } = require('child_process');

const port = process.env.PORT || 4321;
process.env.PORT = port;

const reactAppRewiredStart =
  'npx react-app-rewired start --config-overrides=scripts/config-overrides/';

spawn(reactAppRewiredStart, { stdio: 'inherit', shell: true });

const {
  override,
  addWebpackPlugin,
  overrideDevServer,
} = require('customize-cra');

const webpack = require('webpack');

const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('react-scripts/config/paths');
const isAllowLogEnabled = process.env.ALLOW_LOGS === 'YES';

module.exports = {
  webpack: override(
    isAllowLogEnabled &&
      (addWebpackPlugin(
        new webpack.ProgressPlugin({
          activeModules: true,
          entries: true,
          handler: (percentage, message, ...args) => {
            console.info(
              `<Webpack-Progress>: ${Math.floor(percentage * 100)}% ${message}`,
            );
          },
          modules: true,
          modulesCount: 5000,
          profile: false,
          dependencies: true,
          dependenciesCount: 10000,
          percentBy: null,
        }),
      ),
      (config) => {
        config.infrastructureLogging = {
          level: 'verbose',
        };
        return config;
      }),
  ),
  devServer: overrideDevServer((config) => {
    config.onAfterSetupMiddleware = undefined;
    config.onBeforeSetupMiddleware = undefined;
    config.setupMiddlewares = (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }
      middlewares.push(
        evalSourceMapMiddleware(devServer),
        redirectServedPath(paths.publicUrlOrPath),
        noopServiceWorkerMiddleware(paths.publicUrlOrPath),
      );
      return middlewares;
    };
  }),
};
