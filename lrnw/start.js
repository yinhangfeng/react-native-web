'use strict';

const Config = require('./Config');
const startWebpackDevServer = require('./startWebpackDevServer');
const buildWebpackConfig = require('./buildWebpackConfig');

module.exports = function start({
  cliConfig = Config,
  devServerOptions,
} = {}) {
  const webpackConfig = buildWebpackConfig({
    env: 'development',
    cliConfig,
  });

  startWebpackDevServer(webpackConfig, devServerOptions);
}