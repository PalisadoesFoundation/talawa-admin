const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');


module.exports = override(
  // Add your new webpack plugin
  addWebpackPlugin(new webpack.ProgressPlugin({
    activeModules: true,
    entries: true,
    handler: (percentage, message, ...args) => {
        // Log a custom progress message with active module and its count
        console.info(`<Webpack-Progress>: ${Math.floor(percentage * 100)}% ${message}`);
    },
    modules: true,
    modulesCount: 5000,
    profile: false,
    dependencies: true,
    dependenciesCount: 10000,
    percentBy: null,
})),

  // Modify infrastructureLogging level
  (config) => {
    config.infrastructureLogging = {
      level: 'verbose',
    };
    return config;
  }
);