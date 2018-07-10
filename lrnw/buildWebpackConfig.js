'use strict';

const {
  resolve,
} = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const getWebpackConfig = require('./getWebpackConfig');
const getBabelConfig = require('./getBabelConfig');
const getBrowsers = require('./getBrowsers');

module.exports = function buildWebpackConfig({
  env,
  cliConfig,
}) {
  const projectRoot = cliConfig.getProjectRoot();
  const browsers = getBrowsers(env);

  const getBabelConfigOptions = {
    env,
    browsers,
  };

  let babelConfig = getBabelConfig(getBabelConfigOptions);
  if (cliConfig.getBabelConfig) {
    babelConfig = cliConfig.processBabelConfig(babelConfig, getBabelConfigOptions);
  }

  let webpackConfigOptions = {
    env,
    projectRoot,
    babelConfig,
    entryPath: resolve(projectRoot, 'main.js'),
    outputPath: resolve(projectRoot, 'build/outputs/web'),
    htmlTemplatePath: resolve(projectRoot, 'web/index.html'),
    browsers,
  };

  if (cliConfig.processWebpackConfigOptions) {
    webpackConfigOptions = cliConfig.processWebpackConfigOptions(webpackConfigOptions);
  }

  let config = getWebpackConfig(webpackConfigOptions);

  if (cliConfig.processWebpackConfig) {
    config = cliConfig.processWebpackConfig(config, webpackConfigOptions);
  }

  return config;
};