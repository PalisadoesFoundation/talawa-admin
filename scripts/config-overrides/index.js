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
    // Add your new webpack plugin
    isAllowLogEnabled &&
      (addWebpackPlugin(
        new webpack.ProgressPlugin({
          activeModules: true,
          entries: true,
          handler: (percentage, message, ...args) => {
            // Log a custom progress message with active module and its count
            console.info(
              `<Webpack-Progress>: ${Math.floor(percentage * 100)}% ${message}`
            );
          },
          modules: true,
          modulesCount: 5000,
          profile: false,
          dependencies: true,
          dependenciesCount: 10000,
          percentBy: null,
        })
      ),
      // Modify infrastructureLogging level
      (config) => {
        config.infrastructureLogging = {
          level: 'verbose',
        };
        return config;
      })
  ),
  devServer: overrideDevServer((config) => {
    // Remove onAfterSetupMiddleware and onBeforeSetupMiddleware
    config.onAfterSetupMiddleware = undefined;
    config.onBeforeSetupMiddleware = undefined;

    // Add devServer.setupMiddlewares
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
        noopServiceWorkerMiddleware(paths.publicUrlOrPath)
        // Add your additional middlewares here if needed
      );

      return middlewares;
    };
  }),
};
